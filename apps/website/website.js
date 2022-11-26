/**
 * website.js
 * ~ app for Force Foxtrot
 * authored by 9r3i
 * https://github.com/9r3i
 * started at november 13th 2022
 * @requires: Force
 */
;function website(app){
const ForceObject=app.Force;
this.root=app.root+'/website/';
this.config=null;
this.main=null;
this.body=null;
this.foot='';
this.query={};
this.data=null;
this.plug=null;
this.plugLoaded=0;
window.ForceWebsite=this;
/* init -- the requirement of Force app */
this.init=async function(){
  /* config */
  this.config=await ForceObject.get('config.json');
  ForceObject.host=this.config.host;
  /* cloned methods */
  this.buildElement=ForceObject.buildElement;
  this.clearElement=ForceObject.clearElement;
  this.parseQuery=ForceObject.parseQuery;
  /* load file website.css */
  ForceObject.loadStyleFile(this.root+'css/website.css');
  ForceObject.loadStyleFile(this.root+'css/abu.ayyub.css');
  /* load theme files */
  for(var theme of this.config.themes){
    ForceObject.loadStyleFile(this.root
      +'themes/'+theme+'/'+theme+'.css');
  }
  /* create main content */
  var mainbg=this.buildElement('div',null,{
    'class':'main-bg',
  }),
  mainbc=this.buildElement('div',null,{
    'class':'main-bc',
  });
  this.main=this.buildElement('div',null,{
    'class':'main',
  });
  mainbg.appendTo(document.body);
  mainbc.appendTo(document.body);
  this.main.appendTo(document.body);
  /* prepare Force's plugins */
  this.plug=await ForceObject.plugin
    .register(this.config.plugins)
    .prepare(this.root+'plugins',e=>{
      var loaded=Math.floor(e.loaded/e.total*100);
      if(ForceWebsite.config.coverLoader){
        ForceObject.loader(
          e.total==e.loaded?false:loaded+'% Loading...',
          'Please wait! While we load plugins.\n'
            +'Loaded: '+e.loaded+' of '+e.total+' plugins.',
          e.loaded,e.total);
      }else{
        var plugLoaded=ForceWebsite.plugLoaded||0;
        ForceWebsite.slideHeadLoader(plugLoaded,loaded);
      }
    });
  /* load theme files (second) */
  for(var theme of this.config.themes){
    ForceObject.loadStyleFile(this.root
      +'themes/'+theme+'/'+theme+'.css');
  }
  /* header, body and footer */
  var header=this.buildElement('div',null,{
    'class':'header',
    'id':'header',
    'data-name':this.config.site.name,
  }),
  year=(new Date).getFullYear(),
  footer=this.buildElement('div',null,{
    'class':'footer',
    'data-footer':'Copyright \u00a9 '+year+', '
      +this.config.site.name+'.',
  }),
  innerFootContent='Loading...',
  footContentInner=this.buildElement('div',innerFootContent,{
    'class':'foot-content-inner',
    'id':'foot-content-inner',
  }),
  footContent=this.buildElement('div',null,{
    'class':'foot-content'
  },[footContentInner]),
  body=this.buildElement('div',null,{
    'class':'body',
  });
  this.body=this.buildElement('div',null,{
    'class':'body-content',
  });
  header.appendTo(this.main);
  body.appendTo(this.main);
  footContent.appendTo(this.main);
  footer.appendTo(this.main);
  this.body.appendTo(body);
  /* foot content */
  this.fetch('website.foot',function(r){
    ForceWebsite.setFootContent(r.toString());
    ForceWebsite.foot=r.toString();
  });
  /* popstate */
  window.onpopstate=function(e){
    return ForceWebsite.loadPage(e);
  };
  /* load page */
  this.loadPage();
};
/* load page */
this.loadPage=function(e){
  /* query object of location.search string */
  this.query=this.parseQuery(location.search.substr(1));
  /* clear main element */
  this.clearElement(this.body);
  /* check request */
  if(this.query.hasOwnProperty('p')){
    var pagedown=this.buildElement('div',null,{
      'class':'page-down',
    },[
      this.buildElement('a','Back to Home',{
        'href':'?home',
      }),
    ]);
    /* cache data */
    if(this.data&&this.data.hasOwnProperty(this.query.p)){
      var d=this.data[this.query.p]
      var page=this.pageContent(d);
      page.appendTo(this.body);
      pagedown.appendTo(this.body);
      this.setTitle(d.title);
      return this.anchorInit();
    }
    /* fetch data */
    this.fetch('website.select',function(r){
      var notFound={
        id:0,
        title:'Error: Page is not found',
        slug:ForceWebsite.query.p,
        time:'2022-11-16 05:35:45',
        content:'Error: Page is not found.\n\n'
          +'We were sorry for that. Maybe the link is expired.\n'
          +'Please, try again with another link.\n',
      },
      obj=Array.isArray(r)&&r.length>0?r[0]:notFound;
      var page=ForceWebsite.pageContent(obj);
      page.appendTo(ForceWebsite.body);
      pagedown.appendTo(ForceWebsite.body);
      ForceWebsite.setTitle(obj.title);
      return ForceWebsite.anchorInit();
    },{
      key:'slug',
      slug:this.query.p,
    });
    return;
  }else if(this.hasOwnProperty('kitchenSet')&&this.kitchenSet()){
    /* kitchen set is the premium set */
    return this.kitchenSet(true);
  }
  /* all data -- using cache */
  if(this.data){
    var bulk=this.bulkContent(this.data);
    bulk.appendTo(this.body);
    this.setTitle(ForceWebsite.config.site.description);
    return this.anchorInit();
  }
  /* get all data -- without content */
  this.fetch('website.all',function(r){
    if(!Array.isArray(r)){
      ForceObject.splash('Error: Failed to fetch data.');
      return;
    }
    ForceWebsite.data={};
    var i=r.length;
    while(i--){
      var p=r[i];
      ForceWebsite.data[p.slug]=p;
    }
    var bulk=ForceWebsite.bulkContent(ForceWebsite.data);
    bulk.appendTo(ForceWebsite.body);
    ForceWebsite.setTitle(ForceWebsite.config.site.description);
    return ForceWebsite.anchorInit();
  });
};
/* bulk content */
this.bulkContent=function(d){
  var bulk=this.buildElement('div',null,{
    'class':'bulk',
  }),
  rowCount=0,tmpCount=0;
  for(var i in d){
    rowCount++;
    var p=d[i],
    img=new Image,
    beslug=this.buildElement('a',p.title,{
      href:'?p='+p.slug,
    }),
    bepicture=this.buildElement('div',null,{
      'class':'bulk-each-picture',
      'id':'picture-'+p.slug,
    }),
    betitle=this.buildElement('div',null,{
      'class':'bulk-each-title',
    },[beslug]),
    betime=this.buildElement('div',p.time,{
      'class':'bulk-each-time',
    }),
    be=this.buildElement('div',null,{
      'class':'bulk-each',
      'id':'bulk-each-'+rowCount,
      'data-id':p.id,
      'data-slug':p.slug,
    },[
      betitle,betime,bepicture,
    ]);
    be.appendTo(bulk);
    if(rowCount>this.config.data.limit){
      be.classList.add('bulk-hide');
      tmpCount++;
    }
    /* image */
    img.src=this.config.host+this.config.data.path
      +"/images/"+p.id+".jpg";
    img.dataset.slug=p.slug;
    img.onload=function(e){
      var bepid='picture-'+this.dataset.slug;
      bep=document.getElementById(bepid);
      if(bep){
        bep.style.backgroundImage="url('"+this.src+"')";
      }
    };
  }
  if(rowCount<=this.config.data.limit){
    return bulk;
  }
  /* load more data */
  var but=this.buildElement('button','More',{
    'class':'bulk-button',
    'data-count':this.config.data.limit+'',
    'data-total':rowCount+'',
  }),
  be=this.buildElement('div',null,{
    'class':'bulk-each-down',
  },[but]);
  be.appendTo(bulk);
  but.onclick=function(e){
    var rowCount=parseInt(this.dataset.count),
    rowTotal=parseInt(this.dataset.total),
    rowLimit=ForceWebsite.config.data.limit+rowCount;
    for(var i=0;i<ForceWebsite.config.data.limit;i++){
      rowCount++;
      var be=document.getElementById('bulk-each-'+rowCount);
      if(be){
        be.classList.remove('bulk-hide');
      }
    }
    if(rowCount>=rowTotal){
      var tp=this.parentElement;
      tp.parentElement.removeChild(tp);
      return;
    }
    this.dataset.count=rowCount+'';
  };
  return bulk;
};
/* page content */
this.pageContent=function(p){
  var ptitle=this.buildElement('div',p.title,{
    'class':'page-title',
    'id':'title',
  }),
  ploader=this.buildElement('div',null,{
    'class':'page-content-loader',
  },[
    this.buildElement('img',null,{
      'src':this.root+'css/images/default.loader.gif',
    }),
    document.createTextNode('Loading...'),
  ]),
  img=new Image,
  ppicture=this.buildElement('div',null,{
    'class':'page-picture',
    'id':'page-picture-'+p.slug,
  }),
  pcontent=this.buildElement('div',null,{
    'class':'page-content',
    'id':'content',
    'data-id':p.id+'',
  },[ploader]),
  ptime=this.buildElement('div',p.time,{
    'class':'page-time'
  }),
  page=this.buildElement('div',null,{
    'class':'page',
  },[
    ptitle,ptime,ppicture,pcontent,
  ]);
  /* image */
  img.src=this.config.host+this.config.data.path
    +"/images/"+p.id+".jpg";
  img.dataset.slug=p.slug;
  img.onload=function(e){
    var ppid='page-picture-'+this.dataset.slug;
    pp=document.getElementById(ppid);
    if(pp){
      ForceWebsite.clearElement(pp);
      pp.appendChild(img);
    }
  };
  /* content */
  if(p.hasOwnProperty('content')){
    pcontent.innerHTML=p.content;
  }else{
    this.fetch('website.content',function(r){
      ForceWebsite.data[p.slug]['content']=r;
      pcontent.innerHTML=r;
    },{id:p.id});
  }
  return page;
};
/* set foot content */
this.setFootContent=function(text){
  var id='foot-content-inner',
  fci=document.getElementById(id);
  if(fci){
    fci.innerHTML=text;
    return true;
  }return false;
};
/* set the title */
this.setTitle=function(txt,asHTML){
  var titleTag=document.getElementsByTagName('title'),
  blogTitle=document.getElementById('title');
  if(blogTitle){
    if(asHTML){
      blogTitle.innerHTML=txt;
    }else{
      blogTitle.innerText=txt;
    }
  }
  var suffix=(asHTML?' &#x2015; ':' \u2015 ')
    +this.config.site.name;
  if(!titleTag||titleTag.length==0){
    titleTag.push(document.createElement('title'));
    document.head.appendChild(titleTag[0]);
  }
  var i=titleTag.length;
  while(i--){
    if(asHTML){
      titleTag[i].innerHTML=txt.replace(/<[^>]+>/g,'')+suffix;
    }else{
      titleTag[i].innerText=txt+suffix;
    }
  }return true;
};
/* initialize anchor elements */
this.anchorInit=function(){
  var ans=document.querySelectorAll('a:not([target="_blank"])');
  var i=ans.length;
  while(i--){
    ans[i].onclick=this.anchorExec;
  }
  this.main.scrollTo({
    top:0,
    left:0,
    behavior:'smooth'
  });
  return this.plug.init();
};
/* execute anchor element */
this.anchorExec=function(e){
  e.preventDefault();
  ForceObject.absorbEvent(e);
  ForceWebsite.go(this.href);
  return false;
};
/* go or redirect */
this.go=function(href){
  if(href==window.location.href){return false;}
  window.history.pushState({path:href},'',href);
  return this.loadPage();
};
/* fetch */
this.fetch=function(mt,cb,dt){
  cb=typeof cb==='function'?cb:function(){};
  dt=typeof dt==='object'&&dt!==null?dt:{};
  if(typeof mt!=='string'){return cb(false);}
  dt.database=this.config.data.base;
  ForceObject.fetch(mt,dt,{
    method:'GET',
    download:this.loadProgress,
    upload:this.loadProgress,
  }).then(cb);
};
/* on content ready */
this.onContentReady=function(cb,i){
  cb=typeof cb==='function'?cb:function(){};
  i=i?parseInt(i,10):0;
  var c=document.getElementById('content');
  if((c&&!/Loading\.{3}/.test(c.innerHTML))||i>500){
    return cb(c&&!/Loading\.{3}/.test(c.innerHTML)?c:false,i);
  }i++;
  setTimeout(e=>{
    ForceWebsite.onContentReady(cb,i);
  },10);
};
/* another theme toggle */
this.tryAnotherTheme=function(s){
  s=typeof s==='string'?s:'sabunjelly';
  var f=this.root+'themes/'+s+'/'+s+'.css',
  r=this.root+'themes/'+s+'/reset.css',
  tf=document.getElementById(f),
  tr=document.getElementById(r);
  if(tf){
    tf.parentNode.removeChild(tf);
    f=r;
  }
  if(tr){
    tr.parentNode.removeChild(tr);
  }
  ForceObject.loadStyleFile(f);
};
/* ============ loader / almost stand-alone ============ */
/* fake loader with promise */
this.fakeLoaderPromise=function(){
  var _this=this;
  return new Promise(resolve=>{
    _this.fakeLoader(e=>{
      resolve(e);
    });
  });
};
/* fake loader */
this.fakeLoader=function(cb,val){
  val=val?parseInt(val):0;
  cb=typeof cb==='function'?cb:function(){};
  if(this.config.coverLoader){
    ForceObject.loader(val+'% Loading...','Please wait!',val,100);
  }else{
    this.headLoader(val);
  }
  if(val>=100){
    if(this.config.coverLoader){
      ForceObject.loader(false);
    }else{
      this.headLoader(false);
    }
    return cb(true);
  }val++;
  var _this=this;
  setTimeout(e=>{
    _this.fakeLoader(cb,val);
  },20);
};
/* slide head loader */
this.slideHeadLoader=function(v,m,i){
  if(this.SLIDE_TIMEOUT){
    clearTimeout(this.SLIDE_TIMEOUT);
  }
  v=v?Math.max(parseInt(v,10),0):0;
  m=m?Math.min(parseInt(m,10),100):10;
  i=i?Math.max(parseInt(i,10),v):v;
  if(i>m){
    if(m==100){
      this.headLoader(false);
      this.plugLoaded=0;
    }return;
  }
  this.headLoader(i);
  this.plugLoaded=i;
  i++;
  this.SLIDE_TIMEOUT=setTimeout(e=>{
    ForceWebsite.slideHeadLoader(v,m,i);
  },30);
};
/* head loader */
this.headLoader=function(v){
  var id='head-loader',
  hl=document.getElementById(id),
  ht=document.getElementById(id+'-text'),
  hv=hl?hl.firstChild:null;
  if(v===false){
    if(hl){hl.parentNode.removeChild(hl);}
    if(ht){ht.parentNode.removeChild(ht);}
    return;
  }
  if(!hl){
    hl=document.createElement('div');
    hv=document.createElement('div');
    ht=document.createElement('div');
    hl.classList.add(id);
    ht.classList.add(id+'-text');
    ht.classList.add('blink');
    hl.id=id;
    ht.id=id+'-text';
    hv.classList.add(id+'-value');
    hl.appendChild(hv);
    document.body.appendChild(hl);
    document.body.appendChild(ht);
  }
  v=v?parseInt(v,10):0;
  hv.style.width=v+'%';
  ht.dataset.text=v+'% Processing...';
  return hl;
};
/* load progress */
this.loadProgress=function(e){
  if(true){return false;}
  var loaded=Math.floor(e.loaded/e.total*100),
  plugLoaded=ForceWebsite.plugLoaded||0;
  ForceWebsite.slideHeadLoader(plugLoaded,loaded);
  ForceWebsite.plugLoaded=loaded>=100?0:loaded;
};
/* ============ kitchen set ============ */
this.pkey=null;
this.kkey='?kitchen';
/* kitchen set */
this.kitchenSet=function(x){
  var kkey=this.kkey.substr(1);
  if(this.query.hasOwnProperty(kkey)){
    return x===true?this.kitchen(this.query[kkey]):true;
  }return false;
};
/* kitchen */
this.kitchen=async function(p){
  /* prepare privilege key */
  this.pkey=localStorage.getItem('website-pkey');
  /* set title */
  this.setTitle('Kitchen');
  this.main.scrollTo({
    top:0,
    left:0,
    behavior:'smooth'
  });
  /* check pkey */
  if(!this.pkey){
    var plogin=this.kitchenLoginPage();
    plogin.appendTo(this.body);
    return;
  }else if(p=='foot'){
    var uap=this.kitchenFootEditPage();
    uap.appendTo(this.body);
    return;
  }else if(p=='account'){
    var uap=this.kitchenUserAccountPage();
    uap.appendTo(this.body);
    return;
  }else if(p=='plug'){
    if(!this.query.hasOwnProperty('ns')){
      this.splash('Error: Require namespace.');
      return;
    }
    if(typeof window[this.query.ns]==='function'){
      var plug=new window[this.query.ns];
      if(plug.hasOwnProperty('kitchen')
        &&typeof plug.kitchen==='function'){
        var plug=new window[this.query.ns];
        return plug.kitchen(this.plug);
      }
    }
    this.splash('Error: Invalid plugin.');
    return;
  }else if(p=='upload'){
    if(!this.query.hasOwnProperty('id')){
      this.splash('Error: Require data ID.');
      return;
    }
    if(!this.query.hasOwnProperty('title')){
      this.splash('Error: Require data title.');
      return;
    }
    var upp=this.kitchenUploadPage(this.query.id,this.query.title);
    upp.appendTo(this.body);
    return;
  }else if(p=='new'){
    var ndp=this.kitchenNewDataPage();
    ndp.appendTo(this.body);
    return;
  }else if(p=='edit'){
    if(!this.query.hasOwnProperty('id')){
      this.splash('Error: Require data ID.');
      return;
    }
    this.fetch('website.select',function(r){
      if(Array.isArray(r)&&r.length>0){
        var edp=ForceWebsite.kitchenEditDataPage(r[0]);
        edp.appendTo(ForceWebsite.body);
        return;
      }
      ForceObject.splash('Error: Data is not found.');
    },{
      id:this.query.id,
    });
    return;
  }else if(p=='logout'){
    var cp=await ForceObject.confirm('Logout?');
    if(!cp){
      this.go(this.kkey+'=data');
      return;
    }
    this.pkey=null;
    localStorage.removeItem('website-pkey');
    this.go(this.kkey+'=login');
    return;
  }
  /* put new data button and logout button */
  var bnew=this.buildElement('button','New Data',{
    'class':'button button-soft-green',
  }),
  buse=this.buildElement('button','My Account',{
    'class':'button button-tosca',
  }),
  bout=this.buildElement('button','Logout',{
    'class':'button button-pink',
  }),
  brow=this.buildElement('div',null,{
    'class':'kitchen-row',
  },[bnew,buse,bout]),
  bfoot=this.buildElement('button','Foot Content',{
    'class':'button button-pink',
  }),
  bfooter=this.buildElement('div',null,{
    'class':'kitchen-row',
  },[bfoot]);
  brow.appendTo(this.body);
  bnew.onclick=function(e){
    return ForceWebsite.go(ForceWebsite.kkey+'=new');
  };
  buse.onclick=function(e){
    return ForceWebsite.go(ForceWebsite.kkey+'=account');
  };
  bout.onclick=function(e){
    return ForceWebsite.go(ForceWebsite.kkey+'=logout');
  };
  bfoot.onclick=function(e){
    return ForceWebsite.go(ForceWebsite.kkey+'=foot');
  };
  /* kitchen plugins */
  for(var ns of ForceObject.plugin.plug){
    if(typeof window[ns]==='function'){
      var param=ForceObject.plugin.param[ns],
      plug=new window[ns](param);
      if(plug.hasOwnProperty('kitchen')
        &&typeof plug.kitchen==='function'){
        bplug=this.buildElement('button',ns+'*',{
          'class':'button',
          'data-ns':ns,
        });
        bplug.onclick=function(e){
          return ForceWebsite.go(ForceWebsite.kkey
            +'=plug&ns='+this.dataset.ns);
        };
        bplug.appendTo(bfooter);
      }
    }
  }//*/
  /* get all data -- without content */
  this.fetch('website.all',function(r){
    if(!Array.isArray(r)){
      ForceObject.splash('Error: Failed to fetch data.');
      return;
    }
    var bulk=ForceWebsite.kitchenData(r);
    bulk.appendTo(ForceWebsite.body);
    bfooter.appendTo(ForceWebsite.body);
    /* final page element for anchors */
    return ForceWebsite.anchorInit();
  });
  /* final page element for anchors */
  return this.anchorInit();
};
/* kitchen data */
this.kitchenData=function(d){
  var bulk=this.buildElement('div',null,{
    'class':'kitchen-data',
  }),
  i=d.length;
  while(i--){
    var p=d[i],
    img=new Image,
    beslug=this.buildElement('a',p.title,{
      href:'?p='+p.slug,
    }),
    bepicture=this.buildElement('div',null,{
      'class':'kitchen-data-each-picture',
      'id':'picture-'+p.slug,
    }),
    betitle=this.buildElement('div',null,{
      'class':'kitchen-data-each-title',
    },[beslug]),
    betime=this.buildElement('div',p.time,{
      'class':'kitchen-data-each-time',
    }),
    bedit=this.buildElement('button','Edit',{
      'class':'button button-blue',
      'data-id':p.id+'',
    }),
    bedel=this.buildElement('button','Delete',{
      'class':'button button-red',
      'data-id':p.id+'',
    }),
    brow=this.buildElement('div',null,{
      'class':'kitchen-row-option',
    },[bedit,bedel]),
    be=this.buildElement('div',null,{
      'class':'kitchen-data-each',
      'id':'data-'+p.id,
    },[
      betitle,betime,bepicture,brow,
    ]);
    be.appendTo(bulk);
    /* image */
    img.src=this.config.host+this.config.data.path
      +"/images/"+p.id+".jpg";
    img.dataset.slug=p.slug;
    img.onload=function(e){
      var bepid='picture-'+this.dataset.slug;
      bep=document.getElementById(bepid);
      if(bep){
        bep.style.backgroundImage="url('"+this.src+"')";
      }
    };
    bedit.onclick=function(e){
      ForceWebsite.go(ForceWebsite.kkey+'=edit&id='+this.dataset.id);
    };
    bedel.onclick=async function(e){
      var cp=await ForceObject.confirm('Delete this data?'),
      bdel=this;
      if(!cp){return false;}
      this.disabled=true;
      this.innerText='Deleting...';
      ForceWebsite.request('website.dataDelete',function(r){
        if(typeof r==='string'&&r=='OK'){
          var bd=document.getElementById('data-'+bdel.dataset.id);
          if(bd){bd.parentElement.removeChild(bd);}
          ForceObject.splash('Deleted.');
          return;
        }
        bdel.disabled=false;
        bdel.innerText='Delete';
        ForceObject.splash(r);
      },{id:this.dataset.id});
    };
  }
  return bulk;
};
/* kitchen upload page */
this.kitchenUploadPage=function(id,title){
  var p='',
  img=new Image,
  ntitle=this.buildElement('input',null,{
    'class':'kitchen-input-title',
    'placeholder':'Title',
  }),
  nfake=this.buildElement('div',null,{
    'class':'kitchen-input-file-fake',
  }),
  nupload=this.buildElement('input',null,{
    'class':'kitchen-input-file',
    'placeholder':'Upload',
    'type':'file',
    'accept':'image/jpeg',
  }),
  nview=this.buildElement('div',null,{
    'class':'kitchen-input-file-preview',
  }),
  nsave=this.buildElement('button','Save',{
    'class':'button button-pink',
  }),
  ndel=this.buildElement('button','Delete',{
    'class':'button button-red',
  }),
  nback=this.buildElement('button','Back',{
    'class':'button button-blue',
  }),
  ndp=this.buildElement('div',null,{
    'class':'kitchen-data-form',
  },[
    ntitle,nfake,nupload,nview,nsave,ndel,nback,
  ]);
  ntitle.value=title;
  ntitle.disabled=true;
  img.onload=function(e){
    ForceWebsite.clearElement(nview);
    nview.appendChild(img);
  };
  img.src=this.config.host+this.config.data.path
    +'images/'+id+'.jpg?r='+Math.random();
  nback.onclick=function(e){
    ForceWebsite.go(ForceWebsite.kkey+'=edit&id='+id);
  };
  nupload.onchange=function(e){
    var file=this.files[0],
    fr=new FileReader,
    img=new Image;
    if(file.type!='image/jpeg'){
      ForceObject.splash('Error: File must be image/jpeg.');
      return;
    }
    if(file.size>Math.pow(1024,2)){
      ForceObject.splash('Error: File is too large.');
      return;
    }
    fr.onloadend=function(e){
      ForceWebsite.clearElement(nview);
      img.src=e.target.result;
      nview.appendChild(img);
      nview.dataset.src=e.target.result;
    };fr.readAsDataURL(file);
  };
  ndel.onclick=async function(e){
    var cp=await ForceObject.confirm('Delete this picture?');
    if(!cp){return;}
    nupload.disabled=true;
    nback.disabled=true;
    nsave.disabled=true;
    ndel.disabled=true;
    ndel.innerText='Deleting...';
    ForceWebsite.request('website.pictureDelete',function(r){
      if(typeof r==='string'&&r=='OK'){
        ForceWebsite.go(ForceWebsite.kkey+'=edit&id='+id);
        return;
      }
      nupload.disabled=false;
      nback.disabled=false;
      nsave.disabled=false;
      ndel.disabled=false;
      ndel.innerText='Delete';
      ForceObject.splash(r);
    },{
      id:id,
    });
  };
  nsave.onclick=function(e){
    if(!nview.dataset.src){
      ForceObject.splash('Error: File is not detected.');
      return;
    }
    nupload.disabled=true;
    nback.disabled=true;
    ndel.disabled=true;
    nsave.disabled=true;
    nsave.innerText='Saving...';
    ForceWebsite.request('website.pictureUpload',function(r){
      if(typeof r==='string'&&r=='OK'){
        ForceWebsite.go(ForceWebsite.kkey+'=edit&id='+id);
        return;
      }
      nupload.disabled=false;
      nback.disabled=false;
      ndel.disabled=false;
      nsave.disabled=false;
      nsave.innerText='Save';
      ForceObject.splash(r);
    },{
      id:id,
      data:nview.dataset.src,
    });
  };
  return ndp;
};
/* kitchen edit data page */
this.kitchenEditDataPage=function(d){
  var p='',
  ntitle=this.buildElement('input',null,{
    'class':'kitchen-input-title',
    'placeholder':'Title',
  }),
  ncontent=this.buildElement('textarea',null,{
    'class':'kitchen-input-content',
    'placeholder':'Content',
  }),
  nslug=this.buildElement('input',null,{
    'class':'kitchen-input-title',
    'placeholder':'Slug',
  }),
  ntime=this.buildElement('input',null,{
    'class':'kitchen-input-title',
    'placeholder':'Time',
  }),
  nsave=this.buildElement('button','Save',{
    'class':'button button-pink',
    'data-id':d.id+'',
  }),
  nback=this.buildElement('button','Back',{
    'class':'button button-blue',
  }),
  nupload=this.buildElement('button','Picture',{
    'class':'button button-tosca',
  }),
  ndp=this.buildElement('div',null,{
    'class':'kitchen-data-form',
  },[
    ntitle,ncontent,nslug,ntime,nsave,nback,nupload,
  ]);
  ntitle.value=d.title;
  ncontent.value=d.content;
  nslug.value=d.slug;
  ntime.value=d.time;
  nsave.onclick=function(e){
    ntitle.disabled=true;
    ncontent.disabled=true;
    nslug.disabled=true;
    ntime.disabled=true;
    nback.disabled=true;
    nupload.disabled=true;
    nsave.disabled=true;
    nsave.innerText='Saving...';
    ForceWebsite.request('website.dataEdit',function(r){
      ntitle.disabled=false;
      ncontent.disabled=false;
      nslug.disabled=false;
      ntime.disabled=false;
      nback.disabled=false;
      nupload.disabled=false;
      nsave.disabled=false;
      nsave.innerText='Save';
      if(typeof r==='string'&&r=='OK'){
        ForceObject.splash('Saved.');
        return;
      }ForceObject.splash(r);
    },{
      id:d.id,
      title:ntitle.value,
      content:ncontent.value,
      slug:nslug.value,
      time:ntime.value,
    });
  };
  nback.onclick=function(e){
    ForceWebsite.go(ForceWebsite.kkey+'=data');
  };
  nupload.onclick=function(e){
    ForceWebsite.go(ForceWebsite.kkey+'=upload&id='+d.id+'&title='
      +encodeURIComponent(d.title));
  };
  return ndp;
};
/* kitchen new data page */
this.kitchenNewDataPage=function(){
  var p='',
  ntitle=this.buildElement('input',null,{
    'class':'kitchen-input-title',
    'placeholder':'New Title',
  }),
  ncontent=this.buildElement('textarea',null,{
    'class':'kitchen-input-content',
    'placeholder':'New Content',
  }),
  nsave=this.buildElement('button','Save',{
    'class':'button button-pink',
  }),
  nback=this.buildElement('button','Back',{
    'class':'button button-blue',
  }),
  ndp=this.buildElement('div',null,{
    'class':'kitchen-data-form',
  },[
    ntitle,ncontent,nsave,nback,
  ]);
  nsave.onclick=function(e){
    ntitle.disabled=true;
    ncontent.disabled=true;
    nback.disabled=true;
    nsave.disabled=true;
    nsave.innerText='Saving...';
    ForceWebsite.request('website.dataNew',function(r){
      if(typeof r==='string'&&r=='OK'){
        ForceWebsite.go(ForceWebsite.kkey+'=data');
        return;
      }
      ntitle.disabled=false;
      ncontent.disabled=false;
      nback.disabled=false;
      nsave.disabled=false;
      nsave.innerText='Save';
      ForceObject.splash(r);
    },{
      title:ntitle.value,
      content:ncontent.value,
    });
  };
  nback.onclick=function(e){
    ForceWebsite.go(ForceWebsite.kkey+'=data');
  };
  return ndp;
};
/* kitchen user account page */
this.kitchenUserAccountPage=function(){
  var p='',
  uname=this.pkey.split('.')[0],
  nuname=this.buildElement('input',null,{
    'class':'kitchen-input-title',
    'placeholder':'Username',
  }),
  nopass=this.buildElement('input',null,{
    'class':'kitchen-input-title',
    'placeholder':'Old Password',
    'type':'password',
  }),
  nupass=this.buildElement('input',null,{
    'class':'kitchen-input-title',
    'placeholder':'New Password',
    'type':'password',
  }),
  nsave=this.buildElement('button','Save',{
    'class':'button button-pink',
  }),
  nback=this.buildElement('button','Back',{
    'class':'button button-blue',
  }),
  ndp=this.buildElement('div',null,{
    'class':'kitchen-data-form',
  },[
    nuname,nopass,nupass,nsave,nback,
  ]);
  nuname.value=uname;
  nuname.disabled=true;
  nsave.onclick=function(e){
    nopass.disabled=true;
    nupass.disabled=true;
    nback.disabled=true;
    nsave.disabled=true;
    nsave.innerText='Saving...';
    ForceWebsite.request('website.userEdit',function(r){
      nopass.disabled=false;
      nupass.disabled=false;
      nback.disabled=false;
      nsave.disabled=false;
      nsave.innerText='Save';
      if(typeof r==='string'&&r=='OK'){
        ForceObject.splash('Saved.');
        return;
      }ForceObject.splash(r);
    },{
      uname:nuname.value,
      opass:nopass.value,
      upass:nupass.value,
    });
  };
  nback.onclick=function(e){
    ForceWebsite.go(ForceWebsite.kkey+'=data');
  };
  return ndp;
};
/* kitchen login page */
this.kitchenLoginPage=function(){
  var p='',
  uname=this.buildElement('input',null,{
    'class':'kitchen-login-input',
    'placeholder':'Username',
  }),
  upass=this.buildElement('input',null,{
    'class':'kitchen-login-input',
    'placeholder':'Password',
    'type':'password',
  }),
  submit=this.buildElement('button','Submit',{
    'class':'button button-pink',
  }),
  head=this.buildElement('div',null,{
    'class':'kitchen-login-head',
    'data-head':'Login',
  }),
  foot=this.buildElement('div',null,{
    'class':'kitchen-login-foot',
    'data-foot':'Powered by 9r3i',
  }),
  body=this.buildElement('div',null,{
    'class':'kitchen-login-body',
  },[
    uname,upass,submit,
  ]),
  login=this.buildElement('div',null,{
    'class':'kitchen-login',
  },[
    head,body,foot,
  ]);
  submit.onclick=function(e){
    uname.disabled=true;
    upass.disabled=true;
    submit.disabled=true;
    submit.innerText='Submitting...';
    if(login.classList.contains('kitchen-login-shake')){
      login.classList.remove('kitchen-login-shake');
    }
    ForceWebsite.request('website.login',function(r){
      if(typeof r==='object'&&r!==null
        &&r.hasOwnProperty('pkey')){
        localStorage.setItem('website-pkey',r.pkey);
        ForceWebsite.go(ForceWebsite.kkey+'=data');
        return;
      }
      uname.disabled=false;
      upass.disabled=false;
      submit.disabled=false;
      submit.innerText='Submit';
      login.classList.add('kitchen-login-shake');
      ForceObject.splash(r);
    },{
      uname:uname.value,
      upass:upass.value,
    });
  };
  return login;
};
/* kitchen foot edit page */
this.kitchenFootEditPage=function(){
  var p='',
  ntitle=this.buildElement('input',null,{
    'class':'kitchen-input-title',
    'value':'Foot Content',
  }),
  ncontent=this.buildElement('textarea',null,{
    'class':'kitchen-input-content',
    'placeholder':'Foot Content',
  }),
  nsave=this.buildElement('button','Save',{
    'class':'button button-pink',
  }),
  nback=this.buildElement('button','Back',{
    'class':'button button-blue',
  }),
  ndp=this.buildElement('div',null,{
    'class':'kitchen-data-form',
  },[
    ntitle,ncontent,nsave,nback,
  ]);
  ntitle.disabled=true;
  ncontent.value=this.foot;
  nsave.onclick=function(e){
    ncontent.disabled=true;
    nback.disabled=true;
    nsave.disabled=true;
    nsave.innerText='Saving...';
    ForceWebsite.request('website.footEdit',function(r){
      ncontent.disabled=false;
      nback.disabled=false;
      nsave.disabled=false;
      nsave.innerText='Save';
      if(typeof r==='string'&&r=='OK'){
        ForceObject.splash('Saved.');
        ForceWebsite.foot=ncontent.value;
        ForceWebsite.setFootContent(ncontent.value);
        return;
      }
      ForceObject.splash(r);
    },{
      foot:ncontent.value,
    });
  };
  nback.onclick=function(e){
    ForceWebsite.go(ForceWebsite.kkey+'=data');
  };
  return ndp;
};
/* request
 * @parameters:
 *   mt = string of method
 *   cb = function of callback
 *   dt = object of data
 * @return all to callback
 */
this.request=function(mt,cb,dt){
  cb=typeof cb==='function'?cb:function(){};
  dt=typeof dt==='object'&&dt!==null?dt:{};
  if(typeof mt!=='string'){return cb(false);}
  dt.database=this.config.data.base;
  dt.method=mt;
  dt.token=(Math.floor((new Date).getTime()/0x3e8)+(0x5*0x3c))
    .toString(0x24);
  if(this.pkey){dt.pkey=this.pkey;}
  ForceObject.fetch(mt,dt,{
    method:'POST',
    upload:this.loadProgress,
    download:this.loadProgress,
  }).then(cb);
};
};
