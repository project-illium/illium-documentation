"use strict";(self.webpackChunkillium_documentation=self.webpackChunkillium_documentation||[]).push([[1221],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>m});var o=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,o,r=function(e,t){if(null==e)return{};var n,o,r={},i=Object.keys(e);for(o=0;o<i.length;o++)n=i[o],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(o=0;o<i.length;o++)n=i[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=o.createContext({}),u=function(e){var t=o.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},c=function(e){var t=u(e.components);return o.createElement(s.Provider,{value:t},e.children)},d="mdxType",p={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},y=o.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),d=u(n),y=r,m=d["".concat(s,".").concat(y)]||d[y]||p[y]||i;return n?o.createElement(m,a(a({ref:t},c),{},{components:n})):o.createElement(m,a({ref:t},c))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,a=new Array(i);a[0]=y;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[d]="string"==typeof e?e:r,a[1]=l;for(var u=2;u<i;u++)a[u]=n[u];return o.createElement.apply(null,a)}return o.createElement.apply(null,n)}y.displayName="MDXCreateElement"},7899:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>a,default:()=>p,frontMatter:()=>i,metadata:()=>l,toc:()=>u});var o=n(7462),r=(n(7294),n(3905));const i={sidebar_position:7},a="Using Tor",l={unversionedId:"node/tor",id:"node/tor",title:"Using Tor",description:"Ilxd can be configured to run over Tor to protect your IP address and increase network layer privacy.",source:"@site/docs/node/tor.md",sourceDirName:"node",slug:"/node/tor",permalink:"/node/tor",draft:!1,editUrl:"https://github.com/project-illium/illium-documentation/docs/node/tor.md",tags:[],version:"current",sidebarPosition:7,frontMatter:{sidebar_position:7},sidebar:"nodeSidebar",previous:{title:"Offline Wallet",permalink:"/node/offline-wallet"}},s={},u=[{value:"Dual Stack Mode",id:"dual-stack-mode",level:3},{value:"Validating with Tor",id:"validating-with-tor",level:3}],c={toc:u},d="wrapper";function p(e){let{components:t,...n}=e;return(0,r.kt)(d,(0,o.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"using-tor"},"Using Tor"),(0,r.kt)("p",null,"Ilxd can be configured to run over Tor to protect your IP address and increase network layer privacy."),(0,r.kt)("p",null,"To use tor you'll need to have tor installed on your system and provide the path to the tor binary as a config option."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"$ ilxd --torbinary=/path/to/tor\n")),(0,r.kt)("p",null,"Optionally, you can put this in your ilxd.conf:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"torbinary=/path/to/tor\n")),(0,r.kt)("p",null,"Ilxd will start tor automatically on startup and manage its lifecycle, including shutting it down when ilxd is shut down. "),(0,r.kt)("p",null,"All outgoing connections get proxied through tor, and it sets up a hidden service to accept incoming\nconnections as well."),(0,r.kt)("p",null,"If you want to manually set additional configuration options for tor you can do so by pointing it at\na custom ",(0,r.kt)("inlineCode",{parentName:"p"},"torrc")," file."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"$ ilxd --torrcfile=/path/to/torrc\n")),(0,r.kt)("h3",{id:"dual-stack-mode"},"Dual Stack Mode"),(0,r.kt)("p",null,"Your node can be configured to make connections through both tor AND the clear internet. In this way you act as a bridge\nbetween both networks. Dual stack mode is obviously ",(0,r.kt)("em",{parentName:"p"},"NOT")," private and your IP will be visible."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"$ ilxd --torbinary=/path/to/tor --tordualstack\n")),(0,r.kt)("h3",{id:"validating-with-tor"},"Validating with Tor"),(0,r.kt)("p",null,"Generally speaking it's not recommended that you use Tor when running a validator node. The reason for this is that validators\nand users not running tor may not be able to connect to you (there is relaying functionality but it's a best effort service). "),(0,r.kt)("p",null,"To the extent that other validators have trouble connecting to you, it could cause to get marked\nas having poor uptime resulting in a loss of your coinbase rewards. "),(0,r.kt)("p",null,"You also will likely have a much slower internet connection which could result in most of your consensus query responses lagging\nbehind non-tor validators which results in you having less say in consensus."),(0,r.kt)("p",null,"Finally, if your responses are slow it could ultimately result in other validators making more queries than necessary to finalize\ntransactions which could slow finalization time."))}p.isMDXComponent=!0}}]);