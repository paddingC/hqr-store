 if(type==0){
    //视频开始显示
  }else if(type==1){
    //拍照的路径
    InfoTextCallback(0,str);
    
  }else if(type==4){
    //摄像头数量变化时
    // var camNum = parseInt(str);
    // GetDevCount(camNum);
     InfoTextCallback(26,str);
  }else if(type==2){

   //ShowInfo("智能连拍数量 = "+str+"\r\n"); 
 }else if(type==3){
  // ShowInfo("定时连拍数量 = "+str+"\r\n"); 
 }else if(type==5){
    //图片保存失败
    InfoTextCallback(8,str);
 }else if(type==6){

   var strsMessage= new Array(); 
  strsMessage = str.split("**");
  for(var i=0;i<strsMessage.length-1 ;i++){
   var num = 9+i;
   InfoTextCallback(9+i,strsMessage[i]);
 }
 var picBase64 = axCam_Ocx.GetICPicture();
 InfoTextCallback(19,picBase64);

}else if(type==7){
 //未发现身份证模块
 InfoCallback(0x1e);
}else if(type==8){
    //base64
    InfoTextCallback(5,str);
}else if(type==9){
    //base64
    LoadOver();
}else if(type==10){
    //base64
   InfoTextCallback(24,str);
}else if(type==11){
  var value = parseInt(str);
   if(value==0){
   InfoCallback(0x33);
  }else  if(value==1){
     InfoCallback(0x29);
  }
}else if(type==12){
    //base64
   InfoCallback(0x35);
}else if(type==13){
    //base64
    InfoTextCallback(28,str);
}else if(type==14){
    //base64
    InfoCallback(0xbb);
}else if(type==15){
  var value = parseInt(str);
    if(value==1){
       InfoCallback(0x50);
    }else  InfoCallback(0x51);
}else if(type==16){
    InfoCallback(0x52);
}else if(type==17){
    InfoCallback(0x53);
}else if(type==18){
  var value = parseInt(str);
       if(value==1){
       InfoCallback(0x54);
    }else  InfoCallback(0x55);
}else if(type==19){

    InfoTextCallback(28,str);

    axCam_Ocx2.FaceDoubleOK();

}

