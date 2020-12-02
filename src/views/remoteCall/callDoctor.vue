<template>
  <div class="doctorList">
    <div v-show="flage">
      <el-row>
        <el-col :span="24">
          <div class="grid-content">
            <div class="left">
              <el-button @click="getPatientInfo">当前患者</el-button>
              {{formcur.name}}
            </div>
            <div class="right">
              <div
                style="padding-right: 10px;line-height: 28px;"
              >在线医生 : {{num.onlineNum}} 位 , 离线医生 : {{num.offlineNum}} 位</div>
              <vxe-pager
                perfect
                :loading="loading"
                :current-page="tablePage.currentPage"
                :page-size="tablePage.pageSize"
                :total="tablePage.totalResult"
                :page-sizes="[8]"
                :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
                @page-change="handlePageChange"
              ></vxe-pager>
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="list-box" style="position: relative">
        <el-row :gutter="20">
          <el-col
            :span="6"
            style=" margin-bottom: 10px;"
            v-for="(item,index) in lists"
            :key="index"
          >
            <el-card class="box-card">
              <div
                class="detail"
                @click="callDoctor(item)"
                v-if="callDoctorMore"
                style="cursor: pointer"
              >
                <div class="img">
                  <el-avatar
                    class="headimg"
                    style="width: 100px;height: 100px;"
                    :src="item.headimage"
                  ></el-avatar>
                </div>
                  <div class="fw">
                      <span class="name">
                        {{item.doctorName}} <span style="color: limegreen" v-if="item.postStatus == 1">在线</span>
                        <span style="color: red" v-if="item.postStatus==0">离线</span>
                      </span>
                  </div>
                <div class="fw">
                  <span>
                    科室:
                    <span>{{item.department}}</span>
                    职称:
                    <span>{{item.positionalTitles}}</span>
                  </span>
                </div>
                <div class="synopsis">
                  <span class="details">简介：
                    <el-tooltip :content="item.profile" placement="bottom" effect="dark">
                        <span>{{item.profile}}</span>
                    </el-tooltip>
                  </span>
                </div>
                <div class="be-good">
                    <span class="details">擅长：
                        <el-tooltip :content="item.expertin" placement="bottom" effect="dark">
                            <span>{{item.expertin}}</span>
                        </el-tooltip>
                    </span>
                </div>
              </div>
              <div class="detail" v-else>
                <div class="img">
                  <el-avatar
                    class="headimg"
                    style="width: 100px;height: 100px;"
                    :src="item.headimage"
                  ></el-avatar>
                </div>
                  <div class="fw">
                      <span class="name">
                        {{item.doctorName}} <span style="color: limegreen" v-if="item.postStatus == 1">在线</span>
                        <span style="color: red" v-if="item.postStatus==0">离线</span>
                      </span>
                  </div>
                  <div class="fw">
                  <span>
                    科室:
                    <span>{{item.department}}</span>
                    职称:
                    <span>{{item.positionalTitles}}</span>
                  </span>
                  </div>
                  <div class="synopsis">
                  <span class="details">简介：
                    <el-tooltip :content="item.profile" placement="bottom" effect="dark">
                        <span>{{item.profile}}</span>
                    </el-tooltip>
                  </span>
                  </div>
                  <div class="be-good">
                    <span class="details">擅长：
                        <el-tooltip :content="item.expertin" placement="bottom" effect="dark">
                            <span>{{item.expertin}}</span>
                        </el-tooltip>
                    </span>
                  </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <el-dialog
        title="远程复诊患者基本信息"
        append-to-body
        width="880px"
        center
        :visible.sync="dialogPatient"
        :close-on-click-modal="false"
        @close="diaClose"
      >
        <div class="dialogPatient">
          <div class="left">
            <div id="qrcode" ref="qrcode"></div>
          </div>
          <div class="right">
            <el-form
              :model="form"
              ref="form"
              :rules="rules"
              label-width="120px"
              class="demo-ruleForm"
            >
              <el-form-item required label="患者姓名" prop="name">
                <el-input type="name" v-model="form.name" autocomplete="off" style="width: 268px"></el-input>
              </el-form-item>
              <el-form-item label="身份证">
                <el-input
                  type="idCard"
                  v-model="form.idCard"
                  autocomplete="off"
                  style="width: 268px"
                ></el-input>
              </el-form-item>
              <el-form-item label="年龄" prop="age">
                <el-input v-model.number="form.age" autocomplete="off" style="width: 188px"></el-input>
                <el-select v-model="form.ageunit" style="width: 78px">
                  <el-option
                    v-for="item in ageArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="性别" prop="sex">
                <el-select v-model="form.sex" placeholder="请选择" style="width: 268px">
                  <el-option
                    v-for="item in sexArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item required label="患者联系方式" prop="phone">
                <el-input
                  type="phone"
                  v-model.number="form.phone"
                  autocomplete="off"
                  style="width: 268px"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button class="search" @click="finishEvent('form')">完成</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-dialog>
    </div>
    <div class="main3" style="width: 100%; background: #fff">
      <div class="before" v-show="flage===false">
        <div class="loading">
          <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1576062520511&di=00fac763d7cf79087aedfed389e8754c&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0152395be39c37a80121ab5d479b6c.gif" />
        </div>
        <div class="time">
          <p>请稍后，正在为您连接远程医师{{isdoctor}}</p>
          <el-button style="width: 200px;" @click="goBack" :disabled="isclick" class="search">返回</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcodejs2"
