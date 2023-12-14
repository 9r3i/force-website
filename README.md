
[![Author](https://img.shields.io/badge/author-9r3i-lightgrey.svg)](https://github.com/9r3i)
[![License](https://img.shields.io/github/license/9r3i/force-website.svg)](https://github.com/9r3i/force-website/blob/master/LICENSE)
[![Forks](https://img.shields.io/github/forks/9r3i/force-website.svg)](https://github.com/9r3i/force-website/network)
[![Stars](https://img.shields.io/github/stars/9r3i/force-website.svg)](https://github.com/9r3i/force-website/stargazers)
[![Issues](https://img.shields.io/github/issues/9r3i/force-website.svg)](https://github.com/9r3i/force-website/issues)
[![Release](https://img.shields.io/github/release/9r3i/force-website.svg)](https://github.com/9r3i/force-website/releases)
[![Donate](https://img.shields.io/badge/donate-paypal-orange.svg)](https://paypal.me/9r3i)


# ForceWebsite
An app for Force to build a website


# Requirement
This library requires [Force](https://github.com/9r3i/force) library.


# The Function
This ```website``` function cannot be called just the way it is, because the first parameter is ```app``` object from ```Force.app``` instance.

The ```app``` object must contains method ```init``` and ```app``` property, as [Force's Manual](https://github.com/9r3i/force#app-method)

This ```app``` will generate globals readonly object ```ForceWebsite```, to help its plugins, themes and kitchen to relate to it.


# Configuration
Create tag script to store the configuration, with type ```application/json```.
```html
<script type="application/json" id="website-config"></script>
```
Don't forget to put some ID, so that next going to be easy to get the text content.

And the sample of the text content as the following.
```json
{
  "force": {
    "file": "https://9r3i.github.io/force/force.min.js",
    "cache": {
      "age": 2592e5,
      "description": "3 days in mili second = 3*24*60*60*1000",
      "default": 864e5
    }
  },
  "data": {
    "host": "https://sabunjelly.com/api/force/",
    "base": "foxtrot",
    "driver": "ForceData"
  },
  "site": {
    "name": "9r3i",
    "description": "The sly eagle doesn't kill at whim",
    "keywords": "9r3i, Force, Foxtrot",
    "robots": "follow, index",
    "date": {
      "year": "2022",
      "full": "2022-11-13 05:35:44"
    },
    "data": {}
  },
  "kitchen": {
    "namespace": "kitchen",
    "host": "https://9r3i.github.io/force-kitchen",
    "key": "kitchen"
  },
  "theme": {
    "namespace": "foxtrot",
    "host": "https://9r3i.github.io/foxtrot-theme",
    "config": {
      "data": {
        "limit": 8,
        "foot": 55
      }
    }
  },
  "plugins": [
    ["configuration",false,
      "https://9r3i.github.io/force-website-plugins"
    ],
    ["menu",[
        {
          "href": "?home",
          "text": "Home"
        },
        {
          "href": "?p=tulisan-pertama",
          "text": "Tulisan Pertama"
        },
        {
          "href": "?search",
          "text": "Search"
        },
        {
          "href": "?kitchen",
          "text": "Login"
        }
      ],
      "https://9r3i.github.io/force-website-plugins"
    ],
    ["site",false,"https://9r3i.github.io/force-website-plugins"],
    ["grid",false,"https://9r3i.github.io/force-website-plugins"],
    ["timeago","id_ID",
      "https://9r3i.github.io/force-website-plugins"
    ],
    ["visitor",false,"https://9r3i.github.io/force-website-plugins"],
    ["locode",false,"https://9r3i.github.io/force-website-plugins"],
    ["arabic","arabic",
      "https://9r3i.github.io/force-website-plugins"
    ],
    ["link",false,"https://9r3i.github.io/force-website-plugins"],
    ["social",[
        "sharer",
        "like",
        "qrcode"
      ],
      "https://9r3i.github.io/force-website-plugins"
    ],
    ["search",{
        "id": "body",
        "holder": "Search...",
        "key": "search"
      },
      "https://9r3i.github.io/force-website-plugins"
    ],
    ["land",false,"https://9r3i.github.io/force-website-plugins"],
    ["slider",{
        "id": "body",
        "images": [56,57,58,59]
      },
      "https://9r3i.github.io/force-website-plugins"
    ]
  ],
  "coverLoader": false
}
```
The config above, I use for configuration of my website, [https://9r3i.web.id/](https://9r3i.web.id/), visit it if you wish.


### Read More
Read more about ```website``` app configuration detail in [Force's Website Sample](https://github.com/9r3i/force-sample)


# Usage
Create tag script to store the configuration, without attribute ```src```.
```html
<script id="force-script"></script>
```
Don't forget to put some ID, so that next going to be easy to get the text content.

Next is the calling of the app.
```js
(async function(n,h,cnf,f){
  var ctag=document.getElementById(c), // script tag of website configuration, see configuration section
  ftag=document.getElementById(f), // script tag to load force script
  fname='force/virtual/force.js', // virtual path
  fscript=localStorage.getItem(fname), // get the force script if it's already stored in virtual file
  cnf=JSON.parse(ctag.textContent); // parse the config
  if(!fscript){ // check if it's not stored yet
    fscript=await fetch(cnf.force.file).then(r=>r.text()); // fetch the force.js file
    localStorage.setItem(fname,fscript); // store the force script into virtual file, so next time it won't be loaded anymore
  }
  ftag.textContent=fscript; // load the force script, immedietly executed by the browser
  const app=(new Force).app(n,h,cnf); // prepare the app using Force app instance
  await app.init(); // initialize the app
  console.log("A Force app has been loaded, namespace: "
    +app.namespace);
})(
  'website', // website app namespace
  'https://9r3i.github.io/force-website', // host of ForceWebsite
  'website-config', // from configuration section
  'force-script' // script tag where to store the force.js script
);
```


# Properties
- ```Force``` inherited object of Force (readonly)
- ```version``` string of this website app (readonly)
- ```root``` string of website root
- ```config``` object of website config
- ```app``` inherited object of given parameter ```app```
- ```theme``` object of prepared theme
- ```kitchen``` object of prepared kitchen
- ```query``` object of parsed url query
- ```data``` object of loaded data, index to the slugs
- ```bulkRaw``` array of loaded raw data
- ```plug``` object of registered and prepared plugins, before ```init```
- ```plugLoaded``` int of number of loaded plugins
- ```pkey``` string of privilage key
- ```kkey``` string of kitchen key


# Methods
The methods below is part of the app that has [auto-call](#auto-call) to proceed on it.
- ```init``` async function of initialization, this method is required by ```Force.app``` to initialize the app, [auto-call](#auto-call)
- ```loadPage``` async function to load a page upon ```popstate``` event, [auto-call](#auto-call)
- ```fetchConfig``` async function to load ```site.data``` config from server, [auto-call](#auto-call)
- ```fetchAllData``` async function to load all data from server without values of contents, and parsed to ```ForceWebsite.data```, [auto-call](#auto-call) except for kitchen in the first load.
- ```themePrepare``` function to prepare a theme or kitchen, [auto-call](#auto-call)
- ```finishing``` function to let the app finish the rest of works, including plugins initialization and anchors initialization, [auto-call](#auto-call) except when the kitchen or theme exit in the middle of process
- ```fillPageData``` function to fill page with data, this method is [auto-call](#auto-call), but can be recall if necessary, parameters:
  - ```content``` string of content to fill
  - ```data``` object of data input
- ```anchorInit``` function to initialize all anchors, it's called by ```loadPage```, means it's [auto-call](#auto-call), but i think it won't be conflict if it's called twice
- ```anchorExec``` function of event callback from initialization of ```anchorInit```, means it's [auto-call](#auto-call)
- ```kitchenSet``` function of kitchen set, [auto-call](#auto-call), inner method only
- ```slideHeadLoader``` function to show progress of loading, [auto-call](#auto-call) while preparing plugins
- ```headLoader``` function of head loader, [auto-call](#auto-call) from ```slideHeadLoader```
- ```loadProgress``` function of progress callback, [auto-call](#auto-call) form ```fetch``` if turn it on

These methods are inner method but also used to be a helper
- ```setTitle``` function to set title, it's also [auto-call](#auto-call) but there won't be conflict if it's called again, parameters:
  - ```txt``` string of title
  - ```asHTML``` bool of put as html using ```innerHTML``` instead of ```innerText```; default: ```false```
- ```setMeta``` function to set html meta data, parameters:
  - ```name``` string of meta name
  - ```content``` string of content
  - ```key``` string of meta key; default: name
- ```findDataSpace``` function to find chain of namespaces splitted by dot, parameters:
  - ```n``` string of data namespaces
  - ```data``` object of data spaces
  - ```ao``` bool of object as output; default: ```false```
- ```go``` function to jump the history statement where the ```location.href``` is popped in statement, it's being [auto-call](#auto-call) by ```loadPage``` and ```anchorExec```, but it will help much for kitchen, theme and plugins, parameters:
  - ```href``` string of url to attach in ```location.href``` as statement, and it's not gonna work if ```href``` is the same as ```location.href```
- ```fetch``` function to fetch data from ForceServer using method ```GET```, it's been set to database name and host, parameters:
  - ```mt``` string of force method (NOT request method)
  - ```cb``` function of callback, return argument of mixed data
  - ```dt``` object of data to be merged to the url query, so DO NOT put something secret on it
- ```request``` function to fetch data from ForceServer using method ```POST```, mostly it's used in Kitchen page, parameters:
  - ```mt``` string of force method (NOT request method)
  - ```cb``` function of callback, return argument of mixed data
  - ```dt``` object of data to be merged into ```POST``` data query
- ```upload``` function to upload **TEMPORARY** content to the server, parameters:
  - ```file``` blob of file; ***require**
  - ```cb``` function of return callback, return: string of temporary data ID or structure.
  - ```ul``` function of upload progress callback
- ```loadFile``` function to load a file path or url, from virtual file if exists or load then save into virtual file, parameters:
  - ```f``` string of file path or url
  - ```cb``` function of callback, return a string of file content
- ```getFileContent``` function to get file content from virtual file if exists or load then save into virtual file, return string of file content, parameters:
  - ```f``` string of file path or url
  - ```l``` bool of force to load even it exists

These methods are used to be helper
- ```contentURL``` function to generate content url of a data, parameters:
  - ```id``` number of data ID
  - ```rand``` bool of use random query to prevent browser cache
- ```imageURL``` function to generate image url of a data, parameters:
  - ```id``` number of data ID
  - ```rand``` bool of use random query to prevent browser cache
- ```call``` function to help call inner function; it's [auto-call](#auto-call) in ```fillPageData```, but it will be necessary for plugins to execute some operational, parameters:
  - ```fn``` function to apply
  - ```args``` array of arguments
- ```onContentReady``` function of ready state of content element detected using ```document.getElementById('content')```, return into ```callback``` function, object the content element or ```false``` if failed, parameters:
  - ```cb``` function of callback
  - ```i``` int of counter; auto-generate
- ```kitchenFormHelper``` function to help form on ```submit```, parameters:
  - ```e``` object of submit event of thr form
  - This will return an object with properties and methods:
    - ```data``` object of data, key as ```data.name``` and value as ```data.value```
    - ```submitter``` object element of submitter
    - ```target``` inherited object from ```event.target```
    - ```web``` object of global ForceWebsite
    - ```disable``` function to disable all inputs in range of the form
    - ```enable``` function to enable all inputs in range of the form
    - ```send``` function to send data to the server using ```ForceWebsite.request```, parameters:
      - ```mtd``` string of force method
      - ```cb``` function of callback, after request sent, argument is result from the server
      - ```bb``` function of callback, before request, argument is ```this``` object


# auto-call
This ```auto-call``` means no need to be worried, because it's only worked inside the app, and no plugin, no theme and no kitchen will use this method.


# Closing
That's all there is to it. Alhamdulillaah...




