<template>
    <div class="connectPhysician">
        <div class="main3">
            <div class="before" v-show="flage===false">
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

            <div class="conact-success" v-show="flage">
                <div v-show="showPoint" id="remote_stream" class="remote_stream" style="position: relative;width: 100%;height: 100%">
                    <div id="local_stream" class="local" style="position: absolute; z-index: 9999;width: 200px;height: 200px;background-color: #f0f8fa;right: 0;bottom: 0px">

                    </div>
                </div>
                <img v-show="showPoint === false" src="../../assets/img/point-bg.jpg" style="height: 100%" />
            </div>
            <div class="right-Box" v-show="flage">
                <el-card class="box-card physician">
                    <div slot="header" class="clearfix">
                        <span>医师信息</span>
                    </div>
                    <div class="text item info">
                        <div class="physicianIn">
                            <div class="left">
                                <el-avatar class="headimg"
                                           style="width: 50px;height: 50px;"
                                           :src="doctorInfo.doctorInfo.headimage"></el-avatar>
                                <ul>
                                    <li class="name">{{doctorInfo.doctorInfo.doctorname}}</li>
                                    <li>{{doctorInfo.doctorInfo.department}}</li>
                                    <li>{{doctorInfo.doctorInfo.positionaltitles}}</li>
                                </ul>
                            </div>
                            <div class="right">
                                <ul>
                                    <li>{{doctorInfo.doctorInfo.medicalinstitutions}}</li>
                                    <li>服务次数 : {{doctorInfo.doctorInfo.consultationnum}}</li>
                                    <li><span style="color: red">联系电话</span> : {{doctorInfo.doctorInfo.phonenum}}</li>
                                </ul>
                            </div>
                        </div>
                        <div class="synopsis">
                            <p class="titles">简介 :</p>
                            <span>
                              &nbsp;{{doctorInfo.doctorInfo.profile}}
                            </span>
                        </div>
                        <div class="be-good">
                            <p class="titles">擅长 :</p>
                            <span>
                               {{doctorInfo.doctorInfo.expertin}}
                            </span>
                        </div>
                    </div>
                </el-card>
                <el-card class="box-card prescription">
                    <div slot="header" class="clearfix">
                        <span>处方信息</span>
                    </div>
                    <div class="text item">
                        <p style="color: #606266;padding-bottom: 3px;">{{diagnosis}}</p>
                        <vxe-table
                            border
                            highlight-hover-row
                            height="250px"
                            :data="tableData">
                            <vxe-table-column field="goodsname" title="药品名" sortable></vxe-table-column>
                            <vxe-table-column field="goodstype" title="药品规格" sortable></vxe-table-column>
                            <vxe-table-column field="goodsqty" title="数量" sortable></vxe-table-column>
                            <vxe-table-column field="yfyl" title="用法用量" sortable></vxe-table-column>
                            <vxe-table-column field="goodsunit" title="单位" sortable></vxe-table-column>
                        </vxe-table>
                        <el-button type="primary" :disabled="doctorLeave" @click="callPharmacist" style="margin-top: 10px">呼叫执业药师</el-button>
                        <el-button type="primary" :disabled="doctorLeave" @click="endBtn">结束复诊</el-button>
                        <el-button type="danger" :disabled="doctorLeave && !remoteLeave" @click="cancelBtn" style="margin-top: 10px;margin-right: 12px">作废</el-button>
                            <label>切换摄像头&nbsp;&nbsp;</label>
                            <el-select v-model="chooseValue" @change="changeCamera" placeholder="请选择" >
                                <el-option
                                    v-for="(item, index) in options"
                                    :key="item.deviceId"
                                    :label="item.label"
                                    :value="index">
                                </el-option>
                            </el-select>
                    </div>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import RtcClient from '../../common/RtcClient'
