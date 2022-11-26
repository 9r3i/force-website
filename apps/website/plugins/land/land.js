/**
 * land.js
 * ~ a Force plugin for landing client
 * started at november 9th 2022
 * @requires ForceWebsite
 */
;function land(param){
this.Force=null;
this.init=function(plug){
  this.Force=plug.Force;
  var _land=this;
  key=localStorage.getItem('land-key');
  localStorage.removeItem('land-key');
  if(ForceWebsite.query.hasOwnProperty('land')){
    ForceWebsite.fetch('land.get',function(r){
      if(typeof r!=='string'||r=='false'){
        return false;
      }
      localStorage.setItem('land-key',r);
      ForceWebsite.go('?home');
    },{id:ForceWebsite.query.land});
    return;
  }else if(ForceWebsite.query.hasOwnProperty('land-key')){
    this.Force.splash('Redirecting...');
    ForceWebsite.fetch('land.trade',function(r){
      if(typeof r!=='string'||r=='false'){
        return false;
      }window.location.assign(r);
    },{key:ForceWebsite.query['land-key']});
    return;
  }else if(key&&ForceWebsite.query.hasOwnProperty('home')){
    var but=ForceWebsite.buildElement('button','I\'m not Robot',{
      'class':'land-button',
      'data-key':key,
    }),
    row=ForceWebsite.buildElement('div',null,{
      'class':'land-row',
    },[but]),
    bulk=ForceWebsite.body.firstChild,
    pid=Math.floor(bulk.children.length*Math.random()),
    href=bulk.children[pid].firstChild.firstChild.href;
    ForceWebsite.body.insertBefore(row,bulk);
    but.onclick=function(e){
      localStorage.setItem('land-key',this.dataset.key);
      ForceWebsite.go(href);
    };
    return;
  }else if(key&&ForceWebsite.query.hasOwnProperty('p')){
    var but=ForceWebsite.buildElement('button','10s Preparing...',{
      'class':'land-button',
      'data-key':key,
      'data-time':'10',
    }),
    row=ForceWebsite.buildElement('div',null,{
      'class':'land-row',
    },[but]),
    buta=ForceWebsite.buildElement('button','10s Generating...',{
      'class':'land-button',
      'data-key':key,
      'id':'land-download',
      'data-time':'10',
    }),
    rowa=ForceWebsite.buildElement('div',null,{
      'class':'land-row',
    },[buta]);
    bulk=ForceWebsite.body.firstChild;
    ForceWebsite.body.insertBefore(row,bulk);
    this.countdown(but,function(e){
      ForceWebsite.body.removeChild(row);
      rowa.appendTo(ForceWebsite.body);
      ForceWebsite.main.scrollTo({
         top:bulk.offsetHeight,
         left:0,
         behavior:'smooth'
      });
      _land.countdown(buta,function(e){
        window.open('?land-key='+this.dataset.key,'_blank');
        ForceWebsite.body.removeChild(rowa);
      },'s Generating...','Download');
    },'s Preparing...','Generate');
    return;
  }
};
this.countdown=function(el,cb,ing,text){
  var _land=this,
  i=parseInt(el.dataset.time,10);
  if(i<=0){
    el.innerText=text;
    el.onclick=cb;
    return;
  }
  el.innerText=i+''+ing;
  i--;
  el.dataset.time=i+'';
  setTimeout(e=>{
    return _land.countdown(el,cb,ing,text);
  },1000);
};
/* kitchen */
this.kitchen=function(plug){
  this.Force=plug.Force;
  var p='',
  _land=this,
  ntitle=ForceWebsite.buildElement('input',null,{
    'class':'kitchen-input-title',
    'value':'land.ini',
    'disabled':'true',
  }),
  ncontent=ForceWebsite.buildElement('textarea',null,{
    'class':'kitchen-input-content',
    'placeholder':'Loading...',
  }),
  nsave=ForceWebsite.buildElement('button','Save',{
    'class':'button button-pink',
  }),
  nback=ForceWebsite.buildElement('button','Back',{
    'class':'button button-blue',
  }),
  ndp=ForceWebsite.buildElement('div',null,{
    'class':'kitchen-data-form',
  },[
    ntitle,ncontent,nsave,nback,
  ]);
  nback.onclick=function(e){
    ForceWebsite.go(ForceWebsite.kkey+'=data');
  };
  nsave.onclick=function(e){
    ncontent.disabled=true;
    nback.disabled=true;
    nsave.disabled=true;
    nsave.innerText='Saving...';
    ForceWebsite.request('land.iniPut',function(r){
      ncontent.disabled=false;
      nback.disabled=false;
      nsave.disabled=false;
      nsave.innerText='Save';
      _land.Force.splash('Saved.');
    },{
      content:ncontent.value,
    });
  };
  ndp.appendTo(ForceWebsite.body);
  ForceWebsite.request('land.iniGet',function(r){
    ncontent.value=r;
  });
};
};
