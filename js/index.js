$(function () {
    // 设置高度
    /*
    $(window).on('resize',function () {
        $('#main_container,.content_part').height($(window).height());
    });
    $(window).trigger('resize');
     */
    /*
    $('#wechat svg,#wechat_QR').hover(function () {    //ie出现闪动
        $('#wechat_QR').stop(true,false).fadeIn(300);
    },function () {
        $('#wechat_QR').stop(true,false).fadeOut(300);
    });
    */
    $('#wechat svg,#wechat_QR').on('mouseover',function () {
        $('#wechat_QR').stop(true,false).fadeIn(300);
    });

    $('#wechat svg,#wechat_QR').on('mouseout',function () {
        $('#wechat_QR').stop(true,false).fadeOut(300);
    });



    // 展开时间轴点详情
    $('.title_out').on('click',function () {
        close_point($('.point.active'));
        var $detail_box=$(this).next();
        if($detail_box.parent().find('div').is(':animated')){
            return false;
        }
        $(this).parent().prev().addClass('active');
        $detail_box.animate({'opacity':1},{queue:false,duration:500});
        $(this).animate({'top':0,'left':30},{queue:false,duration:500});
        var h=$detail_box.children('div').height();
        $(this).next().animate({'height':h},500,function () {
            $detail_box.find('.detail').animate({'opacity':1},500);
        });
    });

    $('.point').on('click',function () {
        if($(this).hasClass('active')){
            close_point($(this));
        }else {
            $(this).next().find('.title_out').trigger('click');
        }
    });


    //关闭时间轴点详情
    function close_point($obj) {
        var $detail_box=$obj.next().find('.detail_box');
        var $title_out=$obj.next().find('.title_out');
        /*
        if($obj.next().find('div').is(':animated')){
            return false;
        }*/
        $obj.removeClass('active');
        $detail_box.find('.detail').animate({'opacity':0},200,function () {
            $title_out.animate({'top':0,'left':0},{queue:false,duration:500});
            $detail_box.animate({'opacity':0},{queue:false,duration:500}).animate({'height':25},{queue:false,duration:500});
        });
    }



    // 柱形图
    var skill_chart=echarts.init(document.getElementById('skill_chart'));
    var option={
        title:{
            text:'  技能',
            textStyle:{
                color:'#000',
                fontSize:20
            }
        },
        color:['#3396d9'],
        tooltip:{
            formatter:function (params) {
                return params.value[2];
            }
        },
        legend:{
            data:['技能']
        },
        xAxis:{
            name:'科目',
            nameTextStyle:{
                fontSize:16
            },
            data:
                ['java', 'javascript', 'html', 'css', 'jquery', 'php', 'mysql', 'bootstrap', 'Vue', 'ES6', 'photoshop']
        },
        yAxis:{
            max:100
        },
        series:[{
            name:'技能',
            type:'bar',
            data:[
                [0, 30,'了解'], [1, 70,'掌握'],[2,70,'掌握'],[3,80,'掌握'],[4,80,'掌握'],[5,50,'了解PHP的基础，及一般常用函数'],[6,30,'一般的SQL语句，PHPmyadmin基本操作'],[7,50,'基本应用及布局'], [8, 70, '基本掌握Vue框架应用'], [9, 50, 'ES6基础'],[10,60,'掌握ps的大多数工具']
            ]
        }]
    };






    // 切换动画
    function start_move(target_id,fn) {
        var current_height=$('#main_container').height();
        var target=-((target_id-1)*current_height)+'px';
        $('#content').stop(true,false).animate({'margin-top':target},1000,'easeInOutExpo',function () {
            $('.indicator').removeClass('active');
            $('.indicator[data-id='+target_id+']').addClass('active');
            fn(target_id);
        });

    }


    //切换后页面动画
    function page_start(id) {
        switch (id){
            case 1:
                break;
            case 2:
                skill_chart.setOption(option);
                $('#study_list li').animate({'opacity':1},500).find('span').animate({'opacity':1,'bottom':0},500);
                break;
            case 3:
                $('#project_weibo').animate({'height':'600px'},500,'easeOutBounce');
                break;
            case 4:
                $('#project_news .project_info').fadeIn(300,function () {
                    $.each($('#project_news .img_box'),function (key,value) {
                        $(value).delay(Math.floor(Math.random()*600)).animate({'top':0},300,'easeOutQuart');
                    });
                });
                break;
            default:
                break;
        }
    }


    // 点击切换
    $('.indicator').on('click',function () {
        var target_id=parseInt($(this).attr('data-id'));
        start_move(target_id,page_start);
    });

    // 滚动切换
    document.onmousewheel=function (e) {
        if($('#content').is(':animated')){
            return false;
        }
        var oEvent=e||event;
        var current_id=parseInt($('.indicator.active').attr('data-id'));
        var target_id;
        if(oEvent.wheelDelta<0){
            target_id=current_id+1;
            if(target_id>6){
                target_id=6;
            }
        }else {
            target_id=current_id-1;
            if(target_id<1){
                target_id=1;
            }
        }
        start_move(target_id,page_start);
    };

    document.addEventListener('DOMMouseScroll',function (e) {  //Firefox的滚轮事件
        if($('#content').is(':animated')){
            return false;
        }
        var oEvent=e||event;
        var current_id=parseInt($('.indicator.active').attr('data-id'));
        var target_id;
        if(oEvent.detail>0){
            target_id=current_id+1;
            if(target_id>6){
                target_id=6;
            }
        }else {
            target_id=current_id-1;
            if(target_id<1){
                target_id=1;
            }
        }
        start_move(target_id,page_start);
    });



    // 图片查看器
    $('.img_list img').on('click',function () {
        $('#img_look').fadeIn(100).find('img').attr('src',$(this).attr('src'));
    });

    $('#img_look_close').on('click',function () {
        $('#img_look').fadeOut(100);
    });
    $('#img_look').on('click',function () {
        $(this).fadeOut(100);
    });
    $('#img_look img').on('click',function (event) {
        event.stopPropagation();
    });
    document.getElementById('img_look').onmousewheel=function (ev) {  //阻止滚轮事件冒泡
        var oEvent=ev||event;
        oEvent.stopPropagation();
    };
    document.getElementById('img_look').addEventListener('DOMMouseScroll',function (ev) {
        var oEvent=ev||event;
        oEvent.stopPropagation();
    });


});
