"use strict";(self.webpackChunkillium_documentation=self.webpackChunkillium_documentation||[]).push([[4819],{3905:(t,e,n)=>{n.d(e,{Zo:()=>l,kt:()=>d});var r=n(7294);function o(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function s(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function a(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?s(Object(n),!0).forEach((function(e){o(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function i(t,e){if(null==t)return{};var n,r,o=function(t,e){if(null==t)return{};var n,r,o={},s=Object.keys(t);for(r=0;r<s.length;r++)n=s[r],e.indexOf(n)>=0||(o[n]=t[n]);return o}(t,e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(t);for(r=0;r<s.length;r++)n=s[r],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(o[n]=t[n])}return o}var u=r.createContext({}),p=function(t){var e=r.useContext(u),n=e;return t&&(n="function"==typeof t?t(e):a(a({},e),t)),n},l=function(t){var e=p(t.components);return r.createElement(u.Provider,{value:e},t.children)},c="mdxType",m={inlineCode:"code",wrapper:function(t){var e=t.children;return r.createElement(r.Fragment,{},e)}},f=r.forwardRef((function(t,e){var n=t.components,o=t.mdxType,s=t.originalType,u=t.parentName,l=i(t,["components","mdxType","originalType","parentName"]),c=p(n),f=o,d=c["".concat(u,".").concat(f)]||c[f]||m[f]||s;return n?r.createElement(d,a(a({ref:e},l),{},{components:n})):r.createElement(d,a({ref:e},l))}));function d(t,e){var n=arguments,o=e&&e.mdxType;if("string"==typeof t||o){var s=n.length,a=new Array(s);a[0]=f;var i={};for(var u in e)hasOwnProperty.call(e,u)&&(i[u]=e[u]);i.originalType=t,i[c]="string"==typeof t?t:o,a[1]=i;for(var p=2;p<s;p++)a[p]=n[p];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}f.displayName="MDXCreateElement"},5500:(t,e,n)=>{n.r(e),n.d(e,{assets:()=>u,contentTitle:()=>a,default:()=>m,frontMatter:()=>s,metadata:()=>i,toc:()=>p});var r=n(7462),o=(n(7294),n(3905));const s={sidebar_position:8},a="Assets",i={unversionedId:"overview/assets",id:"overview/assets",title:"Assets",description:"Illium has native support for fungible and non-fungible assets (or tokens). An asset transfer looks no",source:"@site/docs/overview/assets.md",sourceDirName:"overview",slug:"/overview/assets",permalink:"/overview/assets",draft:!1,editUrl:"https://github.com/project-illium/illium-documentation/docs/overview/assets.md",tags:[],version:"current",sidebarPosition:8,frontMatter:{sidebar_position:8},sidebar:"tutorialSidebar",previous:{title:"Smart Contracts",permalink:"/overview/smart-contracts"},next:{title:"Consensus Algorithm",permalink:"/overview/consensus"}},u={},p=[],l={toc:p},c="wrapper";function m(t){let{components:e,...n}=t;return(0,o.kt)(c,(0,r.Z)({},l,n,{components:e,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"assets"},"Assets"),(0,o.kt)("p",null,"Illium has native support for fungible and non-fungible assets (or tokens). An asset transfer looks no\ndifferent from ordinary transfers or smart contracts on chain, so it's not possible to distinguish a transaction\nwhich transfers assets from all other illium transactions. "),(0,o.kt)("p",null,"To enable the token protocol we are going to once again modify our output commitment. This time we will add an\n",(0,o.kt)("inlineCode",{parentName:"p"},"assetID")," field."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-go"},"outputCommitment := hash(scriptHash, amount, assetID, salt, state)\n")),(0,o.kt)("p",null,"For regular illium (ILX) transfers the ",(0,o.kt)("inlineCode",{parentName:"p"},"assetID")," is just a zero byte array. For all other transfers it's the unique\nID of the asset. In this way we can mark outputs as representing a specific asset but keep that information hidden\nto the rest of the network. "),(0,o.kt)("p",null,"To go along with this change we're going to need to modify our transaction validation lurk program to distinguish\nbetween illium (ILX) coins and other assets and to verify that neither are being inflated. "),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-go"},"func ProveTransactionValidity(priv PrivateParams, pub PublicParams) bool {\n    inputTotal := 0\n    inAssetMap := make(map[string]uint64)\n    for i, input := range priv.Inputs {\n        scriptCommitment := hash(input.Script)\n        scriptHash := hash(scriptCommitment, input.LockingParams...)\n        commitment := hash(scriptHash, input.Amount, input.AssetID, input.Salt, input.State)\n    \n        if !ValidateInclusionProof(commitment, input.index, input.InclusionProof, pub.TxocRoot) {\n            return false\n        }\n        \n        if !ValidateScript(input.Script, input.LockingParams, input.UnlockingParams, i, priv, pub) {\n            return false\n        }\n        \n        nullifier := hash(input.Index, input.Salt, scriptCommitment, input.LockingParams...)\n        if !bytes.Equal(nullifier, pub.Nullifiers[i]) {\n            return false\n        }\n        if input.AssetID = ILXID {\n            inputTotal += input.Amount\n        } else {\n            inAssetMap[input.AssetID] += input.Amount\n        }\n    }\n    \n    outputTotal := 0\n    outAssetMap := make(map[string]uint64)\n    for i, output : range priv.Outputs {\n        preimage := append(output.ScriptHash, output.Amount, output.AssetID, output.Salt, output.State)\n        if !bytes.Equal(pub.Outputs[i].Commitment, hash(preimage)) {\n            return false\n        }\n        if output.AssetID = ILXID {\n            outputTotal += output.Amount\n        } else {\n            outAssetMap[output.AssetID] += output.Amount\n        }\n    }\n        \n    if outputTotal + pub.Fee > inputTotal {\n        return false\n    }\n    for assetID, amount := range outAssetMap {\n        if inAssetMap[assetID] < amount {\n            return false\n        }\n    }\n    \n    return true\n}\n")),(0,o.kt)("p",null,"And to go along with this we will need a new transaction type to mint new assets:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-protobuf"},"message MintTransaction {\n  AssetType type            = 1;\n  bytes asset_ID            = 2;\n  bytes document_hash       = 3;\n  uint64 new_tokens         = 4;\n  repeated Output outputs   = 5;\n  uint64 fee                = 6;\n  repeated bytes nullifiers = 7;\n  bytes txo_root            = 8;\n  bytes mint_key            = 9;\n  Locktime locktime         = 10;\n  bytes signature           = 11;\n  bytes proof               = 12;\n\n  enum AssetType {\n    FIXED_SUPPLY    = 0;\n    VARIABLE_SUPPLY = 1;\n  }\n}\n")))}m.isMDXComponent=!0}}]);