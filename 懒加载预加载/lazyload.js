/*
 * @Author: FangFeiyue 
 * @Date: 2017-10-16 13:35:19 
 * @Last Modified by: FangFeiyue
 * @Last Modified time: 2017-10-16 13:45:52
 */
var lazyLoadJS = {
    viewHeight: document.documentElement.clientHeight,
    init: function(){
        this.onLoad();
    },
    onLoad: function(){
        var _this = this;
        this.layzyLoad();
        document.addEventListener('scroll', function(){_this.layzyLoad()});
    },
    layzyLoad: function(){
        var _this = this,
            eles  = document.querySelectorAll('img[data-original][lazyload]');

        Array.prototype.forEach.call(eles, function(item, index){
            var rect;
            if (item.dataset.original === ''){
                return;
            }
            rect = item.getBoundingClientRect();

            if ((rect.bottom >= 0) && (rect.top < _this.viewHeight)){
                !function(){
                    var img = new Image();
                    img.src = item.dataset.original;
                    img.onload = function(){
                        item.src = img.src;
                    };
                    item.removeAttribute('data-original');
                    item.removeAttribute('lazyload');
                }();
            }
        });
    },
};

lazyLoadJS.init();

