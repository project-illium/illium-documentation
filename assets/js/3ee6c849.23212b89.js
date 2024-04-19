"use strict";(self.webpackChunkillium_documentation=self.webpackChunkillium_documentation||[]).push([[6134],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>k});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=r.createContext({}),p=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=p(e.components);return r.createElement(s.Provider,{value:t},e.children)},c="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},h=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),c=p(n),h=a,k=c["".concat(s,".").concat(h)]||c[h]||d[h]||o;return n?r.createElement(k,i(i({ref:t},u),{},{components:n})):r.createElement(k,i({ref:t},u))}));function k(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=h;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[c]="string"==typeof e?e:a,i[1]=l;for(var p=2;p<o;p++)i[p]=n[p];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}h.displayName="MDXCreateElement"},3418:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>i,default:()=>d,frontMatter:()=>o,metadata:()=>l,toc:()=>p});var r=n(7462),a=(n(7294),n(3905));const o={sidebar_position:2},i="zk-snarks",l={unversionedId:"overview/zk-snarks",id:"overview/zk-snarks",title:"zk-snarks",description:"Before we can dive into the Illium protocol we need to wrap our heads around zk-snarks. Don't worry, while the math",source:"@site/docs/overview/zk-snarks.md",sourceDirName:"overview",slug:"/overview/zk-snarks",permalink:"/overview/zk-snarks",draft:!1,editUrl:"https://github.com/project-illium/illium-documentation/docs/overview/zk-snarks.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"tutorialSidebar",previous:{title:"Introduction",permalink:"/"},next:{title:"Output Commitments",permalink:"/overview/output-commitments"}},s={},p=[{value:"Digital Signatures",id:"digital-signatures",level:2},{value:"Back to zk-snarks",id:"back-to-zk-snarks",level:2}],u={toc:p},c="wrapper";function d(e){let{components:t,...n}=e;return(0,a.kt)(c,(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"zk-snarks"},"zk-snarks"),(0,a.kt)("p",null,"Before we can dive into the Illium protocol we need to wrap our heads around zk-snarks. Don't worry, while the math\nbehind zk-snarks is super difficult to understand, you don't need to know any math to get a high level overview of\nwhat they are and what they do. "),(0,a.kt)("p",null,"In a nutshell, zk-snarks are programmatic cryptographic proofs that allow us to prove just about any statement we desire. "),(0,a.kt)("p",null,"Consider something you're likely already familiar with:"),(0,a.kt)("h2",{id:"digital-signatures"},"Digital Signatures"),(0,a.kt)("p",null,"Digital signatures and zero-knowledge proofs are fundamental concepts in cryptography. In a digital signature scheme, a signer uses their private key to sign a message. Anyone can verify the signature against the signer's public key, ensuring the authenticity and integrity of the message."),(0,a.kt)("p",null,"On the other hand, a zero-knowledge proof allows a prover to demonstrate knowledge of a secret to a verifier, without revealing the secret itself."),(0,a.kt)("p",null,"Both of these concepts are critical for secure communication and transaction verification in a variety of applications."),(0,a.kt)("p",null,"In code, we might make use of digital signatures as follows:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-go"},'privateKey, publicKey := GenerateKeyPair()\n\nmessage := "hello world"\n\nsignature := Sign(privateKey, message)\n\nvalid := Verify(publicKey, message, signature)\n')),(0,a.kt)("p",null,"Here the ",(0,a.kt)("inlineCode",{parentName:"p"},"Sign()")," and ",(0,a.kt)("inlineCode",{parentName:"p"},"Verify()")," functions are hiding all the complexity of the elliptic curve math behind the digital\nsignature but all you really need to know is what they do. "),(0,a.kt)("p",null,"Zk-snarks are just as easy to understand from this high level."),(0,a.kt)("h2",{id:"back-to-zk-snarks"},"Back to zk-snarks"),(0,a.kt)("p",null,"Consider a function in code that looks like the following:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-go"},"func foobar(privateParams, publicParams) bool {\n    // Some code here\n}\n")),(0,a.kt)("p",null,"In the above code block we have a function, which we're calling ",(0,a.kt)("inlineCode",{parentName:"p"},"foobar"),", that takes in two sets of parameters, one\nprivate and one public, and returns a boolean (either true or false). The body of our function could be anything we want\nit to be. "),(0,a.kt)("p",null,"Once we define the function body, zk-snarks allow us\nto prove that we know some combination of private and public parameters that make the function return ",(0,a.kt)("inlineCode",{parentName:"p"},"True")," ",(0,a.kt)("em",{parentName:"p"},"without"),"\nrevealing the private parameters (we will reveal the public parameters)."),(0,a.kt)("p",null,"In this sense we can create a zero-knowledge proof for just about any statement we can write in code. "),(0,a.kt)("p",null,"Let's see what this might look like in code:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-go"},"provingKey, verifyingKey := Compile(foobar)\n\nproof := Prove(provingKey, privateParams, publicParams)\n\nvalid := Verify(verifyingKey, publicParams, proof)\n")),(0,a.kt)("p",null,'In the first line we "compile" the ',(0,a.kt)("inlineCode",{parentName:"p"},"foobar")," function and produce a keypair which is cryptographically linked to our\n",(0,a.kt)("inlineCode",{parentName:"p"},"foobar")," function. When used in production both the prover and verifier would have prior agreement on the body of the\n",(0,a.kt)("inlineCode",{parentName:"p"},"foobar")," function and could independently calculate the keypair."),(0,a.kt)("p",null,"In the second line the prover creates a proof using the ",(0,a.kt)("inlineCode",{parentName:"p"},"provingKey")," and the private and public parameters. "),(0,a.kt)("p",null,"At this point the prover would share the ",(0,a.kt)("inlineCode",{parentName:"p"},"proof")," and ",(0,a.kt)("inlineCode",{parentName:"p"},"publicParams")," with the verifier. "),(0,a.kt)("p",null,"And finally, on line 3 the verifier would verify the proof using the ",(0,a.kt)("inlineCode",{parentName:"p"},"verifyingKey")," and the ",(0,a.kt)("inlineCode",{parentName:"p"},"publicParams"),"."),(0,a.kt)("p",null,"That's all there is to it. See that wasn't so bad!"))}d.isMDXComponent=!0}}]);