/**
 * Created by Administrator on 2016/8/27 0027.
 */
;
(function ($) {
    $.fn.mySlider = function (options) {
        return this.each(function () {
            var defaults = {
                animate: "fadeIn",
                circleEvent: "mouseover",
                arrowsBtn: true,
                circleBtn: true,
                autoSlide: false,
                speed: "1500",
                autoSlideSpeed: "2000",
                selfAdaptive:true
            };
            var settings = $.extend(defaults, options);
            var _this = $(this);
            var imgIndex = 0;                                                   //表示第一张轮播图(即索引值)
            var slideUl = _this.find("ul.slide-image");


            //slide效果克隆第一张图片
            if (settings.animate == 'slide') {
                var clone = _this.find("ul.slide-image li").first().clone();    //克隆第一张图片
                _this.find("ul.slide-image").append(clone);

            }

            var imageLis = _this.find("ul.slide-image li");                     //轮播图lis
            var imgWidth = _this.find("ul.slide-image li:first").width();
            var imgHeight = _this.find("ul.slide-image li:first").height();

            //设置pc端轮播图容器的宽高
            _this.css({
                width: imgWidth,
                height: imgHeight
            });


            //适配移动端
            var screenW=$(window).width();
            if(settings.selfAdaptive&&screenW<=imgWidth){
                forMobile();
            }

            function forMobile(){
                _this.css({
                    width:screenW,
                    height:imgHeight/(imgWidth/screenW),
                    overflow: "hidden"
                });
                _this.find("ul.slide-image li a img").css({
                    width:screenW,
                    height:imgHeight/(imgWidth/screenW)
                });
            }

            slideUl.width(imgWidth * 5);

            //淡入淡出效果样式
            if (settings.animate == "fadeIn") {
                slideUl.css({
                    position: 'relative',
                    width: imgWidth,
                    height:imgHeight
                });
                imageLis.css({
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    display: 'none',
                    float: 'none'
                });
                imageLis.eq(0).show();                                  //默认显示第一张图片
            }


            //是否需要箭头按钮
            if (settings.arrowsBtn == false) {
                _this.find(".slide-btn").remove();
            }
            //是否需要圆圈按钮
            if (settings.circleBtn == false) {
                _this.find(".circle-btn").remove();
            }

            //为轮播图片自动添加相应圆圈按钮个数
            var imgLength = imageLis.length;                                    //轮播图片的长度(比索引值大1)
            var curImgLength=imgLength;
            if (settings.animate == "slide") {
               curImgLength=curImgLength-1;
            }
            for (var i = 0; i < curImgLength; i++) {
                var li = "<li></li>";
                _this.find(".circle-btn").append(li);
            }
            var circleBtn = _this.find("ul.circle-btn li");                     //圆圈按钮lis
            circleBtn.first().addClass("circle-btn-active");                    //给当前默认第一个圆圈按钮添加类名


            //鼠标划入/点击等事件
            circleBtn.bind(settings.circleEvent, function () {
                var index = $(this).index();                                //把当前元素的索引值存入一个变量中
                imgIndex = index;                                           //图片的索引值l等于圆圈的索引值index(手动控制与自动控制索引值对应)
                if (settings.animate == 'fadeIn') {
                    imageLis.eq(index).stop().fadeIn(settings.speed).siblings().stop().fadeOut(settings.speed);    //使当前的轮播图淡入，其他同胞图片淡出
                } else if (settings.animate == 'slide') {
                    slideUl.stop().animate({left: -index * imgWidth}, settings.speed);
                }
                $(this).addClass("circle-btn-active").siblings().removeClass("circle-btn-active");


            });

            //选择是否自动播放
            if (settings.autoSlide == true) {
                autoSlide();
            }

            function autoSlide() {
                var time = setInterval(function () {
                    imgIndex++;
                    chooseAnimate();
                }, settings.autoSlideSpeed);
                //鼠标划入轮播图任何区域时关闭定时器
                _this.hover(function (e) {
                    e.stopPropagation();
                    clearInterval(time)
                }, function () {
                    time = setInterval(function () {
                        imgIndex++;
                        chooseAnimate();
                    }, settings.autoSlideSpeed)
                });
            }


            //向左滑动
            $("div.btn_l").click(function () {
                imgIndex--;
                chooseAnimate();
            });

            //向右滑动
            $("div.btn_r").click(function () {
                imgIndex++;
                chooseAnimate();
            });

            //选择动画效果
            function chooseAnimate() {
                if (settings.animate == 'fadeIn') {
                    fadeIn();
                } else if (settings.animate == 'slide') {
                    slide();
                }
            }

            //选择淡入淡出动画

            function fadeIn() {

                if (imgIndex == -1) {             //l等于-1(即在第一张图片时点击向左按钮)
                    imgIndex = imgLength - 1;           //使l等于最后一张图片的索引值
                }
                if (imgIndex == imgLength) {
                    imgIndex = 0;
                }
                circleBtn.eq(imgIndex).addClass("circle-btn-active").siblings().removeClass("circle-btn-active");        //为当前圆圈按钮添加类名，并去除同胞元素的类名
                imageLis.eq(imgIndex).fadeIn(settings.speed).siblings().fadeOut(settings.speed);
            }

            //选择滑动动画效果
            function slide() {
                if(settings.selfAdaptive==true&&screenW<=imgWidth){
                    imgWidth=screenW;
                }else{
                    imgWidth=_this.find("ul.slide-image li a img").width();
                }
                if (imgIndex == imgLength) {
                    slideUl.css({left: 0});
                    imgIndex = 1;
                }

                if (imgIndex == -1) {
                    slideUl.css({left: -(imgLength - 1) * imgWidth});
                    imgIndex = imgLength - 2;
                }
                //alert(imgWidth);

                slideUl.stop().animate({left: -imgIndex * imgWidth}, settings.speed);

                if (imgIndex == imgLength - 1) {
                    circleBtn.eq(0).addClass("circle-btn-active").siblings().removeClass("circle-btn-active");
                } else {
                    circleBtn.eq(imgIndex).addClass("circle-btn-active").siblings().removeClass("circle-btn-active");
                }


            }

        });
    }

})(jQuery);