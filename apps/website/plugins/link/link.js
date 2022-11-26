/**
 * link.js
 * ~ a Force plugin for finding links
 * started at november 15th 2022
 * @requires ForceWebsite
 */
;function link(param){
this.pattern=/https?:\/\/[^\s\n"\\]+/ig;
this.init=function(plug){
  this.Force=plug.Force;
  var _link=this;
  if(ForceWebsite.query.hasOwnProperty('p')){
    ForceWebsite.onContentReady((r,i)=>{
      if(!r||!_link.pattern.test(r.innerHTML)){return;}
      var cd=_link.convert(r.innerHTML);
      r.innerHTML=cd;
    });
  }
};
this.convert=function(s){
  var _link=this,
  l=document.getElementsByClassName('locode-section');
  return s.replace(this.pattern,m=>{
    var h=false;
    for(var i of l){
      if(new RegExp(m,'i').test(i.innerHTML)){
        h=true;
        break;
      }
    }
    if(h){return m;}
    return ForceWebsite.buildElement('a',m,{
      href:m,
      target:'_blank',
      rel:'follow',
    }).outerHTML;
  });
};
};
