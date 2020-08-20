(window.webpackJsonp=window.webpackJsonp||[]).push([[24],{298:function(t,a,s){"use strict";s.r(a);var e=s(4),n=Object(e.a)({},(function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h2",{attrs:{id:"介绍："}},[s("a",{staticClass:"header-anchor",attrs:{href:"#介绍："}},[t._v("#")]),t._v(" 介绍：")]),t._v(" "),s("p",[t._v("Queue 是一个 FIFO（先进先出）的数据结构，并发中使用较多，可以安全地将对象从一个任务传给另一个任务。")]),t._v(" "),s("h2",{attrs:{id:"show-code"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#show-code"}},[t._v("#")]),t._v(" show code")]),t._v(" "),s("p",[t._v("一个最最基础的队列")]),t._v(" "),s("div",{staticClass:"language-java extra-class"},[s("pre",{pre:!0,attrs:{class:"language-java"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ArrayQueue")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("private")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Object")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v(" items"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("private")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("int")]),t._v(" num"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n                head"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n                tail"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ArrayQueue")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("int")]),t._v(" capacity"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("items "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Object")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("capacity"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("num "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" capacity"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("boolean")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("enqueue")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Object")]),t._v(" item"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("num"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("==")]),t._v("tail"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("==")]),t._v("head"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("false")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n            "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("for")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("int")]),t._v(" i "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" head"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" i "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),t._v("tail "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" i"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("++")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n                items"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("i"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("head"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v("items"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("i"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n            "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n            tail"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-=")]),t._v("head"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n            head"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n        items"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("tail"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v("item"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        tail"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("++")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("true")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Object")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("dequeue")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("head"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("==")]),t._v("tail"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("null")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Object")]),t._v(" ret"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v("items"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("head"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("++")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" ret"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n")])])]),s("h2",{attrs:{id:"queue-interface"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#queue-interface"}},[t._v("#")]),t._v(" Queue interface")]),t._v(" "),s("p",[t._v("Queue 在 Java 中是 Interface, 一种实现是 LinkedList, LinkedList 向上转型为 Queue, Queue 通常不能存储 null 元素，否则与 "),s("code",[t._v("poll()")]),t._v(" 等方法的返回值混淆。")]),t._v(" "),s("table",[s("thead",[s("tr",[s("th"),t._v(" "),s("th",{staticStyle:{"text-align":"center"}},[t._v("Throws exception")]),t._v(" "),s("th",[t._v("Returns special value")])])]),t._v(" "),s("tbody",[s("tr",[s("td",[t._v("Insert")]),t._v(" "),s("td",{staticStyle:{"text-align":"center"}},[t._v("add(e)")]),t._v(" "),s("td",[t._v("offer(e)"),s("br")])]),t._v(" "),s("tr",[s("td",[t._v("Remove")]),t._v(" "),s("td",{staticStyle:{"text-align":"center"}},[t._v("remove()")]),t._v(" "),s("td",[t._v("poll()"),s("br")])]),t._v(" "),s("tr",[s("td",[t._v("Examine")]),t._v(" "),s("td",{staticStyle:{"text-align":"center"}},[t._v("element()")]),t._v(" "),s("td",[t._v("peek()")])])])]),t._v(" "),s("p",[t._v("优先考虑右侧方法，右侧元素不存在时返回 null. 判断非空时使用"),s("code",[t._v("isEmpty()")]),t._v("方法，继承自 Collection.")]),t._v(" "),s("h2",{attrs:{id:"priority-queue-优先队列"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#priority-queue-优先队列"}},[t._v("#")]),t._v(" Priority Queue - 优先队列")]),t._v(" "),s("p",[t._v("Java 中提供"),s("code",[t._v("PriorityQueue类")]),t._v("，该类是 Interface Queue 的另外一种实现，和"),s("code",[t._v("LinkedList")]),t._v("的区别主要在于排序行为而不是性能，基于 priority heap 实现，非"),s("code",[t._v("synchronized")]),t._v("，故多线程下应使用"),s("code",[t._v("PriorityBlockingQueue")]),t._v(". 默认为自然序（小根堆），需要其他排序方式可自行实现"),s("code",[t._v("Comparator")]),t._v("接口，选用合适的构造器初始化。使用迭代器遍历时不保证有序，有序访问时需要使用"),s("code",[t._v("Arrays.sort(pq.toArray())")]),t._v(".")]),t._v(" "),s("p",[t._v("不同方法的时间复杂度：")]),t._v(" "),s("ul",[s("li",[t._v("enqueuing and dequeuing: "),s("code",[t._v("offer")]),t._v(", "),s("code",[t._v("poll")]),t._v(", "),s("code",[t._v("remove()")]),t._v(" and "),s("code",[t._v("add")]),t._v(" - O(logn)")]),t._v(" "),s("li",[t._v("Object: "),s("code",[t._v("remove(Object)")]),t._v(" and "),s("code",[t._v("contains(Object)")]),t._v(" - O(n)")]),t._v(" "),s("li",[t._v("retrieval: "),s("code",[t._v("peek")]),t._v(", "),s("code",[t._v("element")]),t._v(", and "),s("code",[t._v("size")]),t._v(" - O(1)")])]),t._v(" "),s("h2",{attrs:{id:"deque-双端队列"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#deque-双端队列"}},[t._v("#")]),t._v(" Deque - 双端队列")]),t._v(" "),s("p",[t._v("双端队列（deque，全名double-ended queue）可以让你在任何一端添加或者移除元素，因此它是一种具有队列和栈性质的数据结构。")]),t._v(" "),s("p",[t._v("Java 在1.6之后提供了 Deque 接口，既可使用"),s("code",[t._v("ArrayDeque")]),t._v("（数组）来实现，也可以使用"),s("code",[t._v("LinkedList")]),t._v("（链表）来实现。前者是一个数组外加首尾索引，后者是双向链表。")]),t._v(" "),s("table",[s("thead",[s("tr",[s("th"),t._v(" "),s("th",[t._v("Throws exception")]),t._v(" "),s("th",[t._v("Special value")]),t._v(" "),s("th",[t._v("Throws exception")]),t._v(" "),s("th",[t._v("Special value")])])]),t._v(" "),s("tbody",[s("tr",[s("td",[t._v("Insert")]),t._v(" "),s("td",[t._v("addFirst(e)")]),t._v(" "),s("td",[t._v("offerFirst(e)")]),t._v(" "),s("td",[t._v("addLast(e)")]),t._v(" "),s("td",[t._v("offerLast(e)")])]),t._v(" "),s("tr",[s("td",[t._v("Remove")]),t._v(" "),s("td",[t._v("removeFirst()")]),t._v(" "),s("td",[t._v("pollFirst()")]),t._v(" "),s("td",[t._v("removeLast()")]),t._v(" "),s("td",[t._v("pollLast()")])]),t._v(" "),s("tr",[s("td",[t._v("Examine")]),t._v(" "),s("td",[t._v("getFirst()")]),t._v(" "),s("td",[t._v("peekFirst()")]),t._v(" "),s("td",[t._v("getLast()")]),t._v(" "),s("td",[t._v("peekLast()")])])])]),t._v(" "),s("p",[t._v("其中offerLast和 Queue 中的offer功能相同，都是从尾部插入。")])])}),[],!1,null,null,null);a.default=n.exports}}]);