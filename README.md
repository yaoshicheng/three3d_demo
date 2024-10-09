运行一个本地的服务器
很多的编程语言都具有一个内置的简易HTTP服务器。它们的功能并不像能够被用于生产环境的服务器，例如Apache 或者 NGINX那样完善， 但对于你来测试three.js应用程序来说，它们就已经足够了。

流行的代码编辑器插件
一些代码编辑器具有插件，可以根据需要生成简单的服务器。

Visual Studio Code Live Server 插件。
Atom Live Server 插件。
Servez
Servez 一个具有界面的简单服务器。

Node.js server
Node.js 具有一个简单的HTTP服务器包，如需安装，请执行：

npm install http-server -g
若要从本地目录下运行，请执行：

http-server . -p 8000
Python server
如果你已经安装好了Python，只需要从命令行里便可以运行它（从工作目录）：

//Python 2.x
python -m SimpleHTTPServer

//Python 3.x
python -m http.server
这将会在为当前目录在8000端口创建一个服务器，也就是说你可以在地址栏里输入这个地址来访问已经创建好的服务器：

http://localhost:8000/
Ruby server
如果你已经安装好了Ruby，通过执行下列命也可以创建同样的服务器：

ruby -r webrick -e "s = WEBrick::HTTPServer.new(:Port => 8000, :DocumentRoot => Dir.pwd); trap('INT') { s.shutdown }; s.start"
PHP server
PHP自从5.4.0版本开始，就内置了一个Web服务器：

php -S localhost:8000
Lighttpd
Lighttpd是一个轻量级的通用Web服务器，在这里，我们将介绍如何在OS X上使用HomeBrew来安装它。 和我们在这里讨论的其他服务器不同，lighttpd是一个成熟的、准用于生产环境的服务器。

通过HomeBrew安装lighttpd
brew install lighttpd
在你希望作为服务器来运行的目录里，创建一个名为lighttpd.conf的配置文件。 这是一个配置文件的样本：TutorialConfiguration。
在配置文件里，将server.document-root更改为你将要创建的服务器中的文件的所在的目录。
通过这个命令来启动：
lighttpd -f lighttpd.conf
使用浏览器打开http://localhost:3000/，然后服务器将可以从你所选择的目录中向你提供静态文件。
IIS
如果你正在使用Microsoft IIS来作为网站服务器，在服务器载入之前，请为.fbx扩展名增加MIME类型。

File name extension: fbx        MIME Type: text/plain
在默认情况下，IIS阻止 .fbx、 .obj 文件的下载，因此你必须对IIS进行配置，使得这些类型的文件可以被下载。

其它简单的替代方案你可以在Stack Overflow上找到：click here。
