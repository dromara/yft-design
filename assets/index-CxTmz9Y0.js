var e=(e,t,a)=>new Promise(((s,l)=>{var n=e=>{try{r(a.next(e))}catch(t){l(t)}},o=e=>{try{r(a.throw(e))}catch(t){l(t)}},r=e=>e.done?s(e.value):Promise.resolve(e.value).then(n,o);r((a=a.apply(e,t)).next())}));import{u as t,a,s,P as l,_ as n,b as o,c as r}from"./index-9EiEhwdt.js";import{t as i,r as c,v as d,J as u,K as p,M as m,u as f,h,U as g,f as x,E as L,ad as v,x as w,y,a2 as _,P as Q,ag as k,I as b,a4 as j}from"./vue-CmC4XbA2.js";import{A as P,m as C,n as I,s as S,o as E,p as D,B as T,C as B,l as M,D as U,F as V,G as z,H as N,I as R}from"./element-plus-1ogla1Xa.js";import{g as W}from"./index-DoDvZAdO.js";import{t as G}from"./lodash-es-BIA5KqfU.js";import"./fabric-cgxnCsQC.js";import"./clipper-lib-dkorA9At.js";const H=i({__name:"MainSearch",setup(e){const t=c("1");return(e,a)=>{const s=C,l=I,n=S,o=E,r=D;return d(),u(r,{gutter:20,class:"h-[100px] flex items-center row-home"},{default:p((()=>[m(o,{span:10,offset:7},{default:p((()=>[m(n,{class:"h-[40px]","prefix-icon":f(P),placeholder:"五一假期"},{append:p((()=>[m(l,{modelValue:f(t),"onUpdate:modelValue":a[0]||(a[0]=e=>h(t)?t.value=e:null),placeholder:"Select"},{default:p((()=>[m(s,{label:"精选模版",value:"1"}),m(s,{label:"我的空间",value:"2"})])),_:1},8,["modelValue"])])),_:1},8,["prefix-icon"])])),_:1})])),_:1})}}}),F={key:0,class:"cursor-pointer"},Y={key:1},Z={class:"flex w-[30px] justify-center"},A={class:"flex w-[30px] justify-center"},K={class:"flex w-[30px] justify-center"},O=["src","onClick"],q={class:"title"},J={class:"content ellipsis_2"},$=r(i({__name:"index",setup(r){const i=t(),u=a(),h=c(!1),{loginStatus:P,username:C}=s(u),I=g({loading:!1,page:1,totalPage:1,column:6,move:!0,items:[]}),S=G((()=>e(this,null,(function*(){const e=document.getElementById("main");e.scrollHeight-(e.scrollTop+e.clientHeight)<=200&&I.page<I.totalPage&&(I.page+=1,yield X())}))),300),$=e=>{h.value=e},X=()=>e(this,null,(function*(){const e={page:I.page,size:l},t=yield W(e);t.data&&200===t.data.code&&(I.page=t.data.data.page,I.totalPage=t.data.data.total_pages,I.items=I.items.concat(t.data.data.items))}));let ee;return x((()=>{X();const e=document.getElementById("homeWaterfall");ee=new ResizeObserver((t=>{const a=t[0].contentRect;a.width>1200?I.column=6:a.width>900?I.column=5:a.width>600?I.column=4:a.width>300?I.column=3:a.width>200&&(I.column=2),e.style.setProperty("--column",I.column.toString())})),ee.observe(e)})),L((()=>{ee.disconnect()})),(e,t)=>{const a=E,s=B,l=M,r=D,c=U,u=v("IconNavigation"),g=V,x=o,L=v("IconViewList"),P=z,W=N,G=R,X=T,ee=n;return d(),w("div",null,[m(X,null,{default:p((()=>[m(c,{class:"border-b-[1px] items-center flex"},{default:p((()=>[m(r,{class:"justify-between items-center"},{default:p((()=>[m(a,{span:4,class:"h-[50px]"},{default:p((()=>t[1]||(t[1]=[y("img",{src:"data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'%20standalone='no'%20?%3e%3c!DOCTYPE%20svg%20PUBLIC%20'-//W3C//DTD%20SVG%201.1//EN'%20'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3e%3csvg%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20version='1.1'%20width='354.33070866141736px'%20height='354.33070866141736px'%20viewBox='0%200%20354.33070866141736%20354.33070866141736'%20xml:space='preserve'%3e%3cdesc%3eCreated%20with%20Fabric.js%206.0.0-beta12%3c/desc%3e%3cdefs%3e%3c/defs%3e%3cg%20transform='matrix(1%200%200%201%20177.6654%20177.6654)'%20id='WorkSpaceDrawType'%20%3e%3crect%20style='stroke:%20rgb(255,255,255);%20stroke-width:%201;%20stroke-dasharray:%20none;%20stroke-linecap:%20butt;%20stroke-dashoffset:%200;%20stroke-linejoin:%20miter;%20stroke-miterlimit:%204;%20fill:%20none;%20fill-rule:%20nonzero;%20opacity:%201;'%20x='-177.16535433070868'%20y='-177.16535433070868'%20rx='0'%20ry='0'%20width='354.33070866141736'%20height='354.33070866141736'%20/%3e%3c/g%3e%3cg%20transform='matrix(2.7116%200%200%202.7116%20177.6654%20177.6654)'%20id='N1mmNupYsE'%20%3e%3cpath%20style='stroke:%20none;%20stroke-width:%201;%20stroke-dasharray:%20none;%20stroke-linecap:%20butt;%20stroke-dashoffset:%200;%20stroke-linejoin:%20miter;%20stroke-miterlimit:%204;%20fill:%20rgb(255,94,23);%20fill-rule:%20nonzero;%20opacity:%201;'%20transform='%20translate(-55.74,%2034.8)'%20d='M%2053.28%20-69.6%20L%2028.32%200.48%20Q%2024.72%2010.68%2021.54%2016.92%20Q%2018.36%2023.16%2014.28%2025.98%20Q%2010.2%2028.8%203.84%2028.8%20L%203.84%2028.8%20Q%201.2%2028.8%20-1.44%2028.38%20Q%20-4.08%2027.96%20-7.08%2026.88%20L%20-7.08%2026.88%20L%20-5.4%2016.56%20Q%20-3.24%2017.16%20-1.2%2017.58%20Q%200.84%2018%203%2018%20L%203%2018%20Q%207.08%2018%209.84%2015%20Q%2012.6%2012%2014.04%207.32%20L%2014.04%207.32%20L%206.12%20-69.6%20L%2018%20-69.6%20L%2021.24%20-24.48%20Q%2021.48%20-20.88%2021.66%20-17.28%20Q%2021.84%20-13.68%2021.96%20-10.08%20L%2021.96%20-10.08%20Q%2023.16%20-13.68%2024.3%20-17.28%20Q%2025.44%20-20.88%2026.64%20-24.48%20L%2026.64%20-24.48%20L%2041.28%20-69.6%20L%2053.28%20-69.6%20Z%20M%2054.12%20-59.04%20L%2055.68%20-69.6%20L%2063.72%20-69.6%20L%2064.32%20-73.8%20Q%2065.64%20-83.4%2068.52%20-88.74%20Q%2071.4%20-94.08%2075.42%20-96.24%20Q%2079.44%20-98.4%2084.24%20-98.4%20L%2084.24%20-98.4%20Q%2088.2%20-98.4%2090.84%20-97.56%20L%2090.84%20-97.56%20L%2089.28%20-86.88%20Q%2088.32%20-87.12%2087.06%20-87.36%20Q%2085.8%20-87.6%2084.72%20-87.6%20L%2084.72%20-87.6%20Q%2079.68%20-87.6%2078%20-82.86%20Q%2076.32%20-78.12%2075.12%20-69.6%20L%2075.12%20-69.6%20L%2088.56%20-69.6%20L%2087%20-59.04%20L%2073.68%20-59.04%20L%2065.28%203.6%20L%2053.64%203.6%20L%2062.28%20-59.04%20L%2054.12%20-59.04%20Z%20M%2085.68%20-17.64%20L%2085.68%20-17.64%20L%2092.16%20-59.04%20L%2084.36%20-59.04%20L%2085.92%20-69.6%20L%2093.84%20-69.6%20L%2096.96%20-89.76%20L%20108%20-89.76%20L%20105%20-69.6%20L%20118.56%20-69.6%20L%20117%20-59.04%20L%20103.32%20-59.04%20L%2097.32%20-18.96%20Q%2096.36%20-12.36%2097.26%20-9.18%20Q%2098.16%20-6%20101.52%20-6%20L%20101.52%20-6%20Q%20104.4%20-6%20107.64%20-8.28%20L%20107.64%20-8.28%20L%20111.36%201.56%20Q%20107.64%203.24%20103.62%204.2%20Q%2099.6%205.16%2095.88%204.68%20Q%2092.16%204.2%2089.46%201.86%20Q%2086.76%20-0.48%2085.62%20-5.22%20Q%2084.48%20-9.96%2085.68%20-17.64%20Z'%20stroke-linecap='round'%20/%3e%3c/g%3e%3c/svg%3e",alt:"",class:"h-full"},null,-1)]))),_:1}),m(a,{span:6,class:"flex justify-end col-user"},{default:p((()=>[f(C)?(d(),w("div",F,[m(s,null,{default:p((()=>[_(Q(f(C)),1)])),_:1})])):(d(),w("div",Y,[m(l,{type:"primary",onClick:t[0]||(t[0]=e=>$(!0))},{default:p((()=>t[2]||(t[2]=[_("登陆/注册")]))),_:1})]))])),_:1})])),_:1})])),_:1}),m(X,null,{default:p((()=>[m(W,{width:"216px"},{default:p((()=>[m(P,{"active-text-color":"#000","default-active":"1",class:"pt-[20px] h-lvh"},{default:p((()=>[m(g,{index:"1"},{default:p((()=>[y("span",Z,[m(u)]),t[3]||(t[3]=y("span",null,"为你推荐",-1))])),_:1}),m(g,{index:"2"},{default:p((()=>[y("span",A,[m(x,{"icon-class":"chatgpt",className:"svg-size"})]),t[4]||(t[4]=y("span",null,"智能AI",-1))])),_:1}),m(g,{index:"3"},{default:p((()=>[y("span",K,[m(L)]),t[5]||(t[5]=y("span",null,"模版空间",-1))])),_:1})])),_:1})])),_:1}),m(G,{onScroll:f(S),class:"h-lvh",id:"main"},{default:p((()=>[m(H),m(r,{class:"mt-[40px]"},{default:p((()=>t[6]||(t[6]=[y("b",{class:"text-[20px]"},"今日推荐",-1)]))),_:1}),m(k,{name:f(I).move?"group":"",tag:"div",class:"waterfall-box",id:"homeWaterfall"},{default:p((()=>[(d(!0),w(b,null,j(f(I).items,((e,t)=>(d(),w("div",{class:"waterfall-item",key:e.id},[y("img",{class:"pic",src:e.preview,alt:"",ref_for:!0,ref:e=>((e,t)=>{if(!e)return;const a=()=>{const a=e.parentElement;if(!a)return;const s=t>=I.column?8:0,l=Math.ceil(a.clientHeight/2)+s;a.style.gridRowEnd=`span ${l}`};a(),e.onload=a,e.onerror=function(){e.src=new URL(""+new URL("loading-BkKY1T9W.gif",import.meta.url).href,import.meta.url).href,a()}})(e,t),onClick:t=>(e=>{const{href:t}=i.resolve({path:"/",query:{template:e}});window.open(t,"_blank")})(e.id)},null,8,O),y("div",q,Q(e.title),1),y("div",J,Q(e.text),1)])))),128))])),_:1},8,["name"])])),_:1},8,["onScroll"])])),_:1})])),_:1}),m(ee,{visible:f(h),onClose:$},null,8,["visible"])])}}}),[["__scopeId","data-v-d9d3b263"]]);export{$ as default};