import {mapGetters} from 'vuex'
import $ from 'jquery'
export default {
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
        var checkName = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('患者姓名不能为空'))
            } else {
                callback()
            }
        }
        return {
            rules: {
                phone: [{validator: checkPhone, trigger: 'blur'}],
                name: [{validator: checkName, trigger: 'blur'}],
                sex: [{required: true, message: '请选择性别', trigger: 'change'}],
                age: [{required: true, message: '请输入年龄', trigger: 'blur'}]
            },
            callDoctorMore: true,
            form: {
                name: '',
                idCard: '',
                phone: '',
                sex: '',
                age: '',
                ageunit: 1
            },
            ageArr: [{label: '岁', value: 1}, {label: '月', value: 2}, {label: '天', value: 3}],
            formcur: {
                name: '',
                idCard: '',
                phone: '',
                sex: '',
                age: ''
            },
            flage: true,
            time: 120,
            dialogPatient: false,
            page: {
                currentPage: 1,
                pageSize: 10,
                totalResult: 300
            },
            currentPage: 1,
            lists: [],
            num: {
                offine: 0,
                free: 0,
                working: 0
            },
            doctorItem: {},
            loading: false,
            tablePage: {
                currentPage: 1,
                pageSize: 8,
                totalResult: 0
            },
            sexArr: [{label: '男', value: 1}, {label: '女', value: 2}],
            isdoctor: '',
            isclick: false, //默认可点
            thisDoctorinfo: {},
            backInfo:{}
        }
    },
    computed: {
        ...mapGetters([
            'userInfo',
        ])
    },
    sockets: {
        connect: function () {
            this.$socket.emit('webSocketLogin', {
                companyId: this.userInfo.companyid,
                linkType: 1,
                webSocketId: this.userInfo.userpkid
            })
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
        webSocketLoginback: function (data) {
            console.log(data);
        },
        // 扫码回填信息
        setPatient: function (data) {
            this.form.name = data.patientname
            this.form.idCard = data.idcardno
            this.form.phone = data.telphone
        },
        // 医生接诊
        acceptTreat: function (data) {
            this.thisDoctorinfo = data
            this.$store.commit('user/SET_INTERDOCTORINFO', data)
            this.$router.push({
                path: '/home/remoteCall/doctorVideo'
            })
        },
        // 医生退诊
        doctorFallback: function (data) {
            this.flage = true
            this.callDoctorMore = true
        },
        doctorFinishTreat: function (data) {
            this.flage = true
            this.callDoctorMore = true
        }
    },
    mounted () {
        this.getList()
        this.getDoctorNum()
        // this.$nextTick(() => {
        //     this.getDocList()
        // })
    },
    methods: {
        getNum () {
            this.$store.dispatch('remoteAuditing/batchGetDictList', {
                companyId: this.userInfo.companyid,
                loginId: this.loginid,
                data: ['POSITIONALTITLES']
            }).then(res => {
                if (res.status === 200) {
                    res.data.POSITIONALTITLES.forEach(i => {
                        this.lists.forEach(e => {
                            if (e.positionalTitles == i.dictValue) {
                                e.positionalTitles = i.dictDtlName
                            }
                        })
                    })
                }
            }).catch(err => {
                console.log(err);
            })
        },
        getList(){
            this.$store.dispatch('remoteAuditing/deptList',{
                companyId: this.userInfo.companyid,
                data: {
                    deptId: this.$route.query.deptId,
                    hospitalId: this.$route.query.hospitalId,
                    page: {
                        pageIndex: this.tablePage.currentPage,
                        pageSize: this.tablePage.pageSize
                    }
                }
            }).then(res => {
                if (res.status === 200) {
                    let needArr = []
                    this.lists = res.data.list
                    this.lists.forEach(i => {
                        needArr = JSON.parse(i.expertin)
                        if (needArr != null) {
                            i.expertin = needArr.toString()
                        }
                    })
                    this.tablePage.totalResult = res.data.total
                    this.getNum()
                }
            })
        },
        getDoctorNum () {
            this.$store.dispatch('remoteAuditing/getDoctorNum',{
                companyId: this.userInfo.companyid,
                data: {
                    deptId: this.$route.query.deptId,
                    hospitalId: this.$route.query.hospitalId,
                }
            }).then(res => {
                this.num = res.data
            }).catch(err => {
                console.log(err);
            })
        },
        handlePageChange ({currentPage, pageSize}) {
            this.tablePage.currentPage = currentPage
            this.tablePage.pageSize = pageSize
            this.getList()
        },
        // getDocList () {
        //     this.$socket.emit('getDoctorList', JSON.stringify({
        //         userid: this.userInfo.userid,
        //         companyid: this.userInfo.companyid,
        //         pageIndex: this.tablePage.currentPage,
        //         pageSize: this.tablePage.pageSize
        //     }))
        // },
        goBack () {
            // clearInterval(this.setInterval)
            // this.isclick = true //返回按钮不可点
            // this.$socket.emit('cancelCallDoctor', JSON.stringify({
            //     userid: this.userInfo.userid,
            //     companyid: this.userInfo.companyid,
            // }))
            this.$store.dispatch('remoteAuditing/secVisit', {
                companyId: this.userInfo.companyid,
                data: {
                    doctorId: this.backInfo.doctorId,
                    hospitalId: this.backInfo.hospitalId,
                    recordId: this.backInfo.recordId
                }
            }).then(res => {
                this.callDoctorMore = true
                if (res.status === 200) {
                    this.flage = true
                }
            })
        },
        getPatientInfo() {
            this.dialogPatient = true
            this.qrcode()
        },
        finishEvent (formName) {
            this.$refs[ formName ].validate((valid) => {
                if (valid) {
                    if (this.form.idCard !== '') {
                        const reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/
                        if (reg.test(this.form.idCard)) {
                            this.formcur = this.form
                            this.dialogPatient = false
                        } else {
                            this.form.idCard = ''
                            this.$message.error('请输入正确的身份证号')
                            return false
                        }
                    } else {
                        this.formcur = this.form
                        this.dialogPatient = false
                    }
                } else {
                  return false
                }
            })
        },
        diaClose () {
            this.$refs.qrcode.innerHTML = ''
        },
        qrcode() {
            this.$nextTick(()=> {
                var canvas = this.$refs.qrcode;
                new QRCode(canvas, {
                    text: this.userInfo.url2,
                    width: 300,
                    height: 300,
                    colorDark: "#666",   //二维码颜色
                    colorLight: "#ffffff"   //二维码背景色
                })
            })
        },
        clickButton: function () {
            this.$socket.emit('msg')
            console.log(1)
        },
        callDoctor(item) {
            console.log(item)
            this.doctorItem = item
            if (item.poststatus !== '0') {
                if (item.workstatus === '1') {
                    this.$message.warning('请选择工作状态为空闲的医生')
                    return false
                }
                if (this.formcur.name === '') {
                    this.$message.warning('请选择当前患者')
                    return false
                }
                this.callDoctorMore = false
                this.isdoctor = item.doctorname
                this.$store.dispatch('remoteAuditing/touchOffDoctor', {
                    companyId: this.userInfo.companyid,
                    data: {
                        age: this.formcur.age,
                        companyId: this.userInfo.companyid,
                        deptId: item.deptId,
                        deptName: item.deptname,
                        sex: this.formcur.sex,
                        doctorId: item.doctorId,
                        doctorName: item.doctorName,
                        headimage: item.headimage,
                        hospitalId: this.$route.query.hospitalId,
                        patientName: this.formcur.name,
                        personcardNo: this.formcur.idCard,
                        phone: this.formcur.phone,
                        userId: this.userInfo.userpkid,
                        positionalTitles: item.positionalTitles, // 医生职称
                        type: 2, // 1.图文  2.视频
                    }
                }).then(res => {
                    if (res.status === 200) {
                        this.flage = false
                        this.isdoctor = item.doctorName
                        this.backInfo = {
                            doctorId: item.doctorId,
                            hospitalId: this.$route.query.hospitalId,
                            recordId: res.data
                        }
                    } else {
                        this.callDoctorMore = true
                    }
                }).catch(err => {
                    this.callDoctorMore = true
                    console.log(err);
                })
            } else {
                this.$message.warning('请选择工作状态为空闲的医生')
                return false
            }
        }
    },
    created() {
        let path = this.$route.path
        this.$store.commit('app/SET_ROUTER', path)
    },
    beforeDestroy () {
        window.location.reload()
    }
}
</script>
<style>
.el-avatar > img {
  width: 100% !important;
}
</style>
<style lang="scss" scoped>
.main3 {
  padding: 10px 0;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  .before {
    width: 500px;
    display: flex;
    flex-direction: column;
    justify-content: center;
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
}
.doctorList {
  width: 100%;
  border: 1px solid #dcdfe6;
  display: flex;
  flex-direction: column;
  padding: 8px;
  .grid-content {
    padding: 0px 50px;
    display: flex;
    height: 60px;
    align-items: center;
    justify-content: space-around;

    .left {
      width: 300px;
    }
    .qrcode {
      width: 202px;
    }
    .right {
      flex: 1;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
    }
  }

  .list-box {
    flex: 1;
    overflow-y: scroll;
    width: 100%;
    overflow-x: hidden;
    padding: 10px 50px;
    box-sizing: border-box;

    .detail {
      /*padding-top: 50px;*/
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
          color: #67c23a;
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
        }
      }

      .be-good {
        margin-top: 5px;
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
        }
      }

      .img {
        height: 130px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}

.dialogPatient {
  .search {
    color: #fff;
    background-color: $color-btn;
    border-color: $color-btn;
  }

  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .left {
    min-width: 300px;
    padding: 20px;
  }

  .right {
    min-width: 500px;
    padding: 20px;
    flex: 1;
  }
}
</style>
