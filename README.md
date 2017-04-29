# deltaImgJS
This function returns function that compares two image data on two canvas tags with RGBa-value.  
https://github.com/YujiSODE/deltaImgJS

>Copyright (c) 2017 Yuji SODE \<yuji.sode@gmail.com\>  
>This software is released under the MIT License.  
>See LICENSE or http://opensource.org/licenses/mit-license.php
______

## Script
* `deltaImgJS.js`: `function deltaImgJS(canvasId1,canvasId2)`  
This function returns function that compares two image data on two canvas tags with average RGBa-value.  

## Paremeters
- `canvasId1` and `canvasId2`: id of two canvas tags.  

## Returned function
- `function(N,max,Vcrit)`: function that compares two image data on two canvas tags,  
  and returns size of sampling area to scan (`dx` and `dy`).
### 1. Parameters for returned function
- `N`: positive integers; size of sampling area (`dx` and `dy`) is defined by  
  `dx=(canvas.width)/N` and `dy=(canvas.height)/N`.
- `max`: positive integers; number of sampling areas to scan.
- `Vcrit`: critical value that ranges from 0 to 1.
### 2. Property of returned function
- `result`: Result object.  

## Result object
{p:p-value,critical:critical value,sampling:number of scanned areas,dataset:datasets of differences}
