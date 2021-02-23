


sync.Pool是Go中常常用来做缓存的一个API，从`New`讲起

```go
type Pool struct {
   noCopy noCopy

   local     unsafe.Pointer // local fixed-size per-P pool, actual type is [P]poolLocal
   localSize uintptr        // size of the local array

   victim     unsafe.Pointer // local from previous cycle
   victimSize uintptr        // size of victims array

   // New optionally specifies a function to generate
   // a value when Get would otherwise return nil.
   // It may not be changed concurrently with calls to Get.
   New func() interface{}
}
```

看注释可知，这个是在Get()不到东西时候New一个得到。`

## Put()

```go
func (p *Pool) Put(x interface{}) {
   if x == nil {
      return
   }
   if race.Enabled {
      if fastrand()%4 == 0 {
         // Randomly drop x on floor.
         return
      }
      race.ReleaseMerge(poolRaceAddr(x))
      race.Disable()
   }
   l, _ := p.pin()
   if l.private == nil {
      l.private = x
      x = nil
   }
   if x != nil {
      l.shared.pushHead(x)
   }
   runtime_procUnpin()
   if race.Enabled {
      race.Enable()
   }
}
```

因为race几个函数点进去也没有实现，我也不知道是干嘛的，我们讲讲遇见的第一个调用p.pin()

```
// pin pins the current goroutine to P, disables preemption and
// returns poolLocal pool for the P and the P's id.
// Caller must call runtime_procUnpin() when done with the pool.
func (p *Pool) pin() (*poolLocal, int) {
   pid := runtime_procPin()
   // In pinSlow we store to local and then to localSize, here we load in opposite order.
   // Since we've disabled preemption, GC cannot happen in between.
   // Thus here we must observe local at least as large localSize.
   // We can observe a newer/larger local, it is fine (we must observe its zero-initialized-ness).
   s := runtime_LoadAcquintptr(&p.localSize) // load-acquire
   l := p.local                              // load-consume
   if uintptr(pid) < s {
      return indexLocal(l, pid), pid
   }
   return p.pinSlow()
}
```



先看到`pid := runtime_procPin()`这个从名字就可以看出，得到一个？进程ID，当前Go语言语境下应该是GMP中的P ID并且防止抢占当的P，然后是`s := runtime_LoadAcquintptr(&p.localSize)`，看字面意思可知，这里得到是就是local数组的size，`l := p.local `这里是一个指针，在这个API中，会常常见到指针操作。

首先，我们可以看到

```go
if uintptr(pid) < s {
   return indexLocal(l, pid), pid
}
```

这是干嘛的？看看源码

```go
func indexLocal(l unsafe.Pointer, i int) *poolLocal {
   lp := unsafe.Pointer(uintptr(l) + uintptr(i)*unsafe.Sizeof(poolLocal{}))
   return (*poolLocal)(lp)
}
```

原来如此，我拿我local的基址加上pid个偏移量，得到一个新的指针地址，这个地址是一个

```go
// Local per-P Pool appendix.
type poolLocalInternal struct {
   private interface{} // Can be used only by the respective P.
   shared  poolChain   // Local P can pushHead/popHead; any P can popTail.
}

