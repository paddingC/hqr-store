<template>
    <div class="pharmacyAudit">
        <div class="form-serch">
            <el-form class="left" ref="form" :model="formInline2" label-width="80px">
                <el-form-item label="患者姓名" style="margin-bottom: 0px;" prop="patient">
                    <el-input class="search-w" @keyup.enter.native="onSubmit" v-model="formInline2.patient"
                              placeholder="患者姓名"></el-input>
                </el-form-item>
                <br>
                <el-form-item label="制单时间" style="margin-bottom: 0px;" prop="inputdate，">
                    <el-date-picker
                        @change="dataChange"
                        class="search-w"
                        v-model="formInline2.inputdate"
                        value-format="yyyy-MM-dd"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <el-form class="right" :rules="rules" :inline="true" ref="ruleForm" :model="formInline" label-width="100px">
                <div class="leftBOX">
                    <el-form-item label="调配药师" prop="dispenseloginname">
                        <el-autocomplete
                            class="search-w"
                            v-model="formInline.dispenseloginname"
                            autocomplete="off"
                            filterable allow-create default-first-option
                            :fetch-suggestions="querySearch"
                            @select="handleSelect1">
                        </el-autocomplete>
                    </el-form-item>
                    <el-form-item label="核对/发药" prop="checkloginname">
                        <el-autocomplete
                            class="search-w"
                            v-model="formInline.checkloginname"
                            autocomplete="off"
                            filterable allow-create default-first-option
                            :fetch-suggestions="querySearch"
                            @select="handleSelect2">
                        </el-autocomplete>
                    </el-form-item>
                    <br>
                    <el-form-item label="密码" style="margin-bottom: 0px;" prop="dispenseloginpwd">
                        <el-input type="text" style="display: none"></el-input>
                        <el-input class="search-w" v-model="formInline.dispenseloginpwd" type="text" onfocus="this.type='password'"
                                  placeholder="调配药师 密码" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" style="margin-bottom: 0px;" prop="checkloginpwd">
                        <el-input type="text" style="display: none"></el-input>
                        <el-input class="search-w" v-model="formInline.checkloginpwd" type="text" onfocus="this.type='password'"
                                  placeholder="核对/发药 密码" autocomplete="off"></el-input>
                    </el-form-item>
                </div>
                <div class="rightBOX">
                    <el-form-item class="form-submit" style="margin-bottom: 0px;">
                        <div class="submit-left">
                            <el-button v-if="userInfo.pointApprovalType == 1" class="search" type="success" @click="checkDis">审核</el-button>
                            <el-button v-if="userInfo.pointApprovalType == 0" class="search" style="margin-bottom: 5px;" type="success" :disabled="unclick1" @click="checkDispense('ruleForm',1)">调配发药</el-button>
                            <!--<el-button class="search" type="success" :disabled="unclick2" @click="checkDispense('ruleForm',2)">未通过归档</el-button>-->
                        </div>
                        <div class="submit-right" style="margin-bottom: 0px;text-align: center">
                            <el-button :size="size" @click="printSelectEvent">打印</el-button>
                            <el-button :size="size" @click="downs">下载</el-button>
                        </div>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div class="table">
            <div class="left">
                <div style="height: 100%">
                    <vxe-table
                        height="100%"
                        border
                        resizable
                        :loading="loading"
                        ref="tableData"
                        :header-cell-style="headClass"
                        :edit-config="{trigger: 'click', mode: 'row',showStatus: true, icon: 'fa fa-edit'}"
                        @edit-actived="editActivedEvent"
                        :data="tableData">
                        <vxe-table-column type="checkbox" width="60" fixed="left"></vxe-table-column>
                        <vxe-table-column type="index" title="序号" width="60"></vxe-table-column>
                        <vxe-table-column field="inputdate"  width="100" title="制单时间" formatter="toDateString" sortable></vxe-table-column>
                        <vxe-table-column field="prescriptionno" title="处方单号" sortable width="150"></vxe-table-column>
                        <vxe-table-column field="patient" title="患者姓名" sortable :edit-render="{name: 'input',attrs: {disabled: false}}" min-width="100px"></vxe-table-column>
                        <vxe-table-column field="insiderphone" sortable title="联系方式"  width="100" :edit-render="{name: 'input',attrs: {disabled: false}}" min-width="100px"></vxe-table-column>
                        <vxe-table-column field="approvalstatus" :formatter="approvalstatus" title="审方状态" show-overflow sortable width="100"></vxe-table-column>
                        <vxe-table-column field="pharmacistname"  width="100" sortable title="执业药师"></vxe-table-column>
                        <vxe-table-column field="pointapprovalstatus"  width="120" sortable :formatter="pointapprovalstatusM" title="门店审核状态"></vxe-table-column>
                        <vxe-table-column field="pointapprovalman"  width="120" sortable title="门店审核人"></vxe-table-column>
                        <vxe-table-column field="prescriptiontype" title="处方类型" sortable width="100" show-overflow :formatter="prescriptiontype"></vxe-table-column>
                        <vxe-table-column field="attribute" title="处方属性" sortable width="100" show-overflow :formatter="attribute"></vxe-table-column>
                        <vxe-table-column field="comefrom" title="处方来源" sortable width="100" show-overflow :formatter="comefrom"></vxe-table-column>
                        <vxe-table-column field="dispensestatus" sortable width="100" :formatter="dispensestatus" title="调配状态" show-overflow></vxe-table-column>
                        <vxe-table-column field="doctor" title="开方医生" sortable width="100"></vxe-table-column>
                        <vxe-table-column field="idcard" title="身份证号" sortable width="150"></vxe-table-column>
                        <vxe-table-column field="goodsname" title="货品" sortable width="100"></vxe-table-column>
                        <vxe-table-column field="goodstype" title="规格" sortable width="100"></vxe-table-column>
                        <vxe-table-column field="factoryname" title="生产厂商" sortable  width="100"></vxe-table-column>
                        <vxe-table-column field="lotno" title="生产批号" sortable width="100"></vxe-table-column>
                        <vxe-table-column field="goodsqty" title="数量" sortable width="100"></vxe-table-column>
                        <vxe-table-column title="操作"  width="100" fixed="right">
                            <template v-slot="{ row }">
                                <div @click="lookEvent(row)" style="color: #00ffff;line-height: 30px;cursor: pointer">查看处方</div>
                            </template>
                        </vxe-table-column>
                    </vxe-table>
                </div>
            </div>
            <div class="right">
                <el-image
                    style="width: 100%; height:calc(100% - 80px)"
                    :src="srcList[0]"
                    :preview-src-list="srcList">
                    <div slot="error"
                         style="height:100%;display: flex;justify-content: center;align-items: center;    background: #F5F7FA;"
                         class="image-slot">
                        <p>暂无处方图片数据</p>
                    </div>
                </el-image>
                <el-button class="search" style="margin-top: 5px" type="success" @click="saveList">保 存</el-button>
            </div>
        </div>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <span>审核不通过，不通过原因: {{reason}}</span>
            <span slot="footer" class="dialog-footer">
<!--    <el-button @click="dialogVisible = false">取 消</el-button>-->
    <el-button type="primary" @click="closeDialogBox">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
import print                    from 'print-js'
import {mapGetters, mapActions} from 'vuex'
import dayjs                    from 'dayjs'
export default {
    name: "index",
    data() {
        return {
            dialogVisible:false,
            reason:'',
            loading: true,
            rules: {
                dispenseloginname: [
                    {required: true, message: '请选择调配人', trigger: 'change'}
                ],
                dispenseloginpwd: [
                    {required: true, message: '请填写调配人密码', trigger: 'blur'}
                ],
                checkloginname: [
                    {required: true, message: '请选择核对人', trigger: 'change'}
                ],
                checkloginpwd: [
                    {required: true, message: '请填写核对人密码', trigger: 'blur'}
                ],
            },
            personnel: [], //人员
            size: 'mini',
            tableData: [],
            checkAll: false,
            srcList: [],
            formInline2: {
                inputdate: '',
                patient: '',
            },
            formInline: {
                dispensestatus: 1,
                patient: '',
                dispenseloginname: '', //调配人
                dispenseloginpwd: '', //调配人密码
                checkloginname: '', //核对人
                checkloginpwd: '',
                prescriptiondid: ''//处方ID
            },
            prescriptionid_c: '',
            unclick1: false,
            unclick2: false,
            handleCheckAllChange(val) {
                // this.checkedCities = val ? cityOptions : []
                // this.isIndeterminate = false
            },
            handleCheckedCitiesChange(value) {
                console.log(value)
                // let checkedCount = value.length
                // this.checkAll = checkedCount === this.cities.length
                // this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
            }
        }
    },
    computed: {
        ...mapGetters([ 'userInfo' ]),
        toatal: function () {
            return this.tableData.length
        },
        choseList: function () {
            let removeRecords = this.$refs.tableData.getSelectRecords()
            return removeRecords
        }
    },
    created() {
        this.$store.commit('app/SET_ROUTER', '/home/pharmacyAudit')
        this.formInline2.inputdate= dayjs().format('YYYY-MM-DD')
        // this.formInline.beginapprovaldate = dayjs().format('YYYY-MM-DD')
        this.getList()
        const {approvalstatus,reason,prescriptionid}=this.$route.query
        this.reason=''
        if (approvalstatus && approvalstatus == 2) {
            console.log("通过")
            this.dialogVisible = true
            this.reason = reason
            this.prescriptionid_c = prescriptionid
        }
        this.isTimeOut()
        this.handle()
        console.log(this.userInfo);
    },
    methods: {
        ...mapActions(
            {
                findList: 'pharmacyAudit/finddoc',
                dispenseAndCheck: 'pharmacyAudit/dispenseAndCheck',
                getByDeptid: 'pharmacyAudit/getByDeptid',
                downloadfile: 'pharmacyAudit/downloadfile',
                updatePatient: 'pharmacyAudit/updatePatient',
                pointapproval: 'pharmacyAudit/pointapproval',
            }
        ),
        async querySearch(queryString, cb) {
            console.log(queryString);
            const yfyl = await this.getByDeptid(
                {
                    deptid: this.userInfo.deptid,
                    key: queryString
                }
            )
            var d = yfyl.map(( item => {
                return {
                    value: item.username,
                    loginid: item.loginid
                }
            } ))
            cb(d);
        },
        handleSelect1 (e) {
            this.formInline.dispenseloginid = e.loginid
        },
        handleSelect2 (e) {
            this.formInline.checkloginid = e.loginid
        },
        handleClose(done) {
            const that=this
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                    that.$router.replace('/dashboard')
                })
                .catch(_ => {});
        },
        closeDialogBox(){
            this.dialogVisible=false
            this.$router.replace('/dashboard')
        },
        handle() {
            clearInterval(this.timeOut)
            this.timeOut = null
            this.timeOut = setInterval(() => {
                this.$message.success('长时间未操作，请重新登录')
                this.$router.push('/dashboard')
            }, 1000 * 60)
        },
        isTimeOut() {
            window.addEventListener("mousemove",this.handle, true);
            // window.addEventListener("keyup", this.throttle(this.handle, 2000), true);
            // window.addEventListener("mouseup", this.throttle(this.handle, 2000), true);
            // window.addEventListener("click", this.throttle(this.handle, 2000), true);
            // window.addEventListener("touchend", this.throttle(this.handle, 2000), true);
            // window.addEventListener('resize', this.throttle(this.handle, 2000))
            // window.addEventListener('scroll', this.throttle(this.handle, 2000))
        },
        approvalstatus(row) {
            // 0 待审核  1审核通过 2审核不通过
            let {cellValue} = row
            return cellValue = cellValue === '0' ? '待审核' : cellValue = cellValue === '2' ? '审核不通过' : '审核通过'

        },
        comefrom(row) {
            // 1:拍照处方，2:电子处方
            let {cellValue} = row
            return cellValue === '1' ? '拍照处方' : '电子处方'
        },
        dispensestatus(row) {
            // 0 待调配 1 已调配
            let {cellValue} = row
            return cellValue === '0' ? '待调配' : '已调配'
        },
        attribute(row) {
            let {cellValue} = row
            return cellValue = cellValue === '1' ? '普通处方' : cellValue = cellValue === '2' ? '慢病处方' : '特药处方'
        },
        pointapprovalstatusM(row){
            let {cellValue} = row
            return cellValue === '1' ? '已审核' : '未审核'
        },
        prescriptiontype(row) {
            // 1 西药 2 草药
            let {cellValue} = row
            return cellValue === '1' ? '西药' : '草药'
        },
        //下载处方
        downloadIamge(imgsrc, name = 11111) {//下载图片地址和图片名
            /*          var image = new Image()
                      // 解决跨域 Canvas 污染问题
                      image.setAttribute("crossOrigin", "anonymous")
                      image.onload = function () {
                          var canvas = document.createElement("canvas")
                          canvas.width = image.width
                          canvas.height = image.height
                          var context = canvas.getContext("2d")
                          context.drawImage(image, 0, 0, image.width, image.height)
                          var url = canvas.toDataURL("image/png") //得到图片的base64编码数据
                          var a = document.createElement("a") // 生成一个a元素
                          var event = new MouseEvent("click") // 创建一个单击事件
                          a.download = name || "photo" // 设置图片名称
                          a.href = url // 将生成的URL设置为a.href属性
                          a.dispatchEvent(event) // 触发a的单击事件
                      }
                      image.src = imgsrc*/
            let image = new Image()
            // 解决跨域 Canvas 污染问题
            image.setAttribute("crossOrigin", "anonymous")
            image.onload = function () {
                let canvas = document.createElement("canvas")
                canvas.width = image.width
                canvas.height = image.height
                let context = canvas.getContext("2d")
                context.drawImage(image, 0, 0, image.width, image.height)
                let url = canvas.toDataURL("image/png") //得到图片的base64编码数据
                let a = document.createElement("a") // 生成一个a元素
                let event = new MouseEvent("click") // 创建一个单击事件
                a.download = name || "photo" // 设置图片名称
                a.href = url // 将生成的URL设置为a.href属性
                a.dispatchEvent(event) // 触发a的单击事件
            }
            image.src = imgsrc

        },
        convertBase64UrlToBlob(base64) {
            var parts = base64.split(";base64,")
            var contentType = parts[ 0 ].split(":")[ 1 ]
            var raw = window.atob(parts[ 1 ])
            var rawLength = raw.length
            var uInt8Array = new Uint8Array(rawLength)
            for (var i = 0; i < rawLength; i++) {
                uInt8Array[ i ] = raw.charCodeAt(i)
            }
            return new Blob([ uInt8Array ], {type: contentType})
        },
        myBrowser() {
            var userAgent = navigator.userAgent //取得浏览器的userAgent字符串
            if (userAgent.indexOf("OPR") > -1) {
                return "Opera"
            } //判断是否Opera浏览器 OPR/43.0.2442.991
            if (userAgent.indexOf("Firefox") > -1) {
                return "FF"
            } //判断是否Firefox浏览器  Firefox/51.0
            if (userAgent.indexOf("Trident") > -1) {
                return "IE"
            } //判断是否IE浏览器  Trident/7.0; rv:11.0
            if (userAgent.indexOf("Edge") > -1) {
                return "Edge"
            } //判断是否Edge浏览器  Edge/14.14393
            if (userAgent.indexOf("Chrome") > -1) {
                return "Chrome"
            } // Chrome/56.0.2924.87
            if (userAgent.indexOf("Safari") > -1) {
                return "Safari"
            } //判断是否Safari浏览器 AppleWebKit/534.57.2 Version/5.1.7 Safari/534.57.2
        },
        convertUrlToBase64 (url) {
            return new Promise(function (resolve, reject) {
                var img = new Image()
                img.crossOrigin = "Anonymous"
                img.src = url
                img.onload = function () {
                    var canvas = document.createElement("canvas")
                    canvas.width = img.width
                    canvas.height = img.height
                    var ctx = canvas.getContext("2d")
                    ctx.drawImage(img, 0, 0, img.width, img.height)
                    var ext = img.src
                                 .substring(img.src.lastIndexOf(".") + 1)
                                 .toLowerCase()
                    var dataURL = canvas.toDataURL("image/" + ext)
                    var base64 = {
                        dataURL: dataURL,
                        type: "image/" + ext,
                        ext: ext
                    }
                    resolve(base64)
                }
            })
        },
        downs() {
            if (this.choseList.length !== 1) {
                this.$message.warning("请选择一条数据进行下载")
            } else {
                // this.downloadIamge(this.choseList[ 0 ].imageurl, 'pic')
                // return
                const that = this
                const url = this.choseList[ 0 ].imageurl[ 0 ]

                this.downloadfile(url)
                    .then(function (res) {
                        console.log(res)
                        // 图片转为base64
                        let base64 = 'data:image/jpg;base64,' + res.base64
                        let filename = res.filename
                        that.downloadIamge(base64, filename)
                        // var blob = that.convertBase64UrlToBlob(base64) // 转为blob对象
                        // // 下载
                        // if (that.myBrowser() == "IE") {
                        //     console.log("ie")
                        //     window.navigator.msSaveBlob(blob, name + ".jpg")
                        // } else if (that.myBrowser() == "FF") {
                        //     window.location.href = url
                        //     console.log("FF")
                        // } else {
                        //     console.log("elrse ")
                        //     var a = document.createElement("a")
                        //     a.download = name
                        //     a.href = URL.createObjectURL(blob)
                        //     a.click()
                        // }
                    })
                    .catch(err => {
                        console.log(err, "---")
                    })

                /*             this.convertUrlToBase64(url).then(function (base64) {
                                 console.log(base64)
                                 // 图片转为base64
                                 var blob = that.convertBase64UrlToBlob(base64) // 转为blob对象
                                 // 下载
                                 if (that.myBrowser() == "IE") {
                                     console.log("ie")
                                     window.navigator.msSaveBlob(blob, name + ".jpg")
                                 } else if (that.myBrowser() == "FF") {
                                     window.location.href = url
                                     console.log("FF")
                                 } else {
                                     console.log("elrse ")
                                     var a = document.createElement("a")
                                     a.download = name
                                     a.href = URL.createObjectURL(blob)
                                     a.click()
                                 }
                             })
                                 .catch(err => {
                                     console.log(err, "---")
                                 })*/
            }
        },
        //打印处方
        printSelectEvent() {
            if (this.choseList.length !== 1) {
                this.$message.warning("请选择一条数据进行打印")
            } else {
                // print({printable: this.choseList[ 0 ].imageurl, type: 'image', header: '处方图片'})
                print({printable: this.choseList[ 0 ].imageurl, type: 'image', header: ''})
            }
            // print('https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg', 'image')


            /*          printJS({
                          printable: ['images/print-01-highres.jpg', 'images/print-02-highres.jpg', 'images/print-03-highres.jpg'],
                          type: 'image',
                          header: '标题仅显示在第一张图片',
                          imageStyle: 'width:50%;margin-bottom:20px;'
                      })*/
            // console.log(this.$refs.tableData.getSelectRecords())
            // this.$refs.tableData.print({
            //     data: this.$refs.tableData.getSelectRecords()
            // })
        },
        headClass({row, column, rowIndex, columnIndex}) {
            return 'background:#36c2aa;'
        },
        currentChange({row}) {
            this.srcList = row.imageurl
            console.log(this.srcList)
        },
        handleRowClick(row, column, event) {
            this.$refs.tableData.toggleRowSelection(row)
        },
        //审核
        checkDis () {
           let rows = this.$refs.tableData.getSelectRecords()
            if (rows.length !== 0) {
                console.log(rows);
                let newArr = []
                let hasstatus = false
                for (var i = 0; i<rows.length; i++) {
                    if (rows[i].pointapprovalstatus === '1') {
                        this.$message.warning('请选择未审核状态的数据')
                        hasstatus = true
                        return false
                    } else {
                        newArr.push({
                            prescriptionid: rows[i].prescriptionid,
                            pointapprovalmanid: this.userInfo.userid,
                            pointapprovalman: this.userInfo.username
                        })
                    }
                }
                if (hasstatus !== true) {
                    console.log(newArr);
                    this.pointapproval(newArr).then(res =>{
                        this.getList()
                        this.$message.success('更改审核状态成功')
                    }).catch(err => {
                        console.log(err);
                    })
                }

            } else {
               this.$message.warning('请至少选择一条数据')
            }
        },
        checkDispense(formName, type) {
            if (this.choseList.length === 0) {
                this.$message.warning("请至少选一条数据")
            } else {
                if (type === 1) {
                    this.$refs[ formName ].validate((valid) => {
                        if (valid) {
                            if (this.formInline.dispenseloginid === this.formInline.checkloginid) {
                                this.$message.error('调配人与核对人不允许为同一个人!')
                                return false
                            }
                            this.unclick1 = true
                            let prescriptionid = this.choseList.map((item) => { return item.prescriptionid})
                            this.formInline.prescriptionid = prescriptionid
                            this.dispenseAndCheck(this.formInline).then(res => {
                                console.log(res)
                                this.unclick1 = false
                                this.$message.success('审核成功')
                                this.$router.push({
                                    path: '/dashboard'
                                })
                                this.getList()
                            }).catch(err => {
                                this.unclick1 = false
                                console.log(err)
                            })
                        } else {
                            console.log('error submit!!')
                            return false
                        }
                    })
                } else {
                    this.unclick2 = true
                    let prescriptionid = this.choseList.map((item) => { return item.prescriptionid})
                    this.formInline.prescriptionid = prescriptionid
                    let parms = {
                        dispensestatus: 2,
                        prescriptionid
                    }
                    this.dispenseAndCheck(parms).then(res => {
                        this.$message.success('审核成功')
                        this.unclick2 = false
                        this.$router.push({
                            path: '/dashboard'
                        })
                        this.getList()
                    }).catch(err => {
                        this.unclick2 = false
                        console.log(err)
                    })
                }
            }

        },
        notPass() {
            this.dispenseAndCheck({
                dispensestatus: 1,
            }).then(res => {
                console.log(res)
                this.$message.success('成功')
            }).catch(err => {
                console.log(err)
            })
        },
        onSubmit() {
            this.getList()
        },
        dataChange() {
            this.getList()
        },
        getList() {
            this.loading = true
            this.findList({
                inputmanid : this.userInfo.userid,
                dispensestatus: 0,
                approvalstatus: 3,
                companyid: this.userInfo.companyid,
                pageIndex: '',
                pageSize: '',
                deptid: this.userInfo.deptid,
                patient: this.formInline2.patient,
                inputdate: this.formInline2.inputdate,
                prescriptionid: this.prescriptionid_c
            })
                .then(res => {
                    this.tableData = res.list
                    this.loading = false
                })
                .catch(err => {
                    console.log(err)
                    this.loading = false
                })
        },
        saveList(){
            if (this.choseList.length === 0) {
                this.$message.warning("请至少选择一条数据")
            } else {
                let list =[]
                console.log(this.choseList)
                this.choseList.forEach((item)=>{
                    list.push({
                        prescriptionid:item.prescriptionid,
                        patient:item.patient,
                        insiderphone:item.insiderphone,
                    })
                })
                // const c = this.choseList.filter((item)=>{return item.attribute==='1'}).forEach((item)=>{})
                console.log(list)
                this.updatePatient(list)
                    .then(res=>{
                        console.log(res)
                        this.$message.success('保存成功')
                        this.getList()
                    }).catch(err=>{
                    console.log(err)
                    this.$message.success('保存失败')
                })
                // print({printable: this.choseList[ 0 ].imageurl, type: 'image', header: '处方图片'})
            }
        },
        lookEvent(row) {
            this.srcList = row.imageurl
        },
        editActivedEvent ({ row }) {
            console.log(row)
            let xTable = this.$refs.tableData
            // attribute
            let patientColumn = xTable.getColumnByField('patient')
            let phoneColumn = xTable.getColumnByField('insiderphone')
            console.log(patientColumn)
            let patientDisabled = row.attribute !== '1'
            let phoneDisabled = row.attribute !== '1'

            patientColumn.editRender.attrs.disabled = patientDisabled
            phoneColumn.editRender.attrs.disabled = phoneDisabled
        },
    },
    beforeDestroy() {
        window.location.reload()
    }
}
</script>

