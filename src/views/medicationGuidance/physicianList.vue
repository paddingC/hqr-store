<template>
    <div class="physicianList">
        <div v-if="flage===true">
            <el-row>
                <el-col :span="24">
                    <div class="grid-content">
                        <div>
                            <p>在线药师 : {{num.free}} 位 , 忙碌药师 : {{num.working}} 位 , 离线药师 : {{num.offine}} 位</p>
                        </div>
                        <div>
                            <vxe-pager
                                perfect
                                :loading="loading"
                                :current-page="tablePage.currentPage"
                                :page-size="tablePage.pageSize"
                                :total="tablePage.totalResult"
                                :page-sizes="[8]"
                                :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
                                @page-change="handlePageChange">
                            </vxe-pager>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <div class="list-box" style="position: relative">
                <el-row :gutter="20">
                    <el-col :span="6" style=" margin-bottom: 10px;" v-for="(item,index) in lists" :key="index">
                        <el-card class="box-card">
                            <div class="detail" v-if="callPhysician">
                                <div class="img" @click="callOne(item)" style="cursor: pointer">
                                    <el-avatar class="headimg"
                                               style="width: 100px;height: 100px;"
                                               :src="item.headimage"></el-avatar>
                                </div>
                                <span class="name">{{item.username}}</span>
                                <div class="zs" @click.stop="getPhote(item)">
                                    <i class="el-icon-folder"></i> <span>执业资格证书</span>
                                </div>

                                <div class="fw">
                                    <span> 服务人数:
                                        <span>{{item.instructiontimes}}</span>
                                        <span style="color: limegreen" v-if="item.workstatus==0 && item.poststatus == 1">空闲</span>
                                        <span style="color: gray" v-if="item.poststatus==0">离线</span>
                                        <span style="color: red" v-if="item.workstatus==1 && item.poststatus == 1">忙碌</span>
                                    </span>
                                </div>
                                <div class="synopsis">
                                    <span class="details" alt="简介" @mouseover="hover(index, 2)" @mouseout="showUpdate = -1">
                                        <span class="title"> 简介 :</span>
                                        {{item.profile}}
                                        <div class="showBox" v-show="showUpdate == index && item.profile != undefined && item.profile != ''">
                                            {{item.profile}}
                                        </div>
                                    </span>
                                </div>
                            </div>
                            <div class="detail" v-else>
                                <div class="img">
                                    <el-avatar class="headimg"
                                               style="width: 100px;height: 100px;"
                                               :src="item.headimage"></el-avatar>
                                </div>
                                <span class="name">{{item.doctorname}}</span>
                                <div class="zs" @click.stop="getPhote(item)">
                                    <i class="el-icon-folder"></i> <span>执业资格证书</span>
                                </div>

                                <div class="fw">
                                    <span> 服务人数:
                                        <span>{{item.instructiontimes}}</span>
                                        <span style="color: limegreen" v-if="item.workstatus==0 && item.poststatus == 1">空闲</span>
                                        <span style="color: gray" v-if="item.poststatus==0">离线</span>
                                        <span style="color: red" v-if="item.workstatus==1 && item.poststatus == 1">忙碌</span>
                                    </span>
                                </div>
                                <div class="synopsis">
                                    <span class="details" alt="简介"> <span class="title"> 简介 :</span> {{item.profile}}</span>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
        </div>

        <el-dialog title="证书" :visible.sync="dialogTableVisible" style="text-align: center">
            <!--<el-avatar shape="square" :size="500" :fit="fit" :src="url"></el-avatar>-->
            <el-image
                class="img"
                style="width: 100%; height:100%"
                :src="certificate[0]"
                :preview-src-list="certificate">
            </el-image>
        </el-dialog>
        <div class="main3">
            <div class="before" v-show="flage===false">
                <div class="loading">
                    <img
                        src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1576062520511&di=00fac763d7cf79087aedfed389e8754c&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0152395be39c37a80121ab5d479b6c.gif"
                        alt="">
                </div>
                <div class="time">
                    <p>请稍后，正在为您连接执业药师</p>
                    <p>{{time}}</p>
                    <el-button style="width: 200px;" @click="goBack" class="search">返回</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import $ from 'jquery'
    export default {
        name: "physicianList",
        data() {
            return {
                num: {
                    free: 0,
                    offine: 0,
                    working: 0,
                },
                lists: [],
                loading: false,
                tablePage: {
                    currentPage: 1,
                    pageSize: 8,
                    totalResult: 0
                },
                fit: 'fill',
                url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
                dialogTableVisible: false,
                certificate: [],
                currentPage: 1,
                circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
                callPhysician: true,
                flage: true,
                time: 120,
                showUpdate: -1
            }
        },
        computed: {
            ...mapGetters([
                'userInfo',
            ])
        },
        sockets: {
            connect: function () {
                console.log('socket 链接成功--------------------11')
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
            // 药师列表
            pharmacistlist: function (data) {
                console.log(data);
                console.log(data.status);
                if (data.status === 200) {
                    this.num = {
                        offine: data.data.offine,
                        free: data.data.free,
                        working: data.data.working
                    }
                    this.lists = data.data.list
                    this.tablePage.totalResult = data.data.info
                }
            },
            callPharmacistBack: function (data) {
                if (data.status === 200) {
                    this.flage = false
                    this.time = 120
                    this.setInterval = setInterval(() => {
                        this.time--
                        if (this.time <= 0) {
                            clearInterval(this.setInterval)
                            this.$socket.emit('cancelCallPharmacist', JSON.stringify({
                                userid: this.userInfo.userid,
                                companyid: this.userInfo.companyid,
                            }))
                            this.time = '链接超时'
                            this.flage = true
                        }
                    }, 1000)
                } else {
                    this.callPhysician = true // 可再次点击
                    this.$message.warning(data.msg)
                    this.$store.commit('app/SET_CALLFLAGE', false)
                }
            },
            pharmacistVideoResults: function (data) {
                clearInterval(this.setInterval)
                if (data.type === '1'){
                    this.$store.commit('user/SET_REMOTELEAVE', false)
                    this.$store.commit('user/SET_PHARMACISTINFO', data)
                    this.$router.push({
                        path: '/home/medicationGuidance/connectPhysician'
                    })
                }else if (data.type === '2') {
                    this.flage = true
                    this.callPhysician = true
                }
            }
        },
        methods: {
            hover (index) {
                this.showUpdate = index
            },
            handlePageChange ({currentPage, pageSize}) {
                this.tablePage.currentPage = currentPage
                this.tablePage.pageSize = pageSize
                this.getList()
            },
            getList () {
                this.$socket.emit('getPharmacistList', JSON.stringify({
                    userid: this.userInfo.userid,
                    companyid: this.userInfo.companyid,
                    pageIndex: this.tablePage.currentPage,
                    pageSize: this.tablePage.pageSize,
                    usestatus: 1
                }))
            },
            getPhote (item) {
                console.log(item);
                if (item.certificate.length > 0) {
                    this.dialogTableVisible = true
                    this.certificate = item.certificate
                } else {
                    this.$message.warning('当前药师未上传执业资格证书')
                }
            },
            callOne (item) {
                // 呼叫执业药师
                console.log(item);
                if (item.poststatus !== '0') {
                    if (item.workstatus === '1') {
                        this.$message.warning('请选择工作状态为空闲的药师')
                        return false
                    }
                    this.callPhysician = false //不可再次点击
                    this.$socket.emit('callPharmacist', JSON.stringify({
                        userid: this.userInfo.userid,
                        companyid: this.userInfo.companyid,
                        pharmacistuserid: item.userid,
                        deptid: this.userInfo.deptid,
                        pharmacistid: item.pharmacistid,
                        deptname: this.userInfo.deptname
                    }))
                } else {
                    this.$message.warning('请选择工作状态为空闲的药师')
                    return false
                }
            },
            goBack () {
                clearInterval(this.setInterval)
                this.flage = true
                this.callPhysician = true // 可再次点击
                this.$socket.emit('cancelCallPharmacist', JSON.stringify({
                    userid: this.userInfo.userid,
                    companyid: this.userInfo.companyid,
                }))
            },
            clickButton: function () {
                this.$socket.emit('getPharmacistlist', JSON.stringify({companyid: "ee842b218438418bace33c148727eefa", pageIndex: 1, pageSize: 8}))

            },
            callDoctor(item) {
                this.$message.info(`${item}`)
            },
            getPhoto(item) {
                // certificate
                // this.url=''
                this.url = item.certificate
                console.log(this.url)
                this.dialogTableVisible = true
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`)
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`)
            }
        },
        mounted(){
            this.$nextTick(() => {
                this.getList()
            })
        },
        created() {
            // console.log(this.$socket.emit)
            let path = this.$route.path
            if (path !== '/home/medicationGuidance/physicianList') { return }
            this.$store.commit('app/SET_ROUTER', path)
        }
    }
