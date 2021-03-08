
TCP三次握手是面试的一个常考点，常常会问：不三次握手行不行？为什么是三次握手不是更多或者更少？
八股文答案就不说了，网上很多。
但是TCP确实是可以不三次握手的，那就是TFO（TCP FAST OPEN），TFO会在第一次三次握手时，在SYN-ACK这个报文上带上一个Fast Open Cookie，让客户端保存，客户端第二次访问服务端时候，发SYN带上这个Cookie，Cookie中维护了上一次连接中建立的信息，就可以只握手一次拉！1个RTT完成握手。
那么，我们可以想到，后续几次握手的关键信息，就在这个Cookie里，也就是说，是这个Cookie里的东西让后两次握手避免了。
## 探索RFC7413
https://tools.ietf.org/html/rfc7413

TOC只能是根据服务端Mac生成的，会验证客户端的源IP地址、会有一个过期时间（安全考虑）并且可以定期更新

服务端操作

```
-  GetCookie(IP_Address): returns a (new) cookie.
-  IsCookieValid(IP_Address, Cookie): checks if the cookie is valid,
    i.e., it has not expired and the cookie authenticates the client
    IP address.
```

会保存TCP options



客户端的TFO依赖客户端与服务器的IP地址，客户端会保存最近接收的一对Cookie，客户端也缓存MSS，因为MSS会在SYN-ACK包中，所以可以提高性能，如果没有缓存会用默认的IPV4 536 bytes和IPV6 1220 bytes 大小MSS，如果太大可能会在MTU分片抵消TFO优势还有重传等其他副作用。

客户端还要缓存负面的响应避免可能的连接失败，比如服务器没确认的SYN中的数据，ICMP错误消息和完全没有来自服务端的SYN-ACK响应，比如中间设备或者防火墙导致的SYN丢包，这时应该暂时关闭TFO在这个特别的地址上（目的IP和端口），所以也要缓存目标端口。



## 完

我没逐字逐句看，就看到这么多了，可能还很多不完善