type poolLocal struct {
   poolLocalInternal

   // Prevents false sharing on widespread platforms with
   // 128 mod (cache line size) = 0 .
   pad [128 - unsafe.Sizeof(poolLocalInternal{})%128]byte
}
```

`pad`是什么？注释里说了，防止false sharing，就是防止多个对象公用Cacheline，所以搞个pad把人家从缓存里顶出去，独占Cacheline，缺点就是会浪费Cache，因为pad本身没啥意义。

`return p.pinSlow()`看到下面这个返回值里的方法

```go
func (p *Pool) pinSlow() (*poolLocal, int) {
   // Retry under the mutex.
   // Can not lock the mutex while pinned.
   runtime_procUnpin()
   allPoolsMu.Lock()
   defer allPoolsMu.Unlock()
   pid := runtime_procPin()
   // poolCleanup won't be called while we are pinned.
   s := p.localSize
   l := p.local
   if uintptr(pid) < s {
      return indexLocal(l, pid), pid
   }
   if p.local == nil {
      allPools = append(allPools, p)
   }
   // If GOMAXPROCS changes between GCs, we re-allocate the array and lose the old one.
   size := runtime.GOMAXPROCS(0)
   local := make([]poolLocal, size)
   atomic.StorePointer(&p.local, unsafe.Pointer(&local[0])) // store-release
   runtime_StoreReluintptr(&p.localSize, uintptr(size))     // store-release
   return &local[pid], pid
}
```

上面的`pid := runtime_procPin()`与这里`runtime_procUnpin()`显然是一对的！上面注释也说了

>// pin pins the current goroutine to P, disables preemption and
>// returns poolLocal pool for the P and the P's id.
>// Caller must call runtime_procUnpin() when done with the pool.

可见这里pool就是在这里创建的

```go
allPoolsMu.Lock()
defer allPoolsMu.Unlock()
pid := runtime_procPin()
// poolCleanup won't be called while we are pinned.
```

因为注释里讲pinned了就无法上锁了，所以这里先上锁，再pin，也是为了获得一个新的pid，并且防止poolcleanup(),我个人理解这里上锁的目的是因为` allPools = append(allPools, p)`，slice不是并发安全的

```go
if uintptr(pid) < s {
   return indexLocal(l, pid), pid
}
```

又是上面出现过的函数，这里我个人理解，因为p.local是一个数组，如果pid当前地址比s也就是数组的size还小，说明这个pid数组是已经存在于曾经已经分配过的p.local这个数组里面的一部分或者说是一个切片，故可以通过p.local作为基址寻址得到

```go
if p.local == nil {
   allPools = append(allPools, p)
}
```

走到这一步，说明p.local是一个新的Pool指针，所以添加到allPools里面

```go
// If GOMAXPROCS changes between GCs, we re-allocate the array and lose the old one.
size := runtime.GOMAXPROCS(0)
local := make([]poolLocal, size)
atomic.StorePointer(&p.local, unsafe.Pointer(&local[0])) // store-release 就是拿首地址像C语言一样
runtime_StoreReluintptr(&p.localSize, uintptr(size))     // store-release
return &local[pid], pid
```

这里的size就是p的个数，这里也没啥好说的，就是一个C-Style的传数组指针，不过是原子操作，然后返回一个&local[pid]也就是poolLocal，这个poolLocal是可以被上面的p.local通过他传入的首地址+偏移找到的

回到Put()

```
if l.private == nil {
   l.private = x
   x = nil
}
```

我们拿到了poolLocal，因为刚刚新建的，所以这里赋值给他的private，x=nil这里我理解是方便GC

但是如果这个poolLocal不是新建的，那么就会走下面这个流程，因为x=nil并不会发生，所以x != nil会成立

```go
if x != nil {
   l.shared.pushHead(x)
}
```

```go
func (c *poolChain) pushHead(val interface{}) {
   d := c.head
   if d == nil {
      // Initialize the chain.
      const initSize = 8 // Must be a power of 2
      d = new(poolChainElt)
      d.vals = make([]eface, initSize)
      c.head = d
      storePoolChainElt(&c.tail, d)
   }

   if d.pushHead(val) {
      return
   }

   // The current dequeue is full. Allocate a new one of twice
   // the size.
   newSize := len(d.vals) * 2
   if newSize >= dequeueLimit {
      // Can't make it any bigger.
      newSize = dequeueLimit
   }

   d2 := &poolChainElt{prev: d}
   d2.vals = make([]eface, newSize)
   c.head = d2
   storePoolChainElt(&d.next, d2)
   d2.pushHead(val)
}
```

让我们看看poolChain先，很明显，是一个双向队列

```go
type poolChain struct {
   // head is the poolDequeue to push to. This is only accessed
   // by the producer, so doesn't need to be synchronized.
   head *poolChainElt

   // tail is the poolDequeue to popTail from. This is accessed
   // by consumers, so reads and writes must be atomic.
   tail *poolChainElt
}

