/*deltaImgJS
* deltaImgJS.js
*
*    Copyright (c) 2017 Yuji SODE <yuji.sode@gmail.com>
*
*    This software is released under the MIT License.
*    See LICENSE or http://opensource.org/licenses/mit-license.php
*/
//This function returns function that compares two image data on two canvas tags with RGBa-value.
/*
*=== Paremeter ===
* - canvasId1 and canvasId2: id of two canvas tags.
*=== Returned function ===
* - function(N,max,Vcrit): function that compares two image data on two canvas tags and returns size of
*   sampling area to scan (dx and dy).
*=== Parameters for returned function ===
* - N: positive integers; size of sampling area (dx and dy) is defined by dx=(canvas.width)/N and dy=(canvas.height)/N.
* - max: positive integers; number of sampling areas to scan.
* - Vcrit: critical value that ranges from 0 to 1.
*=== Property of returned function ===
* - result: {p:p-value,critical:critical value,sampling:number of scanned areas,dataset:datasets of differences}.
*============================================================
*/
function deltaImgJS(canvasId1,canvasId2){
    //canvasId1 and canvasId2: id of two target canvas tags
    canvasId2=(canvasId2!==undefined)?canvasId2:canvasId1;
    var slf=window,r9=slf.Math.random().toFixed(9).replace(/\./g,''),
        c1=slf.document.getElementById(canvasId1).getContext('2d'),
        c2=slf.document.getElementById(canvasId2).getContext('2d'),
        c0,cW=c1.canvas.width,cH=c1.canvas.height,
        bd=slf.document.getElementsByTagName('body')[0],
        div,p,cvs,i=0,x=0,y=0,dx=0,dy=0,d=[],
        /*element generator*/
        f=function(elName,elId,targetId){
            var t=slf.document.getElementById(targetId),E=slf.document.createElement(elName);
            E.id=elId;
            return t.appendChild(E);
        },
        /*function that compares two image data on two canvas tags and returns size of area to scan: dx and dy*/
        fImg=function(N,max,Vcrit){
            //N and max: positive integers
            //Vcrit: critical value that ranges from 0 to 1
            //dx=(canvas.width)/N and dy=(canvas.height)/N
            N=/^[1-9](?:[0-9]+)?$/.test(N)?+N:1;
            max=/^[1-9](?:[0-9]+)?$/.test(max)?+max:10;
            Vcrit=/^(?:1(?:\.0+)?|0(?:\.[0-9]+)?)$/.test(Vcrit)?Vcrit:0.05;
            var spt,B,U,W;
            //resetting result property
            fImg.result={};
            /*=== <generation of worker> ===*/
            spt=[
                'var N='+max+',Arr=[],alpha='+Vcrit+',',
                /*function that estimates average value of a given numerical array*/
                'f=function(A){var s=0,i=0,n=A.length;while(i<n){s+=A[i],i+=1;}return s/n;},',
                /*function that returns probability of elements in a given numerical array, which are not more than crit*/
                'p=function(A,crit){var s=0,i=0,n=A.length;while(i<n){s+=A[i]>crit?0:1,i+=1;}return s/n;};',
                /*head part of eventlistener*/
                'this.addEventListener(\'message\',',
                /*dealing with pixel data; Arr[j] ranges from 0 to 255; Arr[j] = 0 when two images are equivalent*/
                'function(e){var d=e.data;Arr.push(Math.abs(f(d[1])-f(d[0])));',
                /*posted value: {p:p-value,critical:critical value,sampling:number of scanned areas,dataset:datasets of differences}*/
                'if(!(Arr.length<N)){this.postMessage({p:p(Arr,alpha),critical:alpha,sampling:N,dataset:Arr});}}',
                /*tail part of eventlistener*/
                ',true);'
            ].join('');
            B=new Blob([spt],{type:'text/javascript'});
            U=slf.URL.createObjectURL(B);
            W=new Worker(U);
            W.addEventListener('message',function(e){
                fImg.result=e.data;
                slf.window.URL.revokeObjectURL(U),spt=B=U=W=null;
            },true);
            //if error in worker
            W.addEventListener('error',function(e){console.log(e.message);},true);
            /*=== </generation of worker> ===*/
            dx=cW/N,dy=cH/N;
            c0.strokeStyle='#f00',c0.lineWidth=1,c0.clearRect(0,0,c0.canvas.width,c0.canvas.height);
            i=0;
            while(i<max){
                x=Math.random()*cW,y=Math.random()*cH;
                d[0]=c1.getImageData(x,y,dx,dy).data,d[1]=c2.getImageData(x,y,dx,dy).data,c0.strokeRect(x,y,dx,dy),W.postMessage(d),i+=1;
            }
            return {dx:dx,dy:dy};
        };
    bd.id=r9;
    div=f('div','div'+r9,bd.id),div.style.cssText='border:1px solid #000;';
    p=f('p','p'+r9,div.id),p.textContent='Scanned areas: "'+canvasId1+'" and "'+canvasId2+'"';
    cvs=f('canvas','cvs'+r9,div.id),cvs.width=cW,cvs.height=cH,cvs.style.cssText='background:#fff;border:1px solid #000;';
    bd.removeAttribute('id');
    c0=cvs.getContext('2d');
    return fImg;
}
