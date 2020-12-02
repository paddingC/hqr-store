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
              >在线医生 : {{num.free}} 位 , 忙碌医生 : {{num.working}} 位 , 离线医生 : {{num.offine}} 位</div>
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
                <span class="name">{{item.doctorname}}</span>
                <div class="fw">
                  <span>
                    科室:
                    <span>{{item.department}}</span>
                    职称:
                    <span>{{item.positionaltitles}}</span>
                  </span>
                </div>
                <div class="fw">
                  <span>
                    服务人数:
                    <span>{{item.consultationnum}}</span>
                    <span
                      style="color: limegreen"
                      v-if="item.workstatus==0 && item.poststatus == 1"
                    >空闲</span>
                    <span style="color: gray" v-if="item.poststatus==0">离线</span>
                    <span style="color: red" v-if="item.workstatus==1 && item.poststatus == 1">忙碌</span>
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
                <span class="name">{{item.doctorname}}</span>
                <div class="fw">
                  <span>
                    科室:
                    <span>{{item.department}}</span>
                    职称:
                    <span>{{item.positionaltitles}}</span>
                  </span>
                </div>
                <div class="fw">
                  <span>
                    服务人数:
                    <span>{{item.consultationnum}}</span>
                    <span
                      style="color: limegreen"
                      v-if="item.workstatus==0 && item.poststatus == 1"
                    >空闲</span>
                    <span style="color: gray" v-if="item.poststatus==0">离线</span>
                    <span style="color: red" v-if="item.workstatus==1 && item.poststatus == 1">忙碌</span>
                  </span>
                </div>
                <div class="synopsis">
                  <span class="details" alt="简介" :title="item.profile">
                    <span class="title">简介 :</span>
                    {{item.profile}}
                  </span>
                </div>
                <div class="be-good">
                  <span class="details" alt="擅长" :title="item.expertin">
                    <span class="title">擅长 :</span>
                    {{item.expertin}}
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
    <div class="main3">
      <div class="before" v-show="flage===false">
        <div class="loading">
          <img
            src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1576062520511&di=00fac763d7cf79087aedfed389e8754c&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0152395be39c37a80121ab5d479b6c.gif"
            alt
          />
        </div>
        <div class="time">
          <p>请稍后，正在为您连接远程医师{{isdoctor}}</p>
          <p>{{time}}</p>
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
        }
    },

    computed: {
        ...mapGetters([
            'userInfo',
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
        // 医生列表
        doctorlist: function (data) {
            console.log(data);
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
        callDoctorBack: function (data) {
            if (data.status === 200) {
                this.flage = false
                this.time = 120
                this.setInterval = setInterval(() => {
                    this.time--
                    if (this.time <= 0) {
                        clearInterval(this.setInterval)

                        this.$socket.emit('cancelCallDoctor', JSON.stringify({
                            userid: this.userInfo.userid,
                            companyid: this.userInfo.companyid,
                        }))
                        this.time = '链接超时'
                        this.flage = true
                    }
                }, 1000)
            } else {
                this.callDoctorMore = true // 可再次点击
                this.$message.warning(data.msg)
                this.$store.commit('app/SET_CALLFLAGE', false)
            }
        },
        // 接通医生
        doctorVideoResults: function (data) {
            clearInterval(this.setInterval)
            if (data.type == '1') {
                console.log('医生接听的type值：'+data.type);
                this.$store.commit('user/SET_REMOTELEAVE', false)
                this.$router.push({
                    path: '/home/remoteReferral/connectPhysician'
                })
                this.$store.commit('user/SET_DOCTORINFO', data)
            } else if(data.type == '2'){
                this.callDoctorMore = true // 可再次点击
                this.flage = true
            } else {
                this.$message.warning('未检测到type值：' + data.type)
            }
        },
        cancelCallDoctorback: function (data) {
            if (data.status == 200){
                this.flage = true
                this.callDoctorMore = true // 可再次点击
                this.isclick = false
            } else {
                this.isclick = false
            }
        },
        // 扫码回填信息
        setPatient: function (data) {
            this.form.name = data.patientname
            this.form.idCard = data.idcardno
            this.form.phone = data.telphone
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.getDocList()
        })
    },
    methods: {
        handlePageChange ({currentPage, pageSize}) {
            this.tablePage.currentPage = currentPage
            this.tablePage.pageSize = pageSize
            this.$nextTick(() => {
                this.getDocList()
            })
        },
        getDocList () {
            this.$socket.emit('getDoctorList', JSON.stringify({
                userid: this.userInfo.userid,
                companyid: this.userInfo.companyid,
                pageIndex: this.tablePage.currentPage,
                pageSize: this.tablePage.pageSize
            }))
        },
        goBack () {
            clearInterval(this.setInterval)
            this.isclick = true //返回按钮不可点
            this.$socket.emit('cancelCallDoctor', JSON.stringify({
                userid: this.userInfo.userid,
                companyid: this.userInfo.companyid,
            }))
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
                this.$socket.emit('callDoctor', JSON.stringify({
                    userid: this.userInfo.userid,
                    companyid: this.userInfo.companyid,
                    doctoruserid: item.userid,
                    deptid: this.userInfo.deptid,
                    doctorid: item.doctorid,
                    patient: this.formcur.name,
                    telphone: this.formcur.phone,
                    idcardno: this.formcur.idCard,
                    sex: this.formcur.sex,
                    age: this.formcur.age,
                    ageunit: this.formcur.ageunit,
                    companyname: this.userInfo.companyname,
                    deptname: this.userInfo.deptname,
                    inputmanname: this.userInfo.username
                }))
            } else {
                this.$message.warning('请选择工作状态为空闲的医生')
                return false
            }
        }
    },
    created() {
        let path = this.$route.path
        this.$store.commit('app/SET_ROUTER', path)
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
          .showBox {
            position: absolute;
            z-index: 999;
            /*top: 268px;*/
            background: #f0f8fa;
            border: solid 1px #36c2aa;
            max-width: 320px;
            line-height: 32px;
            border-radius: 5px;
            padding-left: 12px;
            padding-right: 12px;
          }
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
          .showBox {
            position: absolute;
            z-index: 999;
            top: 338px;
            background: #f0f8fa;
            border: solid 1px #36c2aa;
            max-width: 320px;
            line-height: 32px;
            border-radius: 5px;
            padding-left: 12px;
            padding-right: 12px;
          }
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
