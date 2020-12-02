<template>
    <div class="connectPhysician">
        <div class="main3" style="position: relative">
            <div class="conact-success" v-show="flage">
                <p>执业资格证</p>
                <div>执业药师：{{pharmacistInfo.pharmacistinfo.username}}</div>
                <div>联系电话：{{pharmacistInfo.pharmacistinfo.telphone}}</div>

                <el-image
                    style="height: 100%;"
                    :src="pharmacistInfo.pharmacistinfo.certificate[0]"
                    alt="证书图片"
                    :preview-src-list="pharmacistInfo.pharmacistinfo.certificate">
                </el-image>
            </div>
            <div class="right-Box" v-show="flage">
                <div id="remote_stream" style="position: relative;width: 100%;height: 90%">
                    <div id="local_stream" class="local"
                         style="position: absolute; z-index: 9999;width: 200px;height: 200px;background-color: royalblue;right: 0;bottom: 0px">

                    </div>
                </div>
            </div>
            <div style="position: absolute;bottom: 20px;text-align: center;margin-left: 30px;">
                <el-button @click="endGuidance">结束指导</el-button>
                <el-button @click="openVadio">拍照</el-button>
                <el-dialog title="拍照" :destroy-on-close="true" :before-close="handleClose"
                           :visible.sync="dialogTableVisible" width="800px">
                    <div style="display: flex;flex-direction: column;">
                        <div style="display: flex;justify-content: space-around;align-items: center">
                            <img id="bigPriDev" style="width: 360px;height: 270px"/>
                            <img id="devPhoto" style="width: 360px;height: 270px"/>
                        </div>
                        <div style="padding-top: 30px;">
                            <el-button id="photographPri">拍照</el-button>
                            <el-button @click="sendPicture">发送</el-button>
                        </div>
                    </div>
                </el-dialog>
                <!--<label style="margin-left: 95px">切换摄像头&nbsp;&nbsp;</label>-->
                <!--<el-select v-model="chooseValue" @change="changeCamera" placeholder="请选择" >-->
                <!--<el-option-->
                <!--v-for="(item, index) in options"-->
                <!--:key="item.deviceId"-->
                <!--:label="item.label"-->
                <!--:value="index">-->
                <!--</el-option>-->
                <!--</el-select>-->
                <!--<el-button v-if="remoteLeave" type="success" @click="leaveRoom" style="margin-left: 25px">退出</el-button>-->
                <!--<el-button v-else disabled="disabled" style="margin-left: 25px">退出</el-button>-->
            </div>
        </div>
    </div>
</template>

<script>
import {mapGetters}  from 'vuex'
import RtcClient     from '../../common/RtcClient'
import QWebChannel   from '../../common/qwebchannel'
import {sendPicture} from '../../api/app'

