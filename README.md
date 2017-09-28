# CloudWeighSystem
这是一个云称重系统的服务端代码，分为client.js, server.js, Cloud_Weigh.sql三个文件。其中：
1. client.js是供客户端查询数据库的。用到的是express框架，相应post请求，监听7878端口。post请求中应包含id键，值为要查询的设备ID。
2. server.js是供设备上传数据到数据库的。用到了socket和mysql。本文件中，socket监听6969端口，如果有相应的数据帧传送过来，则将此数据进行有效性判断后添加到数据库中。
3. Cloud_Weigh.sql是数据库表文件。
---
注意：在使用前，需先创建名为Cloud_Weigh的数据库，然后source上述Cloud_Weigh.sql文件。
