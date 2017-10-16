/*
 * @Author: FangFeiyue 
 * @Date: 2017-10-16 15:29:15 
 * @Last Modified by: FangFeiyue
 * @Last Modified time: 2017-10-16 16:14:28
 */

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