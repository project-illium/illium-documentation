"use strict";(self.webpackChunkillium_documentation=self.webpackChunkillium_documentation||[]).push([[8300],{3905:(e,t,r)=>{r.d(t,{Zo:()=>u,kt:()=>m});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var c=n.createContext({}),p=function(e){var t=n.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},u=function(e){var t=p(e.components);return n.createElement(c.Provider,{value:t},e.children)},l="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},v=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,c=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),l=p(r),v=a,m=l["".concat(c,".").concat(v)]||l[v]||d[v]||o;return r?n.createElement(m,i(i({ref:t},u),{},{components:r})):n.createElement(m,i({ref:t},u))}));function m(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,i=new Array(o);i[0]=v;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s[l]="string"==typeof e?e:a,i[1]=s;for(var p=2;p<o;p++)i[p]=r[p];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}v.displayName="MDXCreateElement"},1233:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>d,frontMatter:()=>o,metadata:()=>s,toc:()=>p});var n=r(7462),a=(r(7294),r(3905));const o={sidebar_position:4},i="Prover Service",s={unversionedId:"api/prover-service",id:"api/prover-service",title:"Prover Service",description:"RPC Messages",source:"@site/docs/api/prover-service.md",sourceDirName:"api",slug:"/api/prover-service",permalink:"/api/prover-service",draft:!1,editUrl:"https://github.com/project-illium/illium-documentation/docs/api/prover-service.md",tags:[],version:"current",sidebarPosition:4,frontMatter:{sidebar_position:4},sidebar:"apiSidebar",previous:{title:"Wallet Server Service",permalink:"/api/wallet-server"},next:{title:"Wallet Service",permalink:"/api/wallet-service"}},c={},p=[{value:"RPC Messages",id:"rpc-messages",level:3}],u={toc:p},l="wrapper";function d(e){let{components:t,...r}=e;return(0,a.kt)(l,(0,n.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"prover-service"},"Prover Service"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-javascript"},"service ProverService {\n    // Prove creates the proof for the transaction and returns the transaction\n    // with the proof attached. The transaction is *not* submitted to the network.\n    //\n    // The transaction is validated against the mempool and will return an error\n    // if it is an otherwise invalid transaction.\n    rpc Prove(ProveRequest) returns (ProveResponse) {}\n    \n    // ProveAndSubmit creates the proof for the transaction and then submits it to\n    // the network. And error is returned if it fails mempool submission.\n    rpc ProveAndSubmit(ProveAndSubmitRequest) returns (ProveAndSubmitResponse) {}\n}\n")),(0,a.kt)("h3",{id:"rpc-messages"},"RPC Messages"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-go"},"message ProveRequest {\n    // The full transaction with the proof set to nil\n    Transaction transaction        = 1;\n    // The private (hidden) data for each input\n    repeated PrivateInput inputs   = 2;\n    // The private (hidden) data for each output\n    repeated PrivateOutput outputs = 3;\n}\nmessage ProveResponse {\n    // The returned transaction with the proof attached\n    Transaction transaction = 1;\n}\n\nmessage ProveAndSubmitRequest {\n    // The full transaction with the proof set to nil\n    Transaction transaction        = 1;\n    // The private (hidden) data for each input\n    repeated PrivateInput inputs   = 2;\n    // The private (hidden) data for each output\n    repeated PrivateOutput outputs = 3;\n}\nmessage ProveAndSubmitResponse {\n    // The transaction ID of the transaction.\n    //\n    // If submission was unsuccessful and error will be returned.\n    bytes transaction_ID = 1;\n}\n")))}d.isMDXComponent=!0}}]);