!function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=13)}({13:function(t,e,n){"use strict";n.r(e);var r=function(t,e){const n=[];for(let r=0;r<t.length;r++){const o=n[n.length-1];o&&o.length!==e?o.push(t[r]):n.push([t[r]])}return n},o=function(t){let e=t.split("M");if(e.shift(),e.length>1)throw"TOO MANY LINES!!!1111 this only supports one continous vector";let n=[];var o=e[0].trim().split(/ L|C /),i=[];for(var a in o){var l=r(o[a].trim().split(" "),2);l.unshift(i),i=l[l.length-1],n.push(l)}return n.shift(),n},i=function(t,e){for(var n in t)t[n]=Number(t[n]),e[n]=Number(e[n]);return Math.sqrt(Math.pow(e[0]-t[0],2)+Math.pow(e[1]-t[1],2))},a=function(t,e,n,r){for(var o in t)t[o]=Number(t[o]),e[o]=Number(e[o]);const i=[(e[0]-t[0])/r,(e[1]-t[1])/r];return[t[0]+i[0]*n,t[1]+i[1]*n]},l=function(t,e,n,r=!1,o=0){let l=[];for(var f=0;f<t.length-1;f++){i(t[f],t[f+1]);let o=a(t[f],t[f+1],e,n);if(l.push(o),r){let e=Math.atan((t[f+1][0]-t[f][0])/(t[f+1][1]-t[f][1]))*(180/Math.PI);e=90+e,t[f+1][1]-t[f][1]<0&&(e=180+e),o.push(e)}}return l},f=function(t,e=100,n=!1){let r=[];if(2==t.length)for(var o=1;o<e;o++){if(0!=r.length)var i=r[r.length-1][2];let a=l(t,o,e,n,i);r.push(a)}else for(o=1;o<=e;o++){if(0!=r.length)i=r[r.length-1][2];let a=l(t,o,e),f=l(a,o,e),c=l(f,o,e,n,i);r.push(c)}return r};function c(t){const e=[],n=[...t.characters];let r=0;for(let o=0;o<t.characters.length;o++){const i=figma.createText();i.characters=n[o],i.textAlignHorizontal="CENTER",i.textAlignVertical="CENTER",i.textAutoResize="WIDTH_AND_HEIGHT",i.fontSize=t.fontSize,i.fontName=t.fontName,i.x=t.x+r,i.y=t.y+t.height+3,r+=i.width,figma.currentPage.appendChild(i),e.push(i)}figma.currentPage.selection=e,figma.viewport.scrollAndZoomIntoView(e)}var u=function(t,e,n,r){return new(n||(n=Promise))((function(o,i){function a(t){try{f(r.next(t))}catch(t){i(t)}}function l(t){try{f(r.throw(t))}catch(t){i(t)}}function f(t){var e;t.done?o(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(a,l)}f((r=r.apply(t,e||[])).next())}))};figma.showUI(__html__,{width:300,height:400}),figma.ui.onmessage=t=>u(void 0,void 0,void 0,(function*(){"do-the-thing"===t.type&&(clearInterval(g),function(){u(this,void 0,void 0,(function*(){for(const n of figma.currentPage.selection){if("VECTOR"==n.type){const r=o(n.vectorPaths[0].data);var t=n.x,e=n.y;figma.ui.postMessage({type:"svg",vectors:r,x:t,y:e})}"TEXT"==n.type&&(yield figma.loadFontAsync({family:n.fontName.family,style:n.fontName.style}),c(n))}}))}()),"cancel"===t.type&&figma.closePlugin("k"),"svg"===t.type&&(!function(t,e,n,r){let o=[];for(var i in t)o.push(...f(t[i],100,!0));let a=o;const l=[];for(var c=0;c<a.length;c++)if(isNaN(a[c][0][0]));else{const t=figma.createRectangle();t.resizeWithoutConstraints(.1,.4),t.y=a[c][0][1],t.x=a[c][0][0],t.rotation=a[c][0][2],figma.currentPage.appendChild(t),l.push(t)}figma.flatten(l),console.log(o)}(t.vectors,t.vectorLengths,t.x,t.y),figma.closePlugin())}));let s="";var h=function(t){s!=t&&(figma.ui.postMessage({type:"selection",value:t}),s=t)};var g=setInterval((function(){const t=figma.currentPage.selection;switch(t.length){case 2:t.filter(t=>"VECTOR"===t.type).length>0||t.filter(t=>"ELLIPSE"===t.type).length>0?1==t.filter(t=>"TEXT"===t.type).length?h("text"):h("clone"):h("nocurve");break;case 1:h("one");break;case 0:h("nothing");break;default:h("toomany")}}),600)}});