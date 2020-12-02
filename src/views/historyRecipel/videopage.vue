<template>
    <div class="connectPhysician">
        <div class="main3" style="position: relative">
            <div class="conact-success">
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
            <div class="right-Box">
                <div id="remote_stream" class="remote_stream" style="position: relative;width: 100%;height: 90%">
                    <div id="local_stream" class="local" style="position: absolute; z-index: 9999;width: 200px;height: 200px;background-color: #f0f8fa;right: 0;bottom: 0px">

                    </div>
                </div>
            </div>
            <div style="position: absolute;bottom: 20px;left: 40%">
                <label style="margin-left: 95px">切换摄像头&nbsp;&nbsp;</label>
                <el-select v-model="chooseValue" @change="changeCamera" placeholder="请选择" >
                    <el-option
                        v-for="(item, index) in options"
                        :key="item.deviceId"
                        :label="item.label"
                        :value="index">
                    </el-option>
                </el-select>
                <el-button v-if="remoteLeave" type="success" @click="leaveRoom" style="margin-left: 25px">退出</el-button>
                <el-button v-else disabled="disabled" style="margin-left: 25px">退出</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import RtcClient from '../../common/RtcClient'
export default {
    name: "connectVideo",
    data() {
        return {
            chooseValue: '',
            options: []
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
        approveCompletion(data){
            if (this.pharmacistInfo.roomid == data.roomid) {
                this.rtc.leave()
                this.rtc = null
                this.$store.commit('app/SET_CALLFLAGE', false)
                if (data.approvalstatus == '4') {
                    this.enterRoom('异---与执业药师视频界面收到驳回回到处方管理')
                    this.$message.warning(data.reason)
                    this.$router.replace({
                        path: '/home/historyRecipel'
                    })
                } else {
                    this.$router.replace({
                        path: '/home/pharmacyAudit',
                        query: {
                            reason: data.reason,
                            approvalstatus: data.approvalstatus,
                            prescriptionid: data.prescriptionid
                        }
                    })
                }
            }

        },
    },
    methods: {
        leaveRoom () {
            this.$store.commit('app/SET_CALLFLAGE',false)
            this.$socket.emit('enterVideoRoom', JSON.stringify({
                userid: this.userInfo.userid,
                type: '1'
            }))
            this.enterRoom('异---与执业药师视频界面点退出按钮')
            this.rtc.leave()
            this.$router.replace({
                path: '/home/remoteReferral/doctorList'
            })

        },
        getKey(rooID) {
            this.$store.dispatch('app/getKey', {userid: this.userInfo.userid,  companyid: this.userInfo.companyid})
                .then(res => {
                    this.$nextTick(() => {
                        this.join(this.videoKey, rooID)
                    })
                })
                .catch(err => {
                    this.$message.warning('获取视频配置信息失败')
                    console.log(err)
                })
        },
        changeCamera (e){
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
            setTimeout(()=>{
                console.log(this.camerasArr);
                console.log('有没有取到摄像头');
                this.options = this.camerasArr
            },1500)
        },
        listenerHandle () {
            document.onkeydown=function (e) {
                var ev = window.event || e;
                var code = ev.keyCode || ev.which;
                console.log('jhhhh',code);
                if (code == 116||(ev.ctrlKey==true && code==82) ||(ev.ctrlKey==true && code==116)) {
                    ev.cancelBubble = true;
                    ev.preventDefault();
                    return false;
                }
            }
            document.oncontextmenu=function(){return false}
        },
        enterRoom (msg) {
            const that = this
            that.$socket.emit('enterVideoRoom', JSON.stringify({
                userid: this.userInfo.userid,
                status: this.remoteLeave,
                msg: msg
            }))
        },

    },
    mounted () {
        this.$store.commit('app/SET_CALLFLAGE', true)
        if (this.remoteLeave) {
            this.$store.commit('app/SET_CALLFLAGE',false)
            this.$store.commit('user/SET_REMOTELEAVE', false)
            this.enterRoom('异---门店与执业药师视频页面状态是true退回医生列表页面')
            this.$router.replace({
                path: '/home/historyRecipel'
            })
        } else {
            this.$nextTick(() => {
                this.getKey(this.pharmacistInfo.roomid)
                this.enterRoom('异---门店与执业药师视频页面')
            })
        }
        this.listenerHandle()
    },
    created() {
        let path = this.$route.path
        if (path !== '/home/videopage') { return }
        this.$store.commit('app/SET_ROUTER', path)

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
            .remote_stream{
                position: relative;
                background-color: #f0f8fa !important;
                background: url("../../assets/img/videoIcon.png") no-repeat;
                background-position:center;
            }
        }

    }
</style>