type poolChainElt struct {
   poolDequeue

   // next and prev link to the adjacent poolChainElts in this
   // poolChain.
   //
   // next is written atomically by the producer and read
   // atomically by the consumer. It only transitions from nil to
   // non-nil.
   //
   // prev is written atomically by the consumer and read
   // atomically by the producer. It only transitions from
   // non-nil to nil.
   next, prev *poolChainElt
}
```

回到pushHead函数,我们发现，当head为空，会做一个普普通通的首尾相连的初始化，然后把val放到这个新队列头部，结束。

```go
d := c.head
if d == nil {
   // Initialize the chain.
   const initSize = 8 // Must be a power of 2
   d = new(poolChainElt)
   d.vals = make([]eface, initSize)
   c.head = d
   storePoolChainElt(&c.tail, d)
}
if d.pushHead(val) {
		return
	}

```

但是我们发现`d.pushHead(val)`是一个bool!他可以是false！！

```go
// pushHead adds val at the head of the queue. It returns false if the
// queue is full. It must only be called by a single producer.
func (d *poolDequeue) pushHead(val interface{}) bool {
   ptrs := atomic.LoadUint64(&d.headTail)
   head, tail := d.unpack(ptrs)
   if (tail+uint32(len(d.vals)))&(1<<dequeueBits-1) == head {
      // Queue is full.
      return false
   }
   slot := &d.vals[head&uint32(len(d.vals)-1)]

   // Check if the head slot has been released by popTail.
   typ := atomic.LoadPointer(&slot.typ)
   if typ != nil {
      // Another goroutine is still cleaning up the tail, so
      // the queue is actually still full.
      return false
   }

   // The head slot is free, so we own it.
   if val == nil {
      val = dequeueNil(nil)
   }
   *(*interface{})(unsafe.Pointer(slot)) = val

   // Increment head. This passes ownership of slot to popTail
   // and acts as a store barrier for writing the slot.
   atomic.AddUint64(&d.headTail, 1<<dequeueBits)
   return true
}
```

看到第一个false,原来如此，这个位运算是我看不懂的！一脸懵逼，让我们看看upack

```go
ptrs := atomic.LoadUint64(&d.headTail)
head, tail := d.unpack(ptrs)
if (tail+uint32(len(d.vals)))&(1<<dequeueBits-1) == head {
   // Queue is full.
   return false
}
```

我一看，虽然没太看懂这个位运算，但是咱还是可以知道，这个队列满了

```go
func (d *poolDequeue) unpack(ptrs uint64) (head, tail uint32) {
   const mask = 1<<dequeueBits - 1
   head = uint32((ptrs >> dequeueBits) & mask)
   tail = uint32(ptrs & mask)
   return
}
```

看下面的代码,从注释我们可以得知，这里是做一个并发的检查，typ不！=nil说明其他协程在做cleaning up，这个队列也是满了的

```go
// Check if the head slot has been released by popTail.
typ := atomic.LoadPointer(&slot.typ)
if typ != nil {
   // Another goroutine is still cleaning up the tail, so
   // the queue is actually still full.
   return false
}
```

```go
// The head slot is free, so we own it.
if val == nil {
   val = dequeueNil(nil) //空占位符
}
*(*interface{})(unsafe.Pointer(slot)) = val //给slot的地址赋上当前val

