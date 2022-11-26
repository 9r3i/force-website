/**
 * site.js
 * ~ a Force plugin for managing site data
 * started at november 11th 2022
 * @requires ForceWebsite
 */
;function site(param){
this.init=function(plug){
  var fc=document.querySelector('.foot-content'),
  sbacc=document.querySelector('.site-account'),
  sfp=document.querySelector('.site-fanpage'),
  sot=document.querySelector('.site-others'),
  saddr=document.querySelector('.site-address'),
  slinks=document.querySelector('.site-links'),
  ssos=document.querySelector('.site-social'),
  siteData=ForceWebsite.config.site.data;
  if(fc&&siteData!==null&&typeof siteData==='object'){
    /* address */
    if(!saddr&&siteData.hasOwnProperty('address')){
      saddr=ForceWebsite.buildElement('div',
        siteData.address,{
        'class':'site-address',
      });
      saddr.appendTo(fc);
    }
    /* social */
    if(!slinks&&siteData.hasOwnProperty('social')
      &&typeof siteData.social==='object'
      &&siteData.social!==null){
      ssos=ForceWebsite.buildElement('div',null,{
        'class':'site-social',
      });
      fc.insertBefore(ssos,fc.firstChild);
      var sosmed={
        'github':'Github',
        'facebook':'Facebook',
        'twitter':'Twitter',
        'whatsapp':'WhatsApp',
        'linkedin':'LinkedIn',
        'youtube':'Youtube',
        'telegram':'Telegram',
        'instagram':'Instagram',
        'pinterest':'Pinterest',
        'tumblr':'Tumblr',
        'playstore':'Playstore',
        'mail':'Email',
      };
      sst=ForceWebsite.buildElement('div','Social Media',{
        'class':'site-social-title',
      }),
      ssc=ForceWebsite.buildElement('div',null,{
        'class':'site-social-content',
      });
      sst.appendTo(ssos);
      ssc.appendTo(ssos);
      for(var i in siteData.social){
        var href=siteData.social[i],
        sosname=sosmed.hasOwnProperty(i)?sosmed[i]:i,
        sosclass=sosmed.hasOwnProperty(i)?i:'default',
        lies=ForceWebsite.buildElement('a',sosname,{
          'href':href,
          'title':sosname+'\n'+href,
          'target':'_blank',
        }),
        lie=ForceWebsite.buildElement('div',null,{
          'class':'site-social-content-each site-social-'+sosclass,
        },[lies]);
        lie.appendTo(ssc);
      }
    }
    /* links */
    if(!slinks&&siteData.hasOwnProperty('links')
      &&Array.isArray(siteData.links)){
      slinks=ForceWebsite.buildElement('div',null,{
        'class':'site-links',
      });
      fc.insertBefore(slinks,fc.firstChild);
      for(var po of siteData.links){
        var lic=ForceWebsite.buildElement('div',null,{
          'class':'site-links-each-content',
        },[],po.content);
        var tp=ForceWebsite.buildElement('div',null,{
          'class':'site-links-each',
        },[
          ForceWebsite.buildElement('div',po.title,{
            'class':'site-links-each-title',
          }),
          lic,
        ]);
        tp.appendTo(slinks);
        for(var pi of po.links){
          var lies=ForceWebsite.buildElement('a',pi[1],{
            'href':pi[0],
            'title':pi[1],
          }),
          lie=ForceWebsite.buildElement('div',null,{
            'class':'site-links-each-content-link',
          },[lies]);
          if(/^http/i.test(pi[0])){
            lies.target='_blank';
          }else{
            lies.onclick=function(e){
              ForceWebsite.go(this.href);
              return false;
            };
          }
          lie.appendTo(lic);
        }
      }
    }
    /* other stuffs */
    if(!sbacc&&siteData.hasOwnProperty('others')
      &&Array.isArray(siteData.others)){
      sot=ForceWebsite.buildElement('div',null,{
        'class':'site-others',
      });
      fc.insertBefore(sot,fc.firstChild);
      for(var po of siteData.others){
        var tp=ForceWebsite.buildElement('div',null,{
          'class':'site-others-each',
        },[
          ForceWebsite.buildElement('div',po.title,{
            'class':'site-others-each-title',
          }),
          ForceWebsite.buildElement('div',null,{
            'class':'site-others-each-content',
          },[],po.content),
        ]);
        tp.appendTo(sot);
      }
    }
    /* bank account */
    if(!sbacc&&siteData.hasOwnProperty('bankAccount')){
      sbacc=ForceWebsite.buildElement('div',null,{
        'class':'site-account',
      },[
        ForceWebsite.buildElement('div','Bank Account',{
            'class':'site-account-title',
          }),
        ForceWebsite.buildElement('div',
          siteData.bankAccount,{
            'class':'site-account-text',
          }),
      ]);
      fc.insertBefore(sbacc,fc.firstChild);
      /**/
      var ptrn=/(bni|mandiri)/i,
      bm=siteData.bankAccount.match(ptrn),
      bname=bm?'site-account-'+bm[1].toLowerCase():'';
      sbacc.classList.add(bname);
      //*/
    }
    /* fanpage */
    if(!sfp&&siteData.hasOwnProperty('fanpage')){
      var fpiframe='<iframe src="//www.facebook.com/plugins/likebox.php?href='+siteData.fanpage+'&width=183&height=285&colorscheme=light&show_faces=true&border_color=%23FFF&stream=false&header=false" style="border:0;background-color:#FFF;overflow:hidden;width:100%;height:auto;"></iframe>';
      sfp=ForceWebsite.buildElement('div',null,{
        'class':'site-fanpage',
      },[
        ForceWebsite.buildElement('div','Fanpage',{
            'class':'site-fanpage-title',
          }),
        ForceWebsite.buildElement('div',null,{
            'class':'site-fanpage-content',
          },[],fpiframe),
      ]);
      fc.insertBefore(sfp,fc.firstChild);
    }
  }
};
};
