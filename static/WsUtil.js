var ws;
var canvas;
var context;
var canvasSecond;
var contextSecond;
var canvasX;
var canvasY;
var canvasLastX;
var canvasLastY;
var isDragging = false;
var canvasX_manual = 0;
var canvasY_manual = 0;
var recX_manual = 0;
var recY_manual = 0;
var recW_manual = 0;
var recH_manual = 0;
var rec_ww = 0;
var rec_hh = 0;
var CutType = 0;
var imgOrignalW = 0;
var imgOrignalH = 0;
var rorateAngleType = 0;
var cutXCaibian=0;
var cutYCaibian=0;
var isDrawMove = false;

var canvasLastX2;
var canvasLastY2;
var isDragging2 = false;
var canvasX_manual2 = 0;
var canvasY_manual2 = 0;
var recX_manual2 = 0;
var recY_manual2 = 0;
var recW_manual2 = 0;
var recH_manual2 = 0;
var rec_ww2 = 0;
var rec_hh2 = 0;
var imgOrignalW2 = 0;
var imgOrignalH2 = 0;
var isDrawMove2 = false;
var cutXCaibian2=0;
var cutYCaibian2=0;

var faceZuobiao=new Array()
var faceZuobiaoSecond=new Array()
var faceNum = 0;
var faceNumSecond = 0;
var isFaceOpen = false;
var isFaceOpenSecond = false;



function WsInit(orignalCanvasW,orignalCanvasH,orignalCanvasW2,orignalCanvasH2,enableCanvas){
 WsInit_ip(orignalCanvasW,orignalCanvasH,orignalCanvasW2,orignalCanvasH2,enableCanvas,"localhost");
}

function WsInit_ip(orignalCanvasW,orignalCanvasH,orignalCanvasW2,orignalCanvasH2,enableCanvas,ip) {
 if(enableCanvas){
   canvas=document.getElementById("cameraCanvas");
   context=canvas.getContext("2d");
   if(isSecondDev){
    canvasSecond=document.getElementById("cameraCanvasSecond");
    contextSecond=canvasSecond.getContext("2d");
    canvasSecond.onmousedown = canvasClick2;
    canvasSecond.onmouseup = stopDragging2;
    canvasSecond.onmouseout = stopDragging2;
    canvasSecond.onmousemove = canvasMove2;
  }
  canvas.onmousedown = canvasClick;
  canvas.onmouseup = stopDragging;
  canvas.onmouseout = stopDragging;
  canvas.onmousemove = canvasMove;
  canvasX = 0;
  canvasY = 0;
  canvasLastX = 0;
  canvasLastY = 0;
}

      //ws=new WebSocket("ws://localhost:9002");
      ws=new WebSocket("ws://"+ip+":9002");
      ws.binaryType = "arraybuffer" ;
      ws.onmessage = function(event) {

        var aDataArray = new Uint8Array( event.data );
        if(aDataArray.length>0){
         if(aDataArray[0] ==0xef && aDataArray[1] ==0x01){
				// getDeviceName(aDataArray[3]);
				// getResolution(aDataArray,5);
				getUsbCamareMessage(aDataArray,5)
                SetImagebase64(1)
			}else if(aDataArray[0] ==0xef && aDataArray[1] ==0x17){
				var camNum = aDataArray[3];
				//GetDevCount(camNum);
        InfoTextCallback(26,camNum);
      }else if(aDataArray[0] ==0xef && aDataArray[1] ==0x19){
        getResolution(aDataArray,5);

      }else if(aDataArray[0] ==0xef && aDataArray[1] ==0x23){
				//getResolution(aDataArray,4);
				var type = aDataArray[3];
				var len = aDataArray[4];
				var data = new Uint8Array(len);
				for(var i=0;i<len;i++){
					data[i] = aDataArray[5+i];
				}
				var str = byteToString(data)
				var text = decodeURIComponent(str);
				InfoTextCallback(type,text);

			}else if (aDataArray[0] ==0xef && aDataArray[1] ==0x05){
				var ww = aDataArray[3]*256+aDataArray[4];
				var hh = aDataArray[5]*256+aDataArray[6];
				context.clearRect(0,0,canvas.width, canvas.height);
				//sendMsgRefreshCam();
				var imgData=context.createImageData(ww,hh);
        var dataNum = 0;
        for (var i=0;i<imgData.data.length;i+=4)
        {
         imgData.data[i+0]=aDataArray[dataNum];
         imgData.data[i+1]=aDataArray[dataNum+1];
         imgData.data[i+2]=aDataArray[dataNum+2];
         imgData.data[i+3]=255;
         dataNum = dataNum +3;
       }
       sendMsgRefreshCam();

       if (CutType ==2){
         rec_ww = ww;
         rec_hh = hh;
         context.putImageData(imgData,canvas.width/2-ww/2, canvas.height/2-hh/2);
         refreshRect();
       }else context.putImageData(imgData,canvas.width/2-ww/2+canvasX, canvas.height/2-hh/2+canvasY);


        context.beginPath();
       context.strokeStyle = "rgb(0,255,0)";
       context.lineWidth=2;
       GetFaceZuobiao(canvas.width/2-ww/2+canvasX,canvas.height/2-hh/2+canvasY);


     }else if (aDataArray[0] ==0xef && aDataArray[1] ==0x0c){
      var ww = aDataArray[3]*256+aDataArray[4];
      var hh = aDataArray[5]*256+aDataArray[6];
      context.clearRect(0,0,canvas.width, canvas.height);
				//sendMsgRefreshCam();
				var imgData=context.createImageData(ww,hh);
        var dataNum = 0;
        for (var i=0;i<imgData.data.length;i+=4)
        {
         imgData.data[i+0]=aDataArray[dataNum];
         imgData.data[i+1]=aDataArray[dataNum+1];
         imgData.data[i+2]=aDataArray[dataNum+2];
         imgData.data[i+3]=255;
         dataNum = dataNum +3;
       }
       sendMsgRefreshCam();
       var Xdis = canvas.width/2-ww/2+canvasX;
       var Ydis = canvas.height/2-hh/2+canvasY;
       context.putImageData(imgData,Xdis, Ydis);

       var lenJiubian = aDataArray[7];


       context.beginPath();
       context.strokeStyle = "rgb(0,255,0)";
       context.lineWidth=2;

       for(var j=0;j<lenJiubian;j++){
         for(var i=0;i<3;i++){
          var aa = 1;
          if(aDataArray[8+i*6+j*24] ==1){
           aa = -1;
         }
         var bb = 1;
         if(aDataArray[11+i*6+j*24] ==1){
           bb = -1;
         }
         var cc = 1;
         if(aDataArray[14+i*6+j*24] ==1){
           cc = -1;
         }
         var dd = 1;
         if(aDataArray[17+i*6+j*24] ==1){
           dd = -1;
         }
         context.moveTo( aDataArray[9+i*6+j*24]*256*aa+aDataArray[10+i*6+j*24]*aa+Xdis,aDataArray[12+i*6+j*24]*256*bb+aDataArray[13+i*6+j*24]*bb+Ydis);
         context.lineTo(aDataArray[15+i*6+j*24]*256*cc+aDataArray[16+i*6+j*24]*cc+Xdis, aDataArray[18+i*6+j*24]*256*dd+aDataArray[19+i*6+j*24]*dd+Ydis);
         context.stroke();
       }
       var ee = 1;
       if(aDataArray[26+j*24] ==1){
        ee = -1;
      }
      var ff = 1;
      if(aDataArray[8+j*24] ==1){
        ff = -1;
      }
      context.moveTo( aDataArray[27+j*24]*256+aDataArray[28+j*24]+Xdis,aDataArray[30+j*24]*256+aDataArray[31+j*24]+Ydis);
      context.lineTo( aDataArray[9+j*24]*256+aDataArray[10+j*24]+Xdis,aDataArray[12+j*24]*256+aDataArray[13+j*24]+Ydis);
      context.stroke();
    }
     GetFaceZuobiao(canvas.width/2-ww/2+canvasX,canvas.height/2-hh/2+canvasY);
  }else if (aDataArray[0] ==0xef && aDataArray[1] ==0x14){
    var tmp = aDataArray[3];
    if(tmp == 0x46) {
      isFaceOpen = true;
    }else  if(tmp == 0x48) {
      isFaceOpenSecond = true;
    }else if(tmp == 0x5e) {
      isFaceOpen = true;
      isFaceOpenSecond = true;
    }else  if(tmp == 0x5f) {
      isFaceOpen = true;
    }else  if(tmp == 0x61) {
      isFaceOpenSecond = true;
    }

    InfoCallback(tmp);
  }else if (aDataArray[0] ==0xef && aDataArray[1] ==0x26){

    if(isSecondDev){
      var ww = aDataArray[3]*256+aDataArray[4];
      var hh = aDataArray[5]*256+aDataArray[6];
      contextSecond.clearRect(0,0,canvasSecond.width, canvasSecond.height);

      var imgData=contextSecond.createImageData(ww,hh);
      var dataNum = 0;
      for (var i=0;i<imgData.data.length;i+=4)
      {
        imgData.data[i+0]=aDataArray[dataNum];
        imgData.data[i+1]=aDataArray[dataNum+1];
        imgData.data[i+2]=aDataArray[dataNum+2];
        imgData.data[i+3]=255;
        dataNum = dataNum +3;

      }
      sendMsgRefreshCamSecond();


      contextSecond.putImageData(imgData,canvasSecond.width/2-ww/2, canvasSecond.height/2-hh/2);
      if (CutType ==2){
        rec_ww2 = ww;
        rec_hh2 = hh;
        refreshRect2();
      }

      GetFaceZuobiaoSecond(canvasSecond.width/2-ww/2,canvasSecond.height/2-hh/2)




    }
  }else if (aDataArray[0] ==0xef && aDataArray[1] ==0x30){
    var type1 = aDataArray[3];
    var ret = 1;
    if(type1==0){
      ret = -1;
    }
    var min = aDataArray[4]*ret;

    var type2 = aDataArray[5];
    ret = 1;
    if(type2==0){
      ret = -1;
    }
    var max = aDataArray[6]*ret;
    var text = ""+min+"*"+max;
    InfoTextCallback(23,text);
                       // GetBrightnessRange_ws(min,max);
                     }else if (aDataArray[0] ==0xef && aDataArray[1] ==0x32){
                      var type1 = aDataArray[3];
                      var ret = 1;
                      if(type1==0){
                        ret = -1;
                      }
                      var min = aDataArray[4]*ret;

                      var type2 = aDataArray[5];
                      ret = 1;
                      if(type2==0){
                        ret = -1;
                      }
                      var max = aDataArray[6]*ret;
                      var max = aDataArray[6]*ret;
                      var text = ""+min+"*"+max;
                      InfoTextCallback(22,text);
                       // GetExposureRange_ws(min,max);
                     }else if (aDataArray[0] ==0xef && aDataArray[1] ==0x36){
                      var len = aDataArray[3]*65536+aDataArray[4]*256+aDataArray[5];
                      var baseDataArray = new Uint8Array( len);
                      for(var i = 0;i<len;i++){
                       baseDataArray[i] =    aDataArray[6+i];
                     }
                     var str = byteToString(baseDataArray);
                     var text = decodeURIComponent(str);

                     var last = text.substr(str.length-2,1);
                     var lastSecond = text.substr(str.length-3,1);
                     if(last == "=" && lastSecond !="="){
                       text=text.substring(0,text.length-1)
                       text = text+"=";
                     }

                     InfoTextCallback(5,text);
                   }else if (aDataArray[0] ==0xef && aDataArray[1] ==0x3b){
                    camidMain = aDataArray[3];
                    if(isSecondDev){
                      camidSub = aDataArray[4];
                    }
                  }else if (aDataArray[0] ==0xef && aDataArray[1] ==0x3e){
                    var len = aDataArray[3]*65536+aDataArray[4]*256+aDataArray[5];
                    var baseDataArray = new Uint8Array( len);
                    for(var i = 0;i<len;i++){
                     baseDataArray[i] =    aDataArray[6+i];
                   }
                   var str = byteToString(baseDataArray);
                   var text = decodeURIComponent(str);

                   InfoTextCallback(19,text);

                 }else if (aDataArray[0] ==0xef && aDataArray[1] ==0x43){
                  var len = aDataArray[3]*65536+aDataArray[4]*256+aDataArray[5];
                  var baseDataArray = new Uint8Array( len);
                  for(var i = 0;i<len;i++){
                   baseDataArray[i] =    aDataArray[6+i];
                 }
                 var str = byteToString(baseDataArray);
                 var text = decodeURIComponent(str);

                 var last = text.substr(str.length-2,1);
                 var lastSecond = text.substr(str.length-3,1);
                 if(last == "=" && lastSecond !="="){
                   text=text.substring(0,text.length-1)
                   text = text+"=";
                 }

                 InfoTextCallback(21,text);
               }else if (aDataArray[0] ==0xef && aDataArray[1] ==0x4a){
                rorateAngleType = aDataArray[3];
              }else if (aDataArray[0] ==0xef && aDataArray[1] ==0x4c){
                var len = aDataArray[3]*65536+aDataArray[4]*256+aDataArray[5];
                var baseDataArray = new Uint8Array( len);
                for(var i = 0;i<len;i++){
                 baseDataArray[i] =    aDataArray[6+i];
               }
               var str = byteToString(baseDataArray);
               var text = decodeURIComponent(str);

               var last = text.substr(str.length-2,1);
               var lastSecond = text.substr(str.length-3,1);
               if(last == "=" && lastSecond !="="){
                 text=text.substring(0,text.length-1)
                 text = text+"=";
               }

               InfoTextCallback(25,text);
             }else if (aDataArray[0] ==0xef && aDataArray[1] ==0x5f){
              var len = aDataArray[3]*65536+aDataArray[4]*256+aDataArray[5];
              var baseDataArray = new Uint8Array( len);
              for(var i = 0;i<len;i++){
               baseDataArray[i] =    aDataArray[6+i];
             }
             var str = byteToString(baseDataArray);
             var text = decodeURIComponent(str);

             var last = text.substr(str.length-2,1);
             var lastSecond = text.substr(str.length-3,1);
             if(last == "=" && lastSecond !="="){
               text=text.substring(0,text.length-1)
               text = text+"=";
             }

             InfoTextCallback(28,text);
           }else if (aDataArray[0] ==0xef && aDataArray[1] ==0x60){
            faceNum = aDataArray[3];
            for(var j=0;j<faceNum*4;j++){

             var aa = 1;
             if(aDataArray[4+j*6] ==1){
              aa = -1;
            }

            faceZuobiao[j*2] = aDataArray[5+j*6]*256*aa+aDataArray[6+j*6]*aa;


             var bb = 1;
             if(aDataArray[7+j*6] ==1){
              bb = -1;
            }
            faceZuobiao[j*2+1] = aDataArray[8+j*6]*256*bb+aDataArray[9+j*6]*bb;

          }


        }else if (aDataArray[0] ==0xef && aDataArray[1] ==0x62){
            faceNumSecond = aDataArray[3];
            for(var j=0;j<faceNumSecond*4;j++){

             var aa = 1;
             if(aDataArray[4+j*6] ==1){
              aa = -1;
            }

            faceZuobiaoSecond[j*2] = aDataArray[5+j*6]*256*aa+aDataArray[6+j*6]*aa;


             var bb = 1;
             if(aDataArray[7+j*6] ==1){
              bb = -1;
            }
            faceZuobiaoSecond[j*2+1] = aDataArray[8+j*6]*256*bb+aDataArray[9+j*6]*bb;

          }


        }else if (aDataArray[0] ==0xef && aDataArray[1] ==0x67){
    var tmp = aDataArray[3];
    if(tmp == 0x00) {
      faceNum = 0;
    }else  if(tmp == 0x01) {
      faceNumSecond = 0;
    }
  }else if(aDataArray[0] ==0xef && aDataArray[1] ==0x71){
        //getResolution(aDataArray,4);
        var type = aDataArray[3];
        var len = aDataArray[4]*256+aDataArray[5];
        var data = new Uint8Array(len);
        for(var i=0;i<len;i++){
          data[i] = aDataArray[6+i];
        }
        var str = byteToString(data)
        var text = decodeURIComponent(str);
        InfoTextCallback(type,text);

      }else if (aDataArray[0] ==0xef && aDataArray[1] ==0x73){
              var len = aDataArray[3]*65536+aDataArray[4]*256+aDataArray[5];
              var baseDataArray = new Uint8Array( len);
              for(var i = 0;i<len;i++){
               baseDataArray[i] =    aDataArray[6+i];
             }
             var str = byteToString(baseDataArray);
             var text = decodeURIComponent(str);

             var last = text.substr(str.length-2,1);
             var lastSecond = text.substr(str.length-3,1);
             if(last == "=" && lastSecond !="="){
               text=text.substring(0,text.length-1)
               text = text+"=";
             }

             InfoTextCallback(30,text);
           }else if (aDataArray[0] ==0xef && aDataArray[1] ==0x7e){
                      var len = aDataArray[3]*65536+aDataArray[4]*256+aDataArray[5];
                      var baseDataArray = new Uint8Array( len);
                      for(var i = 0;i<len;i++){
                       baseDataArray[i] =    aDataArray[6+i];
                     }
                     var str = byteToString(baseDataArray);
                     var text = decodeURIComponent(str);

                     var last = text.substr(str.length-2,1);
                     var lastSecond = text.substr(str.length-3,1);
                     if(last == "=" && lastSecond !="="){
                       text=text.substring(0,text.length-1)
                       text = text+"=";
                     }

                     InfoTextCallback(33,text);
                   }else if(aDataArray[0] ==0xef && aDataArray[1] ==0x80){
        //getResolution(aDataArray,4);
        var len = aDataArray[3]*256+aDataArray[4];
        InfoTextCallback(34,len);

      }
      }

    };
                // ´ò¿ªWebSocket
                ws.onclose = function(event) {
                  //WebSocket Status:: Socket Closed
                  InfoCallback(0xa3);
                  alert("没有检测到高拍仪，请安装高拍仪后再使用！");
                };
                // ´ò¿ªWebSocket
                ws.onopen = function(event) {
                  if(enableCanvas){
                    sendMsgGetMainCameraID();
                    sendMsgRefreshDev();
                    initParameter(orignalCanvasW,orignalCanvasH,orignalCanvasW2,orignalCanvasH2);
                  }

                  InfoCallback(0x24);

                };
                ws.onerror =function(event){
                    //WebSocket Status:: Error was reported
                    InfoCallback(0xa4);
                    alert("没有检测到高拍仪，请安装高拍仪后再使用！");
                  };
                }

                function initParameter(orignalCanvasW,orignalCanvasH,orignalCanvasW2,orignalCanvasH2){
                 sendMsgBestSize();
                 sendMsgSetCutType(0);
                 sendMsgSetFileType(0);
                 sendMsgSetImageColorMode(0);
                 sendMsgSetConntinousShotModel(0);
                 sendMsgChangeOrientation(0);
                 sendMsgSetCanvasOriginalSize(orignalCanvasW,orignalCanvasH);
                 sendMsgSetCanvasSecondOriginalSize(orignalCanvasW2,orignalCanvasH2);

               }

               function canvasClick(e) {
                 isDragging = true;
                 if(!isDrawMove){
                  canvasLastX = 0;

                  canvasLastY = 0;
                  canvasX_manual = 0;
                  canvasY_manual = 0;

                  recX_manual = 0;
                  recY_manual = 0;
                  recW_manual = 0;
                  recH_manual = 0;
                } else {

                }
              }

              function stopDragging() {
               isDragging = false;
               canvasLastX = 0;
               canvasLastY = 0;
               canvasX_manual = 0;
               canvasY_manual = 0;
               if(CutType==2){
                bpp = rec_ww/imgOrignalW;
                if(rorateAngleType==1 || rorateAngleType==3){
                  bpp = rec_ww/imgOrignalH;
                }
                cutXCaibian = Math.abs(recW_manual)/bpp;
                cutYCaibian = Math.abs(recH_manual)/bpp;
              }
            }

            function canvasMove(e) {
              var mx = e.pageX - canvas.offsetLeft;
              var my = e.pageY - canvas.offsetTop;
              if(CutType == 2){
                var x1 = recX_manual;
                var x2 = recX_manual+recW_manual;
                if(x1>x2){
                  x1 = x2;
                  x2 = recX_manual;
                }

                var y1 = recY_manual;
                var y2 = recY_manual+recH_manual;
                if(y1>y2){
                  y1 = y2;
                  y2 = recY_manual;
                }

                if(x1<=mx && mx<=x2 && y1<=my && my<=y2){
                  isDrawMove = true;
                  if(isDragging){
                    if(canvasLastX == 0 && canvasLastY == 0){
                      canvasLastX = mx;
                      canvasLastY = my;

                    }else {
                      recX_manual = recX_manual +(mx-canvasLastX);
                      recY_manual = recY_manual +(my-canvasLastY);
                      canvasLastX = mx;
                      canvasLastY = my;
                    }

                  }
                  return;
                }else if(x1-30<=mx && mx<=x2+30 && y1-30<=my && my<=y2+30){
                 isDrawMove = true;
                 if(isDragging){
                   if(canvasLastX == 0 && canvasLastY == 0){

                    canvasLastX = mx;
                    canvasLastY = my;

                  }else {

                    var tmpX2 = recX_manual+ recW_manual;
                    if(Math.abs(recX_manual-mx)<Math.abs(tmpX2-mx)){
                      recX_manual = recX_manual +(mx-canvasLastX);
                      recW_manual = recW_manual -(mx-canvasLastX);
                    }else recW_manual = recW_manual +(mx-canvasLastX);

                    var tmpY2 = recY_manual+ recH_manual;
                    if(Math.abs(recY_manual-my)<Math.abs(tmpY2-my)){
                      recY_manual = recY_manual +(my-canvasLastY);
                      recH_manual = recH_manual -(my-canvasLastY);
                    }else recH_manual = recH_manual +(my-canvasLastY);

                    canvasLastX = mx;
                    canvasLastY = my;
                  }

                  return;
                }
              }else isDrawMove = false;
            }

            if (isDragging == true) {
              if(CutType != 2){
               if(canvasLastX == 0 && canvasLastY == 0){
                canvasLastX = e.pageX - canvas.offsetLeft;
                canvasLastY = e.pageY - canvas.offsetTop;

              }else {

                canvasX = canvasX +(mx-canvasLastX);
                canvasY = canvasY +(my-canvasLastY);
                canvasLastX = mx;
                canvasLastY = my;
              }
            }else {




             if(canvasLastX == 0 && canvasLastY == 0){

              canvasLastX = mx;
              canvasLastY = my;
              recX_manual = mx;
              recY_manual = my;
            }else {



              canvasX_manual = canvasX_manual +(mx-canvasLastX);
              canvasY_manual = canvasY_manual +(my-canvasLastY);
              canvasLastX = mx;
              canvasLastY = my;
              recW_manual = canvasX_manual;
              recH_manual = canvasY_manual;
            }

          }
        }
      }

      function canvasClick2(e) {
        isDragging2 = true;
        if(!isDrawMove2){
          canvasLastX2 = 0;

          canvasLastY2 = 0;
          canvasX_manual2 = 0;
          canvasY_manual2 = 0;

          recX_manual2 = 0;
          recY_manual2 = 0;
          recW_manual2 = 0;
          recH_manual2 = 0;
        }
      }

      function stopDragging2() {
        isDragging2 = false;
        canvasLastX2 = 0;
        canvasLastY2 = 0;
        canvasX_manual2 = 0;
        canvasY_manual2 = 0;
        if(CutType==2){
          var bpp2 = rec_ww2/imgOrignalW2;
          cutXCaibian2 = Math.abs(recW_manual2)/bpp2;
          cutYCaibian2 = Math.abs(recH_manual2)/bpp2;
        }
      }

      function canvasMove2(e) {
        var mx = e.pageX - canvasSecond.offsetLeft;
        var my = e.pageY - canvasSecond.offsetTop;
        if(CutType == 2){
          var x1 = recX_manual2;
          var x2 = recX_manual2+recW_manual2;
          if(x1>x2){
            x1 = x2;
            x2 = recX_manual2;
          }

          var y1 = recY_manual2;
          var y2 = recY_manual2+recH_manual2;
          if(y1>y2){
            y1 = y2;
            y2 = recY_manual2;
          }

          if(x1<=mx && mx<=x2 && y1<=my && my<=y2){
            isDrawMove2 = true;
            if(isDragging2){
              if(canvasLastX2 == 0 && canvasLastY2 == 0){
                canvasLastX2 = mx;
                canvasLastY2 = my;

              }else {
                recX_manual2 = recX_manual2 +(mx-canvasLastX2);
                recY_manual2 = recY_manual2 +(my-canvasLastY2);
                canvasLastX2 = mx;
                canvasLastY2 = my;
              }

            }
            return;

          }else if(x1-30<=mx && mx<=x2+30 && y1-30<=my && my<=y2+30){
           isDrawMove2 = true;
           if(isDragging2){
             if(canvasLastX2 == 0 && canvasLastY2 == 0){

              canvasLastX2 = mx;
              canvasLastY2 = my;

            }else {

              var tmpX2 = recX_manual2+ recW_manual2;
              if(Math.abs(recX_manual2-mx)<Math.abs(tmpX2-mx)){
                recX_manual2 = recX_manual2 +(mx-canvasLastX2);
                recW_manual2 = recW_manual2 -(mx-canvasLastX2);
              }else recW_manual2 = recW_manual2 +(mx-canvasLastX2);

              var tmpY2 = recY_manual2+ recH_manual2;
              if(Math.abs(recY_manual2-my)<Math.abs(tmpY2-my)){
                recY_manual2 = recY_manual2 +(my-canvasLastY2);
                recH_manual2 = recH_manual2 -(my-canvasLastY2);
              }else recH_manual2 = recH_manual2 +(my-canvasLastY2);

              canvasLastX2 = mx;
              canvasLastY2 = my;
            }

            return;
          }
        }else isDrawMove2 = false;
      }

      if (isDragging2 == true) {
        if(CutType != 2){

        }else {

          if(canvasLastX2 == 0 && canvasLastY2 == 0){

            canvasLastX2 = mx;
            canvasLastY2 = my;
            recX_manual2 = mx;
            recY_manual2 = my;
          }else {

            canvasX_manual2 = canvasX_manual2 +(mx-canvasLastX2);
            canvasY_manual2 = canvasY_manual2 +(my-canvasLastY2);
            canvasLastX2 = mx;
            canvasLastY2 = my;
            recW_manual2 = canvasX_manual2;
            recH_manual2 = canvasY_manual2;
          }

        }
      }
    }

    function getResolution(arrayData,tmpNum) {
      var type = arrayData[3]
      var len = arrayData[4];
      var data = new Int32Array(len*2);
      var num = 0;
      for(var i=0;i<len;i++){
        data[num] = arrayData[tmpNum]*256 +arrayData[tmpNum+1];
        num++;
        data[num] = arrayData[tmpNum+2]*256 +arrayData[tmpNum+3];
        num++;
        tmpNum += 4;
      }
      if(type==0){
       GetDeviceResolution(data);
     }else {
       if(isSecondDev){
        GetDeviceResolutionSecond(data);
        LoadOver2();
      }
    }

  }

  function getUsbCamareMessage(arrayData,tmpNum) {
    var numCam = arrayData[3];
    var len = arrayData[4];
    var data = new Int32Array(len*2);
    var num = 0;
    for(var i=0;i<len;i++){
      data[num] = arrayData[tmpNum]*256 +arrayData[tmpNum+1];
      num++;
      data[num] = arrayData[tmpNum+2]*256 +arrayData[tmpNum+3];
      num++;
      tmpNum += 4;
    }
    GetDeviceResolution(data);
    LoadOver();

    var strUsbNamr =new Array()
    for(var i=0;i<numCam;i++){
      var tmpLen = arrayData[tmpNum];
      var tmpData = new Uint8Array(tmpLen);
      tmpNum++;
      for(var j=0;j<tmpLen;j++){
       tmpData[j] = arrayData[tmpNum];
       tmpNum++;
     }
                       // var arr =       Utf8ToUnicode(tmpData)
                       var str = byteToString(tmpData);
                       var text = decodeURIComponent(str);
                       strUsbNamr[i] = text;
                     }
                     GetDevName(numCam,strUsbNamr);


                   }



                   function sendMsgRefreshCam(){
                     var aDataArray = new Uint8Array(3);
                     aDataArray[0] = 0xef;
                     aDataArray[1] = 0x04;
                     aDataArray[2] = 0x00;
                     ws.send(aDataArray.buffer);
                   }

                   function sendMsgStartVideo2(camId,width,height){


                    imgOrignalW2 = width;
                    imgOrignalH2 = height;
                    var aDataArray = new Uint8Array(8);
                    aDataArray[0] = 0xef;
                    aDataArray[1] = 0x25;
                    aDataArray[2] = 0x05;
                    aDataArray[3] = camId;
                    aDataArray[4] = width/256;
                    aDataArray[5] = width%256;
                    aDataArray[6] = height/256;
                    aDataArray[7] = height%256;
                    ws.send(aDataArray.buffer);
                  }
                  function sendMsgRefreshCamSecond(){
                    var aDataArray = new Uint8Array(3);
                    aDataArray[0] = 0xef;
                    aDataArray[1] = 0x27;
                    aDataArray[2] = 0x00;
                    ws.send(aDataArray.buffer);
                  }
                  function sendMsgSetCanvasOriginalSize(ww,hh){
                   var aDataArray = new Uint8Array(7);
                   aDataArray[0] = 0xef;
                   aDataArray[1] = 0x15;
                   aDataArray[2] = 0x04;
                   aDataArray[3] = ww/256;
                   aDataArray[4] = ww%256;
                   aDataArray[5] = hh/256;
                   aDataArray[6] = hh%256;
                   ws.send(aDataArray.buffer);
                 }
                 function sendMsgSetCanvasSecondOriginalSize(ww,hh){
                  var aDataArray = new Uint8Array(7);
                  aDataArray[0] = 0xef;
                  aDataArray[1] = 0x37;
                  aDataArray[2] = 0x04;
                  aDataArray[3] = ww/256;
                  aDataArray[4] = ww%256;
                  aDataArray[5] = hh/256;
                  aDataArray[6] = hh%256;
                  ws.send(aDataArray.buffer);
                }
                function sendMsgRefreshDev(){
                 var aDataArray = new Uint8Array(3);
                 aDataArray[0] = 0xef;
                 aDataArray[1] = 0x00;
                 aDataArray[2] = 0x00;
                 ws.send(aDataArray.buffer);
               }
               function sendMsgStartVideo(camId,width,height){

                if(width==3672){
                  imgOrignalW = 3264;
                  imgOrignalH = 2448;

                }else {
                 imgOrignalW = width;
                 imgOrignalH = height;
               }
               var aDataArray = new Uint8Array(8);
               aDataArray[0] = 0xef;
               aDataArray[1] = 0x02;
               aDataArray[2] = 0x05;
               aDataArray[3] = camId;
               aDataArray[4] = width/256;
               aDataArray[5] = width%256;
               aDataArray[6] = height/256;
               aDataArray[7] = height%256;
               ws.send(aDataArray.buffer);
             }
             function sendMsgChangeOrientation(type){
               var aDataArray = new Uint8Array(4);
               aDataArray[0] = 0xef;
               aDataArray[1] = 0x06;
               aDataArray[2] = 0x01;
               aDataArray[3] = type;
               ws.send(aDataArray.buffer);
             }
             function sendMsgSetImageColorMode(type){
               var aDataArray2 = new Uint8Array(4);
               aDataArray2[0] = 0xef;
               aDataArray2[1] = 0x07;
               aDataArray2[2] = 0x01;
               aDataArray2[3] = type;
               ws.send(aDataArray2.buffer);
             }

             function sendMsgCloseVideo(){

               var aDataArray = new Uint8Array(3);
               aDataArray[0] = 0xef;
               aDataArray[1] = 0x08;
               aDataArray[2] = 0x00;
               ws.send(aDataArray.buffer);
               context.clearRect(0,0,canvas.width, canvas.height);
             }

             function sendMsgCloseVideoSecond(){

              var aDataArray = new Uint8Array(3);
              aDataArray[0] = 0xef;
              aDataArray[1] = 0x28;
              aDataArray[2] = 0x00;
              ws.send(aDataArray.buffer);
              contextSecond.clearRect(0,0,canvas.width, canvas.height);
            }
            function sendMsgChangeResolution(camId,width,height){



            	var aDataArray = new Uint8Array(8);
            	aDataArray[0] = 0xef;
            	aDataArray[1] = 0x02;
            	aDataArray[2] = 0x05;
            	aDataArray[3] = camId;
            	aDataArray[4] = width/256;
            	aDataArray[5] = width%256;
            	aDataArray[6] = height/256;
            	aDataArray[7] = height%256;
            	ws.send(aDataArray.buffer);
            }

            function sendMsgSetFilePath(pathUnicode){
            	var path = encodeURI(pathUnicode);
            	var pathdata = stringToByte(path);
            	var len = path.length;
            	var aDataArray = new Uint8Array(3+len);
            	aDataArray[0] = 0xef;
            	aDataArray[1] = 0x1c;
            	aDataArray[2] = len;
            	for(var i=0;i<len;i++){
            		aDataArray[3+i] = pathdata[i];
            	}
            	ws.send(aDataArray.buffer);
            }

            function sendMsgSetFileNameModelCustom(index,pathUnicode){
            	var path = encodeURI(pathUnicode);
            	var pathdata = stringToByte(path);
            	var len = path.length;
            	var aDataArray = new Uint8Array(6+len);
            	aDataArray[0] = 0xef;
            	aDataArray[1] = 0x1d;
            	aDataArray[2] = len+3;
            	aDataArray[3] = index/256;
            	aDataArray[4] = index%256;
            	aDataArray[5] = len;
            	for(var i=0;i<len;i++){
            		aDataArray[6+i] = pathdata[i];
            	}
            	ws.send(aDataArray.buffer);
            }

            function sendMsgSetFileNameModelCustomSecond(index,pathUnicode){
              var path = encodeURI(pathUnicode);
              var pathdata = stringToByte(path);
              var len = path.length;
              var aDataArray = new Uint8Array(6+len);
              aDataArray[0] = 0xef;
              aDataArray[1] = 0x46;
              aDataArray[2] = len+3;
              aDataArray[3] = index/256;
              aDataArray[4] = index%256;
              aDataArray[5] = len;
              for(var i=0;i<len;i++){
                aDataArray[6+i] = pathdata[i];
              }
              ws.send(aDataArray.buffer);
            }

            function sendMsgSetFileNameModelFixed(pathUnicode){
            	var path = encodeURI(pathUnicode);
            	var pathdata = stringToByte(path);
            	var len = path.length;
            	var aDataArray = new Uint8Array(3+len);
            	aDataArray[0] = 0xef;
            	aDataArray[1] = 0x1f;
            	aDataArray[2] = len;
            	for(var i=0;i<len;i++){
            		aDataArray[3+i] = pathdata[i];
            	}
            	ws.send(aDataArray.buffer);
            }

            function sendMsgSetFileNameModelFixedSecond(pathUnicode){
              var path = encodeURI(pathUnicode);
              var pathdata = stringToByte(path);
              var len = path.length;
              var aDataArray = new Uint8Array(3+len);
              aDataArray[0] = 0xef;
              aDataArray[1] = 0x48;
              aDataArray[2] = len;
              for(var i=0;i<len;i++){
                aDataArray[3+i] = pathdata[i];
              }
              ws.send(aDataArray.buffer);
            }

            function sendMsgSetFileNameModelTime(){
            	var aDataArray = new Uint8Array(3);
            	aDataArray[0] = 0xef;
            	aDataArray[1] = 0x1e;
            	aDataArray[2] = 0x00;
            	ws.send(aDataArray.buffer);
            }

            function sendMsgSetFileNameModelTimeSecond(){
              var aDataArray = new Uint8Array(3);
              aDataArray[0] = 0xef;
              aDataArray[1] = 0x47;
              aDataArray[2] = 0x00;
              ws.send(aDataArray.buffer);
            }

            function sendMsgSetFileNameModelBarcode(){
              var aDataArray = new Uint8Array(3);
              aDataArray[0] = 0xef;
              aDataArray[1] = 0x2b;
              aDataArray[2] = 0x00;
              ws.send(aDataArray.buffer);
            }

            function sendMsgSetFileType(type){
            	var aDataArray = new Uint8Array(4);
            	aDataArray[0] = 0xef;
            	aDataArray[1] = 0x20;
            	aDataArray[2] = 0x01;
            	aDataArray[3] = type;
            	ws.send(aDataArray.buffer);
            }

            function sendMsgSetConntinousShotModel(type){
            	var aDataArray = new Uint8Array(4);
            	aDataArray[0] = 0xef;
            	aDataArray[1] = 0x21;
            	aDataArray[2] = 0x01;
            	aDataArray[3] = type;
            	ws.send(aDataArray.buffer);
            }

            function sendMsgSetConntinousShotModelTime(len){
            	var aDataArray = new Uint8Array(5);
            	aDataArray[0] = 0xef;
            	aDataArray[1] = 0x22;
            	aDataArray[2] = 0x02;
            	aDataArray[3] = len/256;
            	aDataArray[4] = len%256;
            	ws.send(aDataArray.buffer);
            }

            function sendMsgUploadFile(uploadSerHead,uploadSerLast,uploadSerFile){
            	var path = encodeURI(uploadSerHead);
            	var pathdata = stringToByte(path);
            	var len = path.length;

            	var path2 = encodeURI(uploadSerLast);
            	var pathdata2 = stringToByte(path2);
            	var len2 = path2.length;

            	var path3 = encodeURI(uploadSerFile);
            	var pathdata3 = stringToByte(path3);
            	var len3 = path3.length;

            	var aDataArray = new Uint8Array(8+len+len2+len3);
            	aDataArray[0] = 0xef;
            	aDataArray[1] = 0x24;
            	aDataArray[2] = 5+len+len2+len3;
            	aDataArray[3] = 0x00;
            	aDataArray[4] = 80%256;
            	aDataArray[5] = len;
            	for(var i=0;i<len;i++){
            		aDataArray[6+i] = pathdata[i];
            	}
            	aDataArray[6+len] = len2;
            	for(var i=0;i<len2;i++){
            		aDataArray[7+len+i] = pathdata2[i];
            	}
            	aDataArray[7+len+len2] = len3;
            	for(var i=0;i<len3;i++){
            		aDataArray[8+len+len2+i] = pathdata3[i];
            	}
            	ws.send(aDataArray.buffer);

            }

            function sendMsgUploadFilePort(port,uploadSerHead,uploadSerLast,uploadSerFile){
            	var path = encodeURI(uploadSerHead);
            	var pathdata = stringToByte(path);
            	var len = path.length;

            	var path2 = encodeURI(uploadSerLast);
            	var pathdata2 = stringToByte(path2);
            	var len2 = path2.length;

            	var path3 = encodeURI(uploadSerFile);
            	var pathdata3 = stringToByte(path3);
            	var len3 = path3.length;

            	var aDataArray = new Uint8Array(8+len+len2+len3);
            	aDataArray[0] = 0xef;
            	aDataArray[1] = 0x24;
            	aDataArray[2] = 5+len+len2+len3;
            	aDataArray[3] = port/256;
            	aDataArray[4] = port%256;
            	aDataArray[5] = len;
            	for(var i=0;i<len;i++){
            		aDataArray[6+i] = pathdata[i];
            	}
            	aDataArray[6+len] = len2;
            	for(var i=0;i<len2;i++){
            		aDataArray[7+len+i] = pathdata2[i];
            	}
            	aDataArray[7+len+len2] = len3;
            	for(var i=0;i<len3;i++){
            		aDataArray[8+len+len2+i] = pathdata3[i];
            	}
            	ws.send(aDataArray.buffer);

            }

            function sendMsgCapture(type){
            	if(type != 2){
            		var aDataArray = new Uint8Array(4);
            		aDataArray[0] = 0xef;
            		aDataArray[1] = 0x0a;
            		aDataArray[2] = 0x01;
            		aDataArray[3] = 0x00;
            		ws.send(aDataArray.buffer);
            	}else {
                var x1 = recX_manual;
                if(recX_manual>recX_manual+recW_manual){
                  x1 = recX_manual+recW_manual;

                }
                var y1 = recY_manual;
                if(recY_manual>recY_manual+recH_manual){
                  y1 = recY_manual+recH_manual;

                }


              //   var bpp = rec_ww/imgOrignalW;

              // if(rorateAngleType==1 || rorateAngleType==3){
              //   bpp = rec_hh/imgOrignalH;
              // }

                //var w1 = Math.abs(recW_manual/bpp);
              //  var h1 = Math.abs(recH_manual/bpp);
              var xsend = x1 - (canvas.width/2-rec_ww/2);
              var ysend = y1 - (canvas.height/2-rec_hh/2);


              if(xsend<0)xsend=0;
              if(ysend<0)ysend=0;
              var aDataArray = new Uint8Array(11);
              aDataArray[0] = 0xef;
            		//aDataArray[1] = 0x0f;
                aDataArray[1] = 0x4b;
                aDataArray[2] = 0x08;
                aDataArray[3] = xsend/256;
                aDataArray[4] = xsend%256;
                aDataArray[5] = ysend/256;
                aDataArray[6] = ysend%256;
                aDataArray[7] = cutXCaibian/256;
                aDataArray[8] = cutXCaibian%256;
                aDataArray[9] = cutYCaibian/256;
                aDataArray[10] = cutYCaibian%256;
                // aDataArray[7] = recW_manual/256;
                // aDataArray[8] = recW_manual%256;
                // aDataArray[9] = recH_manual/256;
                // aDataArray[10] = recH_manual%256;
                ws.send(aDataArray.buffer);
              }

            }

            function sendMsgCaptureSecond(){
              var aDataArray = new Uint8Array(3);
              aDataArray[0] = 0xef;
              aDataArray[1] = 0x29;
              aDataArray[2] = 0x00;
              ws.send(aDataArray.buffer);
            }

            function sendMsgCaptureSecondCaibian(){
              var x1 = recX_manual2;
              if(recX_manual2>recX_manual2+recW_manual2){
                x1 = recX_manual2+recW_manual2;

              }
              var y1 = recY_manual2;
              if(recY_manual2>recY_manual2+recH_manual2){
                y1 = recY_manual2+recH_manual2;

              }

              var xsend = x1 - (canvasSecond.width/2-rec_ww2/2);
              var ysend = y1 - (canvasSecond.height/2-rec_hh2/2);


              if(xsend<0)xsend=0;
              if(ysend<0)ysend=0;
              var aDataArray = new Uint8Array(11);
              aDataArray[0] = 0xef;
              aDataArray[1] = 0x4c;
              aDataArray[2] = 0x08;
              aDataArray[3] = xsend/256;
              aDataArray[4] = xsend%256;
              aDataArray[5] = ysend/256;
              aDataArray[6] = ysend%256;
              aDataArray[7] = cutXCaibian2/256;
              aDataArray[8] = cutXCaibian2%256;
              aDataArray[9] = cutYCaibian2/256;
              aDataArray[10] = cutYCaibian2%256;

              ws.send(aDataArray.buffer);
            }

            function sendMsgShowImageSettingWindow(){
            	var aDataArray = new Uint8Array(3);
            	aDataArray[0] = 0xef;
            	aDataArray[1] = 0x0b;
            	aDataArray[2] = 0x00;
            	ws.send(aDataArray.buffer);
            }

            function sendMsgShowImageSettingWindowB(){
              var aDataArray = new Uint8Array(3);
              aDataArray[0] = 0xef;
              aDataArray[1] = 0x45;
              aDataArray[2] = 0x00;
              ws.send(aDataArray.buffer);
            }


            function sendMsgZoom(type){
            	var aDataArray = new Uint8Array(4);
            	aDataArray[0] = 0xef;
            	aDataArray[1] = 0x0d;
            	aDataArray[2] = 0x01;
            	aDataArray[3] = type;
            	ws.send(aDataArray.buffer);
            }

            function sendMsgSetCutType(type) {
              canvasX = 0;
              canvasY = 0;
              CutType = type;
              var aDataArray = new Uint8Array(4);

              aDataArray[0] = 0xef;
              aDataArray[1] = 0x0e;
              aDataArray[2] = 0x01;
              aDataArray[3] = type;
              ws.send(aDataArray.buffer);

            }

            function sendMsgSetJiubianModel(type) {
            	var aDataArray = new Uint8Array(4);
            	aDataArray[0] = 0xef;
            	aDataArray[1] = 0x10;
            	aDataArray[2] = 0x01;
            	aDataArray[3] = type;
            	ws.send(aDataArray.buffer);

            }

            function sendMsgGetCamNum() {
            	var aDataArray = new Uint8Array(3);
            	aDataArray[0] = 0xef;
            	aDataArray[1] = 0x16;
            	aDataArray[2] = 0x00;
            	ws.send(aDataArray.buffer);

            }

            function sendMsgGetResolution(camid) {
            	var aDataArray = new Uint8Array(5);
            	aDataArray[0] = 0xef;
            	aDataArray[1] = 0x18;
            	aDataArray[2] = 0x02;
              aDataArray[3] = 0x00;
              aDataArray[4] = camid;
              ws.send(aDataArray.buffer);
            }

            function sendMsgGetResolutionSecond(camid) {
              var aDataArray = new Uint8Array(5);
              aDataArray[0] = 0xef;
              aDataArray[1] = 0x18;
              aDataArray[2] = 0x02;
              aDataArray[3] = 0x01;
              aDataArray[4] = camid;
              ws.send(aDataArray.buffer);
            }

            function sednMsgSavePDF(pathUnicode){
            	var path = encodeURI(pathUnicode);
            	var pathdata = stringToByte(path);
            	var len = path.length;
            	var aDataArray = new Uint8Array(3+len);
            	aDataArray[0] = 0xef;
            	aDataArray[1] = 0x11;
            	aDataArray[2] = len;
            	for(var i=0;i<len;i++){
            		aDataArray[3+i] = pathdata[i];
            	}
            	ws.send(aDataArray.buffer);
            }

            function sednMsgAddPDF(pathUnicode){
            	var path = encodeURI(pathUnicode);
            	var pathdata = stringToByte(path);
            	var len = path.length;
            	var aDataArray = new Uint8Array(3+len);
            	aDataArray[0] = 0xef;
            	aDataArray[1] = 0x12;
            	aDataArray[2] = len;
            	for(var i=0;i<len;i++){
            		aDataArray[3+i] = pathdata[i];
            	}
            	ws.send(aDataArray.buffer);
            }

            function sednMsgWaterMarkOpen(pathUnicode,fontSize,fontStyleIndex,r,g,b,xoffset,yoffset){
            	var path = encodeURI(pathUnicode);
            	var pathdata = stringToByte(path);
            	var len = path.length;

            	var aDataArray = new Uint8Array(11+len);
            	aDataArray[0] = 0xef;
            	aDataArray[1] = 0x1a;
            	aDataArray[2] = 8+len;
            	aDataArray[3] = fontSize;
            	aDataArray[4] = fontStyleIndex;
            	aDataArray[5] = r;
            	aDataArray[6] = g;
            	aDataArray[7] = b;
            	aDataArray[8] = xoffset;
            	aDataArray[9] = yoffset;
            	aDataArray[10] = len;
            	for(var i=0;i<len;i++){
            		aDataArray[11+i] = pathdata[i];
            	}
            	ws.send(aDataArray.buffer);
            }

            function sednMsgWaterMarkClose(){
            	var aDataArray = new Uint8Array(3);
            	aDataArray[0] = 0xef;
            	aDataArray[1] = 0x1b;
            	aDataArray[2] = 0x00;
            	ws.send(aDataArray.buffer);
            }

            function sednMsgBubaiType(type){
              var aDataArray = new Uint8Array(4);
              aDataArray[0] = 0xef;
              aDataArray[1] = 0x2c;
              aDataArray[2] = 0x01;
              aDataArray[3] = type;
              ws.send(aDataArray.buffer);
            }

            function sednMsgQuqudiseType(type){
              var aDataArray = new Uint8Array(4);
              aDataArray[0] = 0xef;
              aDataArray[1] = 0x34;
              aDataArray[2] = 0x01;
              aDataArray[3] = type;
              ws.send(aDataArray.buffer);
            }

            function sendMsgCombineTwoImage(path1Unicode,path2Unicode,path3Unicode,type){
            	var path1 = encodeURI(path1Unicode);
            	var pathdata1 = stringToByte(path1);
            	var len1 = path1.length;

            	var path2 = encodeURI(path2Unicode);
            	var pathdata2 = stringToByte(path2);
            	var len2 = path2.length;

            	var path3 = encodeURI(path3Unicode);
            	var pathdata3 = stringToByte(path3);
            	var len3 = path3.length;

            	var aDataArray = new Uint8Array(7+len1+len2+len3);
            	aDataArray[0] = 0xef;
            	aDataArray[1] = 0x13;
            	aDataArray[2] = len1+len2+len3+4;
            	aDataArray[3] = type;
            	aDataArray[4] = len1;
            	for(var i=0;i<len1;i++){
            		aDataArray[5+i] = pathdata1[i];
            	}
            	aDataArray[5+len1] = len2;
            	for(var i=0;i<len2;i++){
            		aDataArray[6+len1+i] = pathdata2[i];
            	}

            	aDataArray[6+len1+len2] = len3;
            	for(var i=0;i<len3;i++){
            		aDataArray[7+len1+len2+i] = pathdata3[i];
            	}
            	ws.send(aDataArray.buffer);
            }

            function sendMsgSetAutoExposure(type){
              var aDataArray = new Uint8Array(4);
              aDataArray[0] = 0xef;
              aDataArray[1] = 0x2d;
              aDataArray[2] = 0x01;
              aDataArray[3] = type;
              ws.send(aDataArray.buffer);
            }

            function sendMsgGetExposureRange(){
              var aDataArray = new Uint8Array(3);
              aDataArray[0] = 0xef;
              aDataArray[1] = 0x31;
              aDataArray[2] = 0x00;
              ws.send(aDataArray.buffer);
            }

            function sendMsgGetBrightnessRange(){
              var aDataArray = new Uint8Array(3);
              aDataArray[0] = 0xef;
              aDataArray[1] = 0x2e;
              aDataArray[2] = 0x00;
              ws.send(aDataArray.buffer);
            }

            function sendMsgSetBrightness(temp){
              var type;
              if(temp<0){
                type= 0;
              }else {
               type= 1;
             }
             temp=Math.abs(temp);
             var aDataArray = new Uint8Array(5);
             aDataArray[0] = 0xef;
             aDataArray[1] = 0x2f;
             aDataArray[2] = 0x02;
             aDataArray[3] = type;
             aDataArray[4] = temp;
             ws.send(aDataArray.buffer);
           }

           function sendMsgSetExposure(temp){
            var type;
            if(temp<0){
              type= 0;
            }else {
             type= 1;
           }
           temp=Math.abs(temp);
           var aDataArray = new Uint8Array(5);
           aDataArray[0] = 0xef;
           aDataArray[1] = 0x33;
           aDataArray[2] = 0x02;
           aDataArray[3] = type;
           aDataArray[4] = temp;
           ws.send(aDataArray.buffer);
         }

         function sednMsgGetBase64(filename){
          var path = encodeURI(filename);
          var pathdata = stringToByte(path);
          var len = path.length;
          var aDataArray = new Uint8Array(3+len);
          aDataArray[0] = 0xef;
          aDataArray[1] = 0x35;
          aDataArray[2] = len;
          for(var i=0;i<len;i++){
            aDataArray[3+i] = pathdata[i];
          }
          ws.send(aDataArray.buffer);
        }

        function sendMsgDeleteFile(pathUnicode){
          var path = encodeURI(pathUnicode);
          var pathdata = stringToByte(path);
          var len = path.length;
          var aDataArray = new Uint8Array(3+len);
          aDataArray[0] = 0xef;
          aDataArray[1] = 0x38;
          aDataArray[2] = len;
          for(var i=0;i<len;i++){
            aDataArray[3+i] = pathdata[i];
          }
          ws.send(aDataArray.buffer);
        }

        function sendMsgQrcode(pathUnicode){
          var path = encodeURI(pathUnicode);
          var pathdata = stringToByte(path);
          var len = path.length;
          var aDataArray = new Uint8Array(3+len);
          aDataArray[0] = 0xef;
          aDataArray[1] = 0x39;
          aDataArray[2] = len;
          for(var i=0;i<len;i++){
            aDataArray[3+i] = pathdata[i];
          }
          ws.send(aDataArray.buffer);
        }

        function sendMsgBarcode(pathUnicode){
          var path = encodeURI(pathUnicode);
          var pathdata = stringToByte(path);
          var len = path.length;
          var aDataArray = new Uint8Array(3+len);
          aDataArray[0] = 0xef;
          aDataArray[1] = 0x44;
          aDataArray[2] = len;
          for(var i=0;i<len;i++){
            aDataArray[3+i] = pathdata[i];
          }
          ws.send(aDataArray.buffer);
        }

        function sendMsgGetMainCameraID(){
          var aDataArray = new Uint8Array(4);
          aDataArray[0] = 0xef;
          aDataArray[1] = 0x3a;
          aDataArray[2] = 0x01;
          aDataArray[3] = 0x01;
          ws.send(aDataArray.buffer);
        }

        function sendMsgStartIDCard(){
          var aDataArray = new Uint8Array(4);
          aDataArray[0] = 0xef;
          aDataArray[1] = 0x3c;
          aDataArray[2] = 0x01;
          aDataArray[3] = 0x00;
          ws.send(aDataArray.buffer);
        }

        function sendMsgGetOneIC(){
          var aDataArray = new Uint8Array(4);
          aDataArray[0] = 0xef;
          aDataArray[1] = 0x3c;
          aDataArray[2] = 0x01;
          aDataArray[3] = 0x01;
          ws.send(aDataArray.buffer);
        }

        function sendMsgGetICValues(type){
          var aDataArray = new Uint8Array(4);
          aDataArray[0] = 0xef;
          aDataArray[1] = 0x3d;
          aDataArray[2] = 0x01;
          aDataArray[3] = type;
          ws.send(aDataArray.buffer);
        }

        function sendMsgRotateL(){
          var aDataArray = new Uint8Array(4);
          aDataArray[0] = 0xef;
          aDataArray[1] = 0x40;
          aDataArray[2] = 0x01;
          aDataArray[3] = 0;
          ws.send(aDataArray.buffer);
        }

        function sendMsgRotateR(){
          var aDataArray = new Uint8Array(4);
          aDataArray[0] = 0xef;
          aDataArray[1] = 0x40;
          aDataArray[2] = 0x01;
          aDataArray[3] = 1;
          ws.send(aDataArray.buffer);
        }

        function sendMsgBestSize(){
         canvasX = 0;
         canvasY = 0;
         var aDataArray = new Uint8Array(4);
         aDataArray[0] = 0xef;
         aDataArray[1] = 0x0d;
         aDataArray[2] = 0x01;
         aDataArray[3] = 2;
         ws.send(aDataArray.buffer);
       }

       function sendMsgTrueSize(){
         canvasX = 0;
         canvasY = 0;
         var aDataArray = new Uint8Array(4);
         aDataArray[0] = 0xef;
         aDataArray[1] = 0x0d;
         aDataArray[2] = 0x01;
         aDataArray[3] = 3;
         ws.send(aDataArray.buffer);
       }


       function sendMsgWorkIDCard(){
        var aDataArray = new Uint8Array(4);
        aDataArray[0] = 0xef;
        aDataArray[1] = 0x41;
        aDataArray[2] = 0x01;
        aDataArray[3] = 0x01;
        ws.send(aDataArray.buffer);
      }

      function sendMsgStopWorkIDCard(){
        var aDataArray = new Uint8Array(4);
        aDataArray[0] = 0xef;
        aDataArray[1] = 0x41;
        aDataArray[2] = 0x01;
        aDataArray[3] = 0x00;
        ws.send(aDataArray.buffer);
      }

      function sendMsgShotBase64(type){
       var aDataArray = new Uint8Array(4);
       aDataArray[0] = 0xef;
       aDataArray[1] = 0x42;
       aDataArray[2] = 0x01;
       aDataArray[3] = type;
       ws.send(aDataArray.buffer);
     }

     function sendMsgSetJpgQuanlity(value){
       var aDataArray2 = new Uint8Array(4);
       aDataArray2[0] = 0xef;
       aDataArray2[1] = 0x49;
       aDataArray2[2] = 0x01;
       aDataArray2[3] = value;
       ws.send(aDataArray2.buffer);
     }

     function sendMsgGetICPictureAll(){
      var aDataArray = new Uint8Array(3);
      aDataArray[0] = 0xef;
      aDataArray[1] = 0x4d;
      aDataArray[2] = 0x00;
      ws.send(aDataArray.buffer);
    }

    function sendMsgInitFinger(){

      var aDataArray = new Uint8Array(3);
      aDataArray[0] = 0xef;
      aDataArray[1] = 0x4f;
      aDataArray[2] = 0x00;
      ws.send(aDataArray.buffer);
    }

    function sendMsgStartFinger(){

      var aDataArray = new Uint8Array(4);
      aDataArray[0] = 0xef;
      aDataArray[1] = 0x50;
      aDataArray[2] = 0x01;
      aDataArray[3] = 0x01;
      ws.send(aDataArray.buffer);
    }

    function sendMsgCloseFinger(){

      var aDataArray = new Uint8Array(4);
      aDataArray[0] = 0xef;
      aDataArray[1] = 0x50;
      aDataArray[2] = 0x01;
      aDataArray[3] = 0x00;
      ws.send(aDataArray.buffer);
    }

    function sendMsgBeginVideo(pathUnicode,id,frame){
      var path = encodeURI(pathUnicode);
      var pathdata = stringToByte(path);
      var len = path.length;
      var aDataArray = new Uint8Array(6+len);
      aDataArray[0] = 0xef;
      aDataArray[1] = 0x51;
      aDataArray[2] = len+3;
      aDataArray[3] = id;
      aDataArray[4] = frame;
      aDataArray[5] = len;
      for(var i=0;i<len;i++){
        aDataArray[6+i] = pathdata[i];
      }
      ws.send(aDataArray.buffer);
    }

    function sendMsgStopVideo(){

      var aDataArray = new Uint8Array(3);
      aDataArray[0] = 0xef;
      aDataArray[1] = 0x52;
      aDataArray[2] = 0x00;
      ws.send(aDataArray.buffer);
    }

    function sendMsgBeginVideoSecond(pathUnicode,id,frame){
      var path = encodeURI(pathUnicode);
      var pathdata = stringToByte(path);
      var len = path.length;
      var aDataArray = new Uint8Array(6+len);
      aDataArray[0] = 0xef;
      aDataArray[1] = 0x53;
      aDataArray[2] = len+3;
      aDataArray[3] = id;
      aDataArray[4] = frame;
      aDataArray[5] = len;
      for(var i=0;i<len;i++){
        aDataArray[6+i] = pathdata[i];
      }
      ws.send(aDataArray.buffer);
    }

    function sendMsgStopVideoSecond(){

      var aDataArray = new Uint8Array(3);
      aDataArray[0] = 0xef;
      aDataArray[1] = 0x54;
      aDataArray[2] = 0x00;
      ws.send(aDataArray.buffer);
    }

    function sendMsgGetAudioName(){

      var aDataArray = new Uint8Array(3);
      aDataArray[0] = 0xef;
      aDataArray[1] = 0x55;
      aDataArray[2] = 0x00;
      ws.send(aDataArray.buffer);
    }

    function sednMsgBarQrcode(type){
      var aDataArray = new Uint8Array(4);
      aDataArray[0] = 0xef;
      aDataArray[1] = 0x59;
      aDataArray[2] = 0x01;
      aDataArray[3] = type;
      ws.send(aDataArray.buffer);
    }

    function sendMsgMakeDir(pathUnicode){
      var path = encodeURI(pathUnicode);
      var pathdata = stringToByte(path);
      var len = path.length;
      var aDataArray = new Uint8Array(3+len);
      aDataArray[0] = 0xef;
      aDataArray[1] = 0x5a;
      aDataArray[2] = len;
      for(var i=0;i<len;i++){
        aDataArray[3+i] = pathdata[i];
      }
      ws.send(aDataArray.buffer);
    }

    function sendMsgAutoFoucs(){

      var aDataArray = new Uint8Array(3);
      aDataArray[0] = 0xef;
      aDataArray[1] = 0x5b;
      aDataArray[2] = 0x00;
      ws.send(aDataArray.buffer);
      context.clearRect(0,0,canvas.width, canvas.height);
    }

    function sednMsgFaceCheckInit(){
      var aDataArray = new Uint8Array(3);
      aDataArray[0] = 0xef;
      aDataArray[1] = 0x5c;
      aDataArray[2] = 0x00;
      ws.send(aDataArray.buffer);
    }

    function sednMsgFaceCheckUninit(){
      isFaceOpen = false;
      var aDataArray = new Uint8Array(3);
      aDataArray[0] = 0xef;
      aDataArray[1] = 0x5d;
      aDataArray[2] = 0x00;
      ws.send(aDataArray.buffer);
    }

    function sednMsgStartFaceCheck(){
      var aDataArray = new Uint8Array(3);
      aDataArray[0] = 0xef;
      aDataArray[1] = 0x5e;
      aDataArray[2] = 0x00;
      ws.send(aDataArray.buffer);
    }

    function sednMsgStopFaceCheck(){
      var aDataArray = new Uint8Array(3);
      aDataArray[0] = 0xef;
      aDataArray[1] = 0x61;
      aDataArray[2] = 0x00;
      ws.send(aDataArray.buffer);
    }

     function sednMsgFaceCheckInitSecond(){
      var aDataArray = new Uint8Array(3);
      aDataArray[0] = 0xef;
      aDataArray[1] = 0x63;
      aDataArray[2] = 0x00;
      ws.send(aDataArray.buffer);
    }

    function sednMsgFaceCheckUninitSecond(){
      isFaceOpenSecond = false;
      var aDataArray = new Uint8Array(3);
      aDataArray[0] = 0xef;
      aDataArray[1] = 0x64;
      aDataArray[2] = 0x00;
      ws.send(aDataArray.buffer);
    }

    function sednMsgStartFaceCheckSecond(){
      var aDataArray = new Uint8Array(3);
      aDataArray[0] = 0xef;
      aDataArray[1] = 0x65;
      aDataArray[2] = 0x00;
      ws.send(aDataArray.buffer);
    }

    function sednMsgStopFaceCheckSecond(){
      var aDataArray = new Uint8Array(3);
      aDataArray[0] = 0xef;
      aDataArray[1] = 0x66;
      aDataArray[2] = 0x00;
      ws.send(aDataArray.buffer);
    }

     function sednMsgBankCardFun(type){
      var aDataArray = new Uint8Array(4);
      aDataArray[0] = 0xef;
      aDataArray[1] = 0x6b;
      aDataArray[2] = 0x01;
      aDataArray[3] = type;
      ws.send(aDataArray.buffer);
    }

    function sendMsgInitFingerFunOrCloase(type){
               var aDataArray = new Uint8Array(4);
               aDataArray[0] = 0xef;
               aDataArray[1] = 0x6c;
               aDataArray[2] = 0x01;
               aDataArray[3] = type;
               ws.send(aDataArray.buffer);
      }

      function sendMsgRegisterFinger(){
          var aDataArray = new Uint8Array(3);
      aDataArray[0] = 0xef;
      aDataArray[1] = 0x6d;
      aDataArray[2] = 0x00;
      ws.send(aDataArray.buffer);
        }

          function sednMsgStopRegisterFinger(){
      var aDataArray = new Uint8Array(3);
      aDataArray[0] = 0xef;
      aDataArray[1] = 0x6e;
      aDataArray[2] = 0x00;
      ws.send(aDataArray.buffer);
    }

        function sendMsgVerifyFinger(pathUnicode){
          var path = encodeURI(pathUnicode);
          var pathdata = stringToByte(path);
          var len = path.length;
          var aDataArray = new Uint8Array(3+len);
          aDataArray[0] = 0xef;
          aDataArray[1] = 0x6f;
          aDataArray[2] = len;
          for(var i=0;i<len;i++){
            aDataArray[3+i] = pathdata[i];
          }
          ws.send(aDataArray.buffer);
        }

         function sednMsgStopVerifyFinger(){
      var aDataArray = new Uint8Array(3);
      aDataArray[0] = 0xef;
      aDataArray[1] = 0x70;
      aDataArray[2] = 0x00;
      ws.send(aDataArray.buffer);
    }

      function sednMsgQFaceStratDoubleOrClose(type){
              var aDataArray = new Uint8Array(4);
              aDataArray[0] = 0xef;
              aDataArray[1] = 0x74;
              aDataArray[2] = 0x01;
              aDataArray[3] = type;
              ws.send(aDataArray.buffer);
      }

     function sednMsgFaceCheckInitDouble(){
      var aDataArray = new Uint8Array(3);
      aDataArray[0] = 0xef;
      aDataArray[1] = 0x75;
      aDataArray[2] = 0x00;
      ws.send(aDataArray.buffer);
    }

        function sendMsgSetDpi(x,y){
                   var aDataArray = new Uint8Array(7);
                   aDataArray[0] = 0xef;
                   aDataArray[1] = 0x76;
                   aDataArray[2] = 0x04;
                   aDataArray[3] = x/256;
                   aDataArray[4] = x%256;
                   aDataArray[5] = y/256;
                   aDataArray[6] = y%256;
                   ws.send(aDataArray.buffer);
                 }

      function sednMsgReleaseAll(){
      var aDataArray = new Uint8Array(3);
      aDataArray[0] = 0xef;
      aDataArray[1] = 0x77;
      aDataArray[2] = 0x00;
      ws.send(aDataArray.buffer);
    }

    function sendMsgFaceCheck(type){
              if(type==0){
                isFaceOpen = false;
              }
               var aDataArray2 = new Uint8Array(4);
               aDataArray2[0] = 0xef;
               aDataArray2[1] = 0x78;
               aDataArray2[2] = 0x01;
               aDataArray2[3] = type;
               ws.send(aDataArray2.buffer);
             }

              function sendMsgCaptureFace(){
              var aDataArray = new Uint8Array(3);
              aDataArray[0] = 0xef;
              aDataArray[1] = 0x79;
              aDataArray[2] = 0x00;
              ws.send(aDataArray.buffer);
            }

            function sendMsgFaceCheckSecond(type){
              if(type==0){
                isFaceOpenSecond = false;
              }
               var aDataArray2 = new Uint8Array(4);
               aDataArray2[0] = 0xef;
               aDataArray2[1] = 0x7a;
               aDataArray2[2] = 0x01;
               aDataArray2[3] = type;
               ws.send(aDataArray2.buffer);
             }

              function sendMsgCaptureFaceSecond(){
              var aDataArray = new Uint8Array(3);
              aDataArray[0] = 0xef;
              aDataArray[1] = 0x7b;
              aDataArray[2] = 0x00;
              ws.send(aDataArray.buffer);
            }

             function sendMsgGetFinger(type){
               var aDataArray2 = new Uint8Array(4);
               aDataArray2[0] = 0xef;
               aDataArray2[1] = 0x7f;
               aDataArray2[2] = 0x01;
               aDataArray2[3] = type;
               ws.send(aDataArray2.buffer);
    }

      function sendMsgVerifyFingerBase64(datalen,pathUnicode){
          var path = encodeURI(pathUnicode);
          var pathdata = stringToByte(path);
          var len = path.length;
          var aDataArray = new Uint8Array(7+len);
          aDataArray[0] = 0xef;
          aDataArray[1] = 0x81;
           aDataArray[2] = 0x00;
          aDataArray[3] = datalen/256;
          aDataArray[4] = datalen%256;
           aDataArray[5] = len/256;
            aDataArray[6] = len%256;
          for(var i=0;i<len;i++){
            aDataArray[7+i] = pathdata[i];
          }
          ws.send(aDataArray.buffer);
        }

function sendMsgGetALLVidPid(){
    var aDataArray = new Uint8Array(3);
    aDataArray[0] = 0xef;
    aDataArray[1] = 0xa7;
    aDataArray[2] = 0x00;
    ws.send(aDataArray.buffer);
}

function GetFaceZuobiao(Xdis,Ydis){
      if(isFaceOpen){
      for(var j=0;j<faceNum;j++){
        for(var i=0;i<3;i++){

          context.moveTo( faceZuobiao[2*i+j*8]+Xdis,faceZuobiao[2*i+j*8+1]+Ydis);
          context.lineTo(faceZuobiao[2*i+j*8+2]+Xdis, faceZuobiao[2*i+j*8+3]+Ydis);
          context.stroke();
        }

        context.moveTo( faceZuobiao[6*i+j*8]+Xdis,faceZuobiao[6*i+j*8+1]+Ydis);
        context.lineTo( faceZuobiao[0+j*8]+Xdis,faceZuobiao[1+j*8]+Ydis);
        context.stroke();
      }
    }
    }

    function GetFaceZuobiaoSecond(Xdis,Ydis){
      if(isFaceOpenSecond){
         contextSecond.beginPath();
       contextSecond.strokeStyle = "rgb(0,255,0)";
       contextSecond.lineWidth=2;
      for(var j=0;j<faceNumSecond;j++){
        for(var i=0;i<3;i++){

          contextSecond.moveTo( faceZuobiaoSecond[2*i+j*8]+Xdis,faceZuobiaoSecond[2*i+j*8+1]+Ydis);
          contextSecond.lineTo(faceZuobiaoSecond[2*i+j*8+2]+Xdis, faceZuobiaoSecond[2*i+j*8+3]+Ydis);
          contextSecond.stroke();
        }

        contextSecond.moveTo( faceZuobiaoSecond[6*i+j*8]+Xdis,faceZuobiaoSecond[6*i+j*8+1]+Ydis);
        contextSecond.lineTo( faceZuobiaoSecond[0+j*8]+Xdis,faceZuobiaoSecond[1+j*8]+Ydis);
        contextSecond.stroke();
      }
    }
    }





    function SetCusCropPlaceWs(cutX,cutY,cutW,cutH){

     var bpp = rec_ww/imgOrignalW;
     if(rorateAngleType==1 || rorateAngleType==3){
      bpp = rec_ww/imgOrignalH;
    }
    recX_manual = cutX*bpp+ (canvas.width/2-rec_ww/2);
    recY_manual = cutY*bpp +(canvas.height/2-rec_hh/2);
    recW_manual = cutW*bpp;
    recH_manual = cutH*bpp;
    cutXCaibian = cutW;
    cutYCaibian = cutH;


  }

  function SetCusCropPlaceWs2(cutX,cutY,cutW,cutH){

    var bpp = rec_ww2/imgOrignalW2;
    recX_manual2 = cutX*bpp+ (canvasSecond.width/2-rec_ww2/2);
    recY_manual2 = cutY*bpp +(canvasSecond.height/2-rec_hh2/2);
    recW_manual2 = cutW*bpp;
    recH_manual2 = cutH*bpp;
    cutXCaibian2 = cutW;
    cutYCaibian2 = cutH;


  }



           //手动裁边时的长方形
           function refreshRect(){
           	context.beginPath();
           	context.rect(recX_manual,recY_manual,recW_manual,recH_manual);
           	context.lineWidth = 2;
           	context.strokeStyle = "#0000ff";
           	context.stroke();
           }

           function refreshRect2(){
            contextSecond.beginPath();
            contextSecond.rect(recX_manual2,recY_manual2,recW_manual2,recH_manual2);
            contextSecond.lineWidth = 2;
            contextSecond.strokeStyle = "#0000ff";
            contextSecond.stroke();
          }

          function stringToByte(str) {
            var bytes = new Array();
            var len, c;
            len = str.length;
            for(var i = 0; i < len; i++) {
             c = str.charCodeAt(i);
             if(c >= 0x010000 && c <= 0x10FFFF) {
              bytes.push(((c >> 18) & 0x07) | 0xF0);
              bytes.push(((c >> 12) & 0x3F) | 0x80);
              bytes.push(((c >> 6) & 0x3F) | 0x80);
              bytes.push((c & 0x3F) | 0x80);
            } else if(c >= 0x000800 && c <= 0x00FFFF) {
              bytes.push(((c >> 12) & 0x0F) | 0xE0);
              bytes.push(((c >> 6) & 0x3F) | 0x80);
              bytes.push((c & 0x3F) | 0x80);
            } else if(c >= 0x000080 && c <= 0x0007FF) {
              bytes.push(((c >> 6) & 0x1F) | 0xC0);
              bytes.push((c & 0x3F) | 0x80);
            } else {
              bytes.push(c & 0xFF);
            }
          }
          return bytes;
        }

        function byteToString(arr) {
          if(typeof arr === 'string') {
            return arr;
          }
          var str = '',
          _arr = arr;
          for(var i = 0; i < _arr.length; i++) {
            var one = _arr[i].toString(2),
            v = one.match(/^1+?(?=0)/);
            if(v && one.length == 8) {
              var bytesLength = v[0].length;
              var store = _arr[i].toString(2).slice(7 - bytesLength);
              for(var st = 1; st < bytesLength; st++) {
                store += _arr[st + i].toString(2).slice(2);
              }
              str += String.fromCharCode(parseInt(store, 2));
              i += bytesLength - 1;
            } else {
              str += String.fromCharCode(_arr[i]);
            }
          }
          return str;
        }

        function base64Encode(input) {
          var rv;
          rv = encodeURIComponent(input);
          rv = unescape(rv);
          rv = window.btoa(rv);
          return rv;
        }

function isIE() { //ie?
 if (!!window.ActiveXObject || "ActiveXObject" in window)
  return true;
else
  return false;
}









//--------------------------------
var SupportFormat;    //设备支持的视频格式代号：1->MJPG; 2->YUY2
var OpenFormat;      //打开格式：0->YUY；1->MJPG
var SupportFormat2;    //设备支持的视频格式代号：1->MJPG; 2->YUY2
var OpenFormat2;      //打开格式：0->YUY；1->MJPG



var base64DecodeChars = new Array(
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

function base64decode(str) {
    var c1, c2, c3, c4;
    var i, len, out;

    len = str.length;
    i = 0;
    out = "";
    while(i < len) {
        /* c1 */
        do {
            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while(i < len && c1 == -1);
        if(c1 == -1)
            break;

        /* c2 */
        do {
            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while(i < len && c2 == -1);
        if(c2 == -1)
            break;

        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

        /* c3 */
        do {
            c3 = str.charCodeAt(i++) & 0xff;
            if(c3 == 61)
                return out;
            c3 = base64DecodeChars[c3];
        } while(i < len && c3 == -1);
        if(c3 == -1)
            break;

        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

        /* c4 */
        do {
            c4 = str.charCodeAt(i++) & 0xff;
            if(c4 == 61)
                return out;
            c4 = base64DecodeChars[c4];
        } while(i < len && c4 == -1);
        if(c4 == -1)
            break;
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
}

function getBlobBydataURI(dataURI,type) {
    //var binary = atob(dataURI.split(',')[1]);
    var binary = base64decode(dataURI);
    var array = [];
    for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type:type });
}

function OcxInit(){
    var strUsbNamr =new Array() ;
    var numCam = axCam_Ocx.GetDevCount();
    for (var i = 0; i < numCam; i++) {
        strUsbNamr[i] = axCam_Ocx.GetDevFriendName(i);
    }
    camidMain = axCam_Ocx.GetMainCameraID(1);
    camidSub = axCam_Ocx.GetSecondCameraID();
    GetDevName(numCam,strUsbNamr);

    var FormatSum  = axCam_Ocx.GetFormatCount(camidMain);
    switch(FormatSum)
    {
        case 1:   //（设备只支持MJPG格式）
            OpenFormat = 1 ;     //打开格式为MJPG
            SupportFormat = 1;
            break;
        case 2:   //（设备只支持YUY2格式）
            OpenFormat = 0 ;     //打开格式为YUY
            SupportFormat = 2;
            break;
        case 3:   //（设备支持MJPG与YUY2两种格式）
            OpenFormat = 1 ;     //默认打开格式为MJPG
            SupportFormat = 1;
            break;

    }

    OcxGetDeviceResolution();
}

//获取分辨率
function OcxGetDeviceResolution()
{
    var resCount = axCam_Ocx.GetResolutionCount(camidMain, SupportFormat);
    var dataResolution = new Array();
    var num = 0;
    for (var i = 0; i < resCount; i++) {
        var restr = axCam_Ocx.GetResolution(i);
        var pos = restr.lastIndexOf("*");
        var width = parseInt(restr.substring(0, pos));
        var height =parseInt(restr.substring(pos + 1, restr.length));
        dataResolution[num] = width;
        num++;
        dataResolution[num] = height;
        num++;
    }
    GetDeviceResolution(dataResolution);
}

function OcxGetDeviceResolutionSecond(){
    if(isIE){
        //camidSub = axCam_Ocx.GetSecondCameraID();
        if(camidSub>=0){
            var FormatSum  = axCam_Ocx2.GetFormatCount(camidSub);
            switch(FormatSum)
            {
                case 1:   //（设备只支持MJPG格式）
                    OpenFormat2 = 1 ;     //打开格式为MJPG
                    SupportFormat2 = 1;
                    break;
                case 2:   //（设备只支持YUY2格式）
                    OpenFormat2 = 0 ;     //打开格式为YUY
                    SupportFormat2 = 2;
                    break;
                case 3:   //（设备支持MJPG与YUY2两种格式）
                    OpenFormat2 = 1 ;     //默认打开格式为MJPG
                    SupportFormat2 = 1;
                    break;

            }

            var resCount = axCam_Ocx2.GetResolutionCount(camidSub, SupportFormat2);
            var dataResolution = new Array();
            var num = 0;
            for (var i = 0; i < resCount; i++) {
                var restr = axCam_Ocx2.GetResolution(i);
                var pos = restr.lastIndexOf("*");
                var width = parseInt(restr.substring(0, pos));
                var height =parseInt(restr.substring(pos + 1, restr.length));
                dataResolution[num] = width;
                num++;
                dataResolution[num] = height;
                num++;
            }
            GetDeviceResolutionSecond(dataResolution);
        }

    }else {
        sendMsgGetResolutionSecond(camidSub);
    }
}

//
function StartCam(CamID,width,height){
    if(isIE){
        var i = axCam_Ocx.CAM_Open(CamID, OpenFormat, width, height);
        if (i == 0) InfoCallback(0x00);
        else if (i == -1) InfoCallback(0x16);
        else InfoCallback(0x02);
    }else {
        sendMsgStartVideo(CamID,width,height);
    }
}

function StartCam2(CamID,width,height){
    if(isIE){
        var i = axCam_Ocx2.CAM_Open(CamID, OpenFormat2, width, height);
        if (i == 0) InfoCallback(0x00);
        else if (i == -1) InfoCallback(0x16);
        else InfoCallback(0x02);
    }else {
        sendMsgStartVideo2(CamID,width,height);
    }
}

function CloseCam(){
    if(isIE){
        axCam_Ocx.CAM_Close();
        InfoCallback(0x01);
    }else sendMsgCloseVideo();
}

function CloseCam2(){
    if(isSecondDev){
        if(isIE){
            axCam_Ocx2.CAM_Close();
            InfoCallback(0x01);
        }else sendMsgCloseVideoSecond();
    }
}

function CaptureImage(type){
    if(isIE){
        axCam_Ocx.CaptureImage();
    }else {
        sendMsgCapture(type);
    }
}

function CaptureImage2(type){
    if(isIE){
        axCam_Ocx2.CaptureImage();
    }else {
        if(type !=2){
            sendMsgCaptureSecond();
        }else sendMsgCaptureSecondCaibian();
    }
}

function ChangeCamDevice(CamID){

    if(isIE){
        var FormatSum  = axCam_Ocx.GetFormatCount(CamID);
        switch(FormatSum)
        {
            case 1:   //（设备只支持MJPG格式）
                OpenFormat = 1 ;     //打开格式为MJPG
                SupportFormat = 1;
                break;
            case 2:   //（设备只支持YUY2格式）
                OpenFormat = 0 ;     //打开格式为YUY
                SupportFormat = 2;
                break;
            case 3:   //（设备支持MJPG与YUY2两种格式）
                OpenFormat = 1 ;     //默认打开格式为MJPG
                SupportFormat = 1;
                break;

        }
        OcxGetDeviceResolution();
    }else {
        sendMsgGetResolution(CamID);
    }
}

function ChangeCamDevice2(CamID){

    if(isIE){
        var FormatSum  = axCam_Ocx2.GetFormatCount(CamID);
        switch(FormatSum)
        {
            case 1:   //（设备只支持MJPG格式）
                OpenFormat = 1 ;     //打开格式为MJPG
                SupportFormat = 1;
                break;
            case 2:   //（设备只支持YUY2格式）
                OpenFormat = 0 ;     //打开格式为YUY
                SupportFormat = 2;
                break;
            case 3:   //（设备支持MJPG与YUY2两种格式）
                OpenFormat = 1 ;     //默认打开格式为MJPG
                SupportFormat = 1;
                break;

        }
        OcxGetDeviceResolutionSecond();
    }else {
        sendMsgGetResolutionSecond(CamID);
    }
}

function SetColorMode(type){
    if(isIE){
        axCam_Ocx.SetImageColorMode(type);
    }else {
        sendMsgSetImageColorMode(type);
    }
}

function ShowSettingWindow(){
    if(isIE){
        axCam_Ocx.ShowImageSettingWindow();
    }else {
        sendMsgShowImageSettingWindow();
    }
}

function SetCamCutType(type){
    if(isIE){
        if(type==2){
            axCam_Ocx.CusCrop(1);
        }else axCam_Ocx.SetAutoCut(type);
    }else sendMsgSetCutType(type);

}

function SetCamCutType2(type){
    if(isIE){
        if(type==2){
            axCam_Ocx2.CusCrop(1);
        }else axCam_Ocx2.SetAutoCut(0);
    }

}

function SetImageType(type){
    if(isIE){
        axCam_Ocx.SetFileType(type);
    }else {
        if(type>2)type++;
        sendMsgSetFileType(type);
    }
}

//放大
function ZoomOut() {
    if(isIE){
        axCam_Ocx.CAM_ZoomOut();
    }else sendMsgZoom(1);
}

//缩小
function ZoomIn() {
    if(isIE){
        axCam_Ocx.CAM_ZoomIn();
    }sendMsgZoom(0);
}

//左旋
function RoateL() {
    if(isIE){
        axCam_Ocx.CAM_RotateL();
    }else sendMsgRotateL();

}

//右旋
function RoateR() {
    if(isIE){
        axCam_Ocx.CAM_RotateR();
    }else sendMsgRotateR();
}

//适合大小
function BestSize() {
    if(isIE){
        axCam_Ocx.BestSize();
    }else {
        sendMsgBestSize();
    }
}

//实际大小
function TrueSize() {
    if(isIE){
        axCam_Ocx.TrueSize();
    }else {
        sendMsgTrueSize();
    }
}

function SetWiseCapture(type){
    if(isIE){
        axCam_Ocx.WiseCapture(type);

    }else {
        sendMsgSetConntinousShotModel(type);
    }
}

function SetTimeCapture(type,time){
    if(isIE){
        axCam_Ocx.TimeCapture(type,time);
    }else {
        time = time/10;
        sendMsgSetConntinousShotModelTime(time);
    }
}

function SetImagePath(path){
    if(isIE){
        var ret = axCam_Ocx.setFilePath(path);
        if(ret==0){
            InfoTextCallback(1,path);
        }else InfoCallback(0xae);
    }else {
        sendMsgSetFilePath(path);
    }
}

function SetImagePath2(path){
    if(isIE){
        var ret = axCam_Ocx2.setFilePath(path);
        if(ret==0){
            InfoTextCallback(1,path);
        }else InfoCallback(0xae);
    }
}

function RefreshDevice(){
    if(isIE){
        OcxInit();
    }else {

        sendMsgRefreshDev();
    }
}

function SetImagebase64(type){
    if(isIE){
        axCam_Ocx.IsImageBase64(type);
        if(isSecondDev){
            axCam_Ocx2.IsImageBase64(type);
        }
    }else {
        sendMsgShotBase64(type);
    }
}

function StartIC(){
    if(isIE){
        axCam_Ocx.StartIDCard();
        InfoCallback(0x19);
    }else {
        sendMsgStartIDCard();
    }
}

function StartICWork(){
    if(isIE){
        var ret =axCam_Ocx.WorkIDCard(1);
        if(ret == 0){
            InfoCallback(0x20);
        }else if(ret == -2){
            InfoCallback(0x1f);
        }
    }else {
        sendMsgWorkIDCard();
    }
}

function StopICWork(){
    if(isIE){
        var ret = axCam_Ocx.WorkIDCard(0);
        if(ret == 0){
            InfoCallback(0x21);
        }else if(ret == -2){
            InfoCallback(0x1f);
        }else if(ret == -3){
            InfoCallback(0x1e);
        }
    }else {
        sendMsgStopWorkIDCard();
    }
}

function GetOneIC(){
    if(isIE){
        var ret =axCam_Ocx.GetOneIC();
        if(ret==0){
            InfoCallback(0x1b);
        }else if(ret==-1){
            InfoCallback(0x1d);
        }else if(ret==-2){
            InfoCallback(0x1c);
        }else if(ret==-3){
            InfoCallback(0x1e);
        }else if(ret==-4){
            InfoCallback(0x1f);
        }
    }else {
        sendMsgGetOneIC();
    }
}

function GetICValues(){
    if(isIE){
        var name = axCam_Ocx.GetICValues("NAME");
        if(name.length>0){
            InfoTextCallback(9,name);

            var IC = axCam_Ocx.GetICValues("IC");
            InfoTextCallback(10,IC);

            var SEX = axCam_Ocx.GetICValues("SEX");
            InfoTextCallback(11,SEX);

            var NATION = axCam_Ocx.GetICValues("NATION");
            InfoTextCallback(12,NATION);

            var BIRTHDAY = axCam_Ocx.GetICValues("BIRTHDAY");
            InfoTextCallback(13,BIRTHDAY);

            var ADDRESS = axCam_Ocx.GetICValues("ADDRESS");
            InfoTextCallback(14,ADDRESS);

            var SIGNDEPT = axCam_Ocx.GetICValues("SIGNDEPT");
            InfoTextCallback(15,SIGNDEPT);

            var VALIDSTARTDATE = axCam_Ocx.GetICValues("VALIDSTARTDATE");
            InfoTextCallback(16,VALIDSTARTDATE);

            var VALIDENDDATE = axCam_Ocx.GetICValues("VALIDENDDATE");
            InfoTextCallback(17,VALIDENDDATE);

            var SAMID = axCam_Ocx.GetICValues("SAMID");
            InfoTextCallback(18,SAMID);


            var picBase64 = axCam_Ocx.GetICPicture();
            InfoTextCallback(19,picBase64);
        }

    }else {
        for(var i=0;i<11;i++){
            sendMsgGetICValues(i);
        }
    }
}

function ReadBarCode(imgPath){
    if(isIE){
        var CodeStr = axCam_Ocx.GetBarcodeContent(imgPath);
        if(CodeStr.length>0){
            InfoTextCallback(2,CodeStr);
        }else {
            InfoCallback(0xab);
        }
    }else {
        sendMsgBarcode(imgPath);
    }

}

function ReadQrCode(imgPath){
    if(isIE){
        var CodeStr = axCam_Ocx.GetQRcodeContent(imgPath);
        InfoTextCallback(7,CodeStr);
    }else {
        sendMsgQrcode(imgPath);
    }
}

function AddPDFImageFile(imgPath){
    if(isIE){
        var ret =axCam_Ocx.AddPDFImageFile(imgPath,"",0);
        if(ret == 0){
            InfoCallback(0x05);
        }else if(ret == -1){
            InfoCallback(0xa5);
        }
    }else {
        sednMsgAddPDF(imgPath);
    }
}

function SavePDF(path){
    if(isIE){
        var ret =axCam_Ocx.Convert2PDF(path);
        if(ret == 0){
            InfoCallback(0x06);
        }else if(ret == -1){
            InfoCallback(0xa1);
        }
    }else {
        sednMsgSavePDF(path);
    }
}

function CombineTwoImage(combinePath, ImgPath1, ImgPath2, dir){
    if(isIE){
        var ret = axCam_Ocx.CombineTwoImage(combinePath, ImgPath1, ImgPath2, dir);
        if(ret == 0){
            InfoCallback(0x07);
        }else {
            InfoCallback(0xad);
        }
    }else {
        if(dir!=1)dir=0;
        sendMsgCombineTwoImage(ImgPath1,ImgPath2,combinePath,dir);
    }
}

function UpdataFile(ip,port,method,imgPath){
    if(isIE){
        var ret = axCam_Ocx.UpdataFile(ip, port, method,imgPath);
        if(ret==0){
            InfoCallback(0x12);
        }else {
            InfoCallback(0xa9);
        }
    }else {
        sendMsgUploadFilePort(port,ip,method,imgPath);
    }
}

function GetBase64FromFile(path){
    if(isIE){
        var basestr = axCam_Ocx.GetBase64FromFile(path);
        InfoTextCallback(5,basestr);
    }else{
        sednMsgGetBase64(path);
    }
}

function CloseWaterMark(){
    if(isIE){
        axCam_Ocx.SetAddMark(0);
    }else {
        sednMsgWaterMarkClose();
    }
}

function OpenWaterMark(waterinfo, FontSize, FontSytle, r, g, b, xOff, xOff){
    if(isIE){
        axCam_Ocx.SetAddMark(1);
        axCam_Ocx.SetWaterMark(waterinfo, FontSize, FontSytle, r, g, b, xOff, xOff);
    }else {
        sednMsgWaterMarkOpen(waterinfo,FontSize,FontSytle,r,g,b,xOff,xOff);
    }
}

function SetJiubianModel(type){
    if(isIE){
        axCam_Ocx.setJiubianModel(type);
    }else {
        sendMsgSetJiubianModel(type);
    }
}

function SetBuBai(type){
    if(isIE){
        axCam_Ocx.setBuBai(type);
    }else {
        sednMsgBubaiType(type);
    }
}

function SetQudise(type){
    if(isIE){
        axCam_Ocx.setQudise(type);
    }else {
        sednMsgQuqudiseType(type);
    }
}

function SetFileNameCustom(str,index){

    if(isIE){
        axCam_Ocx.setFileNameCustom(str,index);
    }else {
        sendMsgSetFileNameModelCustom(index,str);
    }

}

function SetFileNameCustom2(str,index){

    if(isIE){
        axCam_Ocx2.setFileNameCustom(str,index);
    }else {
        sendMsgSetFileNameModelCustomSecond(index,str);
    }

}

function SetFileNameFixed(str){
    if(isIE){
        axCam_Ocx.setFileNameFixed(str);
    }else {
        sendMsgSetFileNameModelFixed(str);
    }

}

function SetFileNameFixed2(str){
    if(isIE){
        axCam_Ocx2.setFileNameFixed(str);
    }else {
        sendMsgSetFileNameModelFixedSecond(str);
    }

}

function SetFileNameTime(){
    if(isIE){
        axCam_Ocx.setFileNameTime();
    }else {
        sendMsgSetFileNameModelTime();
    }
}

function SetFileNameTime2(){
    if(isIE){
        axCam_Ocx2.setFileNameTime();
    }else {
        sendMsgSetFileNameModelTimeSecond();
    }
}

function SetAutoExposure(type){

    if(isIE){
        axCam_Ocx.SetAutoExposure(type);
        if(type==1){
            InfoCallback(0x17);

        }else if(type==0){
            InfoCallback(0x18);
        }
    }else {
        sendMsgSetAutoExposure(type);
    }

}

function GetCamParameter(){
    if(isIE){
        var brightnessValue = axCam_Ocx.GetBrightnessRange();
        InfoTextCallback(23,brightnessValue);
        var exposureValue = axCam_Ocx.GetExposureRange();
        InfoTextCallback(22,exposureValue);

    }else {
        sendMsgGetExposureRange();
        sendMsgGetBrightnessRange();

    }
}

function SetExposure(value){
    if(isIE){
        axCam_Ocx.SetExposure(value);
    }else {
        sendMsgSetExposure(value);
    }

}

function SetBrightness(value){
    if(isIE){
        axCam_Ocx.SetBrightness(value)
    }else {
        sendMsgSetBrightness(value);
    }

}

function GetCamNum(){
    if(isIE){
        var num = axCam_Ocx.GetDevCount();
        //GetDevCount(num);
        InfoTextCallback(26,num);
    }else {
        sendMsgGetCamNum();
    }
}

function DeleteFile(path){
    if(isIE){
        var ret = axCam_Ocx.DeleteFileImage(path);
        if(ret ==1){
            InfoTextCallback(6,path);
        }else {
            InfoCallback(0xa2);

        }
    }else {
        sendMsgDeleteFile(path);
    }
}

function SetJpgQuanlity(value){
    if(isIE){
        axCam_Ocx.SetJpgQuanlity(value);
    }else {
        sendMsgSetJpgQuanlity(value);
    }
}

function SetJpgQuanlity2(value){
    if(isIE){
        axCam_Ocx2.SetJpgQuanlity(value);
    }else {

    }
}

function SetCusCropPlace(cutX,cutY,cutW,cutH){
    if(isIE){
        axCam_Ocx.SetCusCropPlace(cutX,cutY,cutW,cutH);
    }else {
        SetCusCropPlaceWs(cutX,cutY,cutW,cutH);
    }

}

function SetCusCropPlace2(cutX,cutY,cutW,cutH){
    if(isIE){
        axCam_Ocx2.SetCusCropPlace(cutX,cutY,cutW,cutH);
    }else {
        SetCusCropPlaceWs2(cutX,cutY,cutW,cutH);
    }

}

function GetICPictureAll(){
    if(isIE){
        var picBase64 = axCam_Ocx.GetICPictureAll();
        InfoTextCallback(25,picBase64);
    }else {
        sendMsgGetICPictureAll();
    }
}

function InitFinger(){
    if(isIE){
        var ret = axCam_Ocx.InitFinger();
        if(ret ==1){
            InfoCallback(0x25);
        }else InfoCallback(0x26);
    }else {
        sendMsgInitFinger();
    }
}

function StartFinger(){
    if(isIE){
        var ret = axCam_Ocx.StartFinger();
        if(ret ==1){
            InfoCallback(0x30);
        }else if(ret == -1){
            InfoCallback(0x27);
        }else if(ret == -2){
            InfoCallback(0x28);
        }else if(ret == -3){
            InfoCallback(0xb1);
        }else if(ret == -4){
            InfoCallback(0x31);
        }
    }else {
        sendMsgStartFinger();
    }
}

function CloseFinger(){
    if(isIE){
        axCam_Ocx.CloseFinger();
        InfoCallback(0x32);
    }else {
        sendMsgCloseFinger();
    }
}

function BeginVideo(filename,id,frameModel){
    var frame = 4;
    if(frameModel == 1){
        frame = 8;
    }else if(frameModel == 2){
        frame = 12;
    }
    if(isIE){
        var ret = axCam_Ocx.BeginVideoID(filename,id,frame);
        if(ret == 1){
            InfoCallback(0x34);
        }else if(ret == -1){
            InfoCallback(0xb2);

        }else if(ret == -2){
            InfoCallback(0x36);

        }
    }else {
        sendMsgBeginVideo(filename,id,frame);
    }


}

function StopVideo(){
    if(isIE){
        axCam_Ocx.StopVideo();
    }else {
        sendMsgStopVideo();
    }
}

function BeginVideoSecond(filename,id,frameModel){
    var frame = 4;
    if(frameModel == 1){
        frame = 8;
    }else if(frameModel == 2){
        frame = 12;
    }
    if(isIE){
        var ret = axCam_Ocx2.BeginVideoID(filename,id,frame);
        if(ret == 1){
            InfoCallback(0x37);
        }else if(ret == -1){
            InfoCallback(0xb3);

        }else if(ret == -2){
            InfoCallback(0x39);

        }
    }else {
        sendMsgBeginVideoSecond(filename,id,frame);
    }


}

function StopVideoSecond(){
    if(isIE){
        axCam_Ocx2.StopVideo();
    }else {
        sendMsgStopVideoSecond();
    }
}

function GetAudioName(){
    if(isIE){
        var str = axCam_Ocx.GetAudioName();
        if(str == "-1"){
            InfoCallback(0x36);
        }else if(str == "0"){
            InfoCallback(0xb4);
        }else InfoTextCallback(27,str);
    }else {
        sendMsgGetAudioName();
    }

}

function ReadBarQrcodeD(type){
    if(isIE){
        var code = axCam_Ocx.ReadBarQrcodeD(type);
        if(type==1){
            InfoTextCallback(2,code);
        }else if(type==2){
            InfoTextCallback(7,code);
        }
    }else {
        sednMsgBarQrcode(type);
    }

}

function MakeDir(path){
    if(isIE){
        var ret = axCam_Ocx.MakeDir(path);
        if(ret == 1){
            InfoCallback(0x44);
        }else InfoCallback(0x45);

    }else {
        sendMsgMakeDir(path);
    }

}

function AutoFoucs(){
    if(isIE){
        axCam_Ocx.AutoFoucs();

    }else {
        sendMsgAutoFoucs();
    }

}

function FaceCheckInit(){
    if(isIE){
        var ret = axCam_Ocx.FaceCheckInit();
        if(ret ==1){
            InfoCallback(0x46);
        }else  InfoCallback(0xb8);

    }else {
        sednMsgFaceCheckInit();
    }

}

function FaceCheckUninit(){
    if(isIE){
        axCam_Ocx.FaceCheckUninit();

    }else {
        sednMsgFaceCheckUninit();
    }

}

function StartFaceCheck(){
    if(isIE){
        var ret = axCam_Ocx.StartFaceCheck();
        if(ret==1){
            InfoCallback(0x47);
        }else if(ret == -1){
            InfoCallback(0xb9);
        }else if(ret == -2){
            InfoCallback(0xba);
        }

    }else {
        sednMsgStartFaceCheck();
    }
}

function StopFaceCheck(){
    if(isIE){
        axCam_Ocx.StopFaceCheck();

    }else {
        sednMsgStopFaceCheck();
    }
}

function FaceCheckInitSecond(){
    if(isIE){
        var ret = axCam_Ocx2.FaceCheckInit();
        if(ret ==1){
            InfoCallback(0x46);
        }else  InfoCallback(0xb8);

    }else {
        sednMsgFaceCheckInitSecond();
    }

}

function FaceCheckUninitSecond(){
    if(isIE){
        axCam_Ocx2.FaceCheckUninit();

    }else {
        sednMsgFaceCheckUninitSecond();
    }

}

function StartFaceCheckSecond(){
    if(isIE){
        var ret = axCam_Ocx2.StartFaceCheck();
        if(ret==1){
            InfoCallback(0x47);
        }else if(ret == -1){
            InfoCallback(0xb9);
        }else if(ret == -2){
            InfoCallback(0xba);
        }

    }else {
        sednMsgStartFaceCheckSecond();
    }
}

function StopFaceCheckSecond(){
    if(isIE){
        axCam_Ocx2.StopFaceCheck();

    }else {
        sednMsgStopFaceCheckSecond();
    }
}

function UninitBankCard(){
    if(isIE){
        axCam_Ocx.UninitBankCard();

    }else {
        sednMsgBankCardFun(0);
    }
}

function InitBankCard(){
    if(isIE){
        var ret = axCam_Ocx.InitBankCard();
        if(ret==1){
            InfoCallback(0x4d);
        }else {
            InfoCallback(0xbc);
        }

    }else {
        sednMsgBankCardFun(1);
    }
}

function GetBankCardNo(){
    if(isIE){
        var ret = axCam_Ocx.GetBankCardNo();
        if(ret.length>10){
            InfoTextCallback(29,ret);
        }else if(ret == "-1"){
            InfoCallback(0xbd);
        }else if(ret == "-2"){
            InfoCallback(0xbe);
        }else if(ret == "-3"){
            InfoCallback(0xbf);
        }else if(ret == "-5"){
            InfoCallback(0xc0);
        }else{
            InfoCallback(0xc1);
        }

    }else {
        sednMsgBankCardFun(2);
    }
}


function InitFingerFun(){
    if(isIE){
        var ret = axCam_Ocx.InitFingerFun();
        if(ret==1){
            InfoCallback(0x4e);
        }else{
            InfoCallback(0x4f);
        }

    }else{
        sendMsgInitFingerFunOrCloase(1);
    }
}

function CloseFingerFun(){
    if(isIE){
        axCam_Ocx.CloseFingerFun();

    }else{
        sendMsgInitFingerFunOrCloase(0);
    }
}

function RegisterFinger(){
    if(isIE){
        var ret = axCam_Ocx.RegisterFingerData();
        if(ret ==1){
            InfoCallback(0x56);
        }else  if(ret ==-1){
            InfoCallback(0x57);
        }else  if(ret ==-2){
            InfoCallback(0x58);
        }else  if(ret ==-3){
            InfoCallback(0x59);
        }
    }else {
        sendMsgRegisterFinger();
    }
}

function StopRegisterFinger(){
    if(isIE){
        axCam_Ocx.StopRegisterFinger();

    }else{
        sednMsgStopRegisterFinger();
    }
}

function VerifyFinger(fingerLen,fingerBase64){
    if(isIE){
        var ret = axCam_Ocx.VerifyFingerBase64(fingerBase64,fingerLen);
        if(ret ==1){
            InfoCallback(0x5d);
        }else  if(ret ==-1){
            InfoCallback(0x57);
        }else  if(ret ==-2){
            InfoCallback(0x5a);
        }else  if(ret ==-3){
            InfoCallback(0x5b);
        }else  if(ret ==-4){
            InfoCallback(0x5c);
        }
    }else {
        sendMsgVerifyFingerBase64(fingerLen,fingerBase64);
    }
}

function StopVerifyFinger(){
    if(isIE){
        axCam_Ocx.StopVerifyFinger();
    }else {
        sednMsgStopVerifyFinger();

    }
}

function GetFingerDataLen(){
    if(isIE){
        var len = axCam_Ocx.GetFingerDataLen();
        InfoTextCallback(34,len);
    }else {
        sendMsgGetFinger(0);
    }

}

function GetFingerBase64(){
    if(isIE){
        var str = axCam_Ocx.GetFingerBase64();
        InfoTextCallback(33,str);
    }else {
        sendMsgGetFinger(1);
    }
}



function FaceStratDouble(){
    if(isIE){
        axCam_Ocx.FaceStratDouble();
        axCam_Ocx2.FaceStratDouble();

    }else{
        sednMsgQFaceStratDoubleOrClose(1);
    }
}

function FaceCloseDouble(){
    if(isIE){
        axCam_Ocx.FaceCloseDouble();
        axCam_Ocx2.FaceCloseDouble();

    }else{
        sednMsgQFaceStratDoubleOrClose(0);
    }
}

function FaceCheckInitDouble(){
    if(isIE){
        FaceCheckInit();
        FaceCheckInitSecond();

    }else {
        sednMsgFaceCheckInitDouble();
    }

}

function SetDpi(xdpi,ydpi){
    if(isIE){
        axCam_Ocx.SetDpi(xdpi,ydpi);
    }else {
        sendMsgSetDpi(xdpi,ydpi);
    }

}

function ReleaseAll(){
    if(isIE){

    }else {
        sednMsgReleaseAll();
    }

}

function InitFaceCheck(){
    if(isIE){
        var ret = axCam_Ocx.InitFaceCheck();
        if(ret==1){
            InfoCallback(0x5f);
        }else {
            InfoCallback(0x60);
        }

    }else {
        sendMsgFaceCheck(1);
    }
}

function DeInitFaceCheck(){
    if(isIE){
        axCam_Ocx.DeInitFaceCheck();

    }else {
        sendMsgFaceCheck(0);
    }
}

function CaptureFace(){
    if(isIE){
        axCam_Ocx.CaptureFace();

    }else {
        sendMsgCaptureFace();
    }
}

function CaptureFaceStr(){
    if(isIE){
        axCam_Ocx.CaptureFaceStr();

    }else {

    }
}

function InitFaceCheckSecond(){
    if(isIE){
        var ret = axCam_Ocx2.InitFaceCheck();
        if(ret==1){
            InfoCallback(0x61);
        }else {
            InfoCallback(0x62);
        }

    }else {
        sendMsgFaceCheckSecond(1);
    }
}

function DeInitFaceCheckSecond(){
    if(isIE){
        axCam_Ocx2.DeInitFaceCheck();

    }else {
        sendMsgFaceCheckSecond(0);
    }
}

function CaptureFaceSecond(){
    if(isIE){
        axCam_Ocx2.CaptureFace();

    }else {
        sendMsgCaptureFaceSecond();
    }
}

function CaptureFaceStrSecond(){
    if(isIE){
        axCam_Ocx2.CaptureFaceStr();

    }else {

    }
}


function GetALLVidPid(){
    if(isIE){
        var num = axCam_Ocx.GetDevCount();
        var strall = num + "";
        for(var i = 0; i < num; i++) {
            var strTemp = axCam_Ocx.GetDeviceVidPid(i);
            strall = strall + "**"+strTemp
        }
        InfoTextCallback(43,strall);
    }else {
        sendMsgGetALLVidPid();
    }
}


function getCanvasPos(canvas,e)
{//获取鼠标在canvas上的坐标

    var rect = canvas.getBoundingClientRect();

    if(e.clientX>rect.left && e.clientX<rect.right && e.clientY>rect.top && e.clientY<rect.bottom){
        return true;
    }else return false;
}


var scrollFunc=function(e){
    e=e || window.event;

    var ret = false;
    if(isIE){
        ret = getCanvasPos(axCam_Ocx,e);
    }else ret =  getCanvasPos(canvas,e);

    //console.log("测试测试测试y:"+yyyy);
    if(ret){
        if(e.wheelDelta){//IE/Opera/Chrome

            if(e.wheelDelta>100){
                ZoomOut();
            }else if(e.wheelDelta<-100){
                ZoomIn();
                if(!isIE){
                    canvasX = 0;
                    canvasY = 0;
                }

            }
        }else if(e.detail){//Firefox
            //t2.value=e.detail;
            if(e.detail>=3){
                ZoomIn();
                if(!isIE){
                    canvasX = 0;
                    canvasY = 0;
                }
            }else if(e.detail<=-3){
                ZoomOut();

            }
        }
        if (e.stopPropagation) e.stopPropagation();
        else e.cancelBubble = true;

        if (e.preventDefault) e.preventDefault();
        else e.returnValue = false;
        return false;
    }else return true;
}



