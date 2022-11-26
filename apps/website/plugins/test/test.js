/**
 * test.js
 * ~ a Force plugin for testing
 * started at november 10th 2022
 * @requires ForceWebsite
 * 
 */
;function test(param){
this.text=param;
this.init=async function(plug){
  //this.visible();
  
  //localStorage.clear();
  
  //var ok=await plug.Force.alert(this.text);
  //plug.Force.splash('Thank you, Allah!');
  //var cp=await plug.Force.fetch('test',{name:'test'});
  //var cp=await plug.Force.fetch('test',{name:'test'},{method:'GET'});
  //plug.Force.splash(cp);
  /**
  plug.Force.fetch('test',{name:'test'}).then(cp=>{
    plug.Force.splash(cp+' yeah!');
  });
  //*/
  
  /**
  var cp=await plug.Force.fetch('website.dataNew',{
    uname:'admin',
    upass:'admin',
    pkey:'test',
  });
  //*/
  /**
  var cp=await plug.Force.fetch('website.content',{
    id:28
  },{method:'GET'});
  plug.Force.splash(cp,5,3);
  //*/
};
this.visible=function(){
  var observer=new IntersectionObserver(function(entries){
	  if(entries[0].isIntersecting===true){
		  //ForceWebsite.Force.splash(entries[0],55,1);
	  }
	  ForceWebsite.Force.splash({
	    isIntersecting:entries[0].isIntersecting,
	    length:entries.length,
	  },5,1);
  },{threshold:[0]});
  observer.observe(document.querySelector('.bulk-button'));
};
};