</script>
<style>
    .el-avatar>img{
        width: 100%!important;
    }
</style>
<style lang="scss" scoped>
    .before {
        width: 30%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        /*align-items: center;*/
        align-items: center;
        height: 400px;
        margin-left: 35%;
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
    .physicianList {
        /*height: 100%;*/
        max-height: 950px;
        width: 100%;
        border: 1px solid #DCDFE6;
        display: flex;
        flex-direction: column;
        padding: 8px;

        .grid-content {
            display: flex;
            height: 60px;
            align-items: center;
            float: right;
            /*justify-content: space-around;*/
        }

        .list-box {
            flex: 1;
            overflow-y: scroll;
            width: 100%;
            overflow-x: hidden;
            padding: 10px 50px;
            box-sizing: border-box;

            .detail {
                padding-top: 50px;
                height: 350px;
                .name {
                    line-height: 30px;
                    display: inline-block;
                    width: 100%;
                    text-align: center;
                    color: #606266;
                    font-size: 18px;
                }

                .zs {
                    cursor: pointer;
                    line-height: 30px;
                    text-align: center;

                    i {
                        color: #67C23A;
                        font-size: 23px;
                    }

                    span {
                        font-size: 18px;
                        padding-left: 10px;
                        color: #606266;
                    }
                }

                .fw {
                    line-height: 30px;
                    text-align: center;

                    span {
                        font-size: 18px;
                        padding-left: 10px;
                        color: #606266;
                    }
                }

                .synopsis {
                    color: #303133;

                    .details {
                        @include ellipsis(4, 1.4);
                        font-size: 16px;
                        overflow: hidden;
                        height: 66px;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 3;
                        -webkit-box-orient: vertical;
                        .title {
                            font-size: 16px;
                        }
                        .showBox{
                            position: absolute;
                            z-index: 999;
                            /*top: 318px;*/
                            background: #f0f8fa;
                            border:solid 1px #36c2aa;
                            max-width: 320px;
                            line-height: 32px;
                            border-radius: 5px;
                            padding-left: 12px;
                            margin-top: -62px;
                            padding-right: 12px;
                        }
                    }
                }
                .img {
                    height: 130px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }
        }
    }
</style>
