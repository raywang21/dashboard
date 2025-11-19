这是一个基于clojure script的dashboard。
特点是基于react和material UI，用clojure script来保存全局变量，以便用repl调试。
模块是纯函数，用react来编写，但是是js格式，利于AI生成。

index.html中，利用CDN链接，引入react，material UI和scittle。
同时执行ClojureScript中的初始化函数（其实也可以在cljs文件末尾直接执行这些函数）。
这样可以避免安装这些npm依赖。

dashboard-main.js，负责根据页面链接，调用对应的模块js文件。
在调用模块js文件的时候，把main.cljs中的函数作为props传递给模块js文件。
例如：
case 'analysis':
          return React.createElement(Component, { 
            data: {
              ...componentData,
              updateModuleData: componentCallbacks.updateModuleData,
              getModuleData: componentCallbacks.getModuleData,
              callCljsFunc: componentCallbacks.callCljsFunc
            }
          });

pages下面，是各种模块js文件，负责每个模块的具体操作。
他们都是纯函数，采用react，但是没有用JSX格式，而是单纯的js文件，
通过调用React.createElement函数来生成react组件。
所以不需要安装babelon等编译react文件的依赖。
访问服务器的接口，目前也通过props传递进来，这样便于mock调试。


main.cljs，是clojure script文件，用atom形式存放数据，模块文件通过updateModuleData和getModuleData来存取。
这里面要注意js和cljs数据格式的转换。
;; JavaScript对象转换函数 - 保持camelCase命名
(defn js->clj-camelcase [js-obj]
  "将JavaScript对象转换为ClojureScript map，保持camelCase关键字"
  (when js-obj
    (->> (js->clj js-obj :keywordize-keys true) 
         )))
; :keywordize-keys true，把字符串原样转换为keyword

(defn clj->js-camelcase [clj-data]
  "递归将ClojureScript数据转换为JavaScript对象"
  (when clj-data
    (clj->js clj-data :keyword-fn #(name %))))
; :keyword-fn #(name %)，把keyword原样转换为字符串
参考docs\naming-convention-guide.md

还要注意命名方式，ClojureScript中注意检查
- 数据结构推荐使用camelCase关键字（与javascript命名方式保持一致，避免转换工作）
- clojure函数名使用kebab-case命名
- clojure局部变量使用kebab-case命名
- 使用 `js->clj-camelcase` 处理JavaScript对象
- 使用 `clj->js-camelcase` 返回JavaScript对象


使用方法：
安装josh
用来为基于scittle（浏览器解释执行clojure script的环境）的clojure script提供一个repl服务器。
npm install cljs-josh

运行josh
npx josh

在项目根目录下放一个文件.nrepl-port，可以指定repl链接端口为7888
里面就一句话
{:port 7888}

calva连接项目中运行的repl，类型选择clojure script nRepl Server
可以在repl中执行 @main/module-data 看到样板项目中的cljs atom（repl缺省在user名字空间，必须加上main这个名字空间前缀才行）