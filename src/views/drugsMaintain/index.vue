<template>
    <div class="drugsMaintain">
        <div class="form-serch">
            <el-form :inline="true" class="left" :model="formInline" label-width="120px" style="margin-top: 20px!important;">
                <el-form-item label="患者姓名">
                    <el-input v-model="formInline.patient" placeholder="患者姓名" class="search-w"></el-input>
                </el-form-item>
                <el-form-item label="开始时间">
                    <el-date-picker
                        class="search-w"
                        v-model="formInline.beginapprovaldate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间">
                    <el-date-picker
                        class="search-w"
                        v-model="formInline.endapprovaldate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <br>
                <el-form-item label="药品名称">
                    <el-input class="search-w" v-model="formInline.goodsname" placeholder="药品名称"></el-input>
                </el-form-item>
                <el-form-item label="联系电话">
                    <el-input class="search-w" v-model="formInline.insiderphone" placeholder="联系电话"></el-input>
                </el-form-item>

                <el-form-item label="审核状态">
                    <el-select class="search-w" v-model="formInline.approvalstatus" placeholder="审核状态">
                        <el-option
                            v-for="item in approvalstatusList"
                            :key="item.label"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <!--<el-form-item label="调配状态">
                    <el-select class="search-w" v-model="formInline.dispensestatus" placeholder="处方状态">
                        <el-option
                            v-for="item in dispensestatus"
                            :key="item.label"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>

                </el-form-item>-->
            </el-form>
            <el-form class="right">
                <el-form-item>
                    <el-button @click="moreSearch">更多</el-button>
                    <el-button class="search" type="success" @click="search">查询</el-button>
                    <el-button @click="clearBtn">清空</el-button>

                    <div class="submit-right" style="margin-top: 6px;text-align: center">
                        <el-button @click="downloadERP">下传ERP系统</el-button>
                        <el-button @click="printSelectEvent">打印</el-button>
                        <el-button @click="downs">下载</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <div class="table" style="height: 100%">
            <div class="left">
                <vxe-table
                    height="45%"
                    border
                    resizable
                    :loading="loading"
                    ref="tableData"
                    :header-cell-style="headClass"
                    :edit-config="{trigger: 'click', mode: 'row', icon: 'fa fa-edit'}"
                    highlight-current-row
                    @edit-actived="editActivedEvent"
                    @current-change="rowChose"
                    :data="tableData">
                    <vxe-table-column type="checkbox" width="60" fixed="left"></vxe-table-column>
                    <vxe-table-column type="index" title="序号" width="60"></vxe-table-column>
                    <vxe-table-column sortable field="prescriptionid" title="处方ID" width="80"></vxe-table-column>
                    <vxe-table-column sortable field="prescriptionno" title="处方编号" width="100"></vxe-table-column>
                    <vxe-table-column sortable field="recordstatus" title="录制" width="80"></vxe-table-column>
                    <vxe-table-column sortable field="prescriptiondate" title="处方日期" width="100" :formatter="formatterDate"></vxe-table-column>
                    <vxe-table-column sortable field="prescriptiontype" title="处方类型" width="100" :formatter="formatterType"></vxe-table-column>
                    <vxe-table-column sortable field="attribute" title="处方属性" width="100" :formatter="formatterAttribute"></vxe-table-column>
                    <vxe-table-column sortable field="comefrom" title="处方来源" width="100" :formatter="formatterComefrom"></vxe-table-column>
                    <vxe-table-column sortable field="patient" title="患者姓名" :edit-render="{name: 'input',attrs: {disabled: false}}" width="100"></vxe-table-column>
                    <vxe-table-column sortable field="insiderphone" title="患者电话" :edit-render="{name: 'input',attrs: {disabled: false}}" width="100"></vxe-table-column>
                    <vxe-table-column sortable field="idcard" title="身份证号" width="100"></vxe-table-column>
                    <vxe-table-column sortable field="diagnosis" title="诊断" width="80"></vxe-table-column>
                    <vxe-table-column sortable field="medicalinstitution" title="医疗机构" width="100"></vxe-table-column>
                    <vxe-table-column sortable field="doctor" title="医师" width="80"></vxe-table-column>
                    <vxe-table-column sortable field="approvalstatus" title="审方状态" width="100" :formatter="formatterApprovalstatus"></vxe-table-column>
                    <vxe-table-column sortable field="pharmacistname" title="执业药师" width="100"></vxe-table-column>
                    <vxe-table-column sortable field="approvaldate" title="审方日期" width="100" :formatter="formatterDate"></vxe-table-column>
                    <vxe-table-column sortable field="pointapprovalstatus" title="门店审核状态" width="120" :formatter="pointapprovalstatusM"></vxe-table-column>
                    <vxe-table-column sortable field="pointapprovalman" title="门店审核人" width="120"></vxe-table-column>
                    <vxe-table-column sortable field="dispensestatus" title="调配状态" width="120" :formatter="formatterDispensestatus"></vxe-table-column>
                    <vxe-table-column sortable field="dispensemanname" title="调配人" width="100"></vxe-table-column>
                    <vxe-table-column sortable field="dispensedate" title="调配日期" width="100" :formatter="formatterDate"></vxe-table-column>
                    <vxe-table-column sortable field="checkstatus" title="核对状态" width="100" :formatter="formatterCheckstatus"></vxe-table-column>
                    <vxe-table-column sortable field="checkmanname" title="核对人" width="100"></vxe-table-column>
                    <vxe-table-column sortable field="checkdate" title="核对日期" width="100" :formatter="formatterDate"></vxe-table-column>
                    <vxe-table-column sortable field="dept" title="零售" width="100"></vxe-table-column>
                    <vxe-table-column sortable field="inputmanname" title="录入人" width="100"></vxe-table-column>
                    <vxe-table-column sortable field="inputdate" title="录入日期" width="100" :formatter="formatterDate"></vxe-table-column>
                    <vxe-table-column title="操作"  width="100" fixed="right">
                        <template v-slot="{ row }">
                            <div @click="lookEvent(row)" style="color: #00ffff;line-height: 30px;cursor: pointer">查看处方</div>
                        </template>
                    </vxe-table-column>
                </vxe-table>
                <div style="height: 6%;margin-top: 10px; margin-bottom: 10px">
                    <el-button @click="dtlAdd" class="search" type="success" size="mini">新增</el-button>
                    <el-button @click="dtlDelete" type="danger" size="mini">删除</el-button>
                </div>
                <vxe-table
                    height="40%"
                    border
                    resizable
                    :loading="loading2"
                    ref="dtltableData"
                    :header-cell-style="headClass"
                    :edit-config="{trigger: 'click', mode: 'row'}"
                    :data="dtlData">
                    <vxe-table-column type="checkbox" width="60" fixed="left"></vxe-table-column>
                    <vxe-table-column type="index" title="序号" width="60"></vxe-table-column>
                    <vxe-table-column sortable field="goodsid" title="商品ID"  width="100px"></vxe-table-column>
                    <vxe-table-column sortable field="goodsname" title="药品名"  width="100px"></vxe-table-column>
                    <vxe-table-column sortable field="goodstype" title="商品规格" width="100px"></vxe-table-column>
                    <vxe-table-column sortable field="goodsunit" title="基本单位" width="100px"></vxe-table-column>
                    <vxe-table-column sortable field="prodarea" title="产地" width="100px"></vxe-table-column>
                    <vxe-table-column sortable field="goodsqty" title="数量" width="180px">
                        <template v-slot="{ row }">
                            <el-input-number v-model="row.goodsqty" :min="1" style="width: 140px;"></el-input-number>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column sortable field="yfyl" title="用法用量" width="240px">
                        <template v-slot="{ row }">
                            <el-input v-model="row.yfyl" style="width: 180px;"></el-input>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column title="操作"  width="100" fixed="right">
                        <template v-slot="{ row }">
                            <div @click="dtlEdit(row)" style="color: #00ffff;line-height: 30px;cursor: pointer">保存</div>
                        </template>
                    </vxe-table-column>
                </vxe-table>
            </div>
            <div class="right">
                <div class="divNeedL_bottom" v-if="source == 2" style="text-align: center;height: 55vh">
                    <el-button @click="openNew">查看附件</el-button>
                </div>
                <el-image
                    v-else
                    :alt="checkedCities[0]"
                    style="width: 100%; height:calc(100% - 80px)"
                    :src="imageurl[0]"
                    :preview-src-list="imageurl">
                    <div slot="error"
                         style="height:100%;display: flex;justify-content: center;align-items: center;background: #F5F7FA;"
                         class="image-slot">
                        <p>暂无处方图片数据</p>
                    </div>
                </el-image>
                <el-button class="search" style="margin-top: 5px" type="success" @click="saveList">保 存</el-button>
            </div>
        </div>
        <!--更多搜索-->
        <el-dialog :visible.sync="moreVisible" title="查询" width="600px">
            <el-form :inline="true" class="left" :model="formInline" label-width="120px">
                <el-form-item label="制单开始时间">
                    <el-date-picker
                        class="search-w"
                        v-model="formInline.begininputdate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="制单结束时间">
                    <el-date-picker
                        class="search-w"
                        v-model="formInline.endinputdate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item><br />
                <el-form-item label="处方类型:">
                    <el-checkbox-group v-model="formInline.comboxType">
                        <el-checkbox label="1">西药处方</el-checkbox>
                        <el-checkbox label="2">中药处方</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="处方属性:">
                    <el-checkbox-group v-model="formInline.comboxAttribute">
                        <el-checkbox label="1">普通处方</el-checkbox>
                        <el-checkbox label="2">慢病处方</el-checkbox>
                        <el-checkbox label="3">特药处方</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="处方来源:">
                    <el-checkbox-group v-model="formInline.comboxComefrom">
                        <el-checkbox label="1">拍照处方</el-checkbox>
                        <el-checkbox label="2">电子处方</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="moreVisible=false">取 消</el-button>
                <el-button class="search" @click="search">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="药品库明细" :visible.sync="drugVisible">
            <div style="margin-top: 10px; margin-bottom: 10px">
                <el-input
                    v-model="filterName"
                    :autofocus="true"
                    @input="filterVal"
                    style="width: 268px"
                    @keyup.enter.native="diaSearch($event)"
                    type="search"
                    placeholder="请输入您要搜索的内容"
                ></el-input>
            </div>
            <div v-loading="loading">
                <vxe-table
                    ref="formDrug"
                    id="getTable"
                    border
                    height="420px"
                    :header-cell-style="headClass"
                    :data.sync="drugList"
                    highlight-current-row
                    :keyboard-config="{isArrow: true, isEnter: true}"
                    @cell-dblclick="closeDrug"
                >
                    <vxe-table-column type="index" width="50"></vxe-table-column>
                    <vxe-table-column field="popularizename" title="主推" sortable></vxe-table-column>
                    <vxe-table-column field="goodsname" title="药品名称" sortable></vxe-table-column>
                    <vxe-table-column field="goodstype" title="药品规格" width="210" sortable></vxe-table-column>
                    <vxe-table-column field="goodsunit" title="药品单位" width="120" sortable></vxe-table-column>
                    <vxe-table-column field="prodarea" title="产地" sortable></vxe-table-column>
                    <vxe-table-column field="price" title="价格" sortable></vxe-table-column>
                    <vxe-table-column field="inventory" title="库存" sortable></vxe-table-column>
                </vxe-table>
                <div class="pagination">
                    <vxe-pager
                        perfect
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
    import {mapGetters, mapActions} from 'vuex'
    import dayjs                    from 'dayjs'
    import print                    from 'print-js'

    import XEUtils from 'xe-utils'
    export default {
        name: "index",
        data () {
            return {
                loading: false,
                loading2: false,
                formInline: {
                    goodsname: '',
                    insiderphone: '',
                    patient: '',
                    region: '',
                    dispensestatus: '',//调配
                    approvalstatus: '1',
                    beginapprovaldate: '',
                    endapprovaldate: '',
                    begininputdate: '',
                    endinputdate: '',
                    companyid: '',
                    pageIndex: '',
                    pageSize: '',
                    attribute: '',
                    comboxType: [],
                    comboxAttribute: [],
                    comboxComefrom: [],
                },
                approvalstatusList: [
                    { value: '', label: '全部'},
                    { value: '0', label: '待审核'},
                    { value: '1', label: '审核通过'},
                    { value: '2', label: '审核不通过'},
                    { value: '4', label: '驳回'}
                ],
                tableData: [],
                dtlData: [],
                checkedCities: [],
                imageurl: [],
                moreVisible: false,
                formVal: {},
                drugVisible: false,
                pageDrug: {},
                drugList: [],
                filterName: '',
                docData: {},
                docChange: false,
                source: ''
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
        created () {
            this.$store.commit('app/SET_ROUTER', '/home/drugsMaintain')
        },
        mounted(){
            this.search()
        },
        methods: {
            ...mapActions(
                {
                    findList: 'pharmacyAudit/finddoc',
                    findDtl: 'pharmacyAudit/finddtl',
                    downloadfile: 'pharmacyAudit/downloadfile',
                    goodList: "pharmacyAudit/goodsFind",
                    savedtl: 'pharmacyAudit/savedtl',
                    deldtl: 'pharmacyAudit/deldtl',
                    sendPrescritpion: 'pharmacyAudit/sendPrescritpion',
                    updatePatient: 'pharmacyAudit/updatePatient',
                }
            ),
            openNew () {
                window.open(
                    this.imageurl,
                    "_blank",
                    "width=375px,height=667px,top=100px,left=0px"
                )
            },
            moreSearch(){
                this.moreVisible = true
            },
            editActivedEvent ({ row }) {
                console.log(row)
                let xTable = this.$refs.tableData
                let patientColumn = xTable.getColumnByField('patient')
                let phoneColumn = xTable.getColumnByField('insiderphone')
                console.log(patientColumn)
                let patientDisabled = row.attribute !== '1'
                let phoneDisabled = row.attribute !== '1'

                patientColumn.editRender.attrs.disabled = patientDisabled
                phoneColumn.editRender.attrs.disabled = phoneDisabled
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
                    console.log(list)
                    this.updatePatient(list).then(res=>{
                        console.log(res)
                        this.$message.success('保存成功')
                        this.search()
                    }).catch(err=>{
                        console.log(err)
                        this.$message.warning('保存失败')
                    })
                }
            },
            search() {
                this.moreVisible = false
                this.loading = true
                if (this.checkedCities.length === 0) {
                    this.formInline.attribute = null
                } else if (this.checkedCities.length === 2) {
                    this.formInline.attribute = 5
                } else {
                    this.formInline.attribute = this.checkedCities[ 0 ]
                }
                this.formInline.companyid = this.userInfo.companyid
                this.formInline.deptid = this.userInfo.deptid
                this.findList(this.formInline).then(res => {
                    setTimeout(() => {
                        this.loading = false
                        this.tableData = res.list
                    }, 300)
                }).catch(err => {
                    this.loading = false
                })
            },
            lookEvent(row) {
                this.imageurl = row.imageurl
                this.source = row.source
            },
            rowChose (val) {
                let row = val.row
                this.docData = val.row
                this.docChange = true
                if (row.prescriptionid) {
                    let parms = {
                        prescriptionid: row.prescriptionid,
                        pageIndex: 1,
                        pageSize: 100
                    }
                    this.dtlData = []
                   this.findChildList(parms)
                }
            },
            findChildList (parms) {
                this.loading2 = true
                this.findDtl(parms).then(res => {
                    setTimeout(() => {
                        this.loading2 = false
                        this.dtlData = res.list
                    })
                }).catch(err => {
                    this.loading2 = false
                })
            },
            downloadERP () {
                if (this.choseList.length <= 0) {
                    this.$message.warning("请至少选择一条数据下传ERP系统")
                } else {
                    let isAlert = false
                    let ids = []
                    this.choseList.forEach(e => {
                        if(e.sendflag) {
                            isAlert = true
                        }
                        ids.push(e.prescriptionid)
                    })
                    if (isAlert) {
                        this.$confirm('选择的数据中已有下传过的数据，是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.okDownloadERP(ids)
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消继续下传ERP系统'
                            })
                        })
                    } else {
                        this.okDownloadERP(ids)
                    }
                }
            },
            okDownloadERP (ids) {
                this.sendPrescritpion({
                    companyId: this.userInfo.companyid,
                    data: ids
                }).then(res => {
                    if (res.status === 200) {
                        this.$message.success('下传ERP系统成功')
                        this.search()
                        this.docChange = false
                        this.dtlData = []
                        this.docData = {}
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            dtlAdd () {
                if (this.docChange) {
                    this.drugVisible = true;
                    this.filterName = '';
                    this.drugList = [];
                    this.pageDrug.totalResult = 0
                } else {
                    this.$message.warning('请选择一条总单在新增细单')
                }
            },
            dtlEdit (row) {
                let newArr = []
                newArr.push(row)
                row.prescriptionid = this.docData.prescriptionid
                this.savedtl(newArr).then(res => {
                    if (res.status === 200) {
                        // 保存细单成功 刷新
                        if (this.docData.prescriptionid) {
                            let parms = {
                                prescriptionid: this.docData.prescriptionid,
                                pageIndex: 1,
                                pageSize: 100
                            }
                            this.dtlData = []
                            this.findChildList(parms)
                        }
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            dtlDelete () {
                if (this.docChange) {
                    let removerows = this.$refs.dtltableData.getSelectRecords()
                    if (removerows.length) {
                        let newArr = []
                        let delDtl = false
                        removerows.forEach(item => {
                            if (item.prescriptiondtlid === undefined) {
                                delDtl = true
                            } else {
                                newArr.push({
                                    prescriptiondtlid: item.prescriptiondtlid,
                                    prescriptionid: item.prescriptionid
                                })
                            }
                        })
                        console.log(newArr);
                        if (delDtl) {
                            this.$message.warning('删除的细单内有未保存的数据')
                            return false
                        }
                        this.deldtl(newArr).then(res => {
                            if(res.status === 200) {
                                this.$message.success('删除细单成功')
                                // 删除细单成功 刷新
                                if (this.docData.prescriptionid) {
                                    let parms = {
                                        prescriptionid: this.docData.prescriptionid,
                                        pageIndex: 1,
                                        pageSize: 100
                                    }
                                    this.dtlData = []
                                    this.findChildList(parms)
                                }
                            }
                        }).catch(err => {
                            console.log(err);
                        })
                    } else {
                        this.$message.warning('请选择您要删除的细单')
                    }
                } else {
                    this.$message.warning('请选择一条总单在删除细单')
                }
            },
            // 获取药品名称
            diaSearch(event) {
                event.target.blur();
                this.$nextTick(() => {
                    this.$refs.formDrug.setCurrentRow(this.drugList[0]);
                });
            },
            closeDrug ({row}) {
                let status = false;
                row.goodsid = row.pkid
                let getTableData = this.$refs.dtltableData.getTableData();
                getTableData.fullData.forEach(item => {

                    if (item.pkid == row.pkid) {
                        status = true;
                    }
                });
                if (this.isManageInventory === 'true') {
                    if (row.inventory === 0) {
                        this.$message.warning("当前库存不足");
                        return false
                    }
                }
                if (status) {
                    this.$message.warning("此货品已选择, 请修改数量即可");
                    return false;
                } else {
                    this.drugVisible = false;
                    this.$refs.dtltableData.insertAt(row, -1).then(({}) => {});
                }
            },
            filterVal(e) {
                this.goodList({
                    companyid: this.userInfo.companyid,
                    pageIndex: this.pageDrug.currentPage,
                    pageSize: this.pageDrug.pageSize,
                    key: e,
                    deptid: this.userInfo.deptid
                })
                .then(res => {
                    this.drugList = res.list;
                    this.pageDrug.totalResult = res.info;
                })
                .catch(err => {
                    console.log(err);
                });
            },
            findDrug(e) {
                this.goodList({
                        companyid: this.userInfo.companyid,
                        pageIndex: this.pageDrug.currentPage,
                        pageSize: this.pageDrug.pageSize,
                        key: e
                    })
                    .then(res => {
                        this.drugList = res.list;
                        this.pageDrug.totalResult = res.info;
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            handlePageChangeDrug({ currentPage, pageSize }) {
                this.pageDrug.currentPage = currentPage;
                this.pageDrug.pageSize = pageSize;
                this.findDrug(this.filterName);
            },
            //打印处方
            printSelectEvent() {
                if (this.choseList.length !== 1) {
                    this.$message.warning("请选择一条数据进行打印")
                } else {
                    print({printable: this.choseList[ 0 ].imageurl, type: 'image', header: ''})
                }
            },

            downs() {
                if (this.choseList.length !== 1) {
                    this.$message.warning("请选择一条数据进行下载")
                } else {
                    const that = this
                    const url = this.choseList[0].imageurl[0]

                    this.downloadfile(url).then(function (res) {
                        console.log(res)
                        let base64 = 'data:image/jpg;base64,' + res.base64
                        let filename = res.filename
                        that.downloadIamge(base64, filename)
                    }).catch(err => {
                        console.log(err, "---")
                    })
                }
            },
            //下载图片地址和图片名
            downloadIamge(imgsrc, name = 11111) {
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
            headClass({row, column, rowIndex, columnIndex}) {
                return 'background:#36c2aa;'
            },
            clearBtn () {
                this.formInline = {
                    goodsname: '',
                    insiderphone: '',
                    patient: '',
                    region: '',
                    dispensestatus: '',
                    approvalstatus: '',
                    beginapprovaldate: '',
                    endapprovaldate: '',
                    begininputdate: '',
                    endinputdate: '',
                    companyid: '',
                    pageIndex: '',
                    pageSize: '',
                    attribute: '',
                    comboxType: [],
                    comboxAttribute: [],
                    comboxComefrom: [],
                }
            },

            formatterDate (row) {
                let {cellValue} = row
                return XEUtils.toDateString(cellValue, 'yyyy-MM-dd')
            },
            pointapprovalstatusM (row) {
                let {cellValue} = row
                return cellValue === '1' ? '已审核' : '未审核'
            },
            // 调配状态
            formatterDispensestatus (row) {
                let {cellValue} = row
                if (cellValue == 0) {
                    return cellValue = '未调配'
                } else if (cellValue == 1) {
                    return cellValue = '已调配'
                }
            },
            // 处方类型
            formatterType (row) {
                let {cellValue} = row
                if (cellValue == 1) {
                    return cellValue = '西药'
                } else if (cellValue == 2) {
                    return cellValue = '草药'
                }
            },
            formatterAttribute (row) {
                let {cellValue} = row
                if (cellValue == 1) {
                    return cellValue = '普通处方'
                } else if (cellValue == 2) {
                    return cellValue = '慢病处方'
                } else if (cellValue == 3) {
                    return cellValue = '特药处方'
                }
            },
            formatterComefrom (row) {
                let {cellValue} = row
                if (cellValue == 1) {
                    return cellValue = '拍照处方'
                } else if (cellValue == 2) {
                    return cellValue = '电子处方'
                }
            },
            // 审批状态
            formatterApprovalstatus (row) {
                let {cellValue} = row
                if (cellValue == 0) {
                    return cellValue = '待审批'
                } else if (cellValue == 1) {
                    return cellValue = '审批通过'
                } else if (cellValue == 2) {
                    return cellValue = '审批拒绝'
                }
            },
            // 核对状态
            formatterCheckstatus (row) {
                let {cellValue} = row
                if (cellValue == 0) {
                    return cellValue = '未核对'
                } else if (cellValue == 1) {
                    return cellValue = '已核对'
                }
            },
        }
    }
</script>

<style scoped lang="scss">
    .drugsMaintain {
        height: 100%;
        min-width: 1384px;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
        padding: 20px;
        background-color: #fff;

        .search {
            color: #FFF;
            background-color: $color-btn;
            border-color: $color-btn;
        }

        & /deep/ .el-image-viewer__close {
            color: red;
        }

        .search-w {
            width: 210px !important;
        }

        .form-serch {
            height: 145px;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            align-items: center;
            border: 1px solid #c9c9c9;
            box-sizing: border-box;
            .left {

            }

            .right {

            }
        }

        .table {
            flex: 1;
            display: flex;
            flex-direction: row;


            .left {
                width: 80%;
                padding: 8px;
                box-sizing: border-box;
            }

            .right {
                width: 20%;
                padding: 8px;
                /*box-sizing: border-box;*/
                /*text-align: center;*/
            }
        }

    }
</style>
