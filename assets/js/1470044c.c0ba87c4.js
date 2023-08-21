"use strict";(self.webpackChunkillium_documentation=self.webpackChunkillium_documentation||[]).push([[602],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>f});var r=n(7294);function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){s(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,s=function(e,t){if(null==e)return{};var n,r,s={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(s[n]=e[n]);return s}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(s[n]=e[n])}return s}var c=r.createContext({}),l=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},p=function(e){var t=l(e.components);return r.createElement(c.Provider,{value:t},e.children)},u="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,s=e.mdxType,o=e.originalType,c=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),u=l(n),d=s,f=u["".concat(c,".").concat(d)]||u[d]||m[d]||o;return n?r.createElement(f,a(a({ref:t},p),{},{components:n})):r.createElement(f,a({ref:t},p))}));function f(e,t){var n=arguments,s=t&&t.mdxType;if("string"==typeof e||s){var o=n.length,a=new Array(o);a[0]=d;var i={};for(var c in t)hasOwnProperty.call(t,c)&&(i[c]=t[c]);i.originalType=e,i[u]="string"==typeof e?e:s,a[1]=i;for(var l=2;l<o;l++)a[l]=n[l];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},232:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>a,default:()=>m,frontMatter:()=>o,metadata:()=>i,toc:()=>l});var r=n(7462),s=(n(7294),n(3905));const o={sidebar_position:5},a="Wallet Server Service",i={unversionedId:"api/wallet_server",id:"api/wallet_server",title:"Wallet Server Service",description:"RPC Messages",source:"@site/docs/api/wallet_server.md",sourceDirName:"api",slug:"/api/wallet_server",permalink:"/docs/api/wallet_server",draft:!1,editUrl:"https://github.com/project-illium/illium-documentation/docs/api/wallet_server.md",tags:[],version:"current",sidebarPosition:5,frontMatter:{sidebar_position:5},sidebar:"apiSidebar",previous:{title:"Wallet Service",permalink:"/docs/api/wallet_service"},next:{title:"Data Messages",permalink:"/docs/api/data_messages"}},c={},l=[{value:"RPC Messages",id:"rpc-messages",level:3}],p={toc:l},u="wrapper";function m(e){let{components:t,...n}=e;return(0,s.kt)(u,(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,s.kt)("h1",{id:"wallet-server-service"},"Wallet Server Service"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-javascript"},"service WalletServerService {\n    // RegisterViewKey registers a new view key with the server. The server will use this key when\n    // attempting to decrypt each output. If outputs decrypt, they will be indexed so the client\n    // can fetch them later.\n    //\n    // To free up resources keys will automatically unregister after some time if the wallet has not\n    // connected in some time.\n    rpc RegisterViewKey(RegisterViewKeyRequest) returns (RegisterViewKeyResponse) {}\n\n    // SubscribeTransactions subscribes to a stream of TransactionsNotifications that match to the\n    // provided view key.\n    rpc SubscribeTransactions(SubscribeTransactionsRequest) returns (stream TransactionNotification) {}\n\n    // GetWalletTransactions returns a list of transactions for the provided view key.\n    rpc GetWalletTransactions(GetWalletTransactionsRequest) returns (GetWalletTransactionsResponse) {}\n\n    // GetTxoProof returns the merkle inclusion proof for the given commitment. This information is needed\n    // by the client to create the zero knowledge proof needed to spend the transaction.\n    rpc GetTxoProof(GetTxoProofRequest) returns (GetTxoProofResponse) {}\n}\n")),(0,s.kt)("h3",{id:"rpc-messages"},"RPC Messages"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-go"},"message RegisterViewKeyRequest {\n    // A view key to register with the server.\n    bytes view_key                  = 1;\n\n    // The unlocking script associated with the address belonging\n    // to the view key serialized as <scriptCommitment><scriptParams...>\n    //\n    // The server needs this in order to compute the nullifier and detect\n    // spend transactions.\n    bytes serializedUnlockingScript = 2;\n\n    // The date the address was created. The server will scan historical blocks\n    // for matching transactions from the birthday forward. Please don't use an\n    // earlier birthday than needed as it puts more stress on the server.\n    //\n    // A zero value will not trigger a rescan.\n    int64 birthday                  = 3;\n}\nmessage RegisterViewKeyResponse {}\n\nmessage SubscribeTransactionsRequest {\n    // A list of view keys to subscribe to\n    repeated bytes view_keys   = 1;\n}\n\nmessage GetWalletTransactionsRequest{\n    // The view key to query transactions\n    bytes view_key = 1;\n\n    // The number of transactions to skip, starting with the oldest first.\n    // Does not affect results of unconfirmed transactions.\n    uint32 nb_skip = 2;\n    // Specify the number of transactions to fetch.\n    uint32 nb_fetch = 3;\n\n\n    oneof start_block {\n        // Recommended. Only get transactions after (or within) a\n        // starting block identified by hash.\n        bytes block_ID = 4;\n        // Recommended. Only get transactions after (or within) a\n        // starting block identified by block number.\n        uint32 height = 5;\n    }\n}\nmessage GetWalletTransactionsResponse {\n    // A list of transactions as the response\n    repeated Transaction transactions = 1;\n}\n\nmessage GetTxoProofRequest {\n    // One or more commitments to fetch the txo proof for.\n    // Since transactions only contain one txo_root if you\n    // should request the commitment for each input in your\n    // transaction as a batch so the returned proofs all share\n    // the same txo_root. Otherwise you may get different roots\n    // if you request them separately.\n    repeated bytes commitments = 1;\n}\nmessage GetTxoProofResponse {\n    // The proof responses\n    repeated TxoProof proofs = 1;\n}\n")))}m.isMDXComponent=!0}}]);