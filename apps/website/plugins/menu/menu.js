/**
 * menu.js
 * ~ a Force plugin for managing mene header
 * started at november 15th 2022
 * @requires ForceWebsite
 */
;function menu(param){
this.version='1.0.0';
this.param=param;
this.Force=null;
this.main=null;
this.button=null;
this.header=null;
this.MENU_WIDTH=null;
/* initialize menu */
this.init=function(plug){
  this.Force=plug.Force;
  var _menu=this,
  header=document.getElementById('header'),
  old=document.getElementById('menu-main'),
  cmenu=this.content(this.param);
  /* check header and old one */
  if(!header||old){return;}
  /* set main elements */
  this.main=cmenu.main;
  this.button=cmenu.button;
  this.header=cmenu.header;
  /* append to header */
  this.button.appendTo(header);
  this.main.appendTo(header);
  /* get menu width */
  if(!this.MENU_WIDTH){
    this.MENU_WIDTH=this.main.offsetWidth+200;
  }
  /* add on resize event */
  window.onresize=function(e){
    return _menu.resize();
  };
  /* re-calibrate menu on resize */
  return this.resize();
};
/* re-calibrate menu on resize */
this.resize=function(){
  /* check menu hide */
  if(!this.MENU_WIDTH){return false;}
  /* get elements */
  var shade=document.getElementById('menu-shadow');
  /* re-calibrate position */
  if(this.MENU_WIDTH>window.innerWidth){
    this.button.classList.add('menu-button-show');
    this.main.classList.add('menu-overflow');
    this.header.classList.add('menu-header-show');
  }else{
    this.button.classList.remove('menu-button-show');
    this.main.classList.remove('menu-overflow');
    this.main.classList.remove('menu-overflow-show');
    this.header.classList.remove('menu-header-show');
    if(shade){
      shade.parentElement.removeChild(shade);
    }
  }return true;
};
/* menu hide */
this.hide=function(){
  /* get elements */
  var shade=document.getElementById('menu-shadow'),
  isOverflow=this.main.classList.contains('menu-overflow');
  if(!shade||!isOverflow){return false;}
  /* remove class overflow and shadow element */
  this.main.classList.remove('menu-overflow-show');
  shade.parentElement.removeChild(shade);
  return true;
};
/* menu toggle */
this.toggle=function(){
  /* get elements */
  var _menu=this,
  shade=document.getElementById('menu-shadow'),
  isOverflow=this.main.classList.contains('menu-overflow');
  if(!isOverflow){return false;}
  /* check for overflow */
  if(this.main.classList.contains('menu-overflow-show')){
    this.main.classList.remove('menu-overflow-show');
    if(shade){
      shade.parentElement.removeChild(shade);
    }return true;
  }this.main.classList.add('menu-overflow-show');
  /* prepare shade */
  var shade=document.createElement('div');
  shade.classList.add('menu-overflow-shadow');
  shade.id='menu-shadow';
  shade.onclick=function(e){
    _menu.main.classList.remove('menu-overflow-show');
    this.parentElement.removeChild(this);
  };
  ForceWebsite.main.appendChild(shade);
  return true;
};
/* menu content */
this.content=function(menus){
  menus=Array.isArray(menus)?menus:[
    {
      href:'?home',
      text:'Home',
    },
  ];
  var _menu=this,
  mbut=ForceWebsite.buildElement('div',null,{
    'class':'menu-button',
    'id':'menu-button',
  },[
    ForceWebsite.buildElement('div',null,{
      'class':'menu-button-strip',
    }),
    ForceWebsite.buildElement('div',null,{
      'class':'menu-button-strip',
    }),
    ForceWebsite.buildElement('div',null,{
      'class':'menu-button-strip',
    }),
  ]),
  mhead=ForceWebsite.buildElement('div',null,{
    'class':'menu-header',
    'id':'menu-header',
  }),
  mmain=ForceWebsite.buildElement('div',null,{
    'class':'menu',
    'id':'menu-main',
  },[mhead]);
  for(var m of menus){
    var me=ForceWebsite.buildElement('div',m.text,{
      'class':'menu-each',
      'title':m.text,
      'data-href':m.href,
    });
    me.appendTo(mmain);
    me.menu=this;
    me.onclick=function(e){
      ForceWebsite.go(this.dataset.href);
      return this.menu.hide();
    };
  }
  mbut.menu=this;
  mbut.onclick=function(e){
    return this.menu.toggle();
  };
  return {
    button:mbut,
    main:mmain,
    header:mhead,
  };
};
};