export default {
    name: "connectPhysician",
    data() {
        return {
            tableData:[],
            flage: true,
            time: 120,
            setInterval: null,
            placement: 'top-end',
            srcList: [
                'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
                'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
            ],
            rtc: null,
            diagnosis: '',
            doctorLeave: true,
            prescriptionid: '',
            chooseValue: '',
            options: [],
            doorfresh: false,
            isclick: false,
            showPoint: true
        }
    },
    computed: {
        ...mapGetters([
            'userInfo',
            'videoKey',
            'doctorInfo',
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
        // 接收医生录入信息
        receiveMsgFromUser: function (data) {
            if (data.type === '1') {
                this.diagnosis = data.msg.diagnosis
                this.tableData = data.msg.list
            }
        },
        // 有药师接单
        videoResults: function (data) {
            if (data.type == 1) {
                clearInterval(this.setInterval)
                this.enterRoom('收到执业药师接听后跳转')
                this.$store.commit('user/SET_PHARMACISTINFO', data)
                this.$router.replace({
                    path:'/home/remoteReferral/connectPharmacist'
                })
            }
        },
        approveCompletion(data){
            if (this.doctorInfo.roomid == data.roomid) {
                if (data.type == '4') {
                    if (data.cancelType == 1) {
                        this.prescriptionid = data.prescriptionid
                        this.doctorLeave = false
                        this.showPoint = false
                        this.rtc.leave()
                    } else if(data.cancelType == 2) {
                        this.rtc.leave()
                        this.$message.warning('医生取消此次复诊')
                        this.$store.commit('app/SET_CALLFLAGE', false)
                        this.$router.replace({
                            path: '/dashboard'
                        })
                    }
                } else {
                    this.rtc.leave()
                    this.$store.commit('app/SET_CALLFLAGE', false)
                    this.enterRoom('医生挂断后返回type不为4')
                    this.$router.replace({
                        path: '/home/remoteReferral/doctorList'
                    })
                }
            }
        },
        cancelCallback: function (data) {
            if (data.status === 200) {
                clearInterval(this.setInterval)
                this.$store.commit('app/SET_CALLFLAGE', false)
                this.$store.commit('user/SET_REMOTELEAVE', true)
                this.flage = true
                this.isclick = false
            }else if (data.status === 400) {
                this.$message.warning(data.msg)
                this.isclick = false
            }
        }
    },
    methods: {
        changeCamera (e){
            console.log(e);
            this.rtc.switchCamera(e)
        },
        goBack() {
            this.enterRoom('门店点击返回按钮')
            this.isclick = true
            this.$socket.emit('cancelCall', JSON.stringify({
                userid: this.userInfo.userid, companyid: this.userInfo.companyid
            }))
        },
        // 呼叫执业药师
        callPharmacist () {
            const that = this
            that.flage = false
            that.time = 120
            this.$store.commit('user/SET_REMOTELEAVE', false)
            that.enterRoom('点击呼叫执业药师')
            that.$socket.emit('getPharmacist', JSON.stringify({
                userid: this.userInfo.userid,
                companyid: this.userInfo.companyid,
                prescriptionid: this.prescriptionid
            }))
            that.setInterval = setInterval(() => {
                that.time--
                if (that.time <= 0) {
                    this.$socket.emit('cancelCall', JSON.stringify({
                        userid: this.userInfo.userid,
                        companyid: this.userInfo.companyid
                    }))
                    clearInterval(that.setInterval)
                    this.$store.commit('app/SET_CALLFLAGE', false)
                    that.time = '链接超时'
                }
            }, 1000)
        },
        endBtn () {
            this.$store.commit('user/SET_REMOTELEAVE', false)
            this.$store.commit('app/SET_CALLFLAGE', false)
            this.enterRoom('门店点击结束复诊跳转到医生列表')
            this.$router.replace({
                path: '/home/remoteReferral/doctorList'
            })
        },
        cancelBtn () {
            this.$store.dispatch('remoteAuditing/deleteDoc', {prescriptionid: this.prescriptionid,  delflag: '1'}).then(res => {
                this.$store.commit('user/SET_REMOTELEAVE', false)
                this.$store.commit('app/SET_CALLFLAGE', false)
                this.enterRoom('门店点击作废')
                this.$router.replace({
                    path: '/dashboard'
                })
            })
        },
        getKey(rooID) {
            this.$store.dispatch('app/getKey', {userid: this.userInfo.userid,  companyid: this.userInfo.companyid}).then(res => {
                this.$nextTick(() => {
                    this.join(this.videoKey, rooID)
                })
            }).catch(err => {
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
            this.rtc.saveCameras()
            this.rtc.getCameraId()
            //this.rtc.join()
            setTimeout(()=>{
                this.options = this.camerasArr
            },1500)
        },
        listenerHandle () {
            // 键盘值
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
                msg: msg
            }))
        }
    },
    mounted () {
        this.$store.commit('app/SET_CALLFLAGE', true)
        if (this.remoteLeave) {
            this.$store.commit('app/SET_CALLFLAGE', false)
            this.enterRoom('页面重新加载退出当前页')
            this.$router.replace({
                path: '/home/remoteReferral/doctorList'
            })
        } else {
            this.$nextTick(() => {
                this.getKey(this.doctorInfo.roomid)
                this.enterRoom('进入房间')
            })
        }
        this.listenerHandle()
    },
    created() {
        let path = this.$route.path
        if (path !== '/home/remoteReferral/connectPhysician') { return }
        this.$store.commit('app/SET_ROUTER', path)
    },
    beforeDestroy() {
        // console.log('刷新当前界面1111111111111111111111');
        // window.location.reload()
        // this.$nextTick(() => {
        //     if (!!window.dialog.get_actionType) {
        //         window.dialog.get_actionType("closeSignal")
        //     }
        //     clearInterval(this.setInterval)
        // })
    }
}
</script>
<style>
    .el-avatar>img{
        width: 100%!important;
    }
</style>
<style lang="scss" scoped>
    .connectPhysician {
        height: 100%;
        width: 100%;

        .main3 {
            height: 100%;
            display: flex;
            justify-content: space-around;
            align-items: center;
            flex-direction: row;
            background: #fff;
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
            .video {
                position: relative;
                height: 50%;
                background-color: lightblue;
            }
            .remote_stream{
                background-color: #f0f8fa !important;
                background: url("../../assets/img/videoIcon.png") no-repeat;
                background-position:center;
            }

            .video_local{
                position: absolute;
                width: 50%;
                height: 120px;
                background: #36c2aa;
                bottom: 0px;
                right: 0px;
                z-index: 999
            }
            p {
                width: 100%;
                text-align: left;
                padding: 5px;
                font-size: 24px;
            }

        }


        .right-Box {
            /*box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);*/
            width: 56%;
            height: 100%;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .info {
                display: flex;
                flex-direction: column;
                align-items: flex-start;

                .titles {
                    color: #606266;
                    font-weight: 700;
                }

                .physicianIn {
                    height: 100px;
                    width: 100%;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                    border-bottom: 2px dashed #DCDFE6;

                    li {
                        line-height: 25px;
                    }

                    .name {
                        font-weight: 700;
                    }

                    .left {
                        width: 30%;
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: space-around;
                    }

                    .right {
                        width: 30%;
                    }
                }

                .synopsis {
                    height: 90px;
                    width: 100%;
                    padding-top: 5px;
                    border-bottom: 2px dashed #DCDFE6;

                    span {
                        @include ellipsis(3, 1.3)
                    }
                }

                .be-good {
                    height: 110px;
                    width: 100%;
                    padding: 4px;
                    border-bottom: 2px dashed #DCDFE6;

                    span {
                        padding-top: 5px;
                        @include ellipsis(4, 1.3)
                    }
                }


            }

            .box-card {
                height: 49.5%;
                width: 100% !important;
            }

            .text {
                font-size: 14px;
            }

            .item {
            }

            & /deep/ .el-card__header {
                background-color: #b5c9e1;
                padding: 5px 10px;
            }

            & /deep/ .el-card__body {
                padding: 5px 10px;
            }

            .clearfix:before,
            .clearfix:after {
                display: table;
                content: "";
            }

            .clearfix:after {
                clear: both
            }

            .box-card {
                width: 480px;
            }
        }

    }
</style>
