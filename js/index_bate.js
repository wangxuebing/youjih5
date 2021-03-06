var PictureView=PictureView||{};

var PICTURE_VIEW_CONSTANTS = {};
PICTURE_VIEW_CONSTANTS.HOUR_ANGLE = 30;
PICTURE_VIEW_CONSTANTS.MINUTE_ANGLE = 6;
PICTURE_VIEW_CONSTANTS.IMG_ITEM_HTML = '<div class="img_warpper width item">'+
                                          '<img src="" data-src="{0}" data-width="{1}" date-height="{2}" id="image_{3}" width="{5}" height="{6}" class="preview_img">'+
                                          '<p class="img_describe">{4}</p>'+
                                        '</div>';
PICTURE_VIEW_CONSTANTS.IMG_COLCK_ITEM_HTML = '<div class="img_warpper width item">'+
                                          '<div class="clock {0}">'+
                                            '<hr class="minute" data-minute="{1}">'+
                                            '<hr class="hour" data-hour="{2}">'+
                                          '</div>'+
                                          '<img src="" data-src="{3}" data-width="{4}" date-height="{5}" id="image_{6}" width="{8}" height="{9}" class="preview_img">'+
                                          '<p class="img_describe">{7}</p>'+
                                      '</div>';

PICTURE_VIEW_CONSTANTS.DATE_ITEM_HTML = '<div class="img_date width item">'+
                                          '<div class="date_main">'+
                                            '<p class="dayly">{0}</p>'+
                                            '<p class="year">{1}</p>'+
                                            '<p class="day">{2}</p>'+
                                          '</div>'+
                                        '</div>';