// Increment head. This passes ownership of slot to popTail
// and acts as a store barrier for writing the slot.
atomic.AddUint64(&d.headTail, 1<<dequeueBits) //把头尾打包在一起
return true
```

回到Put(),解除在上方Pin中的防止多个p竞争，此时已然不是协程安全，Put结束。

```go
runtime_procUnpin()
if race.Enabled {
   race.Enable()
}
```

## Put总结

Pin拿poolLocal-> 是否已经初始化->通过pid寻址找->找不到新创建一块

l.private(也是就上面poolLocal.private)是否存在->不存在赋值给private->存在push到l.shared的环形链表



## Get()

```go
// Get selects an arbitrary item from the Pool, removes it from the
// Pool, and returns it to the caller.
// Get may choose to ignore the pool and treat it as empty.
// Callers should not assume any relation between values passed to Put and
// the values returned by Get.
//
// If Get would otherwise return nil and p.New is non-nil, Get returns
// the result of calling p.New.
func (p *Pool) Get() interface{} {
   if race.Enabled {
      race.Disable()
   }
   l, pid := p.pin()
   x := l.private
   l.private = nil
   if x == nil {
      // Try to pop the head of the local shard. We prefer
      // the head over the tail for temporal locality of
      // reuse.
      x, _ = l.shared.popHead()
      if x == nil {
         x = p.getSlow(pid)
      }
   }
   runtime_procUnpin()
   if race.Enabled {
      race.Enable()
      if x != nil {
         race.Acquire(poolRaceAddr(x))
      }
   }
   if x == nil && p.New != nil {
      x = p.New()
   }
   return x
}
```

最上面注释就自己看看，看到第一行代码,可知，这个是可以被竞争的，虽然race代码实现看不到，可见sync.Pool是多读单写的

```go
if race.Enabled {
   race.Disable()
}
```

又是熟悉的pin，可见是先从根据协程的pid去找到poolLocal，如果找到了，就直接拿private的值，根据上面Put()可知，只有先有private存在值了，才会放入后面的shared的环形双向队列里。

```go
l, pid := p.pin()
x := l.private
l.private = nil
```

那么下面这代码怎么能得到x==nil的情况？串行情况下是不行的，但是别忘了，Get()是多读的，可以并发被访问，并发条件下是可能先被执行了上面那段代码让private=nil的。

然后从shared里拿

```go
if x == nil {
   // Try to pop the head of the local shard. We prefer
   // the head over the tail for temporal locality of
   // reuse.
   x, _ = l.shared.popHead()
   if x == nil {
      x = p.getSlow(pid)
   }
}
```

如果拿不到，就要进入getslow

```go
func (p *Pool) getSlow(pid int) interface{} {
   // See the comment in pin regarding ordering of the loads.
   size := runtime_LoadAcquintptr(&p.localSize) // load-acquire
   locals := p.local                            // load-consume
   // Try to steal one element from other procs.
   for i := 0; i < int(size); i++ {
      l := indexLocal(locals, (pid+i+1)%int(size))
      if x, _ := l.shared.popTail(); x != nil {
         return x
      }
   }

   // Try the victim cache. We do this after attempting to steal
   // from all primary caches because we want objects in the
   // victim cache to age out if at all possible.
   size = atomic.LoadUintptr(&p.victimSize)
   if uintptr(pid) >= size {
      return nil
   }
   locals = p.victim
   l := indexLocal(locals, pid)
   if x := l.private; x != nil {
      l.private = nil
      return x
   }
   for i := 0; i < int(size); i++ {
      l := indexLocal(locals, (pid+i)%int(size))
      if x, _ := l.shared.popTail(); x != nil {
         return x
      }
   }

   // Mark the victim cache as empty for future gets don't bother
   // with it.
   atomic.StoreUintptr(&p.victimSize, 0)

   return nil
}
```

看第一行代码,注释说是去其他p去做一个任务窃取，我个人理解就是扫以p.locals为基址，然后以扫后续size大小的内存，size大小是在 pinSlow()里根据p的数量决定的，所以p只要不变多，就肯定能扫到

```go
// See the comment in pin regarding ordering of the loads.
size := runtime_LoadAcquintptr(&p.localSize) // load-acquire
locals := p.local                            // load-consume
// Try to steal one element from other procs.
for i := 0; i < int(size); i++ {
   l := indexLocal(locals, (pid+i+1)%int(size))
   if x, _ := l.shared.popTail(); x != nil {
      return x
   }
}
```

下面的代码，是从victim中去找，victim是只有poolCleanup()才会产生的，从字面上看，就是被清楚之后的缓存，poolCleanup()之后再说，先看Get()

```go
// Try the victim cache. We do this after attempting to steal
// from all primary caches because we want objects in the
// victim cache to age out if at all possible.
size = atomic.LoadUintptr(&p.victimSize)
if uintptr(pid) >= size {
   return nil
}
locals = p.victim
l := indexLocal(locals, pid)
if x := l.private; x != nil {
   l.private = nil
   return x
}
for i := 0; i < int(size); i++ {
   l := indexLocal(locals, (pid+i)%int(size))
   if x, _ := l.shared.popTail(); x != nil {
      return x
   }
}

