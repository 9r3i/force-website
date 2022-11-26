/**
 * slider.js
 * ~ a Force plugin for sliding images
 * started at november 10th 2022
 * @requires tiny.slider.js, ForceWebsite
 */
;function slider(param){
this.images=param;
this.init=function(plug){
  plug.Force.loadStyleFile(plug.root+'/slider/tiny.slider.min.css');
  plug.Force.loadScriptFile(plug.root+'/slider/tiny.slider.min.js');
  if(ForceWebsite.query.hasOwnProperty('home')
    ||window.location.search==''){
    var sd=this.build(this.images),
    bulk=ForceWebsite.body.firstChild;
    ForceWebsite.body.insertBefore(sd.element,bulk);
    plug.Force.onFunctionReady('tns',r=>{
      if(r){sd.start();}
    });
  }
};
this.build=function(images){
  images=Array.isArray(images)?images:[];
  var div=document.createElement('div');
  var imgs=[];
  for(var i in images){
    var di=document.createElement('div');
    var img=document.createElement('img');
    img.src=''+images[i];
    di.appendChild(img);
    div.appendChild(di);
    imgs.push(img);
  }
  div.classList.add('slider');
  return {start:function(){return tns({
    container:'.slider',
    items:1,
    slideBy:"page",
    mouseDrag:false,
    swipeAngle:false,
    controls:false,
    nav:false,
    speed:400,
    startIndex:0,
    rewind:false,
    center:false,
    autoWidth:false,
    loop:true,
    autoplay:true,
    autoplayHoverPause:false,
    autoplayTimeout:2500,
    autoplayText:[
      "▶",
      "❚❚",
    ],
    autoplayButton:false,
    autoplayButtonOutput:false,
    autoplayResetOnVisibility:false,
  })},element:div,images:imgs};
};
};
