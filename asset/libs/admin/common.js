var left_side_width = 220; //Sidebar width in pixels

String.prototype.trim=function(char){
    if(char){
        return this.replace(new RegExp('^\\'+char+'+|\\'+char+'+$', 'g'), '');
    }
    return this.replace(/^\s+|\s+$/g, '');
}
String.prototype.ltrim=function(char){
    if(char){
        return this.replace(new RegExp('^\\'+char+'+', 'g'), '');
    }
    return this.replace(/^\s+|\s+$/g, '');
}
String.prototype.rtrim=function(char){
   if(char){
        return this.replace(new RegExp('\\'+char+'+$', 'g'), '');
    }
    return this.replace(/^\s+|\s+$/g, '');
}


function Guid(g){

     var arr = new Array(); //存放32位数值的数组

    

     if (typeof(g) == "string"){ //如果构造函数的参数为字符串

         InitByString(arr, g);

     }

     else{

         InitByOther(arr);

     }

     //返回一个值，该值指示 Guid 的两个实例是否表示同一个值。

     this.Equals = function(o){

         if (o && o.IsGuid){

              return this.ToString() == o.ToString();

         }

         else{

              return false;

         }

     }

     //Guid对象的标记

     this.IsGuid = function(){}

     //返回 Guid 类的此实例值的 String 表示形式。

     this.ToString = function(format){

         if(typeof(format) == "string"){

              if (format == "N" || format == "D" || format == "B" || format == "P"){

                   return ToStringWithFormat(arr, format);

              }

              else{

                   return ToStringWithFormat(arr, "D");

              }

         }

         else{

              return ToStringWithFormat(arr, "D");

         }

     }

     //由字符串加载

     function InitByString(arr, g){

         g = g.replace(/\{|\(|\)|\}|-/g, "");

         g = g.toLowerCase();

         if (g.length != 32 || g.search(/[^0-9,a-f]/i) != -1){

              InitByOther(arr);

         }

         else{

              for (var i = 0; i < g.length; i++){

                   arr.push(g[i]);

              }

         }

     }

     //由其他类型加载

     function InitByOther(arr){

         var i = 32;

         while(i--){

              arr.push("0");

         }

     }

     /*

     根据所提供的格式说明符，返回此 Guid 实例值的 String 表示形式。

     N  32 位： xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

     D  由连字符分隔的 32 位数字 xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

     B  括在大括号中、由连字符分隔的 32 位数字：{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}

     P  括在圆括号中、由连字符分隔的 32 位数字：(xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)

     */

     function ToStringWithFormat(arr, format){

         switch(format){

              case "N":

                   return arr.toString().replace(/,/g, "");

              case "D":

                   var str = arr.slice(0, 8) + "-" + arr.slice(8, 12) + "-" + arr.slice(12, 16) + "-" + arr.slice(16, 20) + "-" + arr.slice(20,32);

                   str = str.replace(/,/g, "");

                   return str;

              case "B":

                   var str = ToStringWithFormat(arr, "D");

                   str = "{" + str + "}";

                   return str;

              case "P":

                   var str = ToStringWithFormat(arr, "D");

                   str = "(" + str + ")";

                   return str;

              default:

                   return new Guid();

         }

     }

}

//Guid 类的默认实例，其值保证均为零。

Guid.Empty = new Guid();

//初始化 Guid 类的一个新实例。

Guid.NewGuid = function(){

     var g = "";

     var i = 32;

     while(i--){

         g += Math.floor(Math.random()*16.0).toString(16);

     }

     return new Guid(g);

}

//select2 使用回调函数
function formatRepo(repo) {
    if (repo.loading)
        return repo.text;
    var markup = '<span>' + repo.text + '</span>';
    return markup;
}
//select2 使用回调函数
function formatRepoSelection(repo) {
    return repo.text;
}

