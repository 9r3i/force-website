/**
 * visitor.js
 * ~ a Force plugin for archiving visitors
 * started at november 11th 2022
 * @requires ForceWebsite
 */
;function visitor(param){
this.init=function(plug){
  var fc=document.querySelector('.foot-content'),
  vel=document.querySelector('#visitor-total');
  if(!vel){
    vel=ForceWebsite.buildElement('div',null,{
      'class':'visitor',
      'id':'visitor-total',
      'data-prefix':'Total Visitors:',
      'data-total':'Loading...',
    });
    if(fc){
      fc.insertBefore(vel,fc.firstChild);
    }
  }
  ForceWebsite.fetch('visitor.total',function(r){
    var total=new Intl.NumberFormat().format(parseInt(r,10));
    vel.dataset.total=total;
  },{
    base:ForceWebsite.config.data.base,
  });
};
};