// Mark the victim cache as empty for future gets don't bother
// with it.
atomic.StoreUintptr(&p.victimSize, 0)

return nil
```

可以发现，就和之前的流程的一样的，只是从local换成了victim，就没啥能讲了，最后把victim清空（就是上面那行注释）

看下面

```go
runtime_procUnpin()//跟pin里面的对应
if race.Enabled {
   race.Enable()
   if x != nil {
      race.Acquire(poolRaceAddr(x))
   }
}
```

这里咱就看看注释把，我看了注释里的网址中的讨论，我理解出来就是解决的问题就是防止覆写和数据丢失，注释里写是防止地址冲突

```go
// poolRaceAddr returns an address to use as the synchronization point
// for race detector logic. We don't use the actual pointer stored in x
// directly, for fear of conflicting with other synchronization on that address.
// Instead, we hash the pointer to get an index into poolRaceHash.
// See discussion on golang.org/cl/31589.
func poolRaceAddr(x interface{}) unsafe.Pointer {
   ptr := uintptr((*[2]unsafe.Pointer)(unsafe.Pointer(&x))[1])
   h := uint32((uint64(uint32(ptr)) * 0x85ebca6b) >> 16)
   return unsafe.Pointer(&poolRaceHash[h%uint32(len(poolRaceHash))])
}
```

然后还没有就New一个，如果New也没有，就是上面x := l.private，也就是一块空的interface{},结束。

```go
if x == nil && p.New != nil {
   x = p.New()
}
return x
```

## Get()总结

pin根据pid去寻址找到当前local->local.private有没有->有就找到了

如果private没有，去shared找->shared没有，就去其他p偷

如果其他p也偷不到，就去victim找，也是上面同样流程，先找private ,再找shared

还没有，看New是不是空的，是就返回空接口，不是就New一个。



## poolCleanup()

我们可以发现，只有在代码初始化的时候会做

```go
func init() {
   runtime_registerPoolCleanup(poolCleanup)
}
```

见注释可知，只有stw时候，也就是gc才会用

```go
func poolCleanup() {
   // This function is called with the world stopped, at the beginning of a garbage collection.
   // It must not allocate and probably should not call any runtime functions.

   // Because the world is stopped, no pool user can be in a
   // pinned section (in effect, this has all Ps pinned).

   // Drop victim caches from all pools.
   for _, p := range oldPools {
      p.victim = nil
      p.victimSize = 0
   }

   // Move primary cache to victim cache.
   for _, p := range allPools {
      p.victim = p.local
      p.victimSize = p.localSize
      p.local = nil
      p.localSize = 0
   }

   // The pools with non-empty primary caches now have non-empty
   // victim caches and no pools have primary caches.
   oldPools, allPools = allPools, nil
}
```

非常简单，就是把旧victim丢了，然后根据allPools，也就是pin去找的时候找不到会新开的时候添加的poolLocal们，建立新的victim

## 讲完了