$(function() {
//    'use strict';
    //退出页面需确认
    // if($('.builder-form-box').length){
    //     var submit_clicked = false;
    //     $('button[type="submit"]').click(function(){
    //         submit_clicked = true;
    //     });
    //     window.onbeforeunload = function(){
    //         if(!submit_clicked){
    //             return "所有未保存内容将被丢弃！您确定要退出页面吗？";
    //         }
    //     }
    // }
    
    //Enable sidebar toggle
    $("[data-toggle='offcanvas']").click(function(e) {
        e.preventDefault();

        //If window is small enough, enable sidebar push menu
        if ($(window).width() <= 992) {
            $('.row-offcanvas').toggleClass('active');
            $('.left-side').removeClass("collapse-left");
            $(".right-side").removeClass("strech");
            $('.row-offcanvas').toggleClass("relative");
        } else {
            //Else, enable content streching
            $('.left-side').toggleClass("collapse-left");
            $(".right-side").toggleClass("strech");
        }
    });

    //放大图片
    $('.builder-form-box .img-box img').each(function(){
        new Viewer(this,{
            url: 'data-original'
        });
    })
    
    //ajax post submit请求
    $('body').delegate('.ajax-post', 'click', function() {
        var target, query, form;
        var target_form = $(this).attr('target-form');
        var that = this;
        var nead_confirm = false;

        if (($(this).attr('type') == 'submit') || (target = $(this).attr('href')) || (target = $(this).attr('url'))) {
            form = $('.' + target_form);
            if ($(this).attr('hide-data') === 'true') { //无数据时也可以使用的功能
                form = $('.hide-data');
                query = form.serialize();
            } else if (form.get(0) == undefined) {
                return false;
            } else if (form.get(0).nodeName == 'FORM') {
                if ($(this).hasClass('confirm')) {
                    var confirm_msg = $(this).attr('confirm-msg');
                    if (!confirm(confirm_msg ? confirm_msg : '确认要执行该操作吗?')) {
                        return false;
                    }
                }
                if ($(this).attr('url') !== undefined) {
                    target = $(this).attr('url');
                } else {
                    target = form.get(0).action;
                }
                query = form.serialize();
            } else if (form.get(0).nodeName == 'INPUT' || form.get(0).nodeName == 'SELECT' || form.get(0).nodeName == 'TEXTAREA') {
                form.each(function(k, v) {
                    if (v.type == 'checkbox' && v.checked == true) {
                        nead_confirm = true;
                    }
                });
                if (nead_confirm && $(this).hasClass('confirm')) {
                    var confirm_msg = $(this).attr('confirm-msg');
                    if (!confirm(confirm_msg ? confirm_msg : '确认要执行该操作吗?')) {
                        return false;
                    }
                }
                query = form.serialize();
            } else {
                if ($(this).hasClass('confirm')) {
                    var confirm_msg = $(this).attr('confirm-msg');
                    if (!confirm(confirm_msg ? confirm_msg : '确认要执行该操作吗?')) {
                        return false;
                    }
                }
                query = form.find('input,select,textarea').serialize();
            }
            
            var cus_query;
            cus_query = $(this).attr('query');
            if(cus_query){
                query += '&' + cus_query;
            }
            $(that).addClass('disabled').attr('autocomplete', 'off').prop('disabled', true);
            $.post(target, query).success(function(data) {
                console.log(data);
                if (data.status == 1) {
                    if (data.url && !$(that).hasClass('no-refresh')) {
                        var message = data.info + ' 页面即将自动跳转~';
                    } else {
                        var message = data.info;
                    }
                    toastr.remove();
                    toastr["success"](message);
                    setTimeout(function() {
                        var js = /javascript:(.+)/g.exec(data.url);
                        if(js){
                            eval(js[1]);
                            return;
                        }
                        if (data.url && !$(that).hasClass('no-forward')) {
                            location.href = data.url;
                        } else {
                            location.reload();
                        }
                    }, 2000);
                } else {
                    toastr.remove();
                    $.bs_messagebox('错误', data.info, 'ok');
                    setTimeout(function() {
                        $(that).removeClass('disabled').prop('disabled', false);
                    }, 2000);
                    if($('.reload-verify').length > 0){
                        $('.reload-verify').click();
                    }
                }
            });
        }
        return false;
    });
    
    //ajax get请求
    $('body').delegate('.ajax-get', 'click', function() {
        var target;
        var that = this;
        if ($(this).hasClass('confirm')) {
            var confirm_msg = $(this).attr('confirm-msg');
            if (!confirm(confirm_msg ? confirm_msg : '确认要执行该操作吗?')) {
                return false;
            }
        }
        if ((target = $(this).attr('href')) || (target = $(this).attr('url'))) {
            $(this).addClass('disabled').attr('autocomplete', 'off').prop('disabled', true);
            $.get(target).success(function(data) {
                console.log(data);
                if (data.status == 1) {
                    if (data.url && !$(that).hasClass('no-refresh')) {
                        var message = data.info + ' 页面即将自动跳转~';
                    } else {
                        var message = data.info;
                    }
                    toastr.remove();
                    toastr["success"](message);
                    setTimeout(function() {
                        $(that).removeClass('disabled').prop('disabled', false);
                        if ($(that).hasClass('no-refresh')) {
                            return false;alert();
                        }
                        if (data.url && !$(that).hasClass('no-forward')) {
                            location.href = data.url;
                        } else {
                            location.reload();
                        }
                    }, 2000);
                } else {
                    if (data.login == 1) {
                        $('#login-modal').modal(); //弹出登陆框
                    } else {
                         toastr.remove();
                         $.bs_messagebox('错误', data.info, 'ok');
                    }
                    setTimeout(function() {
                        $(that).removeClass('disabled').prop('disabled', false);
                    }, 2000);
                }
            });
        }
        return false;
    });

});

