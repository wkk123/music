$(function(){
  //DOM对象
   var audio=$(".audio")[0];
  // jQuery对象
   var $audio=$('audio');

//给添加的内容用数组形式体现   
   var muscis=[
                {src:"1.mp3",name:"淘汰",geshou:"周杰伦",time:"03:42"},
                {src:"2.mp3",name:"爱情转移",geshou:"陈奕迅",time:"04:22"},
                {src:"3.mp3",name:"See You Again",geshou:"XXX",time:"03:49"},
                {src:"4.mp3",name:"十年",geshou:"陈奕迅",time:"03:22"},
                {src:"5.mp3",name:"High歌",geshou:"黄龄",time:"04:46"},
                {src:"6.mp3",name:"想太多",geshou:"李玖哲",time:"03:36"}
                ]

//向列表中添加内容
  $(muscis).each(function(index,value){
      $('<li data-id='+index+'><span style="width:254px;">'+value.name+'</span> <span style="width:180px;">'+value.geshou+'</span> <span style="width:34px;">'+value.time+'</span><div class="zhezhao"><i style="width:254px;">'+value.name+'</i><i style="width:140px;">'+value.geshou+'</i><i style="width:74px;" class="shoucang"><span class="like"></span><span class="share"></span><span class="fav"></span><span class="del"></span></i></div></li>').appendTo(".one")
  })

// 添加  播放/暂停  事件
$audio.on('play',function(){
  $(".ting").addClass('kaishi')
})
$audio.on('pause',function(){
  $(".ting").removeClass('kaishi')
})

//点击  播放/暂停
$('.ting').on('click',function(){
  if (audio.paused) {
    audio.play()
  } else{
    audio.pause()
  };
})

//  音量调节
   //  按下事件
  $(".right-center .dian").on("mousedown",function(e){
   e.stopPropagation();
    $('.jindu').addClass('jindu1')
    $('.dian').addClass('dian1')
   $(document).on('mousemove',function(e){
            //获取鼠标距文档左边的距离       //获取长条距文档左边的距离
   	var left=e.pageX-$('.changtiao').offset().left;   //鼠标在长条上移动的距离
   	var v=left/$('.changtiao').width();
   	v=(v>1)?1:v;
   	v=(v<0)?0:v;
   	audio.volume=v;
	
	var vl=audio.volume*$(".changtiao").width();
                                
  $('.jindu').width(vl)        //进度条的长度
	$(".right-center .dian").css({left:vl+30})   //点的移动距离
   })
  })
  //抬起事件
    //本来应该给点添加抬起事件，但是抬起时位置移动就不能执行事件，所以加给document就可以很好的解决这一问题
  $(document).on('mouseup',function(){
    $('.jindu').removeClass('jindu1')
    $('.dian').removeClass('dian1')
    $(document).off('mousemove')
    
  })

//静音
$audio.on('volumechange',function(){
  if (audio.volume===0) {
    $('.jingyin').addClass('jingyin1')
  } else{
    $('.jingyin').removeClass('jingyin1')
  };
})

//给长条一个点击事件，音量到达相应位置
$('.changtiao').on('click',function(e){

    var cw=$('.changtiao').width()
    var ox=$('.changtiao').offset().left;
    var Left=e.pageX-ox;   //鼠标在长条上移动的距离
    if (Left<0) {
      Left=0
    } else if (Left>0&&Left<cw) {
      Left=Left;
    }else if (Left>cw) {
      Left=cw;
    };
    $('.jindu').width(Left)        //进度条的长度
    $(".right-center .dian").css({left:Left+30})
    var v=Left/$('.changtiao').width();
    v=(v>1)?1:v;
    v=(v<0)?0:v;
    audio.volume=v;
})

// 静音 与 非静音 间的切换

/*$('.jingyin').on('click',function(){
   $(this).toggleClass('jingyin1');
   
   if ($(this).attr('jingyin1','audio.volume')) {
    var aa=$(this).attr('audio.volume')
   audio.volume=0;
   } else{
    audio.volume=aa;
   };
  
  })*/




$('.jingyin').on('click',function(){
              //attr设置或返回被选元素的属性值   
              //这里的aa是自定义的一个变量$('.jingyin')本没有这个属性值

  if(!$(this).attr('aa')) {             //当aa不存在是添加aa及其属性值
     $(this).attr('aa',audio.volume)
     $(this).addClass('jingyin1')
     audio.volume=0;
  } else{                              
    audio.volume=$(this).attr('aa');    //当aa存在时保存当前的  音量
    $(this).removeAttr("aa")
    $(this).removeClass('jingyin1')
  };
  
})


//歌曲数量

$('.number').html($('.one li').length)   //html用来设置获取的第一个元素的内容

//歌曲进度
   //歌曲进度随着点击长条位置的改变而改变
$('.progress').on('click',function(e){
    var Left1=e.pageX-$('.progress').offset().left;
    var bili=Left1/$('.progress').width();
    audio.currentTime=bili*audio.duration  //歌曲播放位置
    $('.hongdian').css({left:Left1-4})
    $('.dangqianjindu').css({width:Left1})
  
})
   //歌曲进度随时间的变化而变化
$audio.on('timeupdate',function(){
var dangqianw=audio.currentTime*$('.progress').width()/audio.duration;
 $('.dangqianjindu').css({width:dangqianw});
 $('.hongdian').css({left:dangqianw-4})
})
   //歌曲的进度随着进度的拖动位置而改变
$('.hongdian').on('mousedown',function(e){
  e.stopPropagation();
  
  $(document).on('mousemove',function(e){
    var Left1=e.pageX-$('.progress').offset().left;
        $('.hongdian').css({left:Left1-4})
        $('.dangqianjindu').css({width:Left1})
  })
})
$(document).on('mouseup',function(){
  $(document).off('mousemove')
})

//播放列表当前点击的歌曲
var currentIndex;
$('.one li').on('click',function(){
  num=parseInt($(this).attr('data-id'));
  currentIndex=num;
  audio.src=muscis[currentIndex].src;
  audio.play();
  $(this).addClass('zhezhao1')

  //歌曲信息更换
  $('.center .time').html(muscis[currentIndex].time)
  $('.center .title').html(muscis[currentIndex].name)
  $('.center .name').html(muscis[currentIndex].geshou)
})

var qian=$('.center-Cbtn .qian');
var hou=$('.center-Cbtn .hou');
 qian.on('click',function(){
    $('.one li').removeClass('zhezhao1');
    for(var i=0;i<muscis.length;i++){
      if(muscis[i].src==$('.audio').attr('src')){
      var currentIndex=i;
      }
    }
    currentIndex++;    
    if(currentIndex==muscis.length){
      currentIndex=0;
    }
    $($('.one li')[currentIndex]).addClass('zhezhao1');
    $('.audio')[0].src=$(muscis)[currentIndex].src;
    $('.audio')[0].play();  
  })
/*  hou.on('click',function(){
    $('.one li').removeClass('zhezhao1');
    for(var i=0;i<muscis.length;i++){
      if(muscis[i].src==$('.audio').attr('src')){
      var currentIndex=i;
      }
    }
    currentIndex--;    
    if(currentIndex<0){
      currentIndex=muscis.length-1;
    }
    $($('.one li')[currentIndex]).addClass('zhezhao1');
    $('.audio')[0].src=$(muscis)[currentIndex].src;
    $('.audio')[0].play();  
  })*/
hou.on('click',function(){
  $('.one li').removeClass('zhezhao1');//删除的是下标没减之前
    // alert(currentIndex)
    currentIndex-=1;
    // alert(currentIndex)
    if(currentIndex<0){
      currentIndex=muscis.length-1;
    }
    audio.src=muscis[currentIndex].src;
    
    $($('.one li')[currentIndex]).addClass('zhezhao1');//删除的是下标被减之后

})


// 删除列表中的一行
  $('.del').on('click',function(){   //parentNode 获取匹配元素的父元素
    var num=$(this.parentNode.parentNode.parentNode).index();//现获取要删除的元素的下标
    var deleli=$('.one li')[num];    //找到要删除的对象
    $('.one')[0].removeChild(deleli);
    $('.number').html($('.one li').length);
  })


$audio.on('ended',function(){

}) 








 

  
})