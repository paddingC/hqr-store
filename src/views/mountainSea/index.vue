<template>
    <div class="znsf">
        <div class="container" v-loading="loading">
            <el-form
                :model="formInline"
                size="medium "
                class="base-table6-form"
                :inline="true"
                style="width: 100%;text-align: left;display:inline-block;background:#fff"
                ref="hosForm"
                label-width="132px"
                :rules="rules"
            >
                <el-form-item label="患者姓名" prop="name">
                    <el-input
                        style="margin-right:24px"
                        v-model="formInline.name"
                        placeholder="请输入"
                        class="inputWidth"
                    ></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                    <el-radio-group v-model="formInline.gender">
                        <el-radio :label="1">男</el-radio>
                        <el-radio :label="2">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <br />
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="formInline.mobile"
                              style="margin-right:24px" class="inputWidth" placeholder="请输入"></el-input>
                </el-form-item>
                <div style="float: left">
                    <el-form-item label="年龄" prop="age">
                        <el-input
                            onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"
                            v-model="formInline.age"
                            style="margin-right:24px"
                            placeholder="请输入"
                            class="inputWidth"
                        ></el-input>
                    </el-form-item>
                    <br />
                    <el-form-item label="疾病名称" prop="diseaseName">
                        <el-input
                            v-model="formInline.diseaseName"
                            class="inputWidth_textarea"
                            type="textarea"
                            placeholder="请输入"
                        ></el-input>
                    </el-form-item>
                    <br />
                    <el-form-item label="是否服用过该药" prop="isTakenDrug">
                        <el-radio-group v-model="formInline.isTakenDrug">
                            <el-radio label="1">是</el-radio>
                            <el-radio label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <br />
                    <el-form-item label="是否药物过敏" prop="isDrugAllergy">
                        <el-radio-group v-model="formInline.isDrugAllergy">
                            <el-radio label="1">是</el-radio>
                            <el-radio label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <br />
                    <el-form-item label="是否有不良反应" prop="hasAdverseReactions">
                        <el-radio-group v-model="formInline.hasAdverseReactions">
                            <el-radio label="1">是</el-radio>
                            <el-radio label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <br />
                    <el-form-item label="处方类型" prop="prescriptionType">
                        <el-radio-group v-model="formInline.prescriptionType">
                            <el-radio label="01">西药</el-radio>
                            <el-radio label="02">中成药</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <br />
                    <el-form-item label>
                        <el-button class="search" size="small" @click="consultation">发起咨询</el-button>
                    </el-form-item>
                </div>
                <br />
                <el-form-item label="病例图片" prop="theSide">
                    <el-radio-group v-model="formInline.theSide">
                        <el-radio label="1">有</el-radio>
                        <el-radio label="0">遗失或不在身边</el-radio>
                    </el-radio-group>
                </el-form-item>
                <br />
                <div style="display: inline-block">
                    <div class="textphone"><i :class="formInline.theSide==1?'red':''">*</i>照片</div>
                    <el-button size="small" v-if="userInfo.highShotMeterType === '1'" @click="capPhoto" class="phoneBtn">拍照上传</el-button>
                    <el-button size="small" v-else id="photographPriAudio" class="phoneBtn">拍照上传</el-button>
                    <div class="showframeCon" v-if="url.length!=0">
                        <p>照片(可点击放大)</p>
                        <div class="showframe">
                            <el-image
                                style="width: 100%; height: 100%"
                                :src="url[0]"
                                :preview-src-list="url">
                                <div slot="error" class="image-slot">
                                    <i class="el-icon-picture-outline"></i>
                                </div>
                            </el-image>
                        </div>
                    </div>
                    <div class="showframeCon">
                        <p>实时画面</p>
                        <div class="showframe">
                            <img v-if="userInfo.highShotMeterType === '2' || userInfo.highShotMeterType === '3' || userInfo.highShotMeterType === '4'" id="bigPriDev" alt="">
                            <div v-if="userInfo.highShotMeterType === '1'" id="bigPriDev1"></div>
                        </div>
                    </div>
                </div>
            </el-form>

            <div class="main">
                <div class="tools">
                    <el-button size="small" icon="el-icon-plus" class="search" @click="checkAdd">新增</el-button>
                    <el-button size="small" class="delete" @click="remove">批量删除</el-button>
                </div>
                <vxe-table
                    ref="checkGoods"
                    height="550"
                    border
                    :header-cell-style="rowClass"
                    :data.sync="checkedGoods"
                    tooltip-effect="dark"
                    :auto-resize="true"
                    :sync-resize="true"
                    :edit-rules="validRules"
                    :edit-config="{ trigger: 'manual', mode: 'row', autoClear: false,showIcon
