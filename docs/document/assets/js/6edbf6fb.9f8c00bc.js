"use strict";(self.webpackChunkartplayer_document=self.webpackChunkartplayer_document||[]).push([[601],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return m}});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function p(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var c=r.createContext({}),s=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=s(e.components);return r.createElement(c.Provider,{value:t},e.children)},l={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},y=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,c=e.parentName,u=p(e,["components","mdxType","originalType","parentName"]),y=s(n),m=o,f=y["".concat(c,".").concat(m)]||y[m]||l[m]||a;return n?r.createElement(f,i(i({ref:t},u),{},{components:n})):r.createElement(f,i({ref:t},u))}));function m(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,i=new Array(a);i[0]=y;var p={};for(var c in t)hasOwnProperty.call(t,c)&&(p[c]=t[c]);p.originalType=e,p.mdxType="string"==typeof e?e:o,i[1]=p;for(var s=2;s<a;s++)i[s]=n[s];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}y.displayName="MDXCreateElement"},7702:function(e,t,n){n.r(t),n.d(t,{assets:function(){return u},contentTitle:function(){return c},default:function(){return m},frontMatter:function(){return p},metadata:function(){return s},toc:function(){return l}});var r=n(7462),o=n(3366),a=(n(7294),n(3905)),i=["components"],p={title:"How to import types",sidebar_position:4},c=void 0,s={unversionedId:"en/Questions/How_to_import_types",id:"en/Questions/How_to_import_types",title:"How to import types",description:"Sometimes you lose TypeScript syntax prompt, then you can import types manually",source:"@site/docs/en/Questions/How_to_import_types.mdx",sourceDirName:"en/Questions",slug:"/en/Questions/How_to_import_types",permalink:"/document/en/Questions/How_to_import_types",draft:!1,tags:[],version:"current",sidebarPosition:4,frontMatter:{title:"How to import types",sidebar_position:4},sidebar:"en",previous:{title:"Handle a single component",permalink:"/document/en/Questions/Handle_single_component"},next:{title:"How to add setting panel",permalink:"/document/en/Questions/How_to_add_setting_panel"}},u={},l=[],y={toc:l};function m(e){var t=e.components,n=(0,o.Z)(e,i);return(0,a.kt)("wrapper",(0,r.Z)({},y,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Sometimes you lose ",(0,a.kt)("inlineCode",{parentName:"p"},"TypeScript")," syntax prompt, then you can import types manually"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'/**\n * @typedef { import("artplayer/types/artplayer") } Artplayer\n */\n\n/**\n * @type {Artplayer} - An Artplayer instance.\n */\nconst art1 = {};\n\n/**\n * @param {Artplayer}  art2 - An Artplayer instance.\n */\nfunction getInstance(art2) {\n  //\n}\n')))}m.isMDXComponent=!0}}]);