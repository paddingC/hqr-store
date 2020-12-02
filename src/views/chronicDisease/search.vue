<template>
    <div class="search">
        <el-card class="box-card">
            <div class="left">
                <p>慢病档案</p>

            </div>
            <div class="right">
                <el-form :model="ruleForm" status-icon ref="ruleForm" label-width="100px"
                         class="demo-ruleForm">
                    <el-form-item label="患者身份证" prop="idcard">
                        <el-input style="width: 500px;" placeholder="请输入患者身份证号" v-model="ruleForm.idcard"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="患者姓名" prop="patient">
                        <el-input style="width: 500px;" v-model="ruleForm.patient"
                                  placeholder="请输入患者姓名"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="患者电话" prop="insiderphone">
                        <el-input style="width: 500px;" v-model.number="ruleForm.insiderphone"
                                  placeholder="请输入患者电话"></el-input>
                    </el-form-item>
                    <el-form-item label="建档日期" prop="time">
                        <el-date-picker
                            style="width: 500px;"
                            v-model="ruleForm.time"
                            type="daterange"
                            range-separator="至"
                            value-format="yyyy-MM-dd"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item style="text-align: center;padding-top: 50px;">
                        <el-button type="primary" @click="submitForm('ruleForm')">查 询</el-button>
                        <el-button @click="resetForm('ruleForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <el-dialog title="选择慢病档案" :visible.sync="dialogFormVisible">
            <div slot="footer" class="dialog-footer">
                <vxe-table
                    max-height="450"
                    border
                    ref="tableData"
                    resizable
                    show-overflow
                    auto-resize
                    height="auto"
                    :header-cell-style="headClass"
                    highlight-current-row
                    @current-change="handleCurrentChange"
                    :data="tableData">
                    <vxe-table-column type="index" title="序号" width="60"></vxe-table-column>
                    <vxe-table-column field="prescriptionno" title="处方单号"></vxe-table-column>
                    <vxe-table-column field="patient" title="患者姓名"></vxe-table-column>
                    <vxe-table-column field="insiderphone" title="患者电话"></vxe-table-column>
                    <vxe-table-column field="idcard" title="身份证号" show-overflow></vxe-table-column>
                    <vxe-table-column field="diagnosis" title="病症诊断"></vxe-table-column>
                    <vxe-table-column field="prescriptiondate" title="开方时间"
                                      formatter="toDateString"></vxe-table-column>
                    <vxe-table-column field="inputdate" title="建档时间"
                                      formatter="toDateString"></vxe-table-column>
                </vxe-table>
                <div style="margin-top: 20px">
                    <el-button type="primary" @click="submitCheck">确 定</el-button>
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
    name: "search",
    data() {
        return {
            tableData: [],
            dialogFormVisible: false,
            ruleForm: {
                idcard: '',
                patient: '',
                insiderphone: '',
                time: [],
                attribute: 2,
            },
            searchInfo: null
        }
    },
    computed: {
        ...mapGetters([
            'storeInfo',
            'userInfo'
        ])
    },
    methods: {
        submitCheck() {
            if (this.searchInfo == null) {
                this.$message.warning('请选择一条数据')
                return false
            }
            this.$store.commit('chronicDisease/SET_NCDINFO', this.searchInfo)
            this.$router.replace({
                path: '/home/chronicDisease/detail',
                query: {
                    prescriptionid: this.searchInfo.prescriptionid
                }
            })
        },
        handleCurrentChange({row}) {
            this.searchInfo = null
            this.searchInfo = row
        },
        headClass({row, column, rowIndex, columnIndex}) {
            return 'background:#36c2aa;'
        },
        submitForm(formName) {
            let idCardFlag = !!this.ruleForm.idcard
            let user = !!this.ruleForm.patient || !!this.ruleForm.insiderphone
            if (user || idCardFlag || this.ruleForm.time) {
                let time = this.getPastHalfYear()
                let [ begin = '', end = '' ] = this.ruleForm.time
                let parms = {
                    ...this.ruleForm,
                    begininputdate: begin,
                    endinputdate: end,
                    companyid: this.userInfo.companyid,
                    pageIndex: '',
                    pageSize: '',
                    approvalstatus: 1
                }
                this.$store.dispatch('chronicDisease/saveNcdInfo', parms)
                    .then(data => {
                        console.log(data)
                        this.tableData = data.list
                        this.dialogFormVisible = true
                    }).catch(err => {
                    console.log(err)
                })
            } else {
                this.$message.warning("请至少填写一个查询条件")
            }
        },
        resetForm(formName) {
            this.$refs[ formName ].resetFields()
        },
        getPastHalfYear() {
            // 先获取当前时间
            var curDate = ( new Date() ).getTime()
            console.log(curDate)
            // 将半年的时间单位换算成毫秒
            var halfYear = 365 / 2 * 24 * 3600 * 1000
            var pastResult = curDate - halfYear  // 半年前的时间（毫秒单位）

            // 日期函数，定义起点为半年前
            var pastDate = new Date(pastResult),
                pastYear = pastDate.getFullYear(),
                pastMonth = pastDate.getMonth() + 1,
                pastDay = pastDate.getDate()

            var now = new Date(curDate),
                curYear = now.getFullYear(),
                curtMonth = now.getMonth() + 1,
                curtDay = now.getDate()
            return {
                endprescriptiondate: curYear + '-' + curtMonth + '-' + curtDay,
                beginprescriptiondate: pastYear + '-' + pastMonth + '-' + pastDay,
            }
        }
    },
    created() {
        this.$store.commit('app/SET_ROUTER', '/home/chronicDisease/index')
        var curDate = ( new Date() ).getTime()
        var now=new Date()
        var halfYear = 365 / 2 * 24 * 3600 * 1000
        var pastResult =new Date(curDate - halfYear);   // 半年前的时间（毫秒单位）
        this.ruleForm.time=[pastResult,now]
    }
}
</script>

<style>
    .vxe-table--tooltip-wrapper.theme--dark {
        z-index : 2500 !important;
    }
</style>
<style lang="scss" scoped>
    .search {
        height: 100%;
        min-height: 600px;

        .box-card {
            height: 100%;

            & /deep/ .el-card__body {
                display: flex;
                flex-direction: row;
                /*justify-content: space-between;*/
                /*align-items: center;*/
                height: 100%;
                min-height: 500px;
                overflow-y: auto;
                .left {
                    border: 1px solid #BFBFBF;
                    height: 100%;
                    width: 300px;
                    padding-top: 80px;
                    text-align: center;

                    p {
                        height: 100px;
                        line-height: 100px;
                        font-size: 28px;
                    }
                }

                .right {
                    padding-top: 80px;
                    width: 600px;

                    .footer {
                    }
                }
            }

        }
    }
</style>
