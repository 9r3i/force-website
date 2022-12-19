
[![Author](https://img.shields.io/badge/author-9r3i-lightgrey.svg)](https://github.com/9r3i)
[![License](https://img.shields.io/github/license/9r3i/force-website.svg)](https://github.com/9r3i/force-website/blob/master/LICENSE)
[![Forks](https://img.shields.io/github/forks/9r3i/force-website.svg)](https://github.com/9r3i/force-website/network)
[![Stars](https://img.shields.io/github/stars/9r3i/force-website.svg)](https://github.com/9r3i/force-website/stargazers)
[![Issues](https://img.shields.io/github/issues/9r3i/force-website.svg)](https://github.com/9r3i/force-website/issues)
[![Release](https://img.shields.io/github/release/9r3i/force-website.svg)](https://github.com/9r3i/force-website/releases)
[![Donate](https://img.shields.io/badge/donate-paypal-orange.svg)](https://paypal.me/9r3i)


# force-website
An app for Force to build a website

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
    "data": {
      "links": [
        {
          "title": "Meta Data",
          "links": [
            ["?search","Search"],
            ["?kitchen","Login"]
          ]
        }
      ],
      "social": {
        "github": "https://github.com/9r3i",
        "whatsapp": "https://wa.me/6282110719711",
        "mail": "mailto:luthfie@y7mail.com",
        "linkedin": "https://www.linkedin.com/in/9r3i",
        "twitter": "https://twitter.com/_9r3i",
        "playstore": "https://play.google.com/store/apps/dev?id=6294970245461974911",
        "facebook": "https://fb.me/lut93",
        "youtube": "https://m.youtube.com/@9r3i"
      },
      "others": [
        {
          "title": "Mukadimah",
          "content": "Alhamdulillaah, segala puji hanya milik Allah yang telah memberi segala kemudahan dan kenikmatan."
        }
      ],
      "address": "Alamat:\nJl. Kodau, Gg. Langgar.\nJatimekar, Jatiasih, Kota Bekasi, Jawa Barat, Indonesia",
      "bankAccount": "Bank BNI 1262420702 a.n. Luthfie Al Anshary (BIC/SWIFT:BNINIDJABKS)"
    }
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

# Usage
Next is the calling of the app.
```js
(async function(n,h,cnf,f){
  var ctag=document.getElementById(c), // script tag of website configuration, see configuration section
  ftag=document.getElementById(f), // script tag to load force script
  fname='force/virtual/force.js', // virtual path
  fscript=localStorage.getItem(fname), // get the force script if it's stored yet
  cnf=JSON.parse(ctag.textContent); // parse the config
  if(!fscript){
    fscript=await fetch(cnf.force.file).then(r=>r.text()); // fetch the force.js file
    localStorage.setItem(fname,fscript); // store the force script into virtual file, so next time won't loaded anymore
  }
  ftag.textContent=fscript; // loaf the force script
  const app=(new Force).app(n,h,cnf); // prepare the app using Force
  await app.init(); // initialize the app
  console.log("A Force app has been loaded, namespace: "
    +app.namespace);
})(
  'website', // website app namespace
  'https://9r3i.github.io/force-website', // host of force-website
  'website-config', // from configuration section
  'force-script' // script tag where to store the force.js script
);
```

# Closing
That's all there is to it. Alhamdulillaah...



