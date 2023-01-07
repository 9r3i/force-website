/**
 * website.js
 * ~ app for Force Foxtrot
 * authored by 9r3i
 * https://github.com/9r3i
 * started at november 13th 2022
 * continued at december 1st 2022 to december 13th 2022 (2.0.0)
 * continued at december 17th 2022 (2.1.0)
 * continued at december 20th 2022 (2.2.0)
 * @requires: Force
 * @output: global ForceWebsite object
 */
;function website(app){
const ForceObject=app.Force;
Object.defineProperty(this,'Force',{
  value:app.Force,
  writable:false,
});
Object.defineProperty(this,'version',{
  value:'2.2.1',
  writable:false,
});
this.root=app.root+'/website/';
this.config=app.config;
this.app=app;
this.theme=null;
this.query={};
this.data=null;
this.bulkRaw=[];
this.plug=null;
this.plugLoaded=0;
this.pkey=null;
this.kkey=null;
this.kitchen=null;
Object.defineProperty(window,'ForceWebsite',{
  value:this,
  writable:false,
});
/* init -- the requirement of Force app */
this.init=async function(){
  /* config check */
  if(!this.config.hasOwnProperty('data')
    ||!this.config.data.hasOwnProperty('host')
    ||!this.config.data.hasOwnProperty('base')){
    var cfile=typeof this.config==='string'
      ?this.config:'website.config.json',
    cdata=await ForceObject.get(cfile);
    this.config=cdata;
  }
  /* config host */
  ForceObject.host=this.config.data.host;
  /* cloned methods from ForceObject */
  this.buildElement=ForceObject.buildElement;
  this.clearElement=ForceObject.clearElement;
  this.parseQuery=ForceObject.parseQuery;
  /* load website.css for head-loader style */
  var webStyle=await this.getFileContent(this.root+'website.css');
  ForceObject.loadStyle(webStyle,'website.css');
  /* fetch config */
  await this.fetchConfig();
  /* prepare kitchen theme */
  this.kkey='?'+this.config.kitchen.key;
  this.kitchen=this.themePrepare(
      this.config.kitchen.namespace,
      this.config.kitchen.host,
      true,
      this.config.kitchen.hasOwnProperty('config')
        ?this.config.kitchen.config:{}
    );
  await this.kitchen.init();
  /* prepare main theme */
  this.theme=this.themePrepare(
      this.config.theme.namespace,
      this.config.theme.host,
      false,
      this.config.theme.hasOwnProperty('config')
        ?this.config.theme.config:{}
    );
  await this.theme.init();
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
  /* set meta tags */
  this.setMeta('description',this.config.site.description);
  this.setMeta('keywords',this.config.site.keywords);
  this.setMeta('robots',this.config.site.robots);
  this.setMeta('author','9r3i');
  this.setMeta('author-uri','https://github.com/9r3i');
  this.setMeta('generator','9r3i\\Force\\Website');
  this.setMeta('generator-uri','https://github.com/9r3i/force-website');
  this.setMeta('generator-version',this.version);
  /* popstate */
  window.onpopstate=function(e){
    return ForceWebsite.loadPage(e);
  };
  /* load page */
  return await this.loadPage();
};
/* load page */
this.loadPage=async function(e){
  /* query object of location.search string */
  this.query=this.parseQuery(location.search.substr(1));
  /* check for theme style and kitchen style element */
  var themeCSS=document.getElementById(this.theme.css),
  kitchenCSS=document.getElementById(this.kitchen.css);
  /* ----- check for kitchen set ----- */
  if(this.hasOwnProperty('kitchenSet')&&this.kitchenSet()){
    /* check for theme style element */
    if(themeCSS){
      /* clear theme style */
      themeCSS.parentNode.removeChild(themeCSS);
    }
    /* kitchen set is the premium set */
    return this.kitchenSet(true);
  }
  /* check for kitchen style element and clear kitchen style */
  if(kitchenCSS){
    kitchenCSS.parentNode.removeChild(kitchenCSS);
  }
  /* ----- request page ----- */
  if(this.query.hasOwnProperty('p')){
    /* cache data */
    if(this.data&&this.data.hasOwnProperty(this.query.p)
      &&this.data[this.query.p].hasOwnProperty('content')){
      this.setTitle(this.data[this.query.p].title);
      this.theme.load(this.data[this.query.p]);
      return;
    }
    /* fetch data */
    this.fetch('website.select',function(r){
      if(!Array.isArray(r)||r.length<1){
        return window.location.href='/not-found';
      }
      if(ForceWebsite.data){
        ForceWebsite.data[ForceWebsite.query.p]=r[0];
      }
      ForceWebsite.setTitle(r[0].title);
      ForceWebsite.theme.load(r[0]);
    },{
      key:'slug',
      slug:this.query.p,
    });
    return;
  }
  /* all data -- using cache */
  if(!this.data){
    /* fetch all data */
    await this.fetchAllData();
  }
  this.setTitle(this.config.site.description);
  this.theme.load(this.data);
  return;
};
/* fetch config -- [site.data] only */
this.fetchConfig=async function(){
  var r=await ForceObject.fetch('config.fetch',{
    database:this.config.data.base,
  },{
    method:'GET',
  });
  if(typeof r!=='object'
    ||r===null
    ||Array.isArray(r)){
    ForceObject.splash('Error: Failed to fetch config.');
    r={};
  }
  if(!this.config.hasOwnProperty('site')){
    this.config.site={
      name:'Site Name',
      description:'Site Description',
      keywords:'Site Keywords',
      robots:'Site Robots',
      date:{
        year:'2022',
        full:'2022-11-13 05:23:36',
      },
      data:{},
    };
  }
  this.config.site.data=r;
  return r;
};
/* fetch all data */
this.fetchAllData=async function(){
  var r=await ForceObject.fetch('website.all',{
    database:this.config.data.base,
  },{
    method:'GET',
    download:this.loadProgress,
    upload:this.loadProgress,
  });
  if(!Array.isArray(r)){
    ForceObject.splash('Error: Failed to fetch data.');
    r=[];
  }
  this.bulkRaw=r;
  this.data={};
  var i=r.length;
  while(i--){
    this.data[r[i].slug]=r[i];
  }
  return r;
};
/* prepare theme */
this.themePrepare=function(themeNS,themeHost,isKitchen,config){
  var themeRoot=/^https?:/.test(themeHost)
    ?themeHost+(!themeHost.match(/\/$/)?'/':'')
    :this.root+themeHost+(!themeHost.match(/\/$/)?'/':''),
  themePath=themeRoot+themeNS+'/',
  themeLogin=themePath+themeNS+'.login.html',
  themeHTML=themePath+themeNS+'.html',
  themeJS=themePath+themeNS+'.js',
  themeCSS=themePath+themeNS+'.css';
  return {
    namespace:themeNS,
    host:themeHost,
    root:themeRoot,
    path:themePath,
    login:themeLogin,
    html:themeHTML,
    css:themeCSS,
    js:themeJS,
    isKitchen:isKitchen,
    config:config,
    clogin:null,
    content:null,
    web:this,
    data:this.config,
    loadScriptFile:ForceObject.loadScriptFile,
    loadStyleFile:ForceObject.loadStyleFile,
    loadScript:ForceObject.loadScript,
    loadStyle:ForceObject.loadStyle,
    getContent:ForceObject.get,
    /* ForceWebsite.theme as return -- ONCE -- NOT helper */
    init:async function(){
      var script=await this.web.getFileContent(this.js);
      ForceObject.loadScript(script,this.js);
      this.content=await this.web.getFileContent(this.html);
      if(this.isKitchen){
        this.clogin=await this.web.getFileContent(this.login);
      }
      return this;
    },
    /* load theme components -- ONCE -- NOT helper */
    load:function(more){
      /* prepare data */
      this.data.themeRoot=this.root;
      this.data.themePath=this.path;
      this.data.theme={
        root:this.root,
        path:this.path,
        namespace:this.namespace,
      };
      this.data.query=this.web.query;
      this.data.bulkRaw=this.web.bulkRaw;
      this.data.bulk=this.web.bulk;
      this.data.post={};
      this.data.more=more;
      if(this.web.query.hasOwnProperty('p')
        ||this.web.query.hasOwnProperty(this.web.kkey.substr(1))){
        this.data.post=more;
      }
      /* check loaded script */
      var eljs=document.getElementById(this.js);
      if(!eljs){
        ForceObject.loadScriptFile(this.js);
      }
      /* check loaded style */
      var elcss=document.getElementById(this.css);
      if(!elcss){
        ForceObject.loadStyleFile(this.css);
      }
      /* new theme style, js only */
      if(window.hasOwnProperty(this.namespace)
        &&typeof window[this.namespace]==='object'
        &&window[this.namespace]!==null
        &&window[this.namespace].hasOwnProperty('init')
        &&typeof window[this.namespace].init==='function'){
        window[this.namespace].init(this);
      }
    },
    /* put html into body -- helper to load html file */
    putHTML:function(html){
      document.body.innerHTML=
        this.web.fillPageData(html,this.data);
      this.web.finishing();
    },
    /* load html -- helper to load html file */
    loadHTML:async function(file,cb){
      cb=typeof cb==='function'?cb:function(r){
        _this.putHTML(r);
      };
      var r=await this.web.getFileContent(this.path+file),
      res=this.web.fillPageData(r,this.data);
      return cb(res);
    },
    /* load files -- js and css -- helper */
    loadFiles:function(files,save,i){
      i=i?parseInt(i,10):0;
      if(!Array.isArray(files)
        ||!files.hasOwnProperty(i)){
        return;
      }
      var file=this.path+files[i],
      _this=this,
      el=document.getElementById(file);
      if(!el){
        this.loadFile(file,save);
      }
      setTimeout(e=>{
  	    return _this.loadFiles(files,save,i+1);
      },10);
    },
    /* load a file (NO PATH) -- js and css -- helper */
    loadFile:function(file,save){
      if(typeof file!=='string'){
        return;
      }
      var _this=this,
      el=document.getElementById(file);
      if(el){return;}
      if(file.match(/\.js$/i)){
        if(save){
          ForceWebsite.loadFile(file,r=>{
            _this.loadScript(r);
          });
        }else{
          this.loadScriptFile(file);
        }
      }else if(file.match(/\.css$/i)){
        if(save){
          ForceWebsite.loadFile(file,r=>{
            _this.loadStyle(r);
          });
        }else{
          this.loadStyleFile(file);
        }
      }
    },
  };
};
/* finishing */
this.finishing=function(){
  /* initialize all plugins */
  this.plug.init();
  /* scroll to top */
  document.body.scroll({
    top:0,
    left:0,
    behavior:'smooth'
  });
  /* initialize all anchors */
  setTimeout(e=>{
    this.anchorInit();
  },300);
};
/* ============ main methods ============ */
/* set title */
this.setTitle=function(txt,asHTML){
  var webTitle=document.querySelector('title'),
  webPostTitle=document.getElementById('title');
  if(webPostTitle){
    if(asHTML){
      webPostTitle.innerHTML=txt.replace(/</g,'&lt;');
    }else{
      webPostTitle.innerText=txt;
    }
  }
  var suffix=(asHTML?' &#x2015; ':' \u2015 ')
    +this.config.site.name;
  if(!webTitle){
    webTitle=document.createElement('title');
    document.head.appendChild(webTitle);
  }
  if(asHTML){
    webTitle.innerHTML=txt.replace(/</g,'&lt;')+suffix;
  }else{
    webTitle.innerText=txt+suffix;
  }return true;
};
/* set meta tag */
this.setMeta=function(name,content,key){
  key=typeof key==='string'?key:'name';
  var tag=document.querySelector('meta['+key+'="'+name+'"]');
  if(!tag){
    tag=document.createElement('meta');
    tag.setAttribute(key,name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content',content);
  return true;
};
/* fill page data */
this.fillPageData=function(content,data){
  if(typeof content!=='string'){return content;}
  data=typeof data==='object'&&data!==null?data:{};
  return content.replace(/{{[a-z0-9\._]+}}(\([^\)]*\))?/ig,m=>{
    var o=m.split('{{')[1].split('}}'),
        k=m.match(/\([^\)]*\)$/)
          ?m.match(/\(([^\)]*)\)$/)[1].split(','):[],
        j=[],
        n=o[0],
        r=ForceWebsite.findDataSpace(n,data);
    if(r==n){return m;}
    if(typeof r!=='function'||!m.match(/\(.*\)$/)){
      return r;
    }
    for(var i of k){
      var h=ForceWebsite.findDataSpace(i,data,true);
      j.push(h);
    }
    return ForceWebsite.call(r,j);
  });
};
/* find data space */
this.findDataSpace=function(n,data,ao){
  if(typeof n!=='string'||!n.match(/[a-z0-9\._]+/i)){
    return n;
  }
  data=typeof data==='object'&&data!==null?data:{};
  ao=typeof ao==='boolean'?ao:false;
  var o=ao?'boolean':'object',
      s=n.toString().split('.'),
      h=false,
      r=false,
      t=false,
      u=false;
  for(var i=0;i<s.length;i++){
    if(typeof r==='object'&&r.hasOwnProperty(s[i])){
      r=r[s[i]];
    }else if(typeof t==='object'&&t.hasOwnProperty(s[i])){
      t=t[s[i]];
    }else if(typeof u==='object'&&u.hasOwnProperty(s[i])){
      u=u[s[i]];
    }else if(r===false&&h===false
      &&ForceWebsite.hasOwnProperty(s[i])){
      r=ForceWebsite[s[i]];
      h=true;
    }else if(t===false&&h===false
      &&data.hasOwnProperty(s[i])){
      t=data[s[i]];
      h=true;
    }else if(u===false&&h===false
      &&window.hasOwnProperty(s[i])){
      u=window[s[i]];
      h=true;
    }
  }
  if(r!==ForceWebsite&&typeof r!==o&&r!==false){
    return r;
  }else if(t!==data&&typeof t!==o&&t!==false){
    return t;
  }else if(u!==window&&typeof u!==o&&u!==false){
    return u;
  }return n;
};
/* initialize anchor elements */
this.anchorInit=function(){
  var ans=document.querySelectorAll('a:not([target="_blank"])');
  var i=ans.length;
  while(i--){
    if(!ans[i].href.toString().match(/^javascript/)){
      ans[i].onclick=this.anchorExec;
    }
  }return true;
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
/* upload file */
this.upload=function(file,cb,ul){
  cb=typeof cb==='function'?cb:async function(r){
    await ForceObject.alert(r);
  };
  ul=typeof ul==='function'?ul:this.loadProgress;
  var url=this.config.data.host,
  dt=new FormData,
  hd=null,
  ul=ul,
  dl=null,
  mt='POST',
  ud4=null;
  dt.append('data',file);
  dt.append('method','website.upload');
  dt.append('database',this.config.data.base);
  dt.append('pkey',this.pkey);
  dt.append('token',
    (Math.floor((new Date).getTime()/0x3e8)+(0x5*0x3c))
    .toString(0x24));
  ForceObject.stream(url,cb,cb,dt,hd,ul,dl,mt,ud4);
  /* sample -- simple *
  var xmlhttp=new XMLHttpRequest();
  xmlhttp.open(mt,url,true);
  xmlhttp.upload.onprogress=ul;
  xmlhttp.onreadystatechange=function(e){
    if(xmlhttp.readyState===4
      &&xmlhttp.status===200
      &&typeof xmlhttp.responseText==='string'){
      return cb(xmlhttp.responseText);
    }
  };
  xmlhttp.send(dt);
  //*/
};
/* load file -- save in virtual file */
this.loadFile=function(f,cb){
  cb=typeof cb==='function'?cb:function(){};
  var res=ForceObject.virtualFile(f);
  if(res){return cb(res);}
  ForceObject.get(f).then(r=>{
    ForceObject.virtualFile(f,r);
    return cb(r);
  });
};
/* get file content -- save in virtual file */
this.getFileContent=async function(f,l){
  var res=ForceObject.virtualFile(f);
  if(!res||l){
    res=await ForceObject.get(f);
    ForceObject.virtualFile(f,res);
  }return res;
};
/* ============ helper methods ============ */
/* content url by id */
this.contentURL=function(id,rand){
  return this.config.data.host
    +'?method=website.content'
    +'&database='+this.config.data.base
    +'&id='+id
    +(rand?'&r='+Math.random():'');
};
/* image url by id */
this.imageURL=function(id,rand){
  return this.config.data.host
    +'?method=website.image'
    +'&database='+this.config.data.base
    +'&id='+id
    +(rand?'&r='+Math.random():'');
};
/**
 * call
 * ~ for theme and plugin helper
 * @parameters
 *   fn   = function name
 *   args = array of arguments
*/
this.__proto__.call=function(fn,args){
    return typeof fn==='function'?fn.apply(fn,args):false;
};
/* on content ready -- helper for plugins */
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
/* ============ loader / almost stand-alone ============ */
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
  },10);
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
  var loaded=Math.floor(e.loaded/e.total*100);
  ForceWebsite.headLoader(loaded);
};
/* ============ kitchen set ============ */
/* kitchen set */
this.kitchenSet=function(x){
  var kkey=this.kkey.substr(1);
  if(this.query.hasOwnProperty(kkey)){
    if(x===true){
      /* prepare privilege key */
      this.pkey=localStorage.getItem('website-pkey');
      this.uname=localStorage.getItem('website-uname');
      this.setTitle('Kitchen');
      if(this.query.hasOwnProperty('id')
        &&this.query[kkey]=='edit'){
        this.fetch('website.select',function(r){
          if(!Array.isArray(r)||r.length<1){
            return ForceObject.alert(r);
          }
          ForceWebsite.kitchen.load(r[0]);
        },{
          key:'id',
          id:this.query.id,
        });
        return;
      }
      this.kitchen.load(this.data);
      return this.finishing();
    }return true;
  }return false;
};
/* kitchen form helper -- e = event of submitted form */
this.kitchenFormHelper=function(e){
  e.preventDefault();
  var data={};
  for(var tar of e.target){
    if(tar.name){
      data[tar.name]=tar.value;
    }
  }
  var res={
    data:data,
    submitter:e.submitter,
    target:e.target,
    web:this,
    disable:function(){
      for(var tr of this.target){
        tr.disabled=true;
      }return this;
    },
    enable:function(){
      for(var tr of this.target){
        tr.disabled=false;
      }return this;
    },
    send:function(mtd,cb,bb){
      cb=typeof cb==='function'?cb:function(){};
      bb=typeof bb==='function'?bb:function(){};
      var _this=this;
      bb(this);
      this.disable();
      this.web.request(mtd,r=>{
        _this.enable();
        return cb(r);
      },this.data);
    },
  };
  return res;
};
};