:false}"
                >
                    <vxe-table-column field="checkbox" type="checkbox" width="55"></vxe-table-column>
                    <vxe-table-column type="seq" width="55"></vxe-table-column>
                    <vxe-table-column field="drugName" title="货品名称"></vxe-table-column>
                    <vxe-table-column field="specification" title="规格"></vxe-table-column>
                    <vxe-table-column field="usage" title="用法" :edit-render="{name: 'input',immediate: true, defaultValue: ''}">
                        <template slot-scope="scope">
                            <el-input size="mini" v-model="scope.row.usage"></el-input>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column field="dosage" title="用量" :edit-render="{name: 'input',immediate: true, defaultValue: ''}">
                        <template slot-scope="scope">
                            <el-input size="mini" v-model="scope.row.dosage" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"></el-input>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column field="dosageUnit" title="用量单位" :edit-render="{name: 'input',immediate: true, defaultValue: ''}">
                        <template slot-scope="scope">
                            <el-input size="mini" v-model="scope.row.dosageUnit"></el-input>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column field="goodsqty" title="数量" :edit-render="{name: 'input', immediate: true,defaultValue: ''}">
                        <template slot-scope="scope">
                            <el-input size="mini" v-model="scope.row.goodsqty" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"></el-input>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column field="goodsunit" title="基本单位"></vxe-table-column>
                    <vxe-table-column field="factory" title="生产厂家" :edit-render="{name: 'input',immediate: true, defaultValue: ''}">
                        <template slot-scope="scope">
                            <el-input size="mini" v-model="scope.row.factory"></el-input>
                        </template>
                    </vxe-table-column>

                    <vxe-table-column field="medicinefreq" title="用药频率" :edit-render="{name: 'input',immediate: true, defaultValue: ''}">
                        <template slot-scope="scope">
                            <el-input size="mini" v-model="scope.row.medicinefreq"></el-input>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column field="cz" title="操作" fixed="right" width="150">
                        <template slot-scope="scope">
                            <a @click="delEdit(scope.row)" style="cursor: pointer;color: #36C2AA;text-decoration: none">删除</a>
                        </template>
                    </vxe-table-column>
                </vxe-table>
                <!--分页-->
            </div>

            <!-- 弹窗 -->
            <el-dialog :visible.sync="dialogAdd" title="药品库明细" width="1040px" top="2%" @open="handleOpen">
                <el-form :inline="true" class="left" :model="tableform">
                    <el-form-item>
                        <el-input v-model="tableform.key" style="width:552px" placeholder="通用名/商品名/条形码/批准文号"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="search" size="medium" @click="goodsFind">查询</el-button>
                    </el-form-item>
                </el-form>

                <vxe-table
                    ref="formList"
                    height="550"
                    border
                    :header-cell-style="rowClass"
                    :data.sync="tableData"
                    tooltip-effect="dark"
                >
                    <vxe-table-column field="checkbox" type="checkbox" width="55"></vxe-table-column>
                    <vxe-table-column type="seq" width="55"></vxe-table-column>
                    <vxe-table-column field="popularizename" width="55" title="主推"></vxe-table-column>
                    <vxe-table-column field="goodsname" title="货品名称"></vxe-table-column>
                    <vxe-table-column field="goodstype" title="规格"></vxe-table-column>
                    <vxe-table-column field="goodsunit" title="包装单位"></vxe-table-column>
                    <vxe-table-column field="manufacturer" title="生产厂家"></vxe-table-column>
                </vxe-table>

                <!--分页-->
                <div class="block" style="margin: 20px; text-align: right">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page.pageIndex"
                        :page-sizes="[5, 10, 20, 50, 100]"
                        :page-size="page.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="page.totalResult"
                    ></el-pagination>
                </div>
                <span slot="footer" class="dialog-footer">
					<el-button @click="dialogAdd=false">取 消</el-button>
					<el-button class="search" @click="submitCheck">确 定</el-button>
				</span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import { goodsFind, rxClose } from '../../api/znsf'
    import { genPrescriptionBySyh } from '../../api/mountainSea'
    import QWebChannel from "../../common/qwebchannel";
    function validIdCard(str) {
        const reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/i
        return reg.test(str)
    }
    // 验证用户名
    function validPhone(str) {
        const myreg = /^[1][3,4,5,7,8][0-9]{9}$/
        return myreg.test(str)
    }
    const IdCard = (rule, value, callback) => {
        if (!value) {
            callback(new Error('请输入证件号码'))
        } else if (!validIdCard(value)) {
            callback(new Error('证件号码格式不正确'))
        } else {
            callback()
        }
    }
    const valPhone = (rule, value, callback) => {
        if (!value) {
            callback(new Error('请输入手机号'))
        } else if (!validPhone(value)) {
            callback(new Error('请输入正确的手机格式'))
        } else {
            callback()
        }
    }
    export default {
        name: 'index',
        data() {
            return {
                formInline: {},
                dialogAdd: false,
                loading: false,
                options: [
                    {
                        value: 1,
                        label: '2次/天'
                    },
                    {
                        value: 2,
                        label: '2次/周'
                    },
                    {
                        value: 3,
                        label: '睡前服用'
                    },
                    {
                        value: 4,
                        label: '1次/12小时'
                    },
                    {
                        value: 5,
                        label: '1次/小时'
                    },
                    {
                        value: 6,
                        label: '1次/3小时'
                    },
                    {
                        value: 7,
                        label: '1次/6小时'
                    },
                    {
                        value: 8,
                        label: '1次/8小时'
                    },
                    {
                        value: 9,
                        label: '1次/天'
                    },
                    {
                        value: 10,
                        label: '4次/天'
                    },
                    {
                        value: 11,
                        label: '隔天1次'
                    },
                    {
                        value: 12,
                        label: '1次/周'
                    },
                    {
                        value: 13,
                        label: '立即服用'
                    },
                    {
                        value: 14,
                        label: '3次/天'
                    },
                    {
                        value: 15,
                        label: '隔周一次'
                    },
                    {
                        value: 16,
                        label: '必要时'
                    },
                    {
                        value: 17,
                        label: '紧急时'
                    },
                    {
                        value: 18,
                        label: '每两周一次'
                    },
                    {
                        value: 99,
                        label: '其它'
                    }
                ],
                tableData: [],
                checkedGoods: [],
                page: {
                    pageSize: 10,
                    pageIndex: 1,
                    totalResult: 0
                },
                validRules: {
                    usage: [{required: true, message: '请输入药品用法', trigger: 'blur'}],
                    dosageUnit: [{required: true, message: '请输入用量单位', trigger: 'blur'}],
                    dosage: [{required: true, message: '请输入用量', trigger: 'blur'}],
                    factory: [{required: true, message: '请输入生产厂家', trigger: 'blur'}],
                    medicinefreq: [{required: true, message: '请输入用药频率', trigger: 'blur'}],
                    goodsqty: [{required: true, message: '请输入药品数量', trigger: 'blur'}],
                },
                rules: {
                    name: [{required: true,trigger: 'blur',message: '请输入'}],
                    age: [{required: true, trigger: 'blur',message: '请输入'},],
                    gender: [{required: true,trigger: 'change',message: '请选择'}],
                    mobile: [{required: true,trigger: 'blur',validator: valPhone}],
                    diseaseName: [{required: true,trigger: 'change',message: '请输入'}],
                    isTakenDrug: [{required: true,trigger: 'change',message: '请选择'}],
                    isDrugAllergy: [{required: true,trigger: 'change',message: '请选择'}],
                    hasAdverseReactions: [{required: true,trigger: 'change',message: '请选择'}],
                    prescriptionType: [{required: true,trigger: 'change',message: '请选择'}],
                    theSide: [{required: true,trigger: 'change',message: '请选择'}],
                },
                url: [],
                imgTimer: null,
                //       prescriptionId: 323134302167352
                // applyId: 123327581
                // imSessionId: 771601
                // isNew: true
                tableform: {}
            }
        },
        computed: {
            ...mapGetters(['userInfo'])
        },
        created() {},
        mounted() {
            this.$nextTick(function () {
                // 点易拍
                if (this.userInfo.highShotMeterType === '1') {
                    this.dotPhoto()
                } else if(this.userInfo.highShotMeterType === '2' || this.userInfo.highShotMeterType === '3' || this.userInfo.highShotMeterType === '4') {
                    // 良田S300L，良田S818YJ,良田S200L
                    this.photoInit()
                }
            })
        },
        methods: {
            delEdit (row) {
                this.checkedGoods.forEach((item2, index2) => {
                    if (JSON.stringify(row) === JSON.stringify(item2)) {
                        this.checkedGoods.splice(index2, 1);
                    }
                });
            },
            capPhoto () {
                Capture()
                this.GetImgBase64()
            },
            GetImgBase64(){
                let that=this
                if (sessionStorage.getItem("imgBase64")!='' && sessionStorage.getItem("imgBase64") != null){
                    this.url = []
                    this.url.push(sessionStorage.getItem("imgBase64"))
                    clearTimeout(this.imgTimer)
                    if (this.url.length !== 0&&sessionStorage.getItem("imgBase64")!=null) {
                    }
                }else {
                    this.imgTimer=setTimeout(function (){
                        that.GetImgBase64()
                    },300)
                }
            },
            // 点易拍
            dotPhoto () {
                function loadActiveX() {
                    if (!!window.ActiveXObject || "ActiveXObject" in window){
                        isIE = true;
                        //IE浏览器加载控件
                        document.getElementById("bigPriDev1").innerHTML = "<OBJECT id=\"axCam_Ocx\"  classid=\"clsid:D5BD5B4A-4FC0-4869-880B-27EE9869D706\" width=\"156px\" height=\"176px\" ></OBJECT>";
                        OcxInit();
                    } else {
                        isIE = false;
                        if (!window.WebSocket) {
                            alert("WebSocket not supported by thicameraCanvass browser!");
                        }
                        //其他浏览器加载控件
                        document.getElementById("bigPriDev1").innerHTML =" <canvas id=\"cameraCanvas\" width=\"156px\" height=\"176px\">";
                        WsInit(500,400,500,400,true);
                    }
                }
                loadActiveX()
                this.selectedIndex = 0
            },
            output(message) {
            },
            // 初始化高拍仪
            photoInit() {
                this.baseUrl = "ws://127.0.0.1:12345"
                this.output("Connecting at " + this.baseUrl + ".")
                this.openSocket()
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
                        //网页关闭函数
                        window.onbeforeunload = function () {
                            console.log('网页关闭函数')
                            window.dialog.get_actionType("closeSignal")
                        }
                        window.onunload = function () {
                            console.log('网页关闭函数onunload')
                            window.dialog.get_actionType("closeSignal")
                        }
                        //点击拍照按钮
                        document.getElementById("photographPriAudio").onclick = function () {
                            this.clickPhoto = true
                            dialog.photoBtnClicked("primaryDev_")
                            dialog.get_actionType("savePhotoPriDev")
                        }
                        //服务器返回消息
                        that.sCapheight = []
                        dialog.sendPrintInfo.connect(function (message) {
                            // that.output(message,"-----------------------")
                            if (message.indexOf("priDevName") != -1) {
                                let videoType = message.slice(11, message.length)
                                sessionStorage.setItem('videoType', videoType)
                                that.sCapheight.push(videoType)
                                console.log(that.sCapheight);
                                that.sCapheightIdx = Number(that.sCapheight.length) - 1;
                            }
                            // 图片保存后返回路径关键字savePhoto_success:
                            if (message.indexOf("savePhoto_success:") >= 0) {
                                let imgPath = message.substr(18)
                            }
                        })
                        //接收图片流用来展示，多个，较小的base64数据
                        dialog.send_priImgData.connect(function (message) {
                            var element = document.getElementById("bigPriDev")
                            if (element) {
                                element.src = "data:image/jpg;base64," + message
                            }
                        })
                        //接收拍照base64
                        dialog.send_priPhotoData.connect(function (message) {
                            that.url = []
                            that.url.push("data:image/jpg;base64," + message)
                            that.upImgClick = false
                        })
                        that.output("ready to send/receive messages!")
                        //网页加载完成信号
                        dialog.html_loaded("one")
                    })
                }
            },
            remove() {
                let rows = this.$refs.checkGoods.getCheckboxRecords()
                if (rows.length != 0) {
                    this.$confirm('是否删除', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                        .then(() => {
                            rows.forEach((item, index) => {
                                this.checkedGoods.forEach((item2, index2) => {
                                    if (
                                        JSON.stringify(item) ===
                                        JSON.stringify(item2)
                                    ) {
                                        this.checkedGoods.splice(index2, 1)
                                    }
                                })
                            })
                        })
                        .catch(err => {})
                }
            },
            async consultation() {
                console.log(this.checkedGoods)
                if (this.checkedGoods.length == 0) {
                    this.$message('请添加至少一项药品！')
                    return
                }
                const errMap = await this.$refs.checkGoods
                    .validate()
                    .catch(errMap => errMap)
                if (errMap) {
                    this.$message('请完善表格中的必填项！')
                    return
                }
                if (this.formInline.theSide === '1') {
                    if (this.url.length === 0) {
                        this.$message('请拍照上传')
                        return false
                    }
                }
                this.$refs.hosForm.validate(valid => {
                    if (valid) {
                        this.loading = true
                        this.checkedGoods.forEach(item => {
                            this.options.forEach(item2 => {
                                if (item.usageFrequencyCode == item2.value) {
                                    item.usageFrequencyName = item2.label
                                }
                            })
                        })
                        let params = {
                            companyid: this.userInfo.companyid,
                            companyname: this.userInfo.companyname,
                            inputmanid: this.userInfo.userid,
                            inputmanname: this.userInfo.username,
                            patient: {
                                name: this.formInline.name,
                                mobile: this.formInline.mobile,
                                gender: this.formInline.gender,
                                age: this.formInline.age,
                            },
                            disease: {
                                diseaseName: this.formInline.diseaseName,
                                hasAdverseReactions: this.formInline.hasAdverseReactions,
                                isDrugAllergy: this.formInline.isDrugAllergy,
                                isTakenDrug: this.formInline.isTakenDrug,
                                medicalPicture: {
                                    theSide: this.formInline.theSide,
                                    picture: this.url[0]
                                }
                            },
                            prescriptionType: this.formInline.prescriptionType,
                            pharmacy: {
                                pharmacyMark: this.userInfo.deptid,
                                pharmacyName: this.userInfo.deptname
                            },
                            drugList: this.checkedGoods
                        }
                        genPrescriptionBySyh(params).then(res => {
                            if (res.status === 200) {
                                window.location.reload()
                                this.$message.success(res.msg)
                            }
                            this.loading = false
                        }).catch(err => {
                            console.log(err);
                            this.loading = false
                        })
                    }
                })
            },
            rxClose(id) {
                rxClose(id)
                    .then(response => {
                        // this.tableData = response.data.list
                        // console.log(response)
                        this.$message.success('关闭成功')
                    })
                    .catch(error => {
                        this.$message.error('关闭失败')
                        console.log(error)
                    })
            },
            rowClass() {
                return 'background: #f3f3f3;color:#555;border-color:#dddfe7;'
            },
            handleSizeChange(pageSize) {
                this.page.pageSize = pageSize
                this.goodsFind()
            },
            handleCurrentChange(pageIndex) {
                this.page.pageIndex = pageIndex
                this.goodsFind()
            },
            checkAdd() {
                this.tableform = {}
                this.dialogAdd = true
            },
            submitCheck() {
                let rows = this.$refs.formList.getCheckboxRecords()
                if (rows.length) {
                    rows.forEach((item, index) => {
                        // console.log(item)
                        this.checkedGoods.push({
                            drugName: item.goodsname,
                            specification: item.goodstype,
                            erpgoodsid: item.erpgoodsid,
                            pkid: item.pkid,
                            goodsqty: item.goodsqty,
                            goodsunit: item.goodsunit,
                            factory: item.manufacturer
                        })
                    })
                    this.checkedGoods = this.deteleObject(this.checkedGoods) // 去重
                    this.dialogAdd = false
                } else {
                    this.$message.warning('请至少选择一条数据')
                }
            },
            handleOpen() {
                this.goodsFind()
            },
            goodsFind() {
                let params = {
                    companyid: this.userInfo.companyid,
                    key: this.tableform.key,
                    pageSize:this.page.pageSize,
                    pageIndex:this.page.pageIndex
                }
                goodsFind(params).then(response => {
                    this.tableData = response.data.list
                    this.page.totalResult = response.data.info
                })
            },
            deteleObject(obj) {
                var uniques = []
                var stringify = {}
                for (var i = 0; i < obj.length; i++) {
                    var keys = Object.keys(obj[i])
                    keys.sort(function(a, b) {
                        return Number(a) - Number(b)
                    })
                    var str = ''
                    for (var j = 0; j < keys.length; j++) {
                        if (keys[j] !== '_XID') {
                            str += JSON.stringify(keys[j])
                            str += JSON.stringify(obj[i][keys[j]])
                        }
                    }
                    if (!stringify.hasOwnProperty(str)) {
                        uniques.push(obj[i])
                        stringify[str] = true
                    }
                }
                return uniques
            },
            backToIndex(){
                this.$router.push({path:'/dashboard'})
            }
        }
    }
