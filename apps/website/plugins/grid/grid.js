/**
 * grid.js
 * ~ a Force plugin for griding the bulk
 * started at november 9th 2022
 * @requires ForceWebsite
 */
;function grid(param){
this.init=function(plug){
  var bulks=document.getElementsByClassName('bulk-each');
  if(!ForceWebsite.query.hasOwnProperty('p')&&bulks){
    for(var bulk of bulks){
      bulk.classList.add('bulk-each-grid');
    }
    bulks[0].parentElement.classList.add('bulk-grid');
    return;
  }
};
};
