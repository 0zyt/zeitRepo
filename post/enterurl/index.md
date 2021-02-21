

### 输入URL后会发生什么
1. 调用浏览器渲染引擎（譬如V8），解析网络请求，解析执行JS，UI后端渲染
2. 从URL中解析域名，根据域名查询[DNS](#dns)
    1. 在浏览器DNS缓存中查询
    2. 在操作系统DNS缓存中搜索
    3. 系统Hosts文件中查询
    4. 向本地DNS服务器发起Query请求（UDP）    
3. 与Server进行[TCP](#tcp)握手（+TLS握手）
4. 构造HTTP请求，填充上下文到HTTP头
5. 发送HTTP请求，收到HTML页面作为响应
6. 浏览器引擎解析响应，并渲染至界面，根据HTML文档中超链接再构造HTTP请求
7. 发起获取页面资源的HTTP请求



<h4 id="dns">DNS</h4>
1. 递归查询
	1. eg: www.baidu.com，先从根服务器查询com 路由到权威服务器查询baidu...到更下级的DNS服务器直到查询到IP后返回

<h4 id="tcp">TCP</h4>

1. 三次握手
   1. C: SYN->
   2. S: <-SYN,ACK
   3. C: ACK->
2. 四次挥手
	1. FIN->
	2. <-ACK
	3. <-FIN,ACK
	4. ACK->
3. 状态机图
```
                              +---------+ ---------\      active OPEN
                              |  CLOSED |            \    -----------
                              +---------+<---------\   \   create TCB
                                |     ^              \   \  snd SYN
                   passive OPEN |     |   CLOSE        \   \
                   ------------ |     | ----------       \   \
                    create TCB  |     | delete TCB         \   \
                                V     |                      \   \
                              +---------+            CLOSE    |    \
                              |  LISTEN |          ---------- |     |
                              +---------+          delete TCB |     |
                   rcv SYN      |     |     SEND              |     |
                  -----------   |     |    -------            |     V
 +---------+      snd SYN,ACK  /       \   snd SYN          +---------+
 |         |<-----------------           ------------------>|         |
 |   SYN   |                    rcv SYN                     |   SYN   |
 |   RCVD  |<-----------------------------------------------|   SENT  |
 |         |                    snd ACK                     |         |
 |         |------------------           -------------------|         |
 +---------+   rcv ACK of SYN  \       /  rcv SYN,ACK       +---------+
   |           --------------   |     |   -----------
   |                  x         |     |     snd ACK
   |                            V     V
   |  CLOSE                   +---------+
   | -------                  |  ESTAB  |
   | snd FIN                  +---------+
   |                   CLOSE    |     |    rcv FIN
   V                  -------   |     |    -------
 +---------+          snd FIN  /       \   snd ACK          +---------+
 |  FIN    |<-----------------           ------------------>|  CLOSE  |
 | WAIT-1  |------------------                              |   WAIT  |
 +---------+          rcv FIN  \                            +---------+
   | rcv ACK of FIN   -------   |                            CLOSE  |
   | --------------   snd ACK   |                           ------- |
   V        x                   V                           snd FIN V
 +---------+                  +---------+                   +---------+
 |FINWAIT-2|                  | CLOSING |                   | LAST-ACK|
 +---------+                  +---------+                   +---------+
   |                rcv ACK of FIN |                 rcv ACK of FIN |
   |  rcv FIN       -------------- |    Timeout=2MSL -------------- |
   |  -------              x       V    ------------        x       V
    \ snd ACK                 +---------+delete TCB         +---------+
     ------------------------>|TIME WAIT|------------------>| CLOSED  |
                              +---------+                   +---------+
```