export default {
    data() {
        return {
            flage: true,
            chooseValue: '',
            options: [],
            dialogTableVisible: false,
            baseUrl: 'ws://127.0.0.1:12345',
            socket: null,
            imgPath: null,
            dialog: null,
        }
    },
    computed: {
        ...mapGetters([
            'userInfo',
            'videoKey',
            'pharmacistInfo',
            'remoteLeave',
            'camerasArr'
        ])
    },
    sockets: {
        connect: function () {
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
        videoEnd(data) {
            if (data.status === 200) {
                if (this.pharmacistInfo.roomid == data.data.roomid) {
                    this.rtc.leave()
                    this.$store.commit('app/SET_CALLFLAGE', false)
                    this.$router.replace({
                        path: '/home/medicationGuidance/physicianList'
                    })
                }
            }
        }
    },
    methods: {
        endGuidance() {
            this.$socket.emit('instructionEnd', JSON.stringify({
                mduserid: this.userInfo.userid,
                regid: this.pharmacistInfo.instructioninfo.regid,
                companyid: this.userInfo.companyid,
                pharmacistuserid: this.pharmacistInfo.pharmacistinfo.userid
            }))
            this.$store.commit('app/SET_CALLFLAGE', false)
            this.$router.replace({
                path: '/home/medicationGuidance/physicianList'
            })
        },
        getKey(rooID) {
            this.$store.dispatch('app/getKey', {userid: this.userInfo.userid, companyid: this.userInfo.companyid}).then(res => {
                this.$nextTick(() => {
                    this.join(this.videoKey, rooID)
                })
            }).catch(err => {
                this.$message.warning('获取视频配置信息失败')
                console.log(err)
            })
        },
        changeCamera(e) {
            this.rtc.switchCamera(e)
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
            this.rtc.saveCameras()
            this.rtc.getCameraId()
            //this.rtc.join()
            setTimeout(() => {
                console.log(this.camerasArr)
                console.log('有没有取到摄像头')
                this.options = this.camerasArr
            }, 1500)
        },
        listenerHandle() {
            document.onkeydown = function (e) {
                var ev = window.event || e
                var code = ev.keyCode || ev.which
                console.log('jhhhh', code)
                if (code == 116 || ( ev.ctrlKey == true && code == 82 ) || ( ev.ctrlKey == true && code == 116 )) {
                    ev.cancelBubble = true
                    ev.preventDefault()
                    return false
                }
            }
            document.oncontextmenu = function () {return false}
        },
        enterRoom(msg) {
            const that = this
            that.$socket.emit('enterVideoRoom', JSON.stringify({
                userid: this.userInfo.userid,
                status: this.remoteLeave,
                msg: msg
            }))
        },
        hightPhotoInit() {
            this.output("Connecting at " + this.baseUrl + ".")
            this.openSocket()
        },
        output(message) {
            console.log("outputMessage:  ", message)
        },
        openSocket() {
            const that = this
            this.socket = new WebSocket(this.baseUrl)
            this.socket.onclose = function () {
                console.error("web channel closed")
            }
            this.socket.onerror = function (error) {
                console.error("web channel error: " + error)
            }
            this.socket.onopen = function () {
                that.output("WebSocket start connect")
                new QWebChannel(that.socket, (channel) => {
                    // make dialog object accessible globally
                    that.dialog = channel.objects.dialog
                    //网页关闭函数
                    window.onbeforeunload = function () {
                        that.dialog.get_actionType("closeSignal")
                    }
                    window.onunload = function () {
                        that.dialog.get_actionType("closeSignal")
                    }
                    // 反初始化
                    // document.getElementById("closeHtml").onclick = function () {
                    //     that.dialog.get_actionType("closeSignal")
                    //     var element = document.getElementById("bigPriDev")
                    //     element.src = ""
                    // }
                    //初始化高拍仪
                    // document.getElementById("openHtml").onclick = function () {
                    //     that.dialog.html_loaded("one")
                    // }
                    //高拍仪拍照
                    document.getElementById("photographPri").onclick = function () {
                        that.dialog.photoBtnClicked("primaryDev_")
                        that.dialog.get_actionType("savePhotoPriDev")
                    }
                    //服务器返回消息
                    that.dialog.sendPrintInfo.connect(function (message) {
                        that.output(message)
                        //设备信息 priModel
                        if (message.indexOf("priDevName:") >= 0) {
                            message = message.substr(11)
                        }
                        //设备出图格式
                        if (message.indexOf("priModel:") >= 0) {
                            message = message.substr(9)
                        }
                        //设备分辨率
                        if (message.indexOf("priResolution:") >= 0) {
                            message = message.substr(14)
                        }
                        //图片保存后返回路径关键字savePhoto_success:
                        else if (message.indexOf("savePhoto_success:") >= 0) {
                            // that.imgPath = message.substr(18)
                        }
                    })
                    //接收图片流用来展示，多个，较小的base64数据
                    that.dialog.send_priImgData.connect(function (message) {
                        var element = document.getElementById("bigPriDev")
                        element.src = "data:image/jpg;base64," + message
                    })
                    //接收拍照base64
                    that.dialog.send_priPhotoData.connect(function (message) {
                        var element = document.getElementById("devPhoto")
                        element.src = "data:image/jpg;base64," + message
                        that.imgPath = "data:image/jpg;base64," + message
                        console.log(that.imgPath)
                    })
                    that.output("ready to send/receive messages!")
                    //网页加载完成信号
                    that.dialog.html_loaded("one")
                })
            }
        },
        sendPicture() {
            const id = this.pharmacistInfo.pharmacistinfo.userid
            console.log(this.userInfo)
          const companyid=this.userInfo.companyid
          const loginId=this.userInfo.token.name
            sendPicture({
                companyId:companyid,
                data:{
                    receiverUserId: id,
                    content: this.imgPath,
                },
                loginId:loginId
            })
                .then(res => {
                    console.log(res.status)
                    if (res.status===200){
                        this.dialog.get_actionType("closeSignal")
                        var element = document.getElementById("bigPriDev")
                        element.src = ""
                        this.dialogTableVisible=false
                    }else {
                        this.$message.error('发送失败')
                    }
                }).catch(err => {
                console.log(err)
                this.$message.error('发送失败')
            })
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done()
                    this.dialog.get_actionType("closeSignal")
                    var element = document.getElementById("bigPriDev")
                    element.src = ""
                })
                .catch(_ => {})
        },
        openVadio() {
            this.dialogTableVisible = true
            this.$nextTick(() => {
                this.hightPhotoInit()
            })
        }
    },
    mounted() {
        this.$store.commit('app/SET_CALLFLAGE', true)
        if (this.remoteLeave) {
            this.enterRoom('门店与执业药师视频页面状态是true退回药师列表页面')
            this.$store.commit('app/SET_CALLFLAGE', false)
            this.$store.commit('user/SET_REMOTELEAVE', false)
            this.$router.replace({
                path: '/home/medicationGuidance/physicianList'
            })
        } else {
            this.$nextTick(() => {
                this.getKey(this.pharmacistInfo.roomid)
                this.enterRoom('门店与执业药师视频页面')
            })
        }
        this.listenerHandle()

    },
    created() {
        let path = this.$route.path
        if (path !== '/home/remoteReferral/connectPharmacist') { return }
        this.$store.commit('app/SET_ROUTER', path)
    },
    beforeDestroy() {
        window.location.reload()
    }
}
</script>

<style lang="scss" scoped>
    .connectPhysician {
        height: 100%;
        width: 100%;

        .main3 {
            height: 100%;
            padding: 10px 0;
            display: flex;
            justify-content: space-around;
            align-items: center;
            flex-direction: row;
        }

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
            box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            width: 40%;
            height: 100%;
            box-sizing: border-box;
            padding: 15px;

            p {
                width: 100%;
                text-align: left;
                padding: 5px;
                font-size: 24px;
            }

        }


        .right-Box {
            box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
            width: 56%;
            height: 100%;
            padding: 15px;
            box-sizing: border-box;
        }

    }
</style>