</script>

<style scoped lang="scss">
.textphone{
    color: #333333;
    display: inline-block;
    margin-left: 78px;
    margin-right: 12px;
    .red{
        color: #ff0000;
        opacity: 1;
    }
    i{
        margin-right: 6px;
        font-style: normal;
        color: #fff;
        opacity: 0;
    }
}
.phoneBtn{
    color: #36C2AA;
    border-color: #36C2AA;
    background: #E7FFFB;
}
.znsf {
    width: 100%;
    // text-align: center;
    background: rgba(245, 245, 245, 1);
    display: flex;
    justify-content: center;
    & /deep/ .vxe-table.size--medium .vxe-body--column.col--ellipsis,
    .vxe-table.size--medium .vxe-footer--column.col--ellipsis,
    .vxe-table.size--medium .vxe-header--column.col--ellipsis,
    .vxe-table.vxe-editable.size--medium .vxe-body--column {
        height: 54px;
    }
    & /deep/ .el-form-item__label,
    .el-input__inner,
    .el-button {
        font-size: 14px !important;
    }
    .container {
        width: 83.333%;
        overflow: hidden;
    }
    .main {
        background: #fff;
        margin-top: 16px;
    }
    .base-table6-form {
        padding-top: 24px;
        padding-left: 32px;
    }
    .search {
        color: #fff;
        background-color: $color-btn;
        border-color: $color-btn;
        border-radius: 2px;
        margin-left: 70px;
    }

    .inputWidth {
        width: 368px;
    }
    .tools {
        height: 64px;
        line-height: 64px;
        .search {
            margin-left: 32px;
        }
    }
}
.showframeCon{
    float: right;
    margin-left: 12px;
    p{
        height: 32px;
        line-height: 32px;
        z-index: 11;
        color: #666;
    }
    .showframe{
        display: inline-block;
        width: 156px;
        height: 176px;
        background: #F5F5F5;
        border: 1px solid #E6E6E6;
        img{
            width: 100%;
            height: 100%;
            vertical-align: middle;
        }
    }
}

.inputWidth_textarea{
    width: 368px;
}

/deep/ .el-textarea__inner{
    height: 28px;
}
</style>