//ajax访问网址并返回信息
function ajaxlink($this, url) {
    if (typeof url == 'string') {
        $.ajax({
            url: url, //与此php页面沟通
            beforeSend: function() {
                //禁用提交按钮，防止重复提交
                $this.attr('disabled', true);
                toastr.remove();
                toastr["info"]("操作进行中");
                return true;
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                toastr.remove();
                $.bs_messagebox('错误', $(XMLHttpRequest.responseText).find('h1').text(), 'ok');
                $this.attr('disabled', false);
            },
            success: function(data) {
                if (data.status === 1) {
                    type = "success";
                    toastr.remove();
                    toastr["success"](data.info);
                } else {
                    type = "error";
                    toastr.remove();
                    $.bs_messagebox('错误', data.info, 'ok');
                }
                if (type === 'success') {
                    //成功则跳转到返回的网址
                    if(data.url){
                        setTimeout(function() {
                            window.location = data.url;
                        }, 300);
                    }
                    else{
                        setTimeout(function() {
                            window.location.reload();
                        }, 300);
                    }
                } else {
                    $this.attr('disabled', false);
                }
            }
        });
    }
}

//function headerWidth() {
//    $('.content-header').width($('.right-side').width() - 35);
//}
//jQuery(function($) {
//    $(document).ready(function() {
//        //固定标题功能栏
//        //$('.content-header').stickUp();
//        if($('.stickbtn').length){
//            $('.stickbtn').stickUp();
//        }
//        else{
//            $('.content-header').stickUp();
//        }
//    });
//});

