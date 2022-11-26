/**
 * social.js
 * ~ a Force plugin for sharing to social media
 * started at november 14th 2022
 * @requires ForceWebsite, sharer object v1.1.0, like object v2.1.0
 */
;function social(param){
this.init=function(plug){
  if(!ForceWebsite.query.hasOwnProperty('p')){
    return;
  }
  ForceWebsite.onContentReady(r=>{
    var pr=r.parentNode,
    shr=ForceWebsite.buildElement('div',null,{
      id:'sharer',
    }),
    lkr=ForceWebsite.buildElement('div',null,{
      'class':'like',
      id:'like',
    },[
      ForceWebsite.buildElement('span','Loading...',{
        'class':'like-loading'
      })
    ]),
    scl=ForceWebsite.buildElement('div',null,{
      'class':'social',
      id:'social',
    },[shr,lkr]);
    pr.insertBefore(scl,r);
    sharer.init();
    like.init(r.dataset.id);
  });
};
};
/* like object v2.1.0 */
;const like={
  version:'2.1.0',
  init:function(id){
    var _like=this,
    is_liked=localStorage.getItem('like-'+id)?true:false,
    likes=is_liked?1:0,
    el=document.getElementById('like');
    if(!el){return false;}
    ForceWebsite.fetch('like.get',r=>{
      likes=r;
      el.innerHTML='<div class="like'+(is_liked?' liked':'')+'" '
          +'title="Like'+(is_liked?'d':'')+' this post" '
          +'id="like-button" data-id="'+id+'">'
        +'<div class="like-image"></div>'
        +'<div class="like-label">Like'+(is_liked?'d':'')+'</div>'
        +'</div>'
        +'<div class="like-count" title="'+likes+'">'
        +'<div class="before"></div>'
        +'<div class="after">'+likes+'</div>'
        +'</div>';
      var dlike=document.getElementById('like-button');
      if(!dlike){return;}
      dlike.onclick=function(e){
        var id=this.dataset.id;
        if(localStorage.getItem('like-'+id)){return false;}
        return _like.likePost(id);
      };
    },{id:id});
  },
  likePost:function(id){
    var lf=document.getElementById('like-form');
    if(lf){lf.parentElement.removeChild(lf);}
    var lc=document.querySelector('div[class="like"]');
    if(lc){
      lc.classList.add('liked');
      lc.title='Liked';
    }
    var ll=document.querySelector('div[class="like-label"]');
    if(ll){
      ll.innerText='Liked';
    }
    var lco=document.querySelector('div[class="like-count"]');
    if(lco){
      var count=parseInt(lco.title,10);
      lco.title=count+1;
      lco.children[1].innerText=count+1;
    }
    ForceWebsite.fetch('like.put',function(r){
      if(typeof r==='string'&&r=='OK'){
        localStorage.setItem('like-'+id,'true');
        return true;
      }
      lco.title=count;
      lco.children[1].innerText=count;
      ll.innerText='Like';
      lc.title='Like';
      lc.classList.remove('liked');
    },{
      id:id,
    });
  },
};
/* sharer object v1.1.0 */
;const sharer={
  version:'1.1.0',
  init:function(){
    var PS=document.getElementById('sharer');
    if(!PS){return;}
    PS.title='Share this post';
    PS.innerHTML='<span class="sharer-image"></span>'
      +'<span class="sharer-label">Share</span>';
    var url=encodeURIComponent(document.location.href),
    title=encodeURIComponent(document.getElementsByTagName('title')[0].innerHTML),
    desc='',
    media=encodeURIComponent(document.location.protocol+'//'+document.location.host+'/files/images/luthfie-logo.png');
    PS.onclick=function(e){
      sharer.dialog(function(d){
        d.innerHTML='<div class="sharer-header">Share to</div>';
        d.innerHTML+='<a href="javascript:sharer.open(\'facebook\')" title="Share to Facebook">'
          +'<div class="sharer-each sharer-facebook">Facebook</div></a>';
        d.innerHTML+='<a href="javascript:sharer.open(\'twitter\')" title="Share to Twitter">'
          +'<div class="sharer-each sharer-twitter">Twitter</div></a>';
        d.innerHTML+='<a href="javascript:sharer.open(\'whatsapp\')" title="Share to Whatsapp">'
          +'<div class="sharer-each sharer-whatsapp">Whatsapp</div></a>';
        d.innerHTML+='<a href="javascript:sharer.open(\'linkedin\')" title="Share to LinkedIn">'
          +'<div class="sharer-each sharer-linkedin">LinkedIn</div></a>';
        d.innerHTML+='<a href="javascript:sharer.open(\'pinterest\')" title="Share to Pinterest">'
          +'<div class="sharer-each sharer-pinterest">Pinterest</div></a>';
        d.innerHTML+='<a href="javascript:sharer.open(\'tumblr\')" title="Share to Tumblr">'
          +'<div class="sharer-each sharer-tumblr">Tumblr</div></a>';
        /* Google+ is too old *
        d.innerHTML+='<a href="javascript:sharer.open(\'gplus\')" title="Share to Google+">'
          +'<div class="sharer-each sharer-gplus">Google+</div></a>';
        //*/
      });
    };
  },
  open:function(l){
    var url=encodeURIComponent(document.location.href),
    title=encodeURIComponent(document.getElementsByTagName('title')[0].innerHTML),
    desc=encodeURIComponent(document.querySelector('meta[name="description"]').content),
    media=encodeURIComponent(document.location.protocol+'//'+document.location.host+'/files/images/luthfie-logo.png'),
    link={
      whatsapp:!window.hasOwnProperty('ontouchstart')
        ?'https://api.whatsapp.com/send?text='+title+'%20~%20'+url
        :'whatsapp://send?text='+title+'%20~%20'+url,
      facebook:'http://www.facebook.com/share.php?v=4&u='+url+'&t='+title,
      twitter:'http://twitter.com/share?text='+title+'&url='+url+'&via=',
      gplus:'https://plus.google.com/share?url='+url,
      linkedin:'http://www.linkedin.com/shareArticle?mini=true&url='+url+'&title='+title+'&summary='+desc,
      pinterest:'http://pinterest.com/pin/create/button/?url='+url+'&media='+media+'&description='+title,
      tumblr:'http://tumblr.com/widgets/share/tool?canonicalUrl='+url+'&title='+title+'&caption='+desc,
    };
    sharer.dialog_close();
    if(link[l]){
      window.open(link[l],'_blank');
    }
  },
  dialog:function(c){
    var r=document.getElementById('sharer-dialog');
    if(r){r.parentElement.removeChild(r);}
    var d=document.createElement('div');
    d.id="sharer-dialog";
    d.innerHTML='<div id="sharer-bg"></div><div id="sharer-content"></div>';
    document.body.appendChild(d);
    var bg=document.getElementById('sharer-bg');
    if(bg){
      bg.onclick=function(e){sharer.dialog_close();};
      bg.oncontextmenu=function(e){sharer.dialog_close();};
    }
    var r=document.getElementById('sharer-content');
    if(c){c(r);}
  },
  dialog_close:function(){
    var r=document.getElementById('sharer-dialog');
    if(r){r.parentElement.removeChild(r);}
  }
};
