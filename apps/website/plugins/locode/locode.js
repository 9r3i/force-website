/**
 * locode.js
 * ~ a Force plugin for managing code content
 * started at november 14th 2022
 * @requires ForceWebsite
 */
;function locode(param){
this.version='2.0.1';
this.init=function(plug){
  var _locode=this;
  if(ForceWebsite.query.hasOwnProperty('p')){
    this.onContentReady((r,i)=>{
      if(!r||!/@\[locode/.test(r.innerHTML)){return;}
      var cd=this.convert(r.innerHTML);
      r.innerHTML=cd;
    });
  }
};
this.onContentReady=function(cb,i){
  cb=typeof cb==='function'?cb:function(){};
  i=i?parseInt(i,10):0;
  var c=document.getElementById('content'),
  _locode=this;
  if((c&&/@\[locode/.test(c.innerHTML))||i>500){
    return cb(c,i);
  }i++;
  setTimeout(e=>{
    _locode.onContentReady(cb,i);
  },10);
};
/* ================ locode origin methods ================ */
this.locodeHTML=function(str){
  var html=str.split(/\n/).join('<br />'),
  pt=/(&lt;[a-z0-9]+.*&gt;|&lt;\/[a-z0-9]&gt;)/g,
  pc=/(&lt;\!\-\-.*\-\-&gt;)/ig,
  pa=/[a-z]+=/gi,
  pat=/[a-z]+=('[^']*'|"[^"]*")/ig,
  ptc=/((&lt;\!\-\-.*\-\-&gt;)|(&lt;[a-z0-9]+.*&gt;|&lt;\/[a-z0-9]&gt;))/ig;
  return html.replace(ptc,function(m){
    if(m.match(pc)){
      return m.replace(pc,function(m){
        return '<span class="locode-comment">'+m+'</span>';
      });
    }
    m=m.replace(pat,function(m){
      m=m.replace(pa,function(m){
        return '<span class="locode-keyword">'+m+'</span>';
      });
      return '<span class="locode-string">'+m+'</span>';
    });
    return '<span class="locode-htmltag">'+m+'</span>';
  });
};
this.locodeJS=function(str){
  var html=str,
  ps='(\'[^\']*(\\\\\'[^\']*)+\'|\'[^\']*\'|"[^"]*(\\\\"[^"]*)+"|"[^"]*")',
  pf='((\\.)\?[a-z_][a-z0-9_]+)',
  pv='([a-z_][a-z0-9_]*(\\.))',
  pc='(\\/\\*([^\\*]*[^\\/]*)\\*\\/|\\/\\/[^\\r\\n]*\\r\\n)',
  reg=new RegExp('('+pc+'|'+ps+'|'+pf+'|'+pv+')','ig');
  return html.replace(reg,function(m){
    if(m.match(new RegExp(pc,'ig'))){
      return m.replace(new RegExp(pc,'ig'),function(m){
        return '<span class="locode-comment">'+m+'</span>';
      });
    }else if(m.match(new RegExp(ps,'ig'))){
      return m.replace(new RegExp(ps,'ig'),function(m){
        return '<span class="locode-string">'+m+'</span>';
      });
    }else if(m.match(new RegExp(pv,'ig'))){
      return m.replace(new RegExp(pv,'ig'),function(m){
        return '<span class="locode-variable">'+m+'</span>';
      });
    }else if(m.match(new RegExp(pf,'ig'))){
      var k=['object','array','bool','integer','int','mixed','string',
        'void','continue','function','class','final','static',
        'public','private','protected','const','exit','for','as',
        'while','do','echo','goto','if','else','or','and','xor',
        'return','true','false','null','try','catch','finally',
        'throw','var','new','console','this','typeof','in','let'
      ],
      f=["close","stop","focus","blur","open","alert","confirm",
        "prompt","print","postMessage","captureEvents",
        "releaseEvents","getSelection","getComputedStyle",
        "matchMedia","moveTo","moveBy","resizeTo","resizeBy",
        "scroll","scrollTo","scrollBy","requestAnimationFrame",
        "cancelAnimationFrame","getDefaultComputedStyle",
        "scrollByLines","scrollByPages","sizeToContent",
        "updateCommands","find","dump","setResizable",
        "requestIdleCallback","cancelIdleCallback","btoa","atob",
        "setTimeout","clearTimeout","setInterval","clearInterval",
        "queueMicrotask","createImageBitmap","fetch","addEventListener",
        "removeEventListener","dispatchEvent"
      ];
      return m.replace(new RegExp(pf,'ig'),function(m){
        if(k.indexOf(m)>=0){
          return '<span class="locode-keyword">'+m+'</span>';
        }else if(m.substr(0,1)=='.'||f.indexOf(m)>=0){
          return '<span class="locode-function">'+m+'</span>';
        }else{return m;}
      });
    }else{return m;}
  });
};
this.locodePHP=function(str){
  var html=str,
  ps='(\'[^\']*(\\\\\'[^\']*)+\'|\'[^\']*\'|"[^"]*(\\\\"[^"]*)+"|"[^"]*")',
  pf='([a-z_][a-z0-9_]+)',
  pv='(\\$[a-z_][a-z0-9_]*)',
  pc='(\\/\\*([^\\*]*[^\\/]*)\\*\\/|\\/\\/[^\\r\\n]*\\r\\n)',
  pt='(\&lt\;\\?(php)?|\\?\&gt\;)',
  reg=new RegExp('('+pc+'|'+ps+'|'+pv+'|'+pt+'|'+pf+')','ig');
  return html.replace(reg,function(m){
    if(m.match(new RegExp(pc,'ig'))){
      return m.replace(new RegExp(pc,'ig'),function(m){
        return '<span class="locode-comment">'+m+'</span>';
      });
    }else if(m.match(new RegExp(ps,'ig'))){
      return m.replace(new RegExp(ps,'ig'),function(m){
        return '<span class="locode-string">'+m+'</span>';
      });
    }else if(m.match(new RegExp(pv,'ig'))){
      return m.replace(new RegExp(pv,'ig'),function(m){
        return '<span class="locode-variable">'+m+'</span>';
      });
    }else if(m.match(new RegExp(pt,'ig'))){
      return m.replace(new RegExp(pt,'ig'),function(m){
        return '<span class="locode-statement">'+m+'</span>';
      });
    }else if(m.match(new RegExp(pf,'ig'))){
      var f=window.hasOwnProperty('PHP_FUNCTIONS')
        ?window.PHP_FUNCTIONS
        :['is_bool','is_null','is_file','is_resource'],
      c=['object','array','bool','integer','int','mixed','string',
        'void','require_once','require','include_once','include',
        'isset','unset','new','__construct','__destruct','continue',
        'function','class','final','static','public','private',
        'protected','const','exit','for','foreach','as','while',
        'do','echo','goto','if','else','elseif','return','true',
        'false','null','try','catch','throw','or','and','xor',
        '__FILE__','__DIR__','__CLASS__','__FUNCTION__'
      ];
      return m.replace(new RegExp(pf,'ig'),function(m){
        if(f.indexOf(m)>=0){
          return '<span class="locode-function">'+m+'</span>';
        }else if(c.indexOf(m)>=0){
          return '<span class="locode-keyword">'+m+'</span>';
        }else{return m;}
      });
    }else{return m;}
  });
};
this.locodeLDB=function(str){
  var html=str.split(/\n/).join('<br />'),
  ps='(\'[^\']*\'|\'[^\']*(\\\\\'[^\']*)+\'|"[^"]*"|"[^"]*(\\\\"[^"]*)+")',
  pp='([a-z0-9_]+=[^\&\\x28\\x29\\x2f]+(\&amp;[a-z0-9_]+=[^\&\\x28\\x29\\x2f]+)+)',
  px='([A-Z]{2,8}(\\s[A-Z]{2,9})?)',
  pf='([A-Z_]+\\x28)',
  pc='(\\/\\/[^;]*;|#[^;]*;)',
  ppx='(\\[[a-z0-9_]+\\])',
  reg=new RegExp('('+pc+'|'+ps+'|'+pp+'|'+ppx+'|'+pf+'|'+px+')','ig');
  return html.replace(reg,function(m){
    if(m.match(new RegExp(pc,'ig'))){
      return m.replace(new RegExp(pc,'ig'),function(m){
        return '<span class="locode-comment">'+m+'</span>';
      });
    }else if(m.match(new RegExp(ps,'ig'))){
      return m.replace(new RegExp(ps,'ig'),function(m){
        return '<span class="locode-string">'+m+'</span>';
      });
    }else if(m.match(new RegExp(pp,'ig'))){
      return m.replace(new RegExp(pp,'ig'),function(m){
        return '<span class="locode-param">'+m+'</span>';
      });
    }else if(m.match(new RegExp(ppx,'ig'))){
      return m.replace(new RegExp(ppx,'ig'),function(m){
        return '<span class="locode-param">'+m+'</span>';
      });
    }else if(m.match(new RegExp(pf,'ig'))){
      return m.replace(new RegExp(pf,'ig'),function(m){
        return '<span class="locode-keyword">'
          +m.substr(0,(m.length-1))
          +'</span>(';
      });
    }else if(m.match(new RegExp(px,'g'))){
      var f=[
        'CREATE DATABASE','DROP DATABASE','ALTER DATABASE',
        'CREATE TABLE','DROP TABLE','ALTER TABLE','TRUNCATE TABLE',
        'SELECT','INSERT','DELETE','UPDATE','SHOW DATABASES',
        'SHOW TABLES','SHOW COLUMNS','INSERT INTO','DELETE FROM',
        'WHERE','ORDER BY','LIMIT','ON','FROM','OR','AND','ASC',
        'DESC','AS'
      ];
      return m.replace(new RegExp(px,'g'),function(m){
        if(f.indexOf(m)>=0){
          return '<span class="locode-statement">'+m+'</span>';
        }else{return m;}
      });
    }else{return m;}
  });
};
this.htmlEntities=function(str){
  return str.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};
this.convert=function(str){
  var _locode=this,
  loptrn=/@\[locode(:(ldb|php|js|html))?\[([^~]+(~?[^~]+)*?)~\]\]\n?/g;
  return str.replace(loptrn,function(m){
    var locodeType=false,isHTML=false;
    if(m.match(/^@\[locode:ldb\[/)){
      locodeType=_locode.locodeLDB;
    }else if(m.match(/^@\[locode:php\[/)){
      locodeType=_locode.locodePHP;
    }else if(m.match(/^@\[locode:js\[/)){
      locodeType=_locode.locodeJS;
    }else if(m.match(/^@\[locode:html\[/)){
      locodeType=_locode.locodeHTML;
      isHTML=true;
    }
    var r=m.replace(/^@\[locode(:(ldb|php|js|html))?\[([\n]+)?/,'')
      .replace(/([\n]+)?~\]\]\n?$/,'');
    if(locodeType){
      r=locodeType(r);
    }
    var id='locode-'+Math.ceil((new Date).getTime()*Math.random());
    return '<div id="'+id+'" class="locode-section">'+r+'</div>';
  });
};
};
