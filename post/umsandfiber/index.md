
今天学习了[Windows文档][https://docs.microsoft.com/zh-cn/windows/win32/procthread/about-processes-and-threads]，发现了一个新的概念，叫UMS(User-Mode Scheduling)，了解之后发现，这个东西很像Goroutine,我本人对于协程的认知其实也就是个由Runtime/VM/Framework/Programming language提供的用户态线程调度器，当然Goroutine是特例或者说不是协程，但是在Windows中，分出了两个东西，一个叫UMS，一个叫Fiber.Fiber也就是咱们更加熟知的“协程”，由手动管理调度的协程（我这里想到的是Kotlin Coroutine的suspend和resume)。