<style scoped lang="scss">
    .pharmacyAudit {
        background-color: #fff;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
        padding: 0 5px;

        .search {
            color: #FFF;
            background-color: $color-btn;
            border-color: $color-btn;
        }
        & /deep/ .el-image-viewer__close{
            color: red;
        }
        .test {
            background-color: red;
        }

        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;

        .form-serch {
            height: 145px;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            align-items: center;
            /*border: 1px solid #c9c9c9;*/
            padding: 5px;
            box-sizing: border-box;
            margin-bottom: 10px;



            .left {
                height: 144px;
                display: flex;
                flex-direction: column;
                flex-wrap: wrap;
                border: 1px solid #c9c9c9;
                padding: 5px;
                justify-content: center;
                align-items: center;
                min-width: 360px;
            }

            .right {
                height: 144px;
                border: 1px solid #c9c9c9;
                width: 1000px;
                display: flex;
                flex: 1;
                margin-left: 20px;
                justify-content: space-around;
                align-items: center;
                padding: 5px;
box-sizing: border-box;
                .leftBOX {
                }

                .rightBOX {
                    .form-submit {
                        width: 200px;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;

                    }

                    .submit-left {
                        text-align: center;
                        padding-bottom: 5px;
                    }

                    .submit-right {

                    }

                }
            }
        }

        .table {
            flex: 1;
            display: flex;
            flex-direction: row;
            overflow: hidden;

            .left {
                width: 80%;
                height: 100%;
                padding: 8px;
                box-sizing: border-box;
            }

            .right {
                width: 20%;
                padding: 8px;
                box-sizing: border-box;
                box-sizing: border-box;
                text-align: center;
            }
        }

        .search-w {
            width: 210px !important;
        }
    }
</style>
