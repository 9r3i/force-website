/**
 * search.js
 * ~ a Force plugin for searching data
 * started at november 14th 2022
 * @requires ForceWebsite
 */
;function search(param){
this.holder=param.hasOwnProperty('holder')?param.holder:null;
this.key=param.hasOwnProperty('key')
  &&typeof param.key==='string'
  &&param.key.match(/^[a-z]+$/)
  ?param.key:'search';
this.init=function(plug){
  if(!ForceWebsite.query.hasOwnProperty(this.key)){
    return;
  }
  var sd=ForceWebsite.buildElement('div',null,{},[],this.content());
  ForceWebsite.body.insertBefore(sd,ForceWebsite.body.firstChild);
  ForceWebsite.setTitle('Search');
  this.start();
  if(ForceWebsite.query.search==''){
    return;
  }
  var posts=ForceWebsite.data,
  value=ForceWebsite.query.search,
  count=0;
  reg=new RegExp(value,'i');
  for(var i in posts){
    var p=posts[i],
    el=document.querySelector('[data-id="'+p.id+'"]');
    if(!el){continue;}
    if((p.hasOwnProperty('content')&&reg.test(p.content))
      ||reg.test(p.title)||reg.test(p.slug)){
      if(ForceWebsite.config.data.limit>count){
        el.classList.remove('bulk-hide');
      }count++;
    }else{
      el.parentNode.removeChild(el);
    }
  }
};
this.start=function(){
  var _this=this,
  sbutton=document.querySelector('[data-search="submit"]'),
  sinput=document.querySelector('input[data-search="keyword"]');
  if(!sinput){return false;}
  sinput.key=this.key;
  sinput.onkeyup=function(e){
    _this.suggestion(this.value);
    if(e.keyCode!==13||!this.value){return false;}
    return ForceWebsite.go('?'+this.key+'='+this.value);
  };
  if(sbutton){
    sbutton.key=this.key;
    sbutton.onclick=function(e){
      if(!sinput.value){return false;}
      return ForceWebsite.go('?'+this.key+'='+sinput.value);
    };
  }
};
this.suggestion=function(value){
  var posts=ForceWebsite.data,
  reg=new RegExp(value,'i'),
  el=document.querySelector('[data-search="suggestion"]');
  if(typeof value!=='string'||!el){
    return false;
  }
  ForceWebsite.clearElement(el);
  if(value==''||!value){
    return false;
  }
  for(var i in posts){
    var p=posts[i];
    if((p.hasOwnProperty('content')&&reg.test(p.content))
      ||reg.test(p.title)||reg.test(p.slug)){
      var nel=document.createElement('div');
      var an=document.createElement('a');
      nel.classList.add('search-suggestion-row');
      nel.innerText=p.title;
      an.title=p.title;
      an.href='?p='+p.slug;
      an.onclick=ForceWebsite.anchorExec;
      an.appendChild(nel);
      el.appendChild(an);
    }
  }return true;
};
this.content=function(){
  var holder=this.hasOwnProperty('holder')
    &&typeof this.holder==='string'?this.holder:'Search...';
  return '<div class="search-wrap">'
    +'<div class="search-form">'
    +'<div class="search-form-column-input">'
    +'<input class="search-form-input" data-search="keyword" '
      +'placeholder="'+holder+'" value="" />'
    +'</div>'
    +'<div class="search-form-column-button">'
    +'<div class="search-button" data-search="submit"></div>'
    +'</div>'
    +'<div class="search-suggestion" data-search="suggestion"></div>'
    +'</div>'
    +'</div>';
};
}
