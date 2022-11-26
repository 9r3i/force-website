/**
 * timeago.js 
 * ~ a Force plugin for re-writing publish times
 * started at november 10th 2022
 * @requires ForceWebsite
 */
;function timeago(param){
this.lang=param;
this.Force=null;
this.init=function(plug){
  this.Force=plug.Force;
  var bp=document.getElementsByClassName('bulk-each-time');
  if(bp&&bp.length>0){
    for(var tel of bp){
      var date=tel.innerText,
      ago=this.ago(date);
      tel.innerText=ago;
    }
  }else if(ForceWebsite.query.hasOwnProperty('p')){
    var tel=document.querySelector('.page-time');
    if(tel){
      var date=tel.innerText,
      ago=this.ago(date,true);
      tel.innerText=ago;
    }
  }
};
this.ago=function(date,full){
  var last=new Date(date).getTime(),
  now=new Date().getTime(),
  avrg=now>last?now-last:last-now,
  secs=Math.floor(avrg/1000),
  res=secs,
  suffix=' \u2015 '+(new Date(date)).toString().substr(4,11),
  unit='seconds',
  lastUnit={
    years:'Last year',
    months:'Last month',
    weeks:'Last week',
    days:'Yesterday',
    hours:'1 hour ago',
    minutes:'1 minute ago',
    seconds:'Just now',
  };
  if(secs/31536000>1){
    res=secs/31536000;
    unit='years';
  }else if(secs/2592000>1){
    res=secs/2592000;
    unit='months';
  }else if(secs/604800>1){
    res=secs/604800;
    unit='weeks';
  }else if(secs/86400>1){
    res=secs/86400;
    unit='days';
  }else if(secs/3600>1){
    res=secs/3600;
    unit='hours';
  }else if(secs/60>1){
    res=secs/60;
    unit='minutes';
  }
  var round=Math.round(res),
  lang=typeof this.lang==='string'
    &&this.hasOwnProperty(this.lang)
    ?this[this.lang]:this.nothing;
  out=round==1
    ?lang(lastUnit[unit])
    :round+' '+lang(unit+' ago');
  return out+(full?suffix:'');
};
this.nothing=function(s){
  return s;
};
this.id_ID=function(s){
  const words={
    'Last year':'Tahun lalu',
    'Last month':'Bulan lalu',
    'Last week':'Pekan lalu',
    'Yesterday':'Kemarin',
    '1 hour ago':'Sejam lalu',
    '1 minute ago':'Semenit lalu',
    'Just now':'Baru saja',
    'years ago':'tahun lalu',
    'months ago':'bulan lalu',
    'weeks ago':'pekan lalu',
    'days ago':'hari lalu',
    'hours ago':'jam lalu',
    'minutes ago':'menit lalu',
    'seconds ago':'detik lalu',
  };
  return s.replace(/^(.*)$/,m=>{
    return words.hasOwnProperty(m)?words[m]:m;
  });
};
};