$.extend(PictureView,{
  data : null,
  isShowingSingle : false,
  init : function(){
    setTimeout(function(){
      PictureView.fillData();
      PictureView.createImgItems();
      PictureView.initCss();
      PictureView.preloadImg(1);
      PictureView.transPos(2);
      $('#picture_view').slick({
        speed: 500,
        infinite: false,
        arrows: false,
        mobileFirst: true
      });
      PictureView.initEvent();
    },500);
  },
  getData : function(){
    //js获取参数travel_id！！
    $.ajax({
      url: 'http://115.29.179.17/travelNotes/index/getTravelNotes',
      data:{
        travel_id : this.getQueryString("travel_id")
      },
      type: 'GET',
      jsonp: "callback", 
      dataType: "json",
      async: false,
      cache: true
    })
    .done(function(response) {
      if(response.error_code == 0){
        PictureView.data = response.data;
        PictureView.init();
      }
    })
    .fail(function() {
      alert("获取内容失败了，刷新试试哦");
    })
    .always(function() {
      //do some always
    });
  },
  fillData : function(){
    $('#page_bg').css('background-image','url("' + this.data.background  + '")');
    $(".face").css('background-image','url("' + this.data.face +'")');
    $(".face_name").html(this.data.title);
    $('#music').attr('src',this.data.music);
    var fullTime = this.transTime(this.data.start_time);
    $(".describe").html(fullTime.getFullYear()+"."+(fullTime.getMonth()+1)+"."+fullTime.getDate()+"&nbsp;&nbsp;&nbsp;&nbsp;"+this.data.day_count+"天");
    $("#director").html("导演："+this.data.user.name);
    $("#producer").html("出品："+this.data.producer);
  },
  createImgItems : function(){
    var html = "";
    var images = PictureView.data.images;
    var num = 0
    for(var i = 0; i < images.length; i++){
      var dayImage = images[i];
      html += PICTURE_VIEW_CONSTANTS.DATE_ITEM_HTML.format(
        "DAY"+(i+1), 
        PictureView.transTime(dayImage.time).getFullYear()+"."+(PictureView.transTime(dayImage.time).getMonth()+1), 
        PictureView.transTime(dayImage.time).getDate());
      for(var j = 0; j < dayImage.marks.length; j++){
        var minuteImage = dayImage.marks[j];
        for(var k = 0; k < minuteImage.marks.length; k++){
          var img = minuteImage.marks[k];
          if(k == 0){
            if(parseInt(img.width) >= parseInt(img.height)){
              var imgWidth;
              var imgHeight;
              if(parseInt(img.width) / parseInt(img.height) >= ($(window).width() * 0.8) / ($(window).height() * 0.5)){
                imgWidth = $(window).width()*0.8;
                imgHeight = parseInt(img.height) * imgWidth / parseInt(img.width);
              }else{
                imgHeight = $(window).height() * 0.5;
                imgWidth = parseInt(img.width) * imgHeight / parseInt(img.height);
              }
              
              html += PICTURE_VIEW_CONSTANTS.IMG_COLCK_ITEM_HTML.format(
                "clock_top",
                PictureView.transTime(img.time).getMinutes(),
                PictureView.transTime(img.time).getHours(),
                img.url,
                img.width,
                img.height,
                num,
                img.content,
                imgWidth,
                imgHeight
              );
            }else{
              var imgWidth;
              var imgHeight;
              if(parseInt(img.width) / parseInt(img.height) >= ($(window).width() * 0.8) / ($(window).height() * 0.5)){
                imgWidth = $(window).width()*0.8;
                imgHeight = parseInt(img.height) * imgWidth / parseInt(img.width);
              }else{
                imgHeight = $(window).height() * 0.5;
                imgWidth = parseInt(img.width) * imgHeight / parseInt(img.height);
              }
              html += PICTURE_VIEW_CONSTANTS.IMG_COLCK_ITEM_HTML.format(
                "clock_left",
                PictureView.transTime(img.time).getMinutes(),
                PictureView.transTime(img.time).getHours(),
                img.url,
                img.width,
                img.height,
                num,
                img.content,
                imgWidth,
                imgHeight
              );
            }
          }else{
            var imgWidth;
            var imgHeight;
            if(parseInt(img.width) / parseInt(img.height) >= ($(window).width() * 0.8) / ($(window).height() * 0.5)){
              imgWidth = $(window).width() * 0.8;
              imgHeight = parseInt(img.height) * imgWidth / parseInt(img.width);
            }else{
              imgHeight = $(window).height() * 0.5;
              imgWidth = parseInt(img.width) * imgHeight / parseInt(img.height);
            }
            html += PICTURE_VIEW_CONSTANTS.IMG_ITEM_HTML.format(img.url, img.width, img.height, num, img.content, imgWidth, imgHeight);
          }
          num ++;
        }
      }
    }
    $(html).insertAfter('.face');
  },
  initCss : function(){
    //页面斜线
    $("#picture_view").find(".width:odd").addClass('down');
    $("#picture_view").find(".width:even").addClass('up');
    switch(PictureView.getMobileOperatingSystem()){
      case "ios":
        $("#mobile").addClass("ios");break;
      case "android":
        $("#mobile").addClass("android");break;
    }
  },

  tansEnd : function(index){
    if($(".item").eq(index).find(".minute").length == 0){
      return;
    }
    var $minute = $(".item").eq(index).find(".minute");
    var $hour = $(".item").eq(index).find(".hour");
    if($minute.length != 0 && $hour.length != 0){
      var m = $minute.data("minute");
      var h = $hour.data("hour");
      var hourAngle = PICTURE_VIEW_CONSTANTS.HOUR_ANGLE * h - 90;
      var minuteAngle = PICTURE_VIEW_CONSTANTS.MINUTE_ANGLE * m - 90;
      $minute.velocity({
        rotateZ: minuteAngle
      },{ duration: 1000 });
      $hour.velocity({
        rotateZ: hourAngle
      },{ duration: 1000 });
    }
  },

  transTime : function(time){
    return new Date(parseInt(time) * 1000);
  },  

  preloadImg : function(index){
    for(var i = 0; i < 3; i++){
      $preview_img = $(".item").eq(index+i).find(".preview_img");
      if($preview_img.length != 0 && $preview_img.attr("src") == ""){
        $preview_img.attr("src", $preview_img.data("src"));
      }
    }
  },

  transPos : function(index){
    $preview_img = $(".item").eq(index).find(".preview_img");
    if($preview_img.length == 0){
      return;
    }
    var imgWidth = $preview_img.width();
    var imgHeight = $preview_img.height();
    var imgMarginLeft = -imgWidth/2;
    $preview_img.css({'margin-left' : imgMarginLeft , 'margin-top' : -imgHeight/2});
    $(".item").eq(index).find('.img_describe').css({'top':$(window).height()/2 + imgHeight/2 + 10,'padding-left':$(window).width()/2 - imgWidth/2,'padding-right':$(window).width()/2 - imgWidth/2 - 6});
    
    if($(".item").eq(index).find(".clock_left").length != 0){
      imgMarginLeft += 30;
      $(".item").eq(index).find(".img_describe").css("margin-left",30);
      $(".item").eq(index).find(".clock_left").css('margin-top',imgHeight/6);
      $preview_img.css({'margin-left' : imgMarginLeft , 'margin-top' : -imgHeight*2/3});
      $(".item").eq(index).find('.img_describe').css({'top':$(window).height()/2 + imgHeight/3 + 10,'padding-left':$(window).width()/2 - imgWidth/2});
    }
    if($(".item").eq(index).find(".clock_top").length != 0){
      $(".item").eq(index).find(".clock_top").css('margin-top',($(window).height()-imgHeight)/4);
      $preview_img.css({'margin-left' : imgMarginLeft , 'margin-top' : -imgHeight/2});
      $(".item").eq(index).find('.img_describe').css({'top':$(window).height()/2 + imgHeight/2 + 10,'padding-left':$(window).width()/2 - imgWidth/2});
    }
  },
  transPageCode : function(index){
    if($(".item").eq(index).find(".preview_img").length == 0){
      $(".page_code").hide();
    }else{
      var thisImgIndex = $(".item:lt("+index+")").find(".preview_img").length+1;
      $(".page_code").show().html(thisImgIndex+"/"+this.data.image_count);
    }
  },

  getMobileOperatingSystem : function(){
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ) ){
      return 'ios';
    }else if( userAgent.match( /Android/i ) ){
      return 'android';
    }else{
      return 'pc';
    }
  },  

  toggleRadio : function(){
    var audio = document.getElementById("music");
    if(audio.paused){
      audio.play();
    }else{
      audio.pause();
    }
  },

  // for pc test
  initEvent : function(){
    $('#picture_view').on("afterChange", function(event, slick, currentSlide){
      PictureView.tansEnd(currentSlide);
      PictureView.preloadImg(currentSlide+1);
      PictureView.transPageCode(currentSlide);
      PictureView.transPos(currentSlide+1);
    });

    $("#picture_view").on("swipe", function(){
      // $(".audio_play").hide().removeClass('audio_dis');
      // document.getElementById("music").pause();
      $("#picture_view").slick("slickPause");
      var currentIndex = $("#picture_view").slick("slickCurrentSlide");
      if(currentIndex != 0 && currentIndex != ($(".item").length - 1)){
        $(".footer_play").removeClass('hide');
      }else{
        $(".footer_play").addClass('hide');
      }
    });

    $(document).bind("keyup",function(e){
      if(e.keyCode == 37 || e.keyCode == 39){
        // $(".audio_play").hide().removeClass('audio_dis');
        // document.getElementById("music").pause();
        $('#picture_view').slick("slickPause");
        var currentIndex = $("#picture_view").slick("slickCurrentSlide");
        if(currentIndex != 0 && currentIndex != ($(".item").length - 1)){
          $(".footer_play").removeClass('hide');
        }else{
          $(".footer_play").addClass('hide');
        }
        if (e.keyCode == 37){
          $('#picture_view').slick("slickPrev");
        }else if(e.keyCode == 39){
          $('#picture_view').slick("slickNext");
        }
      }
    });
    $("#download_app").bind("click",function(){
      switch(PictureView.getMobileOperatingSystem()){
        case "ios":
          alert("ios");break;
        case "android":
          alert("android");break;
        default:
          alert("pc");
      }
    });
    $(".preview_img").bind("click",function(){
      if(!PictureView.isShowingSingle){
        // $(".audio_play").hide().removeClass('audio_dis');
        // document.getElementById("music").pause();
        $('#picture_view').slick("slickPause");
        var imgSrc = $(this).attr("src");
        var $preview_img = $("#single_preview").find("img");
        $preview_img.attr("src", imgSrc);
        if(($(this).width()/$(window).width()) > ($(this).height()/$(window).height())){
          $preview_img.height($(window).width()/$(this).width()*$(this).height());
          $preview_img.width($(window).width());
          $preview_img.css({"margin-left": 0, "margin-top": $(window).height()/2 - $preview_img.height()/2});
        }else{
          $preview_img.width($(window).height()/$(this).height()*$(this).width()*0.9);
          $preview_img.height($(window).height()*0.9);
          $preview_img.css({"margin-left": $(window).width()/2 - $preview_img.width()/2, "margin-top": $(window).height()/2 - $preview_img.height()/2});
        }
        PictureView.isShowingSingle = true;
        // setTimeout(function(){
          $("#single_preview").fadeIn();
        // },150);
      }
    });
    $("#single_preview").bind("click",function(){
      if(PictureView.isShowingSingle){
        $("#single_preview").hide().find("img").attr("src", "");
        PictureView.isShowingSingle = false;
        $(".footer_play").removeClass('hide');
      }
    });
    $(".audio").bind("click",function(){
      PictureView.toggleRadio();
      $(this).toggleClass('audio_dis');
    });
    $(".footer_play").bind("click",function(){
      $('#picture_view').slick("slickPlay");
      // document.getElementById("music").play();
      // $(".audio_play").show();
      $(".footer_play").addClass('hide');
    });
    $(".play").bind("click",function(){
      $('#picture_view').slick("slickPlay");
      // document.getElementById("music").play();
      // $(".audio_play").show();
      $(".footer_play").addClass('hide');
    });
  },
  getQueryString : function(name){ 
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
    var r = window.location.search.substr(1).match(reg); 
    if (r != null) return unescape(r[2]); return null; 
  } 
});

String.prototype.format=function(){  
  if(arguments.length==0) return this;  
  for(var s=this, i=0; i<arguments.length; i++)  
    s=s.replace(new RegExp("\\{"+i+"\\}","g"), arguments[i]);  
  return s;  
};
