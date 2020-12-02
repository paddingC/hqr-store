<template>
    <div class="doctorVideoMain">
        <el-row :gutter="20">
            <el-col :span="10">
                <div class="doctorVideoMain_left">
                   <div id="remote_stream" class="remote">
                        <div id="local_stream" class="local"></div>
                    </div>
                </div>
            </el-col>
            <el-col :span="14">
                <div class="doctorVideoMain_right">
                    <div class="doctorVideoMain_right_top">
                        <el-button @click="endBtn" :disabled="doctorLeave && !remoteLeave" class="btn_style" type="primary" size="mini">结束复诊</el-button>
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
                    <div class="doctorVideoMain_right_bottom">
                        <el-card class="box-card physician">
                            <div slot="header" class="clearfix">
                                <span>医师信息</span>
                            </div>
                            <div class="text item info">
                                <div class="physicianIn">
                                    <div class="left">
                                        <img v-if="doctorInfo.headimage==''" src="../../assets/img/modoctor.png" style="width: 50px; height: 50px">
                                        <el-avatar v-else class="headimg" style="width: 50px;height: 50px;" :src="doctorInfo.headimage"></el-avatar>
                                        <ul>
                                            <li class="name">{{doctorInfo.doctorName}}</li>
                                            <li>{{doctorInfo.department}}</li>
                                            <li>{{doctorInfo.positionalTitles}}</li>
                                        </ul>
                                    </div>
                                    <div class="right">
                                        <ul>
                                            <li>{{doctorInfo.medicalinstitutions}}</li>
                                            <li><span style="color: red">联系电话</span> : {{doctorInfo.phone}}</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="synopsis">
                                    <p class="titles">简介 :</p>
                                    <span>&nbsp;&nbsp;{{doctorInfo.profile}}</span>
                                </div>
                                <div class="be-good">
                                    <p class="titles">擅长 :</p>
                                    <span>&nbsp;&nbsp;{{doctorInfo.expertin}}</span>
                                </div>
                            </div>
                        </el-card>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import {mapGetters} from "vuex";
import RtcClient from "../../common/RtcClient";
export default {
    name: "doctorVideo",
    computed: {
        ...mapGetters([
            'userInfo',
            'videoKey',
            'interdoctorinfo',
            'camerasArr',
            'remoteLeave'
        ])
    },
    data () {
        return {
            doctorLeave: true,
            options: [],
            doctorInfo: {},
            chooseValue: '',
            options: [],
        }
    },
    mounted() {
        this.$store.commit('app/SET_CALLFLAGE', true)
        if (this.remoteLeave) {
            this.$store.commit('app/SET_CALLFLAGE', false)
            this.$router.replace({
                path: '/home/remoteCall/chooseHospital'
            })
        } else {
            this.getDoctorinfo()
            this.$nextTick(() => {
                this.getKey()
            })
        }
    },
    sockets: {
        connect: function () {
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
        // 结束问诊
        doctorFinishTreat: function (data) {
            this.doctorLeave = false
            this.prescriptionid = data.prescriptionid
            this.rtc.leave()
            this.$store.commit('app/SET_CALLFLAGE', false)
            this.$router.replace({
                path: '/home/remoteCall/chooseHospital'
            })
        }
    },
    methods: {
        changeCamera (e){
            this.rtc.switchCamera(e)
        },
        getKey () {
            this.$store.dispatch('app/getKey', {
                userid: `P${this.interdoctorinfo.userId}`,
                companyid: this.userInfo.companyid
            }).then(res => {
                this.$nextTick(() => {
                    this.join(this.videoKey)
                })
            }).catch(err => {
                this.$message.warning('获取视频配置信息失败')
                console.log(err)
            })
        },
        join(config) {
            console.log('-------------=======================');
            console.log(config);
            console.log(this.interdoctorinfo.videoRoomId);
            console.log(this.userInfo.userpkid);
            console.log('房间id');
            this.rtc = null
            if (this.rtc) return
            this.rtc = new RtcClient({
                userId: `P${this.interdoctorinfo.userId}`,// config.userid, // 登录接口取
                roomId: this.interdoctorinfo.videoRoomId, // vedioRoomId
                sdkAppId: config.sdkAppId,
                userSig: config.userSig
            })
            this.rtc.saveCameras()
            this.rtc.getCameraId()
            setTimeout(()=>{
                // this.options = this.camerasArr
            },1500)
        },
        getDoctorinfo () {
            this.$store.dispatch('remoteAuditing/zncfdoctorSel', {
                data: this.interdoctorinfo.doctorId,
                companyId: this.userInfo.companyid
            }).then(res => {
                if (res.status === 200) {
                    this.doctorInfo = res.data
                    let needArr = JSON.parse(this.doctorInfo.expertin)
                    if (needArr != null) {
                        this.doctorInfo.expertin = needArr.toString()
                    }
                    this.getNum()
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 结束复诊
        endBtn () {
            this.$store.commit('user/SET_REMOTELEAVE', false)
            this.$store.commit('app/SET_CALLFLAGE', false)
            this.$router.replace({
                path: '/home/remoteCall/chooseHospital'
            })
        },
        // 字典值
        getNum () {
            this.$store.dispatch('remoteAuditing/batchGetDictList', {
                companyId: this.userInfo.companyid,
                loginId: this.loginid,
                data: ['POSITIONALTITLES']
            }).then(res => {
                if (res.status === 200) {
                    res.data.POSITIONALTITLES.forEach(i => {
                        if (this.doctorInfo.positionalTitles == i.dictValue) {
                            this.doctorInfo.positionalTitles = i.dictDtlName
                        }
                    })
                }
            }).catch(err => {
                console.log(err);
            })
        }
    },
    beforeDestroy () {
        window.location.reload()
    }
}
</script>

<style scoped lang="scss" >
    .doctorVideoMain {
        height: 100%;
        width: 100%;
        background: #f5f5f5;
        .doctorVideoMain_left{
            height: 674px;
            .remote{
                position: relative;
                height: 674px;
                border-radius: 5px;
                background-color: #FAFAFA!important;
                background: url("../../assets/img/video_default.png") no-repeat;
                background-size: 64px 64px;
                background-position:center;
            }
            .local{
                position: absolute;
                right: 0;
                bottom: 0px;
                width: 280px;
                height: 224px;
                z-index: 9;
                background-color: #FAFAFA;
            }
        }
        .doctorVideoMain_right{
            height: 674px;
            .doctorVideoMain_right_top{
                height: 60px;
                width: 100%;
                margin-bottom: 20px;
                text-align: right;
                background: #fff;
                .btn_style{
                    font-size: 14px!important;
                    margin-top: 12px;
                    margin-right: 12px;
                }
            }
            .doctorVideoMain_right_bottom{
                height: 594px;
                background: #fff;
                .clearfix{
                    font-size: 18px;
                    font-weight: bold;
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
        }
    }

</style>