$(function() {
    if ($('.file_upload').length) {
        $('.file_upload').fileupload({
            dataType: 'json',
            done: function(e, data) {
                var result = data.result;
                $parentWrapper = $(this).parents('.upload-wrapper');
                if (result.Status == 1) {
                    if (result.Data.url)
                        $parentWrapper.find('.file_name').html('<a target="_blank" href="' + result.Data.url + '">' + result.Data.title + '</a>');
                    $parentWrapper.find('.file_id').val(result.Data.file_id);
                } else {
                    $parentWrapper.find('p.upload_error').text(result.info);
                }
            },
            progress: function(e, data) {
                $(this).parents('.upload-wrapper').find('p.upload_error').text('');
                $progress = $(this).parents('.upload-wrapper').find('.progress');
                if ($progress.not('.in')) {
                    $progress.addClass('in');
                }
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $progress.children('.progress-bar').css(
                    'width',
                    progress + '%'
                );
                if (progress === 100) {
                    progress = 0;
                    setTimeout(function() {
                        $progress.removeClass('in').children().css(
                            'width',
                            progress + '%'
                        );
                    }, 1000);
                };
            }
        });
    }
    if ($('.image_upload').length) {
        $('.image_upload').fileupload({
            dataType: 'json',
            done: function(e, data) {
                var result = data.result;
                $parentWrapper = $(this).parents('.upload-wrapper');
                if (result.Status == 1) {
                    if (result.Data.url)
                        $parentWrapper.find('.image_pic').attr('src', result.Data.url);
                    $parentWrapper.find('.image_id').val(result.Data.file_id);
                } else {
                    $parentWrapper.find('p.upload_error').text(result.info);
                }
            },
            progress: function(e, data) {
                $(this).parents('.upload-wrapper').find('p.upload_error').text('');
                $progress = $(this).parents('.upload-wrapper').find('.progress');
                if ($progress.not('.in')) {
                    $progress.addClass('in');
                }
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $progress.children('.progress-bar').css(
                    'width',
                    progress + '%'
                );
                if (progress === 100) {
                    progress = 0;
                    setTimeout(function() {
                        $progress.removeClass('in').children().css(
                            'width',
                            progress + '%'
                        );
                    }, 1000);
                };
            }
        });
    }


    //后台标题导航栏宽度
//    $(window).resize(function() {
//        headerWidth();
//    });
//    headerWidth();

    //单个项操作
    $('body').delegate('.ajax-submit', 'click', function() {
        ajaxlink($(this), $(this).attr('href'));
        return false;
    });

    //左边菜单高亮判断
    var n_id = $('.content').attr('n-id');
    $("li[n-id=" + n_id + "]").addClass('active').parent().parent().addClass('active');

    //信息提示插件选项
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "300",
        "timeOut": "0",
        "extendedTimeOut": "0",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "slideDown",
        "hideMethod": "slideUp"
    };
    //ajax提交form
    $('body').delegate('.ajax-form', 'submit', function(e) {
        e.preventDefault();
        var formValues = $(this).serialize();

        var customShowMsg = function(info){return true};
        if(typeof jQuery.data(this, 'showMsg') === 'function'){
            var that = this;
            var customShowMsg = function(info){
                var showMsg = jQuery.data(that, 'showMsg');
                showMsg(info);
            };
        }

        var reload = $(this).attr('reload');

        $.ajax({
            url: $(this).attr('action') ? $(this).attr('action') : document.URL,
            type: $(this).attr('method'),
            data: formValues,
            beforeSend: function() {
                $('button[type=submit]').attr('disabled', true);
                toastr.remove();
                toastr["info"]("操作进行中");
                return true;
            },
            success: function(data) {
                //成功状态，下面的是服务器返回的，数据库操作的状态
                var type;
                if (data.status === 1) {
                    type = "success";
                    if(customShowMsg(data.info) === true) {
                        toastr.remove();
                        toastr["success"](data.info);
                    }
                } else {
                    type = "error";
                    toastr.remove();
                    $.bs_messagebox('错误', data.info, 'ok', function(){
                        if(data.url){
                            setTimeout(function() {
                                window.location = data.url;
                            }, 300);
                        }
                    });
                }
                if (type === 'success') {
                    //成功则跳转到返回的网址
                    var js = /javascript:(.+)/g.exec(data.url);
                    if(js){
                        eval(js[1]);
                        return;
                    }
                    if(data.url){
                        setTimeout(function() {
                            window.location = data.url;
                        }, 300);
                    }
                    else{
                        reload !== 'false' && setTimeout(function() {
                            window.location.reload();
                        }, 300);
                    }
                }

                $('button[type=submit]').removeAttr('disabled');
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                toastr.remove();
                $.bs_messagebox('错误', $(XMLHttpRequest.responseText).find('h1').text(), 'ok');
                $(this).attr('disabled', false);
            },
        });
    });

    //触屏hover支持
    $('.btn').bind('touchstart', function() {
        $(this).addClass('hover');
    }).bind('touchend', function() {
        $(this).removeClass('hover');
    });

    //提示框
    $("[data-toggle='tooltip']").tooltip();

    /* 侧栏导航树状结构 */
    $(".sidebar .treeview").tree();
    /*
     *侧栏最小高度
     *
     **/
    function _fix() {
        //Get window height and the wrapper height
        var height = $(window).height() - $("body > .header").height() - ($("body > .footer").outerHeight() || 0);
        $(".wrapper").css("min-height", height + "px");
        var content = $(".wrapper").height();
        //If the wrapper height is greater than the window
        if (content > height)
        //then set sidebar height to the wrapper
            $(".left-side, html, body").css("min-height", content + "px");
        else {
            //Otherwise, set the sidebar to the height of the window
            $(".left-side, html, body").css("min-height", height + "px");
        }
    }
    _fix();
    $(".wrapper").resize(function() {
        _fix();
        fix_sidebar();
    });
    fix_sidebar();
//    /*
//     * iCheck
//     */
//    $("input[type='checkbox']:not('.simple'), input[type='radio']:not('.simple')").iCheck({
//        checkboxClass: 'icheckbox_minimal-blue',
//        radioClass: 'iradio_minimal-blue'
//    });
    //点击reset按钮时，复位所有checkbox控件
//    $("[type=reset]").click(function() {
//        $("input[type='checkbox']:not('.simple'), input[type='radio']:not('.simple')").iCheck('uncheck');
//    });
//    //弹出modal框之前，检查复选框是否至少选了一项
//    $('.select-operate').on('show.bs.modal', function(e) {
//        var checkboxGroup = $('[data-target=group-of-checkbox]').data('checkboxGroup');
//        if (!checkboxGroup.getCheckedValue()) {
//            $.bs_messagebox('错误', '请至少选择一项', 'ok');
//            return e.preventDefault() // stops modal from being shown
//        }
//    });

    //复位搜索页面
    $('a#reset-search').click(function() {
        window.location.href = window.location.href.split('?')[0];
        return false;
    });
    
    //设置header,左侧栏的高度
    var updateHeaderHeight = function(){
        var headerTop = $('body > .header').height();
        $('body > .wrapper.row-offcanvas.row-offcanvas-left').css({
            'margin-top': headerTop,
        }).children('.left-side.sidebar-offcanvas').css({
            top: headerTop
        });
    };
    $(window).on('resize', updateHeaderHeight);
    updateHeaderHeight();
    
    //让.navbar-container滚动到选中的菜单
    if($('.header .navbar-container .navbar-nav.on').length > 0){
        $('.header .navbar-container').scrollLeft($('.header .navbar-container .navbar-nav.on').position().left);
    }


    
    //初始化 .navbar-container滚动条
    if(window.PerfectScrollbar){
        new PerfectScrollbar($('.header .navbar-container').get(0),{
            suppressScrollY: true,
            swipeEasing: true,
            useBothWheelAxes: true,
        });
    }

});


function fix_sidebar() {
    //Make sure the body tag has the .fixed class
    if (!$("body").hasClass("fixed")) {
        return;
    }

    //Add slimscroll
    $(".sidebar").slimscroll({
        height: ($(window).height() - $(".header").height()) + "px",
        color: "rgba(0,0,0,0.2)"
    });
}

//树
(function($) {
    "use strict";
    $.fn.tree = function() {

        return this.each(function() {
            var btn = $(this).children("a").first();
            var menu = $(this).children(".treeview-menu").first();
            var isActive = $(this).hasClass('active');
            //initialize already active menus
            if (isActive) {
                menu.show();
                btn.children(".fa-angle-left").first().removeClass("fa-angle-left").addClass("fa-angle-down");
            }
            //Slide open or close the menu on link click
            btn.click(function(e) {
                e.preventDefault();
                if (isActive) {
                    //Slide up to close menu
                    menu.slideUp(200);
                    isActive = false;
                    btn.children(".fa-angle-down").first().removeClass("fa-angle-down").addClass("fa-angle-left");
                    btn.parent("li").removeClass("active");
                } else {
                    //Slide down to open menu
                    $('.treeview.active').children("a").first().trigger('click');
                    menu.slideDown(200);
                    isActive = true;
                    btn.children(".fa-angle-left").first().removeClass("fa-angle-left").addClass("fa-angle-down");
                    btn.parent("li").addClass("active");
                }
            });
            /* Add margins to submenu elements to give it a tree look */
            menu.find("li > a").each(function() {
                var pad = parseInt($(this).css("margin-left")) + 10;
                $(this).css({
                    "margin-left": pad + "px"
                });
            });
        });
    };
}(jQuery));

/* 居中 */
(function($) {
    "use strict";
    jQuery.fn.center = function(parent) {
        if (parent) {
            parent = this.parent();
        } else {
            parent = window;
        }
        this.css({
            "position": "absolute",
            "top": ((($(parent).height() - this.outerHeight()) / 2) + $(parent).scrollTop() + "px"),
            "left": ((($(parent).width() - this.outerWidth()) / 2) + $(parent).scrollLeft() + "px")
        });
        return this;
    }
}(jQuery));

/*
 * jQuery resize event - v1.1 - 3/14/2010
 * http://benalman.com/projects/jquery-resize-plugin/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($, h, c) {
    var a = $([]),
        e = $.resize = $.extend($.resize, {}),
        i, k = "setTimeout",
        j = "resize",
        d = j + "-special-event",
        b = "delay",
        f = "throttleWindow";
    e[b] = 250;
    e[f] = true;
    $.event.special[j] = {
        setup: function() {
            if (!e[f] && this[k]) {
                return false;
            }
            var l = $(this);
            a = a.add(l);
            $.data(this, d, {
                w: l.width(),
                h: l.height()
            });
            if (a.length === 1) {
                g();
            }
        },
        teardown: function() {
            if (!e[f] && this[k]) {
                return false
            }
            var l = $(this);
            a = a.not(l);
            l.removeData(d);
            if (!a.length) {
                clearTimeout(i);
            }
        },
        add: function(l) {
            if (!e[f] && this[k]) {
                return false
            }
            var n;

            function m(s, o, p) {
                var q = $(this),
                    r = $.data(this, d);
                r.w = o !== c ? o : q.width();
                r.h = p !== c ? p : q.height();
                n.apply(this, arguments)
            }
            if ($.isFunction(l)) {
                n = l;
                return m
            } else {
                n = l.handler;
                l.handler = m
            }
        }
    };

    function g() {
        i = h[k](function() {
            a.each(function() {
                var n = $(this),
                    m = n.width(),
                    l = n.height(),
                    o = $.data(this, d);
                if (m !== o.w || l !== o.h) {
                    n.trigger(j, [o.w = m, o.h = l])
                }
            });
            g()
        }, e[b])
    }
    
    //设置header,左侧栏的高度
    var headerTop = $('body > .header').height();
    $('.main-wrapper-js').css({
        'margin-top': headerTop,
    });
    $('.left-side-js').css({
        top: headerTop
    });
})(jQuery, this);

/*!
 * SlimScroll https://github.com/rochal/jQuery-slimScroll
 * =======================================================
 *
 * Copyright (c) 2011 Piotr Rochala (http://rocha.la) Dual licensed under the MIT
 */
(function(f) {
    jQuery.fn.extend({slimScroll: function(h) {
            var a = f.extend({width: "auto", height: "250px", size: "7px", color: "#000", position: "right", distance: "1px", start: "top", opacity: 0.4, alwaysVisible: !1, disableFadeOut: !1, railVisible: !1, railColor: "#333", railOpacity: 0.2, railDraggable: !0, railClass: "slimScrollRail", barClass: "slimScrollBar", wrapperClass: "slimScrollDiv", allowPageScroll: !1, wheelStep: 20, touchScrollStep: 200, borderRadius: "0px", railBorderRadius: "0px"}, h);
            this.each(function() {
                function r(d) {
                    if (s) {
                        d = d ||
                                window.event;
                        var c = 0;
                        d.wheelDelta && (c = -d.wheelDelta / 120);
                        d.detail && (c = d.detail / 3);
                        f(d.target || d.srcTarget || d.srcElement).closest("." + a.wrapperClass).is(b.parent()) && m(c, !0);
                        d.preventDefault && !k && d.preventDefault();
                        k || (d.returnValue = !1)
                    }
                }
                function m(d, f, h) {
                    k = !1;
                    var e = d, g = b.outerHeight() - c.outerHeight();
                    f && (e = parseInt(c.css("top")) + d * parseInt(a.wheelStep) / 100 * c.outerHeight(), e = Math.min(Math.max(e, 0), g), e = 0 < d ? Math.ceil(e) : Math.floor(e), c.css({top: e + "px"}));
                    l = parseInt(c.css("top")) / (b.outerHeight() - c.outerHeight());
                    e = l * (b[0].scrollHeight - b.outerHeight());
                    h && (e = d, d = e / b[0].scrollHeight * b.outerHeight(), d = Math.min(Math.max(d, 0), g), c.css({top: d + "px"}));
                    b.scrollTop(e);
                    b.trigger("slimscrolling", ~~e);
                    v();
                    p()
                }
                function C() {
                    window.addEventListener ? (this.addEventListener("DOMMouseScroll", r, !1), this.addEventListener("mousewheel", r, !1), this.addEventListener("MozMousePixelScroll", r, !1)) : document.attachEvent("onmousewheel", r)
                }
                function w() {
                    u = Math.max(b.outerHeight() / b[0].scrollHeight * b.outerHeight(), D);
                    c.css({height: u + "px"});
                    var a = u == b.outerHeight() ? "none" : "block";
                    c.css({display: a})
                }
                function v() {
                    w();
                    clearTimeout(A);
                    l == ~~l ? (k = a.allowPageScroll, B != l && b.trigger("slimscroll", 0 == ~~l ? "top" : "bottom")) : k = !1;
                    B = l;
                    u >= b.outerHeight() ? k = !0 : (c.stop(!0, !0).fadeIn("fast"), a.railVisible && g.stop(!0, !0).fadeIn("fast"))
                }
                function p() {
                    a.alwaysVisible || (A = setTimeout(function() {
                        a.disableFadeOut && s || (x || y) || (c.fadeOut("slow"), g.fadeOut("slow"))
                    }, 1E3))
                }
                var s, x, y, A, z, u, l, B, D = 30, k = !1, b = f(this);
                if (b.parent().hasClass(a.wrapperClass)) {
                    var n = b.scrollTop(),
                            c = b.parent().find("." + a.barClass), g = b.parent().find("." + a.railClass);
                    w();
                    if (f.isPlainObject(h)) {
                        if ("height"in h && "auto" == h.height) {
                            b.parent().css("height", "auto");
                            b.css("height", "auto");
                            var q = b.parent().parent().height();
                            b.parent().css("height", q);
                            b.css("height", q)
                        }
                        if ("scrollTo"in h)
                            n = parseInt(a.scrollTo);
                        else if ("scrollBy"in h)
                            n += parseInt(a.scrollBy);
                        else if ("destroy"in h) {
                            c.remove();
                            g.remove();
                            b.unwrap();
                            return
                        }
                        m(n, !1, !0)
                    }
                } else {
                    a.height = "auto" == a.height ? b.parent().height() : a.height;
                    n = f("<div></div>").addClass(a.wrapperClass).css({position: "relative",
                        overflow: "hidden", width: a.width, height: a.height});
                    b.css({overflow: "hidden", width: a.width, height: a.height});
                    var g = f("<div></div>").addClass(a.railClass).css({width: a.size, height: "100%", position: "absolute", top: 0, display: a.alwaysVisible && a.railVisible ? "block" : "none", "border-radius": a.railBorderRadius, background: a.railColor, opacity: a.railOpacity, zIndex: 90}), c = f("<div></div>").addClass(a.barClass).css({background: a.color, width: a.size, position: "absolute", top: 0, opacity: a.opacity, display: a.alwaysVisible ?
                                "block" : "none", "border-radius": a.borderRadius, BorderRadius: a.borderRadius, MozBorderRadius: a.borderRadius, WebkitBorderRadius: a.borderRadius, zIndex: 99}), q = "right" == a.position ? {right: a.distance} : {left: a.distance};
                    g.css(q);
                    c.css(q);
                    b.wrap(n);
                    b.parent().append(c);
                    b.parent().append(g);
                    a.railDraggable && c.bind("mousedown", function(a) {
                        var b = f(document);
                        y = !0;
                        t = parseFloat(c.css("top"));
                        pageY = a.pageY;
                        b.bind("mousemove.slimscroll", function(a) {
                            currTop = t + a.pageY - pageY;
                            c.css("top", currTop);
                            m(0, c.position().top, !1)
                        });
                        b.bind("mouseup.slimscroll", function(a) {
                            y = !1;
                            p();
                            b.unbind(".slimscroll")
                        });
                        return!1
                    }).bind("selectstart.slimscroll", function(a) {
                        a.stopPropagation();
                        a.preventDefault();
                        return!1
                    });
                    g.hover(function() {
                        v()
                    }, function() {
                        p()
                    });
                    c.hover(function() {
                        x = !0
                    }, function() {
                        x = !1
                    });
                    b.hover(function() {
                        s = !0;
                        v();
                        p()
                    }, function() {
                        s = !1;
                        p()
                    });
                    b.bind("touchstart", function(a, b) {
                        a.originalEvent.touches.length && (z = a.originalEvent.touches[0].pageY)
                    });
                    b.bind("touchmove", function(b) {
                        k || b.originalEvent.preventDefault();
                        b.originalEvent.touches.length &&
                                (m((z - b.originalEvent.touches[0].pageY) / a.touchScrollStep, !0), z = b.originalEvent.touches[0].pageY)
                    });
                    w();
                    "bottom" === a.start ? (c.css({top: b.outerHeight() - c.outerHeight()}), m(0, !0)) : "top" !== a.start && (m(f(a.start).position().top, null, !0), a.alwaysVisible || c.hide());
                    C()
                }
            });
            return this
        }});
    jQuery.fn.extend({slimscroll: jQuery.fn.slimScroll})
})(jQuery);

