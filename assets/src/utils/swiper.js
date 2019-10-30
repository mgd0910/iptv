let timer;
let swiper = {
    swiper() {
        benner("#benner", ".nr", ".imga");
        function benner(parent, controller, mod) {
            var num = 0;
            var controller = $(controller);
            var mod = $(mod);
            var benner = $(parent);
            var autoPlayTime = 1500;
            var imgNum = mod.length - 1;
            var auto;
            //根据传进来的名字获取这个名字所对应的对象
            function $(name) {
                if (name[0] == "#") {
                    return document.getElementById(name.substr(1));
                } else if (name[0] == ".") {
                    return document.getElementsByClassName(name.substr(1));
                } else {
                    return document.getElementsByTagName(name);
                }
            }

            //实现鼠标划过圆点,变化图片的效果
            //function change(controller, mod){
            //遍历控制器,绑定鼠标划过事件
            for (var i = 0; i < controller.length; i++) {
                //给控制器加个索引,并把i值赋值给索引
                controller[i].index = i;
                //给所有的控制器都加划过事件
                controller[i].onmouseover = function () {
                    for (var j = 0; j < controller.length; j++) {
                        //将所有控制器改为默认样式
                        controller[j].className = "nr";
                    }
                    //改变所选的控制器样式
                    this.className = "nr active";
                    //将模型改为默认样式
                    for (var x = 0; x < mod.length; x++) {
                        mod[x].className = "imga";
                    }
                    //改变所选控制器对应的模型的样式
                    mod[this.index].className = "imga active";
                };
            }
            //}
            //绑定鼠标移入,暂停播放图片
            // benner.onmouseover = function() {
            //   clearInterval(auto);
            // };
            // //绑定鼠标离开,继续播放
            // benner.onmouseleave = function() {
            //   autoPlay();
            // };
            //指定播放那个图片
            function play(num) {
                for (var j = 0; j < controller.length; j++) {
                    controller[j].className = "nr";
                }
                controller[num].className = "nr active";
                for (var x = 0; x < mod.length; x++) {
                    mod[x].className = "imga";
                }
                mod[num].className = "imga active";
            }
            //自动播放
            function autoPlay() {
                auto = setInterval(function () {
                    if (num > imgNum) {
                        num = 0;
                    }
                    play(num);
                    num++;
                }, autoPlayTime);
            }
            autoPlay()
        }
    },
    clear() {
        clearInterval(timer)
    }
}
export default swiper