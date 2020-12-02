<template>
    <div class="form">
        <el-card class="box-card" style="height: 100%" v-show="active!==3">
            <div class="left">
                <div v-show="active===1">
                    <p style="font-size: 18px">
                        填写个人信息
                    </p>
                    <el-form style="padding-top: 80px;" :model="form" ref="form" status-icon :rules="rules"
                             label-width="120px"
                             class="demo-ruleForm">
                        <el-form-item
                            required
                            label="患者姓名"
                            prop="patientname"
                        >
                            <el-input style="min-width: 200px" v-model.number="form.patientname"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item
                            required
                            label="身份证"
                            prop="idcardno"
                        >
                            <el-input style="min-width: 200px" type="idcardno" v-model="form.idcardno"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item
                            required
                            label="患者联系方式"
                            prop="telphone"
                        >
                            <el-input style="min-width: 200px" type="telphone" v-model.number="form.telphone"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item style="padding-top: 150px;">
                            <el-button class="search" @click="submitForm('form')">下一步</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div v-show="active===2">
                    <p style="font-size: 18px;margin-bottom: 65px;">
                        填写药品信息
                    </p>
                    <el-form :model="form" ref="ruleForm" label-width="150px"
                             class="demo-ruleForm">
                        <!--<el-form-item label="药品名称" prop="goodsname">-->
                            <!--<el-autocomplete-->
                                <!--v-model="form.goodsname"-->
                                <!--class="searchDrug"-->
                                <!--:fetch-suggestions="querySearchAsync"-->
                                <!--placeholder="请输入内容"-->
                                <!--@select="handleSelect"-->
                            <!--&gt;</el-autocomplete>-->
                        <!--</el-form-item>-->
                        <el-form-item label="药品名称" prop="goodsname">
                            <el-input style="min-width: 200px" v-model="form.goodsname" autocomplete="off"
                                      @keyup.enter.native="handleSearch"></el-input>
                            <span class="addClass" @click="drugNameSearch">+</span>
                        </el-form-item>
                        <el-form-item label="规格" prop="goodstype">
                            <el-input style="min-width: 200px" v-model="form.goodstype"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="生产厂家" prop="factoryname">
                            <el-input v-model.number="form.factoryname" style="min-width: 200px"></el-input>
                        </el-form-item>
                        <el-form-item label="数量" prop="goodsqty">
                            <el-radio v-model="form.goodsqty" label="1" border>1</el-radio>
                            <el-radio v-model="form.goodsqty" label="2" border>2</el-radio>
                        </el-form-item>
                        <el-form-item label="生产批号" prop="lotno">
                            <el-input v-model.number="form.lotno" style="min-width: 200px"></el-input>
                        </el-form-item>
                        <div
                            style="display: flex;justify-content: space-between;align-items: center;padding-top: 150px;">
                            <el-button type="primary" style="width: 150px" @click="backOne">返回上一步
                            </el-button>
                            <el-button style="margin-right: 100px;width: 150px" @click="callMed('ruleForm')" :disabled="finishClick" class="search">完成</el-button>
                        </div>

                    </el-form>
                </div>
            </div>
            <div class="border1px"></div>
            <div class="right">
                <div v-show="active===1">
                    <p style="font-size: 18px">
                        身份证上传 ( 正反面 )
                    </p>
                    <div class="right-box" style="padding-top: 80px;">
                        <div class="idcard">
                            <el-button type="danger" size="small" @click="delId('idCardOne')" class="del-z"
                                       icon="el-icon-delete" circle></el-button>
                            <div class="fileDiv1">
                                <el-button size="small" type="primary" icon="el-icon-plus" circle></el-button>
                                <input class="file_input" type="file" ref="fileBtn1" @change="Preview(1)" />
                            </div>
                            <el-button @click="delId('idCardTwo')" type="danger" size="small" class="del-f"
                                       icon="el-icon-delete" circle></el-button>
                            <div class="fileDiv2">
                                <el-button size="small" type="primary" icon="el-icon-plus" circle></el-button>
                                <input class="file_input" type="file" ref="fileBtn2" @change="Preview(2)" />
                            </div>
                            <el-image :src="idCardOne" class="idcard">
                                <div slot="placeholder" class="image-slot">
                                    加载中<span class="dot">...</span>
                                </div>
                                <div slot="error" class="image-slot">
                                    <i class="el-icon-s-custom" style="font-size: 100px"></i>
                                </div>
                            </el-image>
                            <el-image :src="idCardTwo" class="idcard">
                                <div slot="placeholder" class="image-slot">
                                    加载中<span class="dot">...</span>
                                </div>
                                <i class="el-icon-delete-solid del-f"></i>
                                <div slot="error" class="image-slot">
                                    <i class="el-icon-s-custom" style="font-size: 100px"></i>
                                </div>
                            </el-image>

                        </div>
                        <div class="take-p">
                            <div v-if="userInfo.highShotMeterType === '2' || userInfo.highShotMeterType === '3'|| userInfo.highShotMeterType === '4'" style="text-align: center">
                                <img id="bigPriDev" :src="showPic" alt="">
                                <el-button id="photographPriForm" type="warning" style="margin:15px 0;">拍照</el-button>
                            </div>
                            <div v-if="userInfo.highShotMeterType === '1'" style="text-align: center">
                                <div>
                                    设备：<select id="DeviceName" name="D1" onchange="ChangeDevice()" style=" width: 180px;height: 42px;line-height: 42px;border-radius: 5px;margin: 12px;"></select>
                                </div>
                                <div id="bigPriDevf"></div>
                                <el-button @click="capPhoto('one')" type="warning" style="margin:15px 0;">拍照</el-button>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-show="active===2">
                    <p style="font-size: 18px;margin-bottom: 65px;">
                        处方信息
                    </p>
                    <div class="right-box">
                        <div class="medic">
                            <div style="margin-bottom: 20px;font-size: 16px !important;">
                                <span style="margin-right: 10px;"> 处方类型</span>
                                <el-radio-group v-model="form.prescriptiontype">
                                    <el-radio v-for="item in comefrom"
                                              :key="item.value"
                                              :label="item.value"
                                              style="font-size: 16px !important;">
                                        {{item.label}}
                                    </el-radio>
                                </el-radio-group>
                            </div>
                            <el-button @click="delId('prescriptionimage')" type="danger" size="small" class="del-m"
                                       icon="el-icon-delete" circle></el-button>
                            <div class="fileDiv3">
                                <el-button size="small" type="primary" icon="el-icon-plus" circle></el-button>
                                <input class="file_input" type="file" ref="fileBtn3" @change="Preview(3)" />
                            </div>
                            <el-image :src="form.prescriptionimage[0]" class="idcard">
                                <div slot="placeholder" class="image-slot">
                                    加载中<span class="dot">...</span>
                                </div>
                                <div slot="error" class="image-slot">
                                    <i class="el-icon-reading" style="font-size: 100px"></i>
                                </div>
                            </el-image>
                        </div>
                        <div class="take-p">
                            <div v-if="userInfo.highShotMeterType === '2' || userInfo.highShotMeterType === '3' || userInfo.highShotMeterType === '4'" style="text-align: center">
                                <img :src="showPic2" alt="">
                                <el-button id="photographPri2A" type="warning" style="margin: 5px 0;">拍照</el-button>
                            </div>
                            <div v-if="userInfo.highShotMeterType === '1'" style="text-align: center">
                                <div id="bigPriDevf2"></div>
                                <el-button @click="capPhoto('two')" type="warning" style="margin: 5px 0;">拍照</el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-card>
        <el-card class="box-card2" style="height: 100%" v-show="active===3">
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
                    <p style="font-weight: 700;
    font-size: 18px;
    padding: 5px 0;">执业资格证</p>
                    <el-tooltip class="item" effect="dark" content="点击查看详情" placement="bottom-start">
                        <el-image
                            style="height: 50%;"
                            :src="certificate[0]"
                            alt="证书图片"
                            :preview-src-list="certificate">
                        </el-image>
                    </el-tooltip>
                    <div style="height: 50%;">
                        <el-tooltip class="item" effect="dark" content="点击查看详情" placement="bottom-start">
                            <el-image
                                style="height: 100%"
                                :src="imageurl[0]"
                                alt="处方图片"
                                :preview-src-list="imageurl">
                            </el-image>
                        </el-tooltip>

                    </div>
                </div>
                <div class="right-Box" id="remote_stream" style="position: relative">
                    <div class="local" id="local_stream"
                         style="position: absolute; z-index: 9999;width: 200px;height: 200px;background-color: #f0f8fa;right: 0;bottom: 0"></div>
                </div>
                <div style="position: absolute;bottom: 105px;left: 41%">
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
        </el-card>
        <!---->
        <el-dialog title="药品库明细" :visible.sync="drugVisible" width="764px" height="704px">
            <div style="margin-top: 10px; margin-bottom: 10px">
                <el-input
                    v-model="filterName"
                    style="width: 552px"
                    placeholder="请输入药品名称或操作码查询"></el-input>
                <el-button @click="searchTopBtn" style="height: 40px;width: 68px;border-radius: 0px;margin-left: 16px;background: #36c2aa;color: #fff; font-size: 16px">查询</el-button>
            </div>
            <div class="searchTop">
                <span v-for="(item, index) in searchToplist" :key="index" @click="searchTopEvent(item)">
                    {{item.goodsname}}
                </span>
            </div>
            <div v-loading="loading">
                <vxe-table
                    ref="formDrug"
                    id="getTable"
                    border
                    :data.sync="drugList"
                    :header-cell-style="headClass"
                    highlight-current-row
                    :keyboard-config="{isArrow: true, isEnter: true}"
                    @cell-dblclick="closeDrug">
                    <vxe-table-column type="index" width="50"></vxe-table-column>
                    <vxe-table-column field="popularizename" title="主推"></vxe-table-column>
                    <vxe-table-column field="goodsname" title="药品名称"></vxe-table-column>
                    <vxe-table-column field="goodstype" title="药品规格"></vxe-table-column>
                    <vxe-table-column field="goodsunit" title="药品单位"></vxe-table-column>
                    <vxe-table-column field="prodarea" title="产地"></vxe-table-column>
                    <vxe-table-column field="price" title="价格"></vxe-table-column>
                    <vxe-table-column field="inventory" title="库存"></vxe-table-column>
                </vxe-table>
                <div class="pagination">
                    <vxe-pager
                        perfect
                        v-loading="pageDrugLoading"
                        :current-page="pageDrug.currentPage"
                        :page-size="pageDrug.pageSize"
                        :total="pageDrug.totalResult"
                        :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
                        @page-change="handlePageChangeDrug"
                    ></vxe-pager>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import QWebChannel              from '../../common/qwebchannel'
import {mapGetters, mapActions} from 'vuex'
// import TRTC                     from 'trtc-js-sdk'
import RtcClient                from '../../common/RtcClient'
import $ from 'jquery'
export default {
    name: "forms",
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
            rtc: null,
            time: 120,
            flage: true,
            state: '',
            timeout: null,
            comefrom: [ {label: '西药', value: 1}, {label: '中药', value: 2} ],
            type: 1,
            prescriptionimage: null,
            showPic2: null,
            showPic: null,
            baseUrl: null,
            idCardOne: null,
            idCardTwo: null,
            certificate: [],
            imageurl: [],
            active: 1,
            prescriptionid: null,
            ruleForm: {
                pass: '',
                checkPass: '',
                age: '',
                radio1: '1',
                prod: ''
            },
            form: {
                patientname: '',
                idcardno: '',
                telphone: "",
                idcardimage: [],
                goodsname: '',
                factoryname: '',
                goodsqty: '1',
                goodstype: '',
                lotno: '',
                pkid: '',
                prescriptiontype: 1,
                prescriptionimage: []
            },
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
            placement: 'left-start',
            setInterval: null,
            // restaurants: [],
            chooseValue: '',
            options: [],
            isclick: false,
            finishClick: false,
            curRoomid: '',
            // 点易拍
            imgTimer: null,
            drugVisible: false,
            drugList: [],
            pageDrug:{},
            filterName:'',
            pageDrugLoading:false,
            loading: false,
            searchToplist: [],
        }
    },
    computed: {
        ...mapGetters([
            'appInfo',
            'userInfo',
            'patientInfo',
            'token',
            'videoKey',
            'camerasArr',
            'remoteLeave'
            // ...
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
        // 有药师接单
        videoResults: function (data) {
            clearInterval(this.setInterval)
            console.log(data, "-------------ideoResults:远程审方-------------")
            if (data.type === 1) {
                this.flage = false
                this.curRoomid = data.roomid
                this.getKey(data.mduserid, data.roomid)
                this.$store.commit('app/SET_CALLFLAGE', true)
                this.certificate = data.pharmacistinfo.certificate
                this.imageurl = data.prescriptioninfo.imageurl
                CloseVideo()
            }
        },
        approveCompletion: function (data) {
            if (this.curRoomid == data.roomid) {
                this.rtc.leave()
                this.$store.commit('app/SET_CALLFLAGE', false)
                this.$router.replace({
                    path: '/home/pharmacyAudit',
                    query: {
                        reason: data.reason,
                        approvalstatus: data.approvalstatus,
                    }
                })
            }
        },
        cancelCallback: function (data) {
            if (data.status === 200) {
                this.photoInit()
                this.$socket.emit('cancelCall ')
                this.$store.commit('app/SET_CALLFLAGE', false)
                this.active = 2
                clearInterval(this.setInterval)
                this.flage = true
                this.isclick = false
            }else if (data.status === 400) {
                this.$message.warning(data.msg)
                this.isclick = false
            }
        }
    },
    methods: {
        ...mapActions(
            {
                buyspecialdrug: 'drugAdministration/buyspecialdrug',
                goodList: 'drugAdministration/findGood',
            }),
        // 药品名称点击加好 - 弹出药品库明细
        drugNameSearch () {
            this.drugVisible = true
            this.filterName = this.form.goodsname
            this.searchTopBtn()
        },
        // 输入药品名称回车 - 弹出药品库明细
        handleSearch () {
            this.drugVisible = true
            this.filterName = this.form.goodsname
            this.searchTopBtn()
        },
        // 药品库明细查询按钮
        searchTopBtn () {
            this.$store.dispatch("drugAdministration/findGood", {
                companyid: this.userInfo.companyid,
                pageIndex: this.pageDrug.currentPage,
                pageSize: this.pageDrug.pageSize,
                deptid: this.userInfo.deptid,
                key: this.filterName,
                usestatus: 1,
                specialdrug: 1
            }).then(res => {
                console.log(res);
                this.drugList = res.list;
                this.pageDrug.totalResult = res.info;
            }).catch(err => {
                console.log(err);
            });
            this.$store.dispatch("drugAdministration/listByCompanyId", {
                companyId: this.userInfo.companyid,
                deptid: this.userInfo.deptid,
                usestatus: 1,
                specialdrug: 1
            }).then(res => {
                console.log(res);
                this.searchToplist = res;
            }).catch(err => {
                console.log(err);
            });
        },
        // 点击常用药品回填数据
        searchTopEvent (item, index) {
            this.drugVisible = false
            this.form.goodsname = item.goodsname
            this.form.goodstype = item.goodstype
            this.form.pkid = item.pkid
            this.form.erpgoodsid = item.erpgoodsid
        },
        // 双击药品库明细表回填数据
        closeDrug({ row }) {
            console.log(row);
            this.form.goodsname = row.goodsname
            this.form.goodstype = row.goodstype
            this.form.pkid = row.pkid
            this.form.erpgoodsid = row.erpgoodsid
            this.drugVisible = false
        },
        Preview (imgindex){
            var that = this;
            let inputFile=null
            if (imgindex==1) {
                inputFile = this.$refs.fileBtn1.files[0];
            }else if (imgindex==2){
                inputFile = this.$refs.fileBtn2.files[0];
            }else if (imgindex==3){
                inputFile = this.$refs.fileBtn3.files[0];
            }

            if (inputFile) {
                if (inputFile.type !== 'image/jpeg' && inputFile.type !== 'image/png' && inputFile.type !== 'image/gif') {
                    this.$message.warning('不是有效的图片文件！')
                    return;
                }

                const reader = new FileReader();
                reader.readAsDataURL(inputFile);
                reader.onload = data=> {
                    let ress = data.target
                   if (imgindex == 1){
                        that.idCardOne=ress.result
                   } else if (imgindex == 2){
                       that.idCardTwo=ress.result
                   }else if(imgindex==3){
                       that.form.prescriptionimage = []
                       that.form.prescriptionimage.push(ress.result)
                   }

                };
            } else {
                return;
            }
        },
        callMed() {
            if (this.form.prescriptionimage.length === 0) {
                this.$message.warning('请上传处方照片')
                return false
            }
            if (!this.form.goodsname) {
                this.$message.warning('请录入货品')
                return false
            }
            this.finishClick = true
            this.form.companyid = this.userInfo.companyid
            this.form.deptid = this.userInfo.deptid
            this.form.userid = this.userInfo.userid
            this.form.companyname = this.userInfo.companyname
            this.form.deptname = this.userInfo.deptname
            this.form.inputmanname = this.userInfo.username
            this.buyspecialdrug(this.form).then(res => {
                this.prescriptionid = res.prescriptionid
                this.$socket.emit('getPharmacist', JSON.stringify({
                    userid: this.userInfo.userid, companyid: this.userInfo.companyid, prescriptionid: res.prescriptionid
                }))
                this.flage = true
                this.time = 120
                this.active = 3
                this.setInterval = setInterval(() => {
                    this.time--
                    if (this.time <= 0) {
                        clearInterval(this.setInterval)
                        this.$socket.emit('cancelCall', JSON.stringify({
                            userid: this.userInfo.userid, companyid: this.userInfo.companyid
                        }))
                        this.$store.commit('app/SET_CALLFLAGE', false)
                        this.time = '链接超时'
                        this.flage = true
                        this.finishClick = false
                    }
                }, 1000)
            }).catch(err => {
                console.log(err)
                this.finishClick = false
                this.$store.commit('app/SET_CALLFLAGE', false)
            })
        },
        goBack() {
            this.isclick = true
            this.finishClick = false
            this.$socket.emit('cancelCall', JSON.stringify({
                userid: this.userInfo.userid, companyid: this.userInfo.companyid
            }))
        },
        submitForm(formName) {
            this.$refs[ formName ].validate((valid) => {
                if (valid) {
                    if (formName === 'form') {
                        if (this.idCardTwo !== null && this.idCardOne !== null) {
                            this.form.idcardimage = []
                            this.form.idcardimage.push(this.idCardOne, this.idCardTwo)
                            console.log(this.form)
                            if (this.userInfo.highShotMeterType === '1') {
                                document.getElementById("bigPriDevf").innerHTML = ''
                                CloseVideo()
                                this.active = 2
                                this.dotPhoto()
                            } else if(this.userInfo.highShotMeterType === '2' || this.userInfo.highShotMeterType === '3' || this.userInfo.highShotMeterType === '4') {
                                this.active = 2
                            }
                        } else {
                            this.$message.info('请上传身份证信息')
                        }
                    }
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        resetForm(formName) {
            this.$refs[ formName ].resetFields()
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
                    // window.dialog.html_loaded("one")
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
                    document.getElementById("photographPriForm").onclick = function () {
                        dialog.photoBtnClicked("primaryDev_")
                        dialog.get_actionType("savePhotoPriDev")
                    }
                    document.getElementById("photographPri2A").onclick = function () {
                        dialog.photoBtnClicked("primaryDev_")
                        dialog.get_actionType("savePhotoPriDev")
                    }
                    //服务器返回消息
                    dialog.sendPrintInfo.connect(function (message) {
                        if (message.indexOf("priDevName") != -1) {
                            let videoType = message.slice(11, message.length)
                            sessionStorage.setItem('videoType', videoType)
                        }
                    })
                    //摄像头图片展示
                    dialog.send_priImgData.connect(function (message) {
                        let src = "data:image/jpg;base64," + message
                        if (that.active === 1) {
                            that.showPic = src
                        } else {
                            that.showPic2 = src
                        }

                    })

                    //接收拍照base64
                    dialog.send_priPhotoData.connect(function (message) {
                        let url = "data:image/jpg;base64," + message
                        if (that.active === 1) {
                            if (that.idCardOne === null) {
                                that.idCardOne = url
                            } else {
                                that.idCardTwo = url
                            }
                        } else {
                            that.form.prescriptionimage = []
                            that.form.prescriptionimage.push(url)
                        }
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
        delId(type) {
            if (type === 'prescriptionimage') {
                this.form.prescriptionimage = []
                return
            }
            this[ type ] = null
        },
        async querySearchAsync(queryString, cb) {
            const d = await this.goodList(
                {
                    companyid: this.userInfo.companyid,
                    usestatus: 1,
                    pageIndex: '',
                    pageSize: '',
                    key: this.form.goodsname,
                    specialdrug: 1,
                }
            )
            if (d.length === 0) {
                this.form.goodstype = ''
                this.form.goodsname = ''
                this.form.pkid = ''
            }
            var c = d.list.map(( item => {
                return {
                    value: item.goodsname,
                    goodstype: item.goodstype,
                    pkid: item.pkid,
                }
            } ))

            clearTimeout(this.timeout)
            this.timeout = setTimeout(() => {
                if (c.length === 0) {
                    this.$message.info("未查到该药品")
                }
                cb(c)
            }, 1500)
        },
        handleSelect(item) {
            this.form.goodstype = item.goodstype
            this.form.pkid = item.pkid
        },
        handlePageChangeDrug({ currentPage, pageSize }) {
            this.pageDrug.currentPage = currentPage;
            this.pageDrug.pageSize = pageSize;
            this.findDrug(this.filterName);
        },
        headClass({row, column, rowIndex, columnIndex}) {
            return 'background:#36c2aa;color: #fff'
        },
        // getGoodList() {
        //     this.goodList(
        //         {
        //             companyid: '',
        //             usestatus: 1,
        //             pageIndex: '',
        //             pageSize: '',
        //             key: this.form.goodsname,
        //             specialdrug: 1,
        //         }
        //     ).then(res => {
        //         this.restaurants = res
        //     }).catch(err => {
        //
        //     })
        // },
        getKey(mduserid, rooID) {
            this.$store.dispatch('app/getKey', {userid: this.userInfo.userid, companyid: this.userInfo.companyid})
                .then(res => {
                    let parms = res
                    parms.rooID = rooID
                    this.$nextTick(() => {
                        if (this.userInfo.highShotMeterType === '2' || this.userInfo.highShotMeterType === '3'|| this.userInfo.highShotMeterType === '4'){
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
        leaveRoom () {
            this.$store.commit('app/SET_CALLFLAGE',false)
            this.rtc.leave()
            this.$router.replace(
                {
                    path: '/home/pharmacyAudit',
                }
            )
        },
        backOne () {
            if (this.userInfo.highShotMeterType === '1') {
                document.getElementById("bigPriDevf2").innerHTML = '';
                this.active = 1;
                CloseVideo();
                this.dotPhoto();
            } else {
                this.active = 1
            }
        },
        // 点易拍
        dotPhoto () {
            const that = this
            function loadActiveX() {
                //if (navigator.userAgent.indexOf('MSIE') >= 0) {
                if (!!window.ActiveXObject || "ActiveXObject" in window){
                    isIE = true;
                    //IE浏览器加载控件
                    if (that.active === 1) {
                        document.getElementById("bigPriDevf").innerHTML = "<OBJECT id=\"axCam_Ocx\"  classid=\"clsid:D5BD5B4A-4FC0-4869-880B-27EE9869D706\" width=\"400px\" height=\"400px\" ></OBJECT>";
                    } else {
                        document.getElementById("bigPriDevf2").innerHTML = "<OBJECT id=\"axCam_Ocx\"  classid=\"clsid:D5BD5B4A-4FC0-4869-880B-27EE9869D706\" width=\"400px\" height=\"400px\" ></OBJECT>";
                    }
                    //document.getElementById("ActiveXDivTwo").innerHTML = "<OBJECT id=\"axCam_Ocx2\"  classid=\"clsid:341014BA-CD4A-4918-A11F-8A33B152915A\" width=\"500px\" height=\"400px\" ></OBJECT>";
                    OcxInit();
                }
                else {
                    isIE = false;
                    if (!window.WebSocket) {
                        alert("WebSocket not supported by this browser!");
                    }
                    //其他浏览器加载控件
                    if (that.active === 1) {
                        document.getElementById("bigPriDevf").innerHTML =" <canvas id=\"cameraCanvas\" width=\"400px\" height=\"320px\" style=\"border:1px solid #d3d3d3;\">";
                    } else {
                        document.getElementById("bigPriDevf2").innerHTML =" <canvas id=\"cameraCanvas\" width=\"400px\" height=\"320px\" style=\"border:1px solid #d3d3d3;\">";
                    }
                    WsInit(500,400,500,400,true);
                }
            }
            loadActiveX()
        },
        capPhoto (type) {
            Capture()
            this.GetImgBase64(type)
        },
        GetImgBase64(){
            let that = this
            if (sessionStorage.getItem("imgBase64")!='' && sessionStorage.getItem("imgBase64")!= null){
                if (that.active === 1) {
                    if (that.idCardOne === null) {
                        that.idCardOne = sessionStorage.getItem("imgBase64")
                    } else {
                        that.idCardTwo = sessionStorage.getItem("imgBase64")
                    }
                } else {
                    that.form.prescriptionimage = []
                    that.form.prescriptionimage.push(sessionStorage.getItem("imgBase64"))
                }
                sessionStorage.setItem("imgBase64",'')
                clearTimeout(this.imgTimer)
            }else {
                this.imgTimer=setTimeout(() => {this.GetImgBase64()},200)
            }
        },
    },
    mounted() {
        // this.getGoodList()
        if (this.active !== 3) {
            this.$store.commit('app/SET_CALLFLAGE', false)
        }
        this.$nextTick(function () {
            if (this.userInfo.highShotMeterType === '1') {
                this.dotPhoto()
            } else if(this.userInfo.highShotMeterType === '2' || this.userInfo.highShotMeterType === '3'|| this.userInfo.highShotMeterType === '4') {
                // 良田S300L/S818YJ
                this.photoInit()
            }
        })
    },
    created() {
        let path = this.$route.path
        this.$store.commit('app/SET_ROUTER', path)
        if (this.active !== 3) {
            this.$store.commit('app/SET_CALLFLAGE', false)
        }
        this.listenerHandle()
    },
    beforeDestroy() {
        window.location.reload()
        if (this.userInfo.highShotMeterType === '2' || this.userInfo.highShotMeterType === '3'|| this.userInfo.highShotMeterType === '4'){
            window.dialog.get_actionType("closeSignal")
        }
    }
}
</script>

<style lang="scss" scoped>
    .form {
        width: 100%;
        height: 100%;
        .searchTop span{
            display: inline-block;
            padding: 12px;
            color: #666;
            margin-right: 16px;
            background: #F5F5F5;
            font-size: 16px;
            margin-bottom: 12px;
        }
        .searchTop span:hover{
            background: #E6E6E6!important;
        }

        .addClass{
            position: absolute;
            right: 0px;
            display: inline-block;
            width: 40px;
            height: 40px;
            font-size: 20px;
            text-align: center;
            line-height: 40px;
            background: #C0C4CC;
            color: #fff;
            cursor:pointer
        }
        .box-card2 {
            height: 100%;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: row;
            padding: 10px 0;

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
                    /*height: 100%;*/
                    height: 80%;
                    box-sizing: border-box;
                    background-color: #f0f8fa !important;
                    background: url("../../assets/img/videoIcon.png") no-repeat;
                    background-position:center;
                }
            }
        }

        .searchDrug {
            width: 100%;

            & /deep/ .el-input {
                min-width: 200px;
            }
        }

        .search {
            color: #FFF;
            background-color: $color-btn;
            border-color: $color-btn;
        }

        & /deep/ .el-card__body {
            height: 100%;
            display: flex;
            flex-direction: row;

            .left {
                height: 100%;
                width: 50%;
                padding: 10px 20px;
            }

            .border1px {
                width: 1px;
                border: 1px dashed #909090;
            }

            .right {

                padding: 10px 20px;
                height: 100%;
                width: 56%;

                .right-box {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;

                    .medic {
                        width: 400px;

                        position: relative;

                        .del-m {
                            position: absolute;
                            top: 43px;
                            z-index: 9;
                            font-size: 12px;
                            left: 0;
                        }

                        .fileDiv3 {
                            display: inline-block;
                            position: absolute;
                            top: 43px;
                            right: 0px;
                            z-index: 100;
                        }
                        .file_input {
                            width: 34px;/*因为file-input在部分浏览器中会自带一个输入框，需要双击才可以点击上传,放大后将其定位到div外面就好啦*/
                            height: 34px;
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
                    }

                    .idcard {
                        width: 300px;
                        height: 200px;

                        position: relative;

                        .fileDiv1 {
                            display: inline-block;
                            position: absolute;
                            top: 20px;
                            right: 0px;
                            z-index: 100;
                        }
                        .fileDiv2 {
                            display: inline-block;
                            position: absolute;
                            top: 233px;
                            right: 0px;
                            z-index: 100;
                        }
                        .file_input {
                            width: 34px;/*因为file-input在部分浏览器中会自带一个输入框，需要双击才可以点击上传,放大后将其定位到div外面就好啦*/
                            height: 34px;
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
                        .del-z {
                            position: absolute;
                            top: 20px;
                            z-index: 9999;
                            font-size: 12px;
                            /*right: 11px;*/
                            left: 0;
                        }

                        .del-f {
                            position: absolute;
                            top: 233px;
                            z-index: 9999;
                            font-size: 12px;
                            left: 0;
                        }

                        .image-slot {
                            width: 300px;
                            height: 200px;
                            color: #C0C4CC;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            vertical-align: middle;
                            background: #F5F7FA;
                        }
                    }

                    .take-p {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        margin-top: 20px;
                        margin-left: 30px;
                        min-width: 350px;
                        width: 800px;
                        height: 450px;
                        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
                    }
                }
            }
        }
    }


</style>
