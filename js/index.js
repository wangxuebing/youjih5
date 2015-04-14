var PictureView=PictureView||{};
var PICTURE_VIEW_CONSTANTS = {};
var timer = 3000;
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
                                          '<div class="img_describe">{7}</div>'+
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
        autoplaySpeed: timer,
        infinite: false,
        arrows: false,
        mobileFirst: true,
        draggable: true
      });   
      PictureView.initEvent(); 
    },500);
  },
  getData : function(){
    //js获取参数travel_id！！
    $.ajax({
      url: 'http://e-traveltech.com/travelNotes/index/getTravelNotes',
      // url: 'http://121.40.167.145/travelNotes/index/getTravelNotes',
      data:{
        travel_id : this.getQueryString("travel_id"),
        channel_id : this.getQueryString("channel_id"),
        extra : this.getQueryString("extra")
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
    if(this.data.user.logo != ""){
      $(".user_head img").attr("src",this.data.user.logo)
    };
    if(this.data.user.name != ""){
      $(".username").html(this.data.user.name);
    };
    $('#music').attr('src',this.data.music);
    var fullTime = this.transTime(this.data.start_time);
    // $(".describe").html(fullTime.getFullYear()+"."+(fullTime.getMonth()+1)+"."+fullTime.getDate()+"&nbsp;&nbsp;&nbsp;&nbsp;"+this.data.day_count+"天");
    $(".describe").html("<span class='timeday'>" + fullTime.getDate() + "</span>" + "<span class='timemonth'>" + (fullTime.getMonth()+1)+"月" + "</span>");
    
    $("#director").html("导演："+this.data.user.name);
    $("#producer").html("出品："+this.data.producer);
    
        
    if(this.data.conduct_info.image == ""){
      $('.conduct').remove();
    }else{
      $('.conduct').css('background-image','url("' + this.data.conduct_info.image  + '")');
    }
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
            html += PICTURE_VIEW_CONSTANTS.IMG_ITEM_HTML.format(
              img.url, 
              img.width, 
              img.height, 
              num, 
              img.content, 
              imgWidth, 
              imgHeight
            );
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
    setTimeout(function(){
      $preview_img.css({'margin-left' : imgMarginLeft , 'margin-top' : -imgHeight/2});
      $(".item").eq(index).find('.img_describe').show().css({'top':$(window).height()/2 + imgHeight/2 + 10,'padding-left':$(window).width()/2 - imgWidth/2,'padding-right':$(window).width()/2 - imgWidth/2 - 6});
    
      if($(".item").eq(index).find(".clock_left").length != 0){
        imgMarginLeft += 30;
        $(".item").eq(index).find(".img_describe").show().css("margin-left",30);
        $(".item").eq(index).find(".clock_left").show().css('margin-top',imgHeight/6);
        $preview_img.css({'margin-left' : imgMarginLeft , 'margin-top' : -imgHeight*2/3});
        $(".item").eq(index).find('.img_describe').show().css({'top':$(window).height()/2 + imgHeight/3 + 10,'padding-left':$(window).width()/2 - imgWidth/2});
      }
      if($(".item").eq(index).find(".clock_top").length != 0){
        $(".item").eq(index).find(".clock_top").show().css('margin-top',($(window).height()-imgHeight)/4);
        $preview_img.css({'margin-left' : imgMarginLeft , 'margin-top' : -imgHeight/2});
        $(".item").eq(index).find('.img_describe').show().css({'top':$(window).height()/2 + imgHeight/2 + 10,'padding-left':$(window).width()/2 - imgWidth/2});
      }
    },150);

  },
  transPageCode : function(index){
    if($(".item").eq(index).find('.face_main').length != 0){
      $(".stop_play,.auto_play").addClass('hide');
    }
    if($(".item").eq(index).find(".preview_img").length == 0){
      $(".page_code").hide();
    }else{
      var thisImgIndex = $(".item:lt("+index+")").find(".preview_img").length+1;
      $(".page_code").show().html(thisImgIndex+"/"+this.data.image_count);
    }
    if($(".item").eq(index).find(".banner").length == 0){
      $(".page_code").css('bottom',10)
    }else{
      $(".page_code").css('bottom',$(".banner").find("img").height() + 10)
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
      document.getElementById("music").pause();
      $("#picture_view").slick("slickPause");
      var currentIndex = $("#picture_view").slick("slickCurrentSlide");
      if(currentIndex == 0){
        $(".auto_play,.stop_play,.display").addClass('hide');
        $('.play').removeClass('hide');
      }else{
        $(".auto_play,.play").removeClass('hide');
        $(".stop_play,.display").addClass('hide');
      }
    });
        
    $(document).bind("keyup",function(e){
      if(e.keyCode == 37 || e.keyCode == 39){
        document.getElementById("music").pause();
        $('#picture_view').slick("slickPause");
        var currentIndex = $("#picture_view").slick("slickCurrentSlide");
        if(currentIndex == 0){
          $(".auto_play,.stop_play,.display").addClass('hide');
          $('.play').removeClass('hide');
        }else{
          $(".auto_play,.play").removeClass('hide');
          $(".stop_play,.display").addClass('hide');
        }
        if (e.keyCode == 37){
          $('#picture_view').slick("slickPrev");
        }else if(e.keyCode == 39){
          $('#picture_view').slick("slickNext");
        }
      }
    });
    
    $(".preview_img").bind("click",function(){
      if(!PictureView.isShowingSingle){
        document.getElementById("music").pause();
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
        $("#single_preview").fadeIn();
      }
    });
    $("#single_preview").bind("click",function(){
      if(PictureView.isShowingSingle){
        $("#single_preview").hide().find("img").attr("src", "");
        PictureView.isShowingSingle = false;
        $(".auto_play").removeClass('hide');
        $(".stop_play").addClass('hide');
      }
    });
    
    $(".auto_play").bind("click",function(){
      $('#picture_view').slick("slickPlay");
      document.getElementById("music").play();
      $(this).addClass('hide');
      $('.play').addClass('hide');
      $(".stop_play,.display").removeClass('hide');
    });
    
    $(".stop_play").bind("click",function(){
      $(this).addClass('hide');
      $('.display').addClass('hide');
      $('#picture_view').slick("slickPause");
      document.getElementById("music").pause();
      $(".auto_play,.play").removeClass('hide');
    });
    
    $(".display").bind("click",function(){
      $('.stop_play').addClass('hide');
      $(this).hide();
      $('.play').show();
      $('#picture_view').slick("slickPause");
      document.getElementById("music").pause();
      $(".auto_play").removeClass('hide');
    });
    
    $(".play").bind("click",function(){
      $(this).addClass('hide');
      $(".auto_play").addClass("hide");
      $(".stop_play,.display").removeClass("hide");
      $('#picture_view').slick("slickPlay");
      $('#picture_view').slick("slickGoTo",1);
      document.getElementById("music").play();
    });
    
    $(document).delegate(".close_banner","click",function(){
      $(this).parent(".banner").remove();
      $(".page_code").css('bottom',10)
    });
    
    if(this.data.banner_info.image == ""){
      $('.banner').hide();
    }else{
      $(".img_warpper").last().append('<div class="banner"><span class="close_banner"></span><a href="#" target="_blank"><img src="' + "http://e-traveltech.com" + this.data.banner_info.image + '" /></a></div>')
      // $('.banner').css('background-image','url("' + "http://e-traveltech.com" + this.data.banner_info.image  + '")');
    }
    
    if(this.data.banner_info.url == ""){
      $('.banner a').attr('href','#');
    }else{
      $('.banner a').attr('href','http://e-traveltech.com' + this.data.banner_info.url);
    }
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
