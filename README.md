# Web前端性能优化
几乎所有的开发者都会面临着开发的网站存在加载问题，想要加快网页的加载速度前端的页面更需要在性能优化上下功夫，只有这样才能实现更好的用户体验。

本文根据自己的学习笔记、工作经验总结而来，从构建、浏览器渲染、缓存、PWA、服务端优化等多方面，梳理前端性能优化的技术点、综合分析技术的原理，根据不同的业务场景选择合适的性能优化点进行应用，最终为你的网站带来显著的速度提升和整体性能提升。
## 注意
性能优化要见机行事，随机应变，坚持中庸的思想，不可过度优化。
## 设计到的前端性能优化点、功能点
- 网络层面
- 构建层面
- 服务端层面
- 浏览器渲染层面
- 资源的合并与压缩
- 图片编解码原理和类型选择
- 浏览器的渲染机制
- 懒加载预加载
- 浏览器存储
- 缓存机制
- PWA
- Vue-SSR
## 资源的合并与压缩
- 目标
    - 理解减少http请求数量和减少请求资源大小两个优化要点
    - 掌握压缩和合并的原理
    - 掌握通过在线网站和fis3两种实现压缩与合并的方法
浏览器的一个请求从发送到返回都经历了什么？

![浏览器的一个请求从发送到返回的经历](http://note.youdao.com/yws/public/resource/c2361265179a03449f6d52397fd50033/xmlnote/6FEF241D4A474A709524227E7D6BD7D4/17830)

- html压缩
- css压缩
- js压缩
- 文件合并
    - 文件合并可能产生的问题
        - 首屏渲染的问题
        - 缓存失效的问题
    - 文件合并的建议
        - 公共库合并
        - 不同页面的合并
## 图片相关的优化
- png8/png24/png32之间的区别
    - png8--256色 + 支持透明
    - png24--2^24色 + 不支持透明
    - png32--2^24 + 支持透明
- 不同格式图片常用的业务场景
    - jpg有损压缩，压缩率高，不支持透明，适用于大部分不需要透明图片的业务场景
    - png支持透明，浏览器兼容好，适用于大部分需要透明图片的业务场景
    - webp压缩程度更好，在ios webview有兼容性问题，适用于安卓全部
    - svg矢量图，代码内嵌，相对较小，适用于图片样式相对简单的场景
- 图片优化的几种方法,通常都用前端构建工具完成
    - 进行图片压缩，常用网站：[tinypng](https://tinypng.com/)
    - css雪碧图，常用网站：[spritecow](http://www.spritecow.com/)
        - 优点：减少HTTP请求量
        - 缺点：整合图片比较大时，一次加载比较慢
    - imgge inline 将图片的内容内嵌到html当中，图片要小才能适用这种方法
    - 适用矢量图
        - 适用SVG进行矢量图的绘制
        - 适用iconfont解决icon问题
    - 在安卓下使用webp,常用制作webp的网站：[智图](http://zhitu.isux.us/)
## css和js的装载与执行
- html加载渲染的过程

![html加载渲染的过程](http://note.youdao.com/yws/public/resource/c2361265179a03449f6d52397fd50033/xmlnote/E6F38972BFD34E89981B448423399DB9/17832)
- html渲染过程的一些特点
    - 顺序执行，并发加载
    - 是否阻塞
    - 依赖关系
    - 引入方式
- css阻塞
    - css head中阻塞页面的渲染
    - css阻塞js的执行
    - css不阻塞外部脚本的加载
- js阻塞
    - 直接引入的js阻塞页面的渲染
    - js不阻塞资源的加载
    - js顺序执行，阻塞后续js逻辑的执行
## 懒加载与预加载
- 懒加载
    - 图片进入可视区域之后请求图片资源
    - 减少无效资源的加载
    - 并发加载的资源过多会阻塞js的加载，影响网站的正常使用
- 预加载
    - 图片等静态资源在使用之前提前请求
    - 资源使用到时能存缓存中加载，提升用户体验 
- 预加载的几种方式
    - 使用img图片直接加载，display属性设置为none
    - 使用Image对象
    - 使用XMLHttpRequest对象
    - 预加载的库：[PreloadJs](http://www.createjs.cc/preloadjs/docs/modules/PreloadJS.html)
- PreloadJs的简单使用
    - 引入PreloadJs
    ```
    <script src="https://cdn.bootcss.com/PreloadJS/0.6.0/preloadjs.min.js"></script>
    <script src="./my_reload.js"></script>
    ```
    - 新建my_preload.js文件
    - my_load.js文件中写入如下代码
    ```
    // LoadQueue是一个加载管理器，可以预先加载一个文件或者一个文件队列
    var queue = new createjs.LoadQueue(false);

    // 为事件添加你想要的监听事件
    queue.on("complete", handleComplete, this);

    // 或添加多个文件使用列表或一个清单定义使用 loadManifest
    queue.loadManifest([
        {id: "myImage", src:"https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=996503075,3768564257&fm=200&gp=0.jpg"},
        {id: "myImage2", src:"https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=4287850242,3208290927&fm=200&gp=0.jpg"}
    ]);

    function handleComplete() {
        var image = queue.getResult("myImage");
        document.body.appendChild(image);
    }
    ```
    - 浏览器中打开index.html页面
## 重绘和回流

## 相关技术和工具
- 少量Vue.js
- 版本控制：git
- 开发工具：VSCode
- 调试工具：Chrome
    - performance
    - layers
## 下载源码
```
git clone https://github.com/fangfeiyue/Web_Performance_Optimization.git
```
## 运行项目
```
npm install
npm run dev
```
## 说明
如果对您有帮助，您可以点右上角 "Star" 支持一下 谢谢！ ^_^

或者您可以 "follow" 一下，我会不断开源更多的有趣的项目
## 个人简介
作者：房飞跃

博客地址：[前端网](http://www.qdfuns.com/house/31986/note)  [博客园](https://www.cnblogs.com/fangfeiyue)  [GitHub](https://github.com/fangfeiyue)

职业：web前端开发工程师

爱好：探索新事物，学习新知识

座右铭：一个终身学习者

## 联系方式
坐标：北京

QQ：294925572

微信：

![XinShiJieDeHuHuan](http://note.youdao.com/yws/public/resource/c2361265179a03449f6d52397fd50033/xmlnote/100D55934BB446839482D3EA0CDC3E8D/17820)

## 赞赏
觉得有帮助可以微信扫码支持下哦，赞赏金额不限，一分也是您对作者的鼎力支持

![微信打赏](http://note.youdao.com/yws/public/resource/c2361265179a03449f6d52397fd50033/xmlnote/D77744C8EC944CF6AA232272CBC5CF6D/17828)