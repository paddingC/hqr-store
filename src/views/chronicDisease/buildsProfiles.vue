<template>
    <div class="buildsProfiles" style="height: 100%">
        <p style="font-size: 16px;line-height: 20px;margin-bottom: 10px;">请将您的处方放置在处方采集设备下,并摆放整齐,确认处方无误后点击发送处方</p>
        <el-steps :active="active" finish-status="success">
            <el-step title="填写患者信息"></el-step>
            <el-step title="上传处方"></el-step>
            <el-step title="远程建档"></el-step>
        </el-steps>
        <el-divider></el-divider>
        <div class="main1" v-show="active===1">
            <div class="qrcode">
                <div id="qrcode"></div>
            </div>
            <div class="form">
                <el-form :model="form" ref="form" :rules="rules" label-width="200px" class="demo-ruleForm">
                    <el-form-item required label="患者姓名" prop="patientname">
                        <el-input style="width: 400px;" type="patientname" v-model.number="form.patientname" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item required label="身份证" prop="idcardno">
                        <el-input style="width: 400px;" type="idcardno" v-model="form.idcardno" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item required label="患者联系方式" prop="telphone">
                        <el-input style="width: 400px;" v-model.number="form.telphone" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="search" @click="submitForm('form')">下一步</el-button>
                        <!--                        <el-button class="search" @click="resetForm('form')">重置</el-button>-->
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="main2" v-show="active===2">
            <div class="photo">
                <img v-show="userInfo.highShotMeterType === '2' || userInfo.highShotMeterType === '3' || userInfo.highShotMeterType === '4'" id="bigPriDev" style="width: 100%;height: 100%" alt="">
                <div v-show="userInfo.highShotMeterType === '1'" id="bigPriDev1"></div>
                <div v-if="userInfo.highShotMeterType === '1'">
                    设备：<select id="DeviceName" name="D1" onchange="ChangeDevice()" style=" width: 180px;height: 42px;line-height: 42px;border-radius: 5px;margin: 12px;"></select>
                </div>
            </div>
            <div class="form2">
                <el-form :model="form2" ref="form2" label-width="200px" class="demo-ruleForm">
                    <el-form-item label="处方类型" prop="resource">
                        <el-radio-group v-model="form2.type">
                            <el-radio v-for="item in comefrom"
                                      :key="item.value"
                                      :label="item.value"
                            >
                                {{item.label}}
                            </el-radio>

                        </el-radio-group>
                    </el-form-item>
                    <!--                    <el-form-item>-->
                    <el-button v-if="userInfo.highShotMeterType === '2' || userInfo.highShotMeterType === '3' || userInfo.highShotMeterType === '4'" id="photographPri" style="margin-left: 131px;margin-bottom: 22px;" class="search">拍照</el-button>
                    <el-button v-if="userInfo.highShotMeterType === '1'" @click="capPhoto" style="margin-left: 131px;margin-bottom: 22px;" class="search">拍照</el-button>
                    <div class="fileDiv1">
                        <el-button class="fileDiv2">上传本地</el-button>
                        <input class="file_input" type="file" ref="fileBtn" @change="Preview" />
                    </div>
                    <el-button @click="callMed" :disabled="finishClick" style="margin-left: 80px;margin-bottom: 22px;" class="search">呼叫药师</el-button>
                    <div style="margin-left: 131px;margin-bottom: 22px;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);"
                         class="demo-image__preview">
                        <el-popover
                            placement="top-start"
                            title="查看详情"
                            trigger="hover"

                            :placement="placement"
                            content="点击查看全部图片">
                            <el-image
                                slot="reference"
                                style="width: 500px; height: 350px;"
                                :src="srcList[0]"
                                alt="证书图片"
                                :preview-src-list="srcList">
                                <div slot="error" class="image-slot"
                                     style="height: 100%;display: flex;justify-content: center;align-items: center;">
                                    <i style="font-size: 50px" class="el-icon-picture-outline"></i>
                                </div>
                            </el-image>
                        </el-popover>
                    </div>
                    <!--                    </el-form-item>-->
                </el-form>
            </div>
        </div>
        <div class="main3" v-show="active===3">
            <div class="before" v-show="active===3&&flage===true">
                <div class="loading">
                    <img
                        src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1576062520511&di=00fac763d7cf79087aedfed389e8754c&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0152395be39c37a80121ab5d479b6c.gif"
                        alt="">
                </div>
                <div class="time">
                    <p>请稍后正在为您匹配合适的药师</p>
                    <p>{{time}}</p>
                    <el-button style="width: 200px;" @click="goBack" :disabled="isclick" class="search">返回</el-button>
                </div>
            </div>
            <div class="conact-success" v-show="active===3&&flage===false">
                <div class="left-BOX">

                    <el-popover
                        placement="top-start"
                        title="证书图片"
                        trigger="hover"
                        :placement="placement"
                        content="点击查看全部图片">
                        <el-image
                            slot="reference"
                            style="height: 50%;"
                            :src="certificate[0]"
                            alt="证书图片"
                            :preview-src-list="certificate">
                        </el-image>
                    </el-popover>
                    <div style="height: 50%;">
                        <el-popover
                            placement="top-start"
                            title="处方图片"
                            trigger="hover"
                            :placement="placement"
                            content="点击查看全部图片">
                            <el-image
                                slot="reference"
                                style="height: 100%;width: 100%"
                                :src="recipelList[0]"
                                alt="处方图片"
                                :preview-src-list="recipelList">
                            </el-image>
                        </el-popover>
                        <!--                    <img src="http://dmimg.5054399.com/allimg/pkm/pk/22.jpg" alt="">-->
                    </div>
                </div>
                <div class="right-Box" id="remote_stream" style="position: relative">
                    <div class="local" id="local_stream"
                         style="position: absolute; z-index: 9999;width: 200px;height: 200px;background-color: #f0f8fa;right: 0;bottom: 0px"></div>

                </div>
                <div style="position: absolute;bottom: 105px;left: 40%">
                    <label style="margin-left: 95px">切换摄像头&nbsp;&nbsp;</label>
                    <el-select v-model="chooseValue" @change="changeCamera" placeholder="请选择" >
                        <el-option
                            v-for="(item, index) in options"
                            :key="item.deviceId"
                            :label="item.label"
                            :value="index">
                        </el-option>
                    </el-select>
                    <el-button v-if="remoteLeave" @click="leaveRoom" style="margin-left: 25px">退出</el-button>
                    <el-button v-else disabled="disabled" style="margin-left: 25px">退出</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import QRCode       from "qrcodejs2"
    import QWebChannel  from '../../common/qwebchannel'
    import {mapGetters} from 'vuex'
    // import TRTC         from 'trtc-js-sdk'
    import RtcClient    from '../../common/RtcClient'
    import $ from 'jquery'
    export default {
        name: "buildsProfiles",
        data() {
            var checkPhone = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('手机号不能为空'))
                } else {
                    const reg = /^1(2|3|4|5|6|7|8|9)\d{9}$/
                    console.log(reg.test(value))
                    if (reg.test(value)) {
                        callback()
                    } else {
                        return callback(new Error('请输入正确的手机号'))
                    }
                }
            }
            var checkId = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('身份证号不能为空'))
                } else {
                    const reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/
                    console.log(reg.test(value))
                    if (reg.test(value)) {
                        callback()
                    } else {
                        return callback(new Error('请输入正确的身份证'))
                    }
                }
            }
            var checkName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('患者姓名不能为空'))
                } else {
                    callback()
                }
            }
            return {
                flage: true,
                placement: 'top-end',
                certificateList: [
                    'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
                    'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
                ],
                recipelList: [
                    'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg',
                    'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
                ],
                time: 120,
                setInterval: null,
                loading: true,
                rules: {
                    telphone: [
                        {validator: checkPhone, trigger: 'blur'}
                    ],
                    patientname: [
                        {validator: checkName, trigger: 'blur'}
                    ],
                    idcardno: [
                        {validator: checkId, trigger: 'blur'}
                    ]
                },
                url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
                srcList: [],
                active: 1,
                link: "我是二维码",
                form: {
                    patientname: '',
                    telphone: '',
                    idcardno: '',
                },
                form2: {
                    type: 1,
                },
                comefrom: [ {label: '西药', value: 1},
                    {label: '中药', value: 2} ],
                baseUrl: null,
                certificate: [],
                prescriptionid: null,
                rtc: null,
                chooseValue: '',
                options: [],
                isclick: false,
                finishClick: false,
                curRoomid: '',
                baseFile64: [],
                imgTimer: null
            }
        },
        computed: {
            ...mapGetters([
                'patientInfo',
                'userInfo',
                'token',
                'videoKey',
                'camerasArr',
                'remoteLeave'
            ])
        },
        sockets: {
            connect: function () {
                console.log('socket 链接成功--------------------')
                this.$socket.emit('login', JSON.stringify({
                    userid: this.userInfo.userid, companyid: this.userInfo.companyid
                }))
            },
            connecting: function () {
                console.log('正在连接')
            },
            connect_failed: function () {
                console.log('连接失败')
            },
            disconnect: function () {
                console.log('断开连接')
            },
            error: function () {
                console.log('错误发生，并且无法被其他事件类型所处理')
            },
            videoResults: function (data) {
                clearInterval(this.setInterval)
                console.log(data, "-------------ideoResults:慢病-------------")
                if (data.type === 1) {
                    // this.$message.success("连接成功")
                    this.flage = false
                    this.$store.commit('app/SET_CALLFLAGE', true)
                    this.curRoomid = data.roomid
                    this.getKey(data.roomid)
                    this.certificate = data.pharmacistinfo.certificate
                    // this.recipelList = []
                    this.recipelList = data.prescriptioninfo.imageurl
                    if(this.userInfo.highShotMeterType === '1') {
                        CloseVideo()
                    }
                }
            },
            approveCompletion: function (data) {
                if (this.curRoomid == data.roomid){
                    this.rtc.leave()
                    this.$store.commit('app/SET_CALLFLAGE', false)
                    this.$router.replace({
                        path:'/home/pharmacyAudit',
                        query:{
                            reason:data.reason,
                            approvalstatus:data.approvalstatus,
                        }
                    })
                }

            },
            cancelCallback: function (data) {
                if (data.status === 200) {
                    this.$store.commit('app/SET_CALLFLAGE', false)
                    this.active = 2
                    clearInterval(this.setInterval)
                    this.isclick = false
                }else if (data.status === 400) {
                    this.$message.warning(data.msg)
                    this.isclick = false
                }
            },
            // 扫码回填信息
            setPatient: function (data) {
                if (this.active == 1) {
                    this.form.patientname = data.patientname
                    this.form.idcardno = data.idcardno
                    this.form.telphone = data.telphone
                }
            }
        },
        methods: {
            Preview(){
                var that = this;
                const inputFile = this.$refs.fileBtn.files[0];
                this.inputFile = inputFile;
                if (this.inputFile) {
                    let inputFile = this.inputFile;
                    if (inputFile.type !== 'image/jpeg' && inputFile.type !== 'image/png' && inputFile.type !== 'image/gif') {
                        this.$message.warning('不是有效的图片文件！')
                        return;
                    }

                    const reader = new FileReader();
                    reader.readAsDataURL(this.inputFile);
                    reader.onload = data=> {
                        let ress = data.target
                        that.srcList.unshift(ress.result)
                        let arr = ress.result.split(',')
                        that.baseFile64 = arr[1]
                    };
                } else {
                    return;
                }
            },
            leaveRoom () {
                this.$store.commit('app/SET_CALLFLAGE',false)
                this.rtc.leave()
                this.$router.replace(
                    {
                        path: '/home/pharmacyAudit',
                    }
                )
            },
            callMed() {
                if (this.srcList.length !== 0) {
                    this.finishClick = true
                    this.sxSaveDoc()
                } else {
                    this.$message.warning('请上传处方后再呼叫执业药师')
                }
            },
            goBack() {
                this.isclick = true
                this.finishClick = false
                this.$socket.emit('cancelCall', JSON.stringify({
                    userid: this.userInfo.userid, companyid: this.userInfo.companyid
                }))
            },
            openSocket() {
                const that = this
                var socket = new WebSocket(this.baseUrl)
                socket.onclose = function () {
                    console.error("web channel closed")
                }
                socket.onerror = function (error) {
                    console.error("web channel error: " + error)
                }
                socket.onopen = function () {
                    that.output("WebSocket start connect")
                    new QWebChannel(socket, function (channel) {
                        // make dialog object accessible globally
                        window.dialog = channel.objects.dialog
                        window.dialog.html_loaded("one")

                        //网页关闭函数
                        window.onbeforeunload = function () {
                            window.dialog.get_actionType("closeSignal")
                        }
                        window.onunload = function () {
                            window.dialog.get_actionType("closeSignal")
                        }
                        //反初始化
                        // document.getElementById("closeHtml").onclick = function () {
                        //     dialog.get_actionType("closeSignal")
                        //     var element = document.getElementById("bigPriDev")
                        //     element.src = ""
                        // }
                        //初始化
                        // document.getElementById("openHtml").onclick = function () {
                        window.dialog.html_loaded("one")
                        // }

                        //拍照按钮点击
                        document.getElementById("photographPri").onclick = function () {
                            dialog.photoBtnClicked("primaryDev_")
                            dialog.get_actionType("savePhotoPriDev")
                        }
                        //服务器返回消息
                        dialog.sendPrintInfo.connect(function (message) {
                            // that.output(message)
                            if (message.indexOf("priDevName") != -1) {
                                let videoType = message.slice(11, message.length)
                                sessionStorage.setItem('videoType', videoType)
                            }
                            //图片保存后返回路径关键字savePhoto_success:
                            // if (message.indexOf("savePhoto_success:") >= 0) {
                            //     imgPath = message.substr(18)
                            // }
                        })
                        //接收图片流用来展示，多个，较小的base64数据
                        dialog.send_priImgData.connect(function (message) {
                            var element = document.getElementById("bigPriDev")
                            element.src = "data:image/jpg;base64," + message
                        })
                        //接收拍照base64
                        dialog.send_priPhotoData.connect(function (message) {
                            let url = "data:image/jpg;base64," + message
                            that.srcList.unshift(url)
                            // that.$store.commit('ncd/SET_PICTURE', url)
                            // console.log(that.$store.getters.ncdpicture)
                            // var element = document.getElementById("devPhoto")
                            // element.src = "data:image/jpg;base64," + message
                        })
                        that.output("ready to send/receive messages!")
                        //网页加载完成信号
                        dialog.html_loaded("one")
                    })
                }
            },
            output(message) {
                console.log(message)
            },
            photoInit() {
                this.baseUrl = "ws://127.0.0.1:12345"
                this.output("Connecting at " + this.baseUrl + ".")
                this.openSocket()
            },
            submitForm(formName) {
                this.$refs[ formName ].validate((valid) => {
                    if (valid) {
                        this.$store.dispatch('remoteAuditing/savePatient', this.form)
                            .then(res => {
                                if (this.userInfo.highShotMeterType === '1') {
                                    this.dotPhoto()
                                } else if(this.userInfo.highShotMeterType === '2' || this.userInfo.highShotMeterType === '3' || this.userInfo.highShotMeterType === '4') {
                                    // 良田S300L/S818YJ
                                    this.photoInit()
                                }
                                this.next()
                            }).catch(err => {
                            console.log(err, 'err')
                        })
                    } else {
                        return false
                    }
                })
            },
            resetForm(formName) {
                this.$refs[ formName ].resetFields()
            },
            next() {
                if (this.active++ > 2) this.active = 0
            },
            qrcode() {
                let that = this
                let qrcode = new QRCode('qrcode', {
                    width: 300,
                    height: 300,        // 高度
                    text: this.userInfo.url,   // 二维码内容
                    // render: 'canvas' ,   // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
                    // background: '#f0f',   // 背景色
                    // foreground: '#ff0'    // 前景色
                })
            },
            getParms() {
                return {
                    prescriptiontype: this.form2.type, //处方类型
                    patient: this.form.patientname,// 患者姓名
                    idcard: this.form.idcardno,// 身份证号
                    insiderphone: this.form.telphone,// 手机号
                    patientid: '',// 患者ID 微信登录 传
                    inputmanid: this.userInfo.userid,// 录入人ID
                    deptid: this.userInfo.deptid,// 部门ID
                    companyid: this.userInfo.companyid,// 入驻企业ID
                    attribute: '2',// 普通处方
                    comefrom: '1',// 拍照处方
                    imageurl: this.srcList,//处方图片base64 数组
                    companyname: this.userInfo.companyname,
                    deptname: this.userInfo.deptname,
                    inputmanname: this.userInfo.username
                }
            },
            sxSaveDoc() {
                const that = this
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.3)'
                })
                const parms = this.getParms()
                this.$store.dispatch('remoteAuditing/sxsavedoc', parms).then(prescriptionid => {
                    loading.close()
                    that.$socket.emit('getPharmacist', JSON.stringify({userid: parms.inputmanid, companyid: parms.companyid, prescriptionid: prescriptionid}))
                    that.prescriptionid = prescriptionid
                    that.active = 3
                    that.flage = true
                    that.time = 120
                    that.setInterval = setInterval(() => {
                        that.time--
                        if (that.time <= 0) {
                            this.$socket.emit('cancelCall', JSON.stringify({
                                userid: this.userInfo.userid, companyid: this.userInfo.companyid
                            }))
                            clearInterval(that.setInterval)
                            that.time = '链接超时'
                            that.finishClick = false
                        }
                    }, 1000)
                }).catch(err => {
                    loading.close()
                    this.finishClick = false
                    console.log(err, 'err')
                })
            },
            getKey(rooID) {
                // let id = mduserid + '_1_' + this.prescriptionid
                this.$store.dispatch('app/getKey', {userid: this.userInfo.userid,  companyid: this.userInfo.companyid})
                    .then(res => {
                        let parms = res
                        parms.rooID = rooID
                        this.$nextTick(() => {
                            if (this.userInfo.highShotMeterType === '2' || this.userInfo.highShotMeterType === '3' || this.userInfo.highShotMeterType === '4'){
                                window.dialog.get_actionType("closeSignal")
                            }
                            this.join(this.videoKey, rooID)
                        })
                    })
                    .catch(err => {
                        this.$message.warning('获取视频配置信息失败')
                        console.log(err)
                    })
            },
            join(config, rooID) {
                this.rtc = null
                if (this.rtc) return
                this.rtc = new RtcClient({
                    userId: config.userid,
                    roomId: rooID,
                    sdkAppId: config.sdkAppId,
                    userSig: config.userSig
                })
                //this.rtc.join()
                this.rtc.saveCameras()
                this.rtc.getCameraId()
                setTimeout(()=>{
                    this.options = this.camerasArr
                },1500)
            },
            changeCamera (e) {
                this.rtc.switchCamera(e)
            },
            listenerHandle () {
                // 键盘值
                document.onkeydown=function (e) {
                    var ev = window.event || e;
                    var code = ev.keyCode || ev.which;
                    if (code == 116||(ev.ctrlKey==true && code==82) ||(ev.ctrlKey==true && code==116)) {
                        ev.cancelBubble = true;
                        ev.preventDefault();
                        return false;
                    }
                }
                document.oncontextmenu=function(){return false}
            },
            // 点易拍
            dotPhoto () {
                const that = this
                function loadActiveX() {
                    //if (navigator.userAgent.indexOf('MSIE') >= 0) {
                    if (!!window.ActiveXObject || "ActiveXObject" in window){
                        isIE = true;
                        //IE浏览器加载控件
                        document.getElementById("bigPriDev1").innerHTML = "<OBJECT id=\"axCam_Ocx\"  classid=\"clsid:D5BD5B4A-4FC0-4869-880B-27EE9869D706\" width=\"700px\" height=\"400px\" ></OBJECT>";
                        OcxInit();
                    }
                    else {
                        isIE = false;
                        if (!window.WebSocket) {
                            alert("WebSocket not supported by this browser!");
                        }
                        //其他浏览器加载控件
                        document.getElementById("bigPriDev1").innerHTML =" <canvas id=\"cameraCanvas\" width=\"700px\" height=\"402px\" style=\"border:1px solid #d3d3d3;\">";
                        WsInit(500,400,500,400,true);
                    }
                }
                loadActiveX()
            },
            capPhoto () {
                sessionStorage.setItem("imgBaseType",'2')
                Capture()
                this.GetImgBase64()
            },
            GetImgBase64(){
                if (sessionStorage.getItem("imgBase64")!= '' && sessionStorage.getItem("imgBase64")!= null && sessionStorage.getItem("imgBaseType")=='2'){
                    this.srcList.unshift(sessionStorage.getItem("imgBase64"))
                    sessionStorage.setItem("imgBase64",'')
                    clearTimeout(this.imgTimer)
                }else {
                    this.imgTimer=setTimeout(() => {this.GetImgBase64()},200)
                }
            },
        },

        mounted() {
            this.$nextTick(function () {
                this.qrcode()
            })
            let path = '/home/chronicDisease/index'
            this.$store.commit('app/SET_ROUTER', path)
            if (this.active !== 3) {
                this.$store.commit('app/SET_CALLFLAGE', false)
            }
        },
        created() {
            this.$store.commit('app/SET_ROUTER', 'home/chronicDisease/index')
            if (this.active !== 3) {
                this.$store.commit('app/SET_CALLFLAGE', false)
            }
            this.listenerHandle()
        },
        beforeDestroy() {
            window.location.reload()
            if (this.userInfo.highShotMeterType === '2' || this.userInfo.highShotMeterType === '3' || this.userInfo.highShotMeterType === '4'){
                window.dialog.get_actionType("closeSignal")
            }
            clearInterval(this.setInterval)
        }
    }
</script>
<style>
    .el-step__head.is-success, .el-step__title.is-success {
        color        : #36c2aa;
        border-color : #36c2aa;
    }
    .el-step.is-horizontal .el-step__line {
        height : 2px;
        top    : 30px;
        left   : 0;
        right  : 0;
    }
    .el-step__icon.is-text {
        border-radius : 50%;
        border        : 2px solid;
        border-color  : inherit;
    }
    .el-step__icon {
        width     : 62px;
        height    : 62px;
        font-size : 28px;
    }
</style>
<style lang="scss" scoped>
    .buildsProfiles {
        .fileDiv1 {
            display: inline-block;
            margin-left: 100px;
            position: relative;
        }

        .fileDiv2 {
            color: #FFF;
            background-color: $color-btn;
            border-color: $color-btn;
        }
        .file_input {
            width: 100px;/*因为file-input在部分浏览器中会自带一个输入框，需要双击才可以点击上传,放大后将其定位到div外面就好啦*/
            height: 36px;
            position: absolute;
            top: 0;
            left: 0px;
            z-index:1;
            -moz-opacity: 0;
            -ms-opacity: 0;
            -webkit-opacity: 0;
            opacity: 0;  /*css属性——opcity不透明度，取值0-1*/
            filter: alpha(opacity=0); /*兼容IE8及以下--filter属性是IE特有的，它还有很多其它滤镜效果，而filter: alpha(opacity=0); 兼容IE8及以下的IE浏览器(如果你的电脑IE是8以下的版本，使用某些效果是可能会有一个允许ActiveX的提示,注意点一下就ok啦)*/
            cursor: pointer;
        }
        .search {
            color: #FFF;
            background-color: $color-btn;
            border-color: $color-btn;
        }

        width: 100%;
        box-sizing: border-box;
        padding: 20px;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        .main1 {
            display: flex;
            flex: 1;
            justify-content: space-around;
            align-items: center;

            .qrcode {

                width: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .form {
                flex: 1;
            }
        }

        .main2 {
            padding: 20px 0;
            flex: 1;
            display: flex;
            justify-content: space-around;
            align-items: center;
            flex-direction: row;

            .photo {
                width: 700px;
                height: 100%;
                /*background-color: rosybrown;*/
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            }

            .form2 {
                align-self: flex-start;
                min-width: 600px;
                height: 100%;
            }
        }

        .main3 {
            height: 500px;
            padding: 10px 0;
            display: flex;
            justify-content: space-around;
            align-items: center;
            flex-direction: row;

            .before {
                width: 500px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                /*align-items: center;*/
                align-items: center;
                height: 400px;

                .loading {
                    width: 200px;
                    height: 200px;

                    img {
                        height: 100%;
                        width: 100%;
                    }
                }

                .time {
                    box-sizing: border-box;
                    padding-top: 20px;
                    text-align: center;

                    p {
                        font-size: 23px;
                        padding: 15px;
                    }
                }
            }

            .conact-success {
                display: flex;
                flex-direction: row;
                justify-content: space-around;
                /*align-items: center;*/
                align-items: center;
                width: 100%;
                height: 100%;
                box-sizing: border-box;

                .left-BOX {
                    width: 40%;
                    height: 100%;
                    overflow: hidden;
                    box-sizing: border-box;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);

                    img {
                        width: 100%;
                        height: 100%;
                    }
                }

                .right-Box {
                    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
                    width: 56%;
                    height: 100%;
                    /*height: 80%;*/
                    box-sizing: border-box;
                    background-color: #f0f8fa !important;
                    background: url("../../assets/img/videoIcon.png") no-repeat;
                    background-position:center;
                }
            }
        }
    }
</style>

