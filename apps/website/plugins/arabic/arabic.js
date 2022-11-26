/**
 * arabic.js
 * ~ a Force plugin for managing arabic content
 * started at november 15th 2022
 * @requires ForceWebsite
 */
;function arabic(param){
this.version='1.0.0';
this.pattern=/([\u0600-\u06ff]+)/g;
this.className=param;
this.init=function(plug){
  this.Force=plug.Force;
  var _arabic=this;
  if(ForceWebsite.query.hasOwnProperty('p')){
    ForceWebsite.onContentReady((r,i)=>{
      if(!r||!_arabic.pattern.test(r.innerHTML)){return;}
      var cd=_arabic.convert(r.innerHTML);
      r.innerHTML=cd;
    });
  }
};
this.convert=function(s){
  var _arabic=this,
  r=[],
  u=s.split(/\n/),
  l=document.getElementsByClassName('locode-section');
  for(var n of u){
    var m=n.match(this.pattern);
    if(!m){
      r.push(n+'\n');
      continue;
    }
    var h=false;
    for(var i of l){
      if(new RegExp(m[0],'i').test(i.innerHTML)){
        h=true;
        break;
      }
    }
    if(h){
      r.push(n+'\n');
      continue;
    }
    if(m.join(' ').length/n.length>0.5){
      var c=ForceWebsite.buildElement('div',n,{
        'class':_arabic.className,
      });
      r.push(c.outerHTML);
    }else{
      var c=n.replace(this.pattern,m=>{
        return ForceWebsite.buildElement('span',m,{
          'class':_arabic.className,
        }).outerHTML;
      });
      r.push(c+'\n');
    }
  }
  return r.join('');
};
};