function setCheckedIds($this, selectIds, valDom) {
    valDom = valDom || ".check-all";
    var selectIds_str = '';
    var ids = $this.val();
    var ids_index = selectIds.indexOf(ids);

    if($this.prop('checked')){
        if (ids_index === -1) selectIds.push(ids);
    }else{
        if (ids_index !== -1) selectIds.splice(ids_index, 1);
    }
    if(selectIds) selectIds_str = selectIds.join(",");
    $(valDom).data('checkedIds', selectIds_str);
}

// select2_ajax start
function select2_ajax(select_dom, url, query){
    query.pageSize = (query.pageSize && query.pageSize > 20) ? query.pageSize : 20;

    $(select_dom).select2({
        ajax: {
            url: url,
            type: "GET",
            dataType: 'JSON',
            delay: 500,
            data: function (params) {
                $("input[class='select2-search__field']").on('input', function () {
                    query.search = params.term;
                });
                params = { //请求的参数, 关键字和搜索条件
                    search: params.term, //select搜索框里面的value
                    page: params.page || 1,
                    pageSize: query.pageSize || 20
                };
                params = $.extend(params, query);
                return params;
            },
            processResults: function (res, params) {
                params.page = params.page || 1;
                params.pageSize = query.pageSize || 20;

                //返回的选项必须处理成以下格式
                //var results =  [{ id: 0, text: 'enhancement' }, { id: 1, text: 'bug' }, { id: 2, text: 'duplicate' }];
                return {
                    results: res.data,
                    pagination:{
                        more: (params.page * params.pageSize) < res.total_count
                    }
                };
            },
        },
        escapeMarkup: function (markup) {
            return markup;
        }, // 返回html实体，防止xss注入;

        placeholder: '----请选择----', // 默认文字提示
        allowClear: true // 允许清空
    });
}
// select2_ajax end
