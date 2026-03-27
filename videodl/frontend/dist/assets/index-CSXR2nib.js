import{r as d,a as Se,R as $e}from"./react-wGySg1uH.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function a(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(o){if(o.ep)return;o.ep=!0;const n=a(o);fetch(o.href,n)}})();var oe={exports:{}},H={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ce=d,Ee=Symbol.for("react.element"),Ie=Symbol.for("react.fragment"),Oe=Object.prototype.hasOwnProperty,ze=Ce.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Le={key:!0,ref:!0,__self:!0,__source:!0};function ie(e,t,a){var i,o={},n=null,r=null;a!==void 0&&(n=""+a),t.key!==void 0&&(n=""+t.key),t.ref!==void 0&&(r=t.ref);for(i in t)Oe.call(t,i)&&!Le.hasOwnProperty(i)&&(o[i]=t[i]);if(e&&e.defaultProps)for(i in t=e.defaultProps,t)o[i]===void 0&&(o[i]=t[i]);return{$$typeof:Ee,type:e,key:n,ref:r,props:o,_owner:ze.current}}H.Fragment=Ie;H.jsx=ie;H.jsxs=ie;oe.exports=H;var s=oe.exports,J={},se=Se;J.createRoot=se.createRoot,J.hydrateRoot=se.hydrateRoot;let Re={data:""},Pe=e=>{if(typeof window=="object"){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||Re},_e=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,Te=/\/\*[^]*?\*\/|  +/g,ae=/\n+/g,C=(e,t)=>{let a="",i="",o="";for(let n in e){let r=e[n];n[0]=="@"?n[1]=="i"?a=n+" "+r+";":i+=n[1]=="f"?C(r,n):n+"{"+C(r,n[1]=="k"?"":t)+"}":typeof r=="object"?i+=C(r,t?t.replace(/([^,])+/g,c=>n.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,m=>/&/.test(m)?m.replace(/&/g,c):c?c+" "+m:m)):n):r!=null&&(n=/^--/.test(n)?n:n.replace(/[A-Z]/g,"-$&").toLowerCase(),o+=C.p?C.p(n,r):n+":"+r+";")}return a+(t&&o?t+"{"+o+"}":o)+i},M={},ne=e=>{if(typeof e=="object"){let t="";for(let a in e)t+=a+ne(e[a]);return t}return e},Ae=(e,t,a,i,o)=>{let n=ne(e),r=M[n]||(M[n]=(m=>{let h=0,f=11;for(;h<m.length;)f=101*f+m.charCodeAt(h++)>>>0;return"go"+f})(n));if(!M[r]){let m=n!==e?e:(h=>{let f,p,v=[{}];for(;f=_e.exec(h.replace(Te,""));)f[4]?v.shift():f[3]?(p=f[3].replace(ae," ").trim(),v.unshift(v[0][p]=v[0][p]||{})):v[0][f[1]]=f[2].replace(ae," ").trim();return v[0]})(e);M[r]=C(o?{["@keyframes "+r]:m}:m,a?"":"."+r)}let c=a&&M.g?M.g:null;return a&&(M.g=M[r]),((m,h,f,p)=>{p?h.data=h.data.replace(p,m):h.data.indexOf(m)===-1&&(h.data=f?m+h.data:h.data+m)})(M[r],t,i,c),r},Fe=(e,t,a)=>e.reduce((i,o,n)=>{let r=t[n];if(r&&r.call){let c=r(a),m=c&&c.props&&c.props.className||/^go/.test(c)&&c;r=m?"."+m:c&&typeof c=="object"?c.props?"":C(c,""):c===!1?"":c}return i+o+(r??"")},"");function V(e){let t=this||{},a=e.call?e(t.p):e;return Ae(a.unshift?a.raw?Fe(a,[].slice.call(arguments,1),t.p):a.reduce((i,o)=>Object.assign(i,o&&o.call?o(t.p):o),{}):a,Pe(t.target),t.g,t.o,t.k)}let le,W,X;V.bind({g:1});let S=V.bind({k:1});function He(e,t,a,i){C.p=t,le=e,W=a,X=i}function E(e,t){let a=this||{};return function(){let i=arguments;function o(n,r){let c=Object.assign({},n),m=c.className||o.className;a.p=Object.assign({theme:W&&W()},c),a.o=/ *go\d+/.test(m),c.className=V.apply(a,i)+(m?" "+m:"");let h=e;return e[0]&&(h=c.as||e,delete c.as),X&&h[0]&&X(c),le(h,c)}return o}}var Ve=e=>typeof e=="function",F=(e,t)=>Ve(e)?e(t):e,Ue=(()=>{let e=0;return()=>(++e).toString()})(),de=(()=>{let e;return()=>{if(e===void 0&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),Be=20,G="default",ce=(e,t)=>{let{toastLimit:a}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,a)};case 1:return{...e,toasts:e.toasts.map(r=>r.id===t.toast.id?{...r,...t.toast}:r)};case 2:let{toast:i}=t;return ce(e,{type:e.toasts.find(r=>r.id===i.id)?1:0,toast:i});case 3:let{toastId:o}=t;return{...e,toasts:e.toasts.map(r=>r.id===o||o===void 0?{...r,dismissed:!0,visible:!1}:r)};case 4:return t.toastId===void 0?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(r=>r.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let n=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(r=>({...r,pauseDuration:r.pauseDuration+n}))}}},A=[],ue={toasts:[],pausedAt:void 0,settings:{toastLimit:Be}},D={},me=(e,t=G)=>{D[t]=ce(D[t]||ue,e),A.forEach(([a,i])=>{a===t&&i(D[t])})},pe=e=>Object.keys(D).forEach(t=>me(e,t)),qe=e=>Object.keys(D).find(t=>D[t].toasts.some(a=>a.id===e)),U=(e=G)=>t=>{me(t,e)},Ke={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},Ye=(e={},t=G)=>{let[a,i]=d.useState(D[t]||ue),o=d.useRef(D[t]);d.useEffect(()=>(o.current!==D[t]&&i(D[t]),A.push([t,i]),()=>{let r=A.findIndex(([c])=>c===t);r>-1&&A.splice(r,1)}),[t]);let n=a.toasts.map(r=>{var c,m,h;return{...e,...e[r.type],...r,removeDelay:r.removeDelay||((c=e[r.type])==null?void 0:c.removeDelay)||(e==null?void 0:e.removeDelay),duration:r.duration||((m=e[r.type])==null?void 0:m.duration)||(e==null?void 0:e.duration)||Ke[r.type],style:{...e.style,...(h=e[r.type])==null?void 0:h.style,...r.style}}});return{...a,toasts:n}},Je=(e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(a==null?void 0:a.id)||Ue()}),R=e=>(t,a)=>{let i=Je(t,e,a);return U(i.toasterId||qe(i.id))({type:2,toast:i}),i.id},y=(e,t)=>R("blank")(e,t);y.error=R("error");y.success=R("success");y.loading=R("loading");y.custom=R("custom");y.dismiss=(e,t)=>{let a={type:3,toastId:e};t?U(t)(a):pe(a)};y.dismissAll=e=>y.dismiss(void 0,e);y.remove=(e,t)=>{let a={type:4,toastId:e};t?U(t)(a):pe(a)};y.removeAll=e=>y.remove(void 0,e);y.promise=(e,t,a)=>{let i=y.loading(t.loading,{...a,...a==null?void 0:a.loading});return typeof e=="function"&&(e=e()),e.then(o=>{let n=t.success?F(t.success,o):void 0;return n?y.success(n,{id:i,...a,...a==null?void 0:a.success}):y.dismiss(i),o}).catch(o=>{let n=t.error?F(t.error,o):void 0;n?y.error(n,{id:i,...a,...a==null?void 0:a.error}):y.dismiss(i)}),e};var We=1e3,Xe=(e,t="default")=>{let{toasts:a,pausedAt:i}=Ye(e,t),o=d.useRef(new Map).current,n=d.useCallback((p,v=We)=>{if(o.has(p))return;let g=setTimeout(()=>{o.delete(p),r({type:4,toastId:p})},v);o.set(p,g)},[]);d.useEffect(()=>{if(i)return;let p=Date.now(),v=a.map(g=>{if(g.duration===1/0)return;let j=(g.duration||0)+g.pauseDuration-(p-g.createdAt);if(j<0){g.visible&&y.dismiss(g.id);return}return setTimeout(()=>y.dismiss(g.id,t),j)});return()=>{v.forEach(g=>g&&clearTimeout(g))}},[a,i,t]);let r=d.useCallback(U(t),[t]),c=d.useCallback(()=>{r({type:5,time:Date.now()})},[r]),m=d.useCallback((p,v)=>{r({type:1,toast:{id:p,height:v}})},[r]),h=d.useCallback(()=>{i&&r({type:6,time:Date.now()})},[i,r]),f=d.useCallback((p,v)=>{let{reverseOrder:g=!1,gutter:j=8,defaultPosition:I}=v||{},$=a.filter(w=>(w.position||I)===(p.position||I)&&w.height),P=$.findIndex(w=>w.id===p.id),_=$.filter((w,O)=>O<P&&w.visible).length;return $.filter(w=>w.visible).slice(...g?[_+1]:[0,_]).reduce((w,O)=>w+(O.height||0)+j,0)},[a]);return d.useEffect(()=>{a.forEach(p=>{if(p.dismissed)n(p.id,p.removeDelay);else{let v=o.get(p.id);v&&(clearTimeout(v),o.delete(p.id))}})},[a,n]),{toasts:a,handlers:{updateHeight:m,startPause:c,endPause:h,calculateOffset:f}}},Ge=S`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,Ze=S`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Qe=S`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,et=E("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${Ge} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${Ze} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${Qe} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,tt=S`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,st=E("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${tt} 1s linear infinite;
`,at=S`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,rt=S`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,ot=E("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${at} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${rt} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,it=E("div")`
  position: absolute;
`,nt=E("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,lt=S`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,dt=E("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${lt} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,ct=({toast:e})=>{let{icon:t,type:a,iconTheme:i}=e;return t!==void 0?typeof t=="string"?d.createElement(dt,null,t):t:a==="blank"?null:d.createElement(nt,null,d.createElement(st,{...i}),a!=="loading"&&d.createElement(it,null,a==="error"?d.createElement(et,{...i}):d.createElement(ot,{...i})))},ut=e=>`
0% {transform: translate3d(0,${e*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,mt=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e*-150}%,-1px) scale(.6); opacity:0;}
`,pt="0%{opacity:0;} 100%{opacity:1;}",ht="0%{opacity:1;} 100%{opacity:0;}",ft=E("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,yt=E("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,vt=(e,t)=>{let a=e.includes("top")?1:-1,[i,o]=de()?[pt,ht]:[ut(a),mt(a)];return{animation:t?`${S(i)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${S(o)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},xt=d.memo(({toast:e,position:t,style:a,children:i})=>{let o=e.height?vt(e.position||t||"top-center",e.visible):{opacity:0},n=d.createElement(ct,{toast:e}),r=d.createElement(yt,{...e.ariaProps},F(e.message,e));return d.createElement(ft,{className:e.className,style:{...o,...a,...e.style}},typeof i=="function"?i({icon:n,message:r}):d.createElement(d.Fragment,null,n,r))});He(d.createElement);var gt=({id:e,className:t,style:a,onHeightUpdate:i,children:o})=>{let n=d.useCallback(r=>{if(r){let c=()=>{let m=r.getBoundingClientRect().height;i(e,m)};c(),new MutationObserver(c).observe(r,{subtree:!0,childList:!0,characterData:!0})}},[e,i]);return d.createElement("div",{ref:n,className:t,style:a},o)},bt=(e,t)=>{let a=e.includes("top"),i=a?{top:0}:{bottom:0},o=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:de()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(a?1:-1)}px)`,...i,...o}},wt=V`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,T=16,jt=({reverseOrder:e,position:t="top-center",toastOptions:a,gutter:i,children:o,toasterId:n,containerStyle:r,containerClassName:c})=>{let{toasts:m,handlers:h}=Xe(a,n);return d.createElement("div",{"data-rht-toaster":n||"",style:{position:"fixed",zIndex:9999,top:T,left:T,right:T,bottom:T,pointerEvents:"none",...r},className:c,onMouseEnter:h.startPause,onMouseLeave:h.endPause},m.map(f=>{let p=f.position||t,v=h.calculateOffset(f,{reverseOrder:e,gutter:i,defaultPosition:t}),g=bt(p,v);return d.createElement(gt,{id:f.id,key:f.id,onHeightUpdate:h.updateHeight,className:f.visible?wt:"",style:g},f.type==="custom"?F(f.message,f):o?o(f):d.createElement(xt,{toast:f,position:p}))}))};const b=({d:e,size:t=20,stroke:a="currentColor",fill:i="none",strokeWidth:o=1.8})=>s.jsx("svg",{width:t,height:t,viewBox:"0 0 24 24",fill:i,stroke:a,strokeWidth:o,strokeLinecap:"round",strokeLinejoin:"round",children:s.jsx("path",{d:e})}),x={download:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",link:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",play:"M5 3l14 9-14 9V3z",x:"M18 6L6 18M6 6l12 12",clock:"M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM12 6v6l4 2",eye:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",trash:"M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6",history:"M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM3.05 11H1M23 12h-2M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42",info:"M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM12 16v-4M12 8h.01",paste:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M9 2h6v4H9V2z",youtube:"M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58a2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z",facebook:"M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",refresh:"M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15",install:"M12 2v12M8 10l4 4 4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"};function re(e){if(!e)return null;const t=Math.floor(e/3600),a=Math.floor(e%3600/60),i=Math.floor(e%60);return t>0?`${t}:${String(a).padStart(2,"0")}:${String(i).padStart(2,"0")}`:`${a}:${String(i).padStart(2,"0")}`}function Nt(e){return e?e>=1e9?`${(e/1e9).toFixed(1)}B views`:e>=1e6?`${(e/1e6).toFixed(1)}M views`:e>=1e3?`${(e/1e3).toFixed(1)}K views`:`${e} views`:null}function kt(e){return e?e>=1e9?`${(e/1e9).toFixed(1)} GB`:e>=1e6?`${(e/1e6).toFixed(1)} MB`:`${(e/1e3).toFixed(0)} KB`:null}function Dt(e){const t=(e||"").toLowerCase();return t.includes("youtube")?x.youtube:t.includes("facebook")||t.includes("fb")?x.facebook:x.play}function Mt(e){try{const t=new URL(e).hostname.toLowerCase();return t.includes("youtube")||t.includes("youtu.be")?"YouTube":t.includes("facebook")||t.includes("fb.watch")?"Facebook":t.includes("instagram")?"Instagram":t.includes("tiktok")?"TikTok":t.includes("twitter")||t.includes("x.com")?"Twitter/X":t.includes("vimeo")?"Vimeo":t.includes("dailymotion")?"Dailymotion":"Video"}catch{return null}}const St={MAX:"#e63c3c","4K":"#9b59b6","2K":"#6c5ce7",FHD:"#0984e3",HD:"#00b894",SD:"#636e72",MP3:"#f5c842"},he="/api";async function $t(e){const t=await fetch(`${he}/info`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:e})}),a=await t.json();if(!t.ok)throw new Error(a.error||"Failed to fetch video info");return a}function Ct(){try{const e=localStorage.getItem("svd_history");if(e)return JSON.parse(e);const t=localStorage.getItem("vdl_history");return t?(localStorage.setItem("svd_history",t),JSON.parse(t)):[]}catch{return[]}}function Y(e){try{localStorage.setItem("svd_history",JSON.stringify(e.slice(0,50)))}catch{}}function Et(){var Q;const[e,t]=d.useState(""),[a,i]=d.useState(!1),[o,n]=d.useState(null),[r,c]=d.useState(null),[m,h]=d.useState(!1),[f,p]=d.useState(0),[v,g]=d.useState("download"),[j,I]=d.useState(Ct),[$,P]=d.useState(null),[_,w]=d.useState(!1),[O,B]=d.useState(!1),z=d.useRef(null),q=d.useRef(null);d.useEffect(()=>{const l=u=>{u.preventDefault(),P(u)};return window.addEventListener("beforeinstallprompt",l),window.addEventListener("appinstalled",()=>w(!0)),window.matchMedia("(display-mode: standalone)").matches&&w(!0),()=>window.removeEventListener("beforeinstallprompt",l)},[]),d.useEffect(()=>{const l=u=>{var N;if(u.target===z.current)return;const k=(N=u.clipboardData||window.clipboardData)==null?void 0:N.getData("text");k!=null&&k.startsWith("http")&&t(k)};return document.addEventListener("paste",l),()=>document.removeEventListener("paste",l)},[]);const fe=async()=>{if(!$)return;$.prompt();const{outcome:l}=await $.userChoice;l==="accepted"&&(w(!0),P(null))},K=d.useCallback(async()=>{var u,k;const l=e.trim();if(!l){y.error("Paste a video URL first"),(u=z.current)==null||u.focus();return}i(!0),n(null),c(null);try{const N=await $t(l);n(N),c(((k=N.qualities)==null?void 0:k[0])||null),y.success("Video found!",{icon:"🎬"})}catch(N){y.error(N.message||"Failed to fetch video info")}finally{i(!1)}},[e]),ye=l=>{l.key==="Enter"&&K()},ve=async()=>{var l;try{const u=await navigator.clipboard.readText();u&&t(u)}catch{(l=z.current)==null||l.focus()}},xe=()=>{var l;t(""),n(null),c(null),(l=z.current)==null||l.focus()},ge=async()=>{if(!o||!r)return;h(!0),p(0);const l=setInterval(()=>{p(u=>u<85?u+Math.random()*8:u)},800);try{q.current=new AbortController;const u=await fetch(`${he}/download`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:e.trim(),format:r.format,quality_id:r.id,title:o.title}),signal:q.current.signal});if(!u.ok){const Me=await u.json();throw new Error(Me.error||"Download failed")}const N=(u.headers.get("content-disposition")||"").match(/filename="(.+)"/),ke=(N==null?void 0:N[1])||`video_${r.id}.mp4`;p(95);const De=await u.blob(),ee=URL.createObjectURL(De),L=document.createElement("a");L.href=ee,L.download=ke,document.body.appendChild(L),L.click(),document.body.removeChild(L),setTimeout(()=>URL.revokeObjectURL(ee),1e4),p(100);const te=[{id:Date.now(),title:o.title,thumbnail:o.thumbnail,platform:o.platform,quality:r.label,url:e.trim(),date:new Date().toISOString()},...j];I(te),Y(te),y.success(`Downloaded: ${r.label}`,{icon:"✅",duration:4e3})}catch(u){u.name==="AbortError"?y("Download cancelled",{icon:"🚫"}):y.error(u.message||"Download failed")}finally{clearInterval(l),h(!1),p(0)}},be=()=>{var l;(l=q.current)==null||l.abort()},we=()=>{I([]),Y([]),y("History cleared",{icon:"🗑️"})},je=l=>{const u=j.filter(k=>k.id!==l);I(u),Y(u)},Ne=l=>{l.preventDefault(),B(!1);const u=l.dataTransfer.getData("text");u!=null&&u.startsWith("http")&&t(u)},Z=e?Mt(e):null;return s.jsxs("div",{className:"app",onDragOver:l=>{l.preventDefault(),B(!0)},onDragLeave:()=>B(!1),onDrop:Ne,children:[s.jsx(jt,{position:"top-right",toastOptions:{style:{background:"#1c1c2a",color:"#f0f0f8",border:"1px solid rgba(255,255,255,0.1)",fontFamily:"DM Sans, sans-serif"}}}),s.jsx("div",{className:"bg-grid"}),s.jsx("div",{className:"bg-gradient"}),s.jsx("header",{className:"header",children:s.jsxs("div",{className:"header-inner",children:[s.jsxs("div",{className:"logo",children:[s.jsx("div",{className:"logo-icon",children:s.jsx("img",{src:"/icons/icon-192.png",alt:"Saadi Video Downloader",width:"28",height:"28",style:{borderRadius:8,display:"block"}})}),s.jsxs("span",{className:"logo-text",children:["Saadi",s.jsx("span",{children:" Video Downloader"})]})]}),s.jsxs("nav",{className:"nav",children:[s.jsxs("button",{className:`nav-btn ${v==="download"?"active":""}`,onClick:()=>g("download"),children:[s.jsx(b,{d:x.download,size:16}),"Download"]}),s.jsxs("button",{className:`nav-btn ${v==="history"?"active":""}`,onClick:()=>g("history"),children:[s.jsx(b,{d:x.history,size:16}),"History",j.length>0&&s.jsx("span",{className:"badge",children:j.length})]})]}),!_&&$&&s.jsxs("button",{className:"install-btn",onClick:fe,children:[s.jsx(b,{d:x.install,size:15}),"Install App"]})]})}),s.jsxs("main",{className:"main",children:[v==="download"&&s.jsxs("div",{className:"download-tab animate-fadeIn",children:[s.jsxs("div",{className:"hero animate-fadeUp",children:[s.jsxs("div",{className:"hero-eyebrow",children:[s.jsx("span",{className:"dot"}),"HD Video Downloader"]}),s.jsxs("h1",{className:"hero-title",children:["Download Any",s.jsx("br",{}),s.jsx("span",{className:"title-accent",children:"Video Instantly"})]}),s.jsx("p",{className:"hero-sub",children:"YouTube · Facebook · Instagram · TikTok · Twitter/X · Vimeo"})]}),s.jsxs("div",{className:`input-card animate-fadeUp ${O?"drag-over":""}`,style:{animationDelay:"0.1s"},children:[O&&s.jsx("div",{className:"drop-overlay",children:"Drop URL here"}),s.jsxs("div",{className:"input-label",children:[s.jsx(b,{d:x.link,size:14}),"Video URL",Z&&s.jsxs("span",{className:"platform-tag",children:[Z," detected"]})]}),s.jsxs("div",{className:"input-row",children:[s.jsxs("div",{className:"input-wrapper",children:[s.jsx("input",{ref:z,type:"url",value:e,onChange:l=>t(l.target.value),onKeyDown:ye,placeholder:"https://www.youtube.com/watch?v=...",className:"url-input",autoComplete:"off",spellCheck:!1}),e&&s.jsx("button",{className:"clear-btn",onClick:xe,title:"Clear",children:s.jsx(b,{d:x.x,size:14})})]}),s.jsxs("button",{className:"paste-btn",onClick:ve,title:"Paste from clipboard",children:[s.jsx(b,{d:x.paste,size:16}),"Paste"]}),s.jsx("button",{className:`fetch-btn ${a?"loading":""}`,onClick:K,disabled:a,children:a?s.jsxs(s.Fragment,{children:[s.jsx("span",{className:"spinner"}),"Fetching..."]}):s.jsxs(s.Fragment,{children:[s.jsx(b,{d:x.info,size:16}),"Get Video"]})})]}),s.jsx("div",{className:"supported-platforms",children:["YouTube","Facebook","Instagram","TikTok","Twitter/X","Vimeo","Dailymotion","+1000 more"].map(l=>s.jsx("span",{className:"platform-chip",children:l},l))})]}),o&&s.jsxs("div",{className:"video-card animate-fadeUp",style:{animationDelay:"0.05s"},children:[s.jsxs("div",{className:"video-info",children:[o.thumbnail&&s.jsxs("div",{className:"thumbnail-wrap",children:[s.jsx("img",{src:o.thumbnail,alt:o.title,className:"thumbnail",loading:"lazy"}),s.jsx("div",{className:"thumb-play",children:s.jsx(b,{d:x.play,size:20,fill:"white",stroke:"none"})}),o.duration&&s.jsx("div",{className:"thumb-duration",children:re(o.duration)})]}),s.jsxs("div",{className:"video-meta",children:[s.jsxs("div",{className:"video-platform",children:[s.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round",children:s.jsx("path",{d:Dt(o.platform)})}),o.platform]}),s.jsx("h2",{className:"video-title",children:o.title}),s.jsxs("div",{className:"video-stats",children:[o.uploader&&s.jsxs("span",{className:"stat",children:[s.jsx(b,{d:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",size:12}),o.uploader]}),o.view_count&&s.jsxs("span",{className:"stat",children:[s.jsx(b,{d:x.eye,size:12}),Nt(o.view_count)]}),o.duration&&s.jsxs("span",{className:"stat",children:[s.jsx(b,{d:x.clock,size:12}),re(o.duration)]})]})]})]}),s.jsxs("div",{className:"quality-section",children:[s.jsx("div",{className:"quality-label",children:"Select Quality"}),s.jsx("div",{className:"quality-grid",children:(Q=o.qualities)==null?void 0:Q.map(l=>s.jsxs("button",{className:`quality-btn ${(r==null?void 0:r.id)===l.id?"selected":""}`,onClick:()=>c(l),children:[s.jsx("div",{className:"q-badge",style:{background:St[l.badge]||"#636e72"},children:l.badge}),s.jsx("div",{className:"q-label",children:l.label}),l.filesize&&s.jsx("div",{className:"q-size",children:kt(l.filesize)})]},l.id))})]}),m?s.jsxs("div",{className:"download-progress-wrap",children:[s.jsxs("div",{className:"progress-header",children:[s.jsxs("span",{children:["Downloading ",r==null?void 0:r.label,"…"]}),s.jsxs("span",{className:"progress-pct",children:[Math.round(f),"%"]})]}),s.jsx("div",{className:"progress-bar",children:s.jsx("div",{className:"progress-fill",style:{width:`${f}%`}})}),s.jsxs("button",{className:"cancel-btn",onClick:be,children:[s.jsx(b,{d:x.x,size:14}),"Cancel Download"]})]}):s.jsxs("button",{className:"download-btn",onClick:ge,disabled:!r,children:[s.jsx(b,{d:x.download,size:20}),"Download ",r==null?void 0:r.label,(r==null?void 0:r.id)==="audio"?" (MP3)":" (MP4)"]})]}),!o&&!a&&s.jsx("div",{className:"tips animate-fadeUp",style:{animationDelay:"0.2s"},children:s.jsx("div",{className:"tips-grid",children:[{icon:x.paste,title:"Paste URL",desc:"Copy any video link and paste it above, or use Ctrl+V anywhere on the page."},{icon:x.download,title:"Choose Quality",desc:"Pick from 4K, 1080p, 720p HD or audio-only MP3 download."},{icon:x.install,title:"Install App",desc:"Install Saadi Video Downloader (SVD) for quick access — no browser needed."}].map((l,u)=>s.jsxs("div",{className:"tip-card",style:{animationDelay:`${.2+u*.08}s`},children:[s.jsx("div",{className:"tip-icon",children:s.jsx(b,{d:l.icon,size:18})}),s.jsxs("div",{className:"tip-content",children:[s.jsx("div",{className:"tip-title",children:l.title}),s.jsx("div",{className:"tip-desc",children:l.desc})]})]},u))})})]}),v==="history"&&s.jsxs("div",{className:"history-tab animate-fadeIn",children:[s.jsxs("div",{className:"history-header",children:[s.jsx("h2",{className:"section-title",children:"Download History"}),j.length>0&&s.jsxs("button",{className:"clear-history-btn",onClick:we,children:[s.jsx(b,{d:x.trash,size:14}),"Clear All"]})]}),j.length===0?s.jsxs("div",{className:"empty-state",children:[s.jsx("div",{className:"empty-icon",children:s.jsx(b,{d:x.download,size:32,stroke:"var(--text3)"})}),s.jsx("div",{className:"empty-title",children:"No downloads yet"}),s.jsx("div",{className:"empty-desc",children:"Your download history will appear here."}),s.jsx("button",{className:"empty-cta",onClick:()=>g("download"),children:"Start Downloading"})]}):s.jsx("div",{className:"history-list",children:j.map((l,u)=>s.jsxs("div",{className:"history-item animate-fadeUp",style:{animationDelay:`${u*.04}s`},children:[l.thumbnail&&s.jsx("img",{src:l.thumbnail,alt:l.title,className:"history-thumb",loading:"lazy"}),s.jsxs("div",{className:"history-meta",children:[s.jsx("div",{className:"history-title",children:l.title}),s.jsxs("div",{className:"history-details",children:[s.jsx("span",{children:l.platform}),s.jsx("span",{className:"sep",children:"·"}),s.jsx("span",{children:l.quality}),s.jsx("span",{className:"sep",children:"·"}),s.jsx("span",{children:new Date(l.date).toLocaleDateString()})]})]}),s.jsxs("div",{className:"history-actions",children:[s.jsx("button",{className:"redownload-btn",onClick:()=>{t(l.url),g("download"),K()},title:"Re-download",children:s.jsx(b,{d:x.refresh,size:14})}),s.jsx("button",{className:"remove-btn",onClick:()=>je(l.id),title:"Remove",children:s.jsx(b,{d:x.trash,size:14})})]})]},l.id))})]})]}),s.jsx("footer",{className:"footer",children:s.jsx("p",{children:"Saadi Video Downloader (SVD) uses yt-dlp · For personal use only · Respect copyright laws"})})]})}J.createRoot(document.getElementById("root")).render(s.jsx($e.StrictMode,{children:s.jsx(Et,{})}));
