const getters = {
    token: state => state.user.token,
    introduction: state => state.user.introduction,
    prescriptionPic: state => state.auditing.prescriptionPic,
    ncdpicture: state => state.ncd.picture,
    patientInfo: state => state.remoteAuditing.patientInfo,

    userInfo: state => state.user.userInfo,
    storeInfo: state => state.app.storeInfo, //应用信息
    activeRouer: state => state.app.activeRouer,// 标记的路由地址
    videoKey: state => state.app.videoKey, //视频key
    ncdInfo: state => state.chronicDisease.ncdInfo, //视频key
    callFlage: state => state.app.callFlage, //视频key
    //inObj: state => state.user.inObj, // 视频通话中刷新
    //inType: state => state.user.inType, // 视频通话中刷新
    prescriptionid: state => state.user.prescriptionid,
    camerasArr: state => state.user.camerasArr,
    camerasIdx: state => state.user.camerasIdx,
    remoteLeave: state => state.user.remoteLeave,
    doctorInfo: state => state.user.doctorInfo,
    pharmacistInfo: state => state.user.pharmacistInfo,
    realmName: state => state.user.realmName,
    loginid: state => state.app.loginid,
    interdoctorinfo: state => state.user.interdoctorinfo
}
export default getters
