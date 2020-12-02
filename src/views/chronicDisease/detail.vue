<template>
    <div class="detail">
        <el-card class="box-card">
            <div class="left">
                <el-button style="margin-bottom: 15px;" @click="goBack">返回</el-button>
                <div class="card">
                    <div>
                        <el-row :gutter="10">
                            <el-col class="mb10" :span="12">
                                <div class="grid-content bg-purple">
                                    患者姓名:{{ncdInfo.patient}}
                                </div>
                            </el-col>
<!--                            <el-col class="mb10" :span="12">-->
<!--                                <div class="grid-content bg-purple">-->
<!--                                    性别:{{ncdInfo.sex }}-->
<!--                                </div>-->
<!--                            </el-col>-->
                            <el-col class="mb10" :span="12">
                                <div class="grid-content bg-purple">
                                    联系电话:{{ncdInfo.insiderphone }}
                                </div>
                            </el-col>
<!--                            <el-col class="mb10" :span="12">-->
<!--                                <div class="grid-content bg-purple">-->
<!--                                    年龄:{{ncdInfo.age }}-->
<!--                                </div>-->
<!--                            </el-col>-->
                            <el-col class="mb10 last-col" :span="24">
                                <div class="grid-content purple">
                                    病症诊断:
                                    <div class="zd">
                                        {{ncdInfo.diagnosis}}
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="img1">
                        <el-image
                            style="width: 100%;height: 100%"
                            :src="ncdInfo.imageurl[0]"
                            :preview-src-list="ncdInfo.imageurl">
                        </el-image>
                    </div>
                </div>
            </div>
            <div class="border1"></div>
            <div class="right">
                <div><span>购药明细</span>
                    <el-button style="margin-bottom: 15px;margin-left: 15px;" @click="buy">再次购买</el-button>
                </div>
                <div class="bottom-BOX">
                    <vxe-table
                      height="95%"
                        border
                        ref="tableData"
                        :header-cell-style="headClass"
                        highlight-current-row
                        :data="tableData">
                        <vxe-table-column type="index" title="序号" width="60"></vxe-table-column>
                        <vxe-table-column field="credate" title="购买时间"></vxe-table-column>
                        <vxe-table-column field="effectivedays" title="距离处方有效购药时间"></vxe-table-column>
                        <vxe-table-column field="inputmanname" title="建档人"></vxe-table-column>
                        <vxe-table-column field="validityday" formatter="toDateString"
                                          title="有效期"></vxe-table-column>
                    </vxe-table>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'

export default {
    name: "detail",
    data() {
        return {
            prescriptionid: null,
            tableData: [],
        }
    },
    computed: {
        ...mapGetters([ 'ncdInfo' ])
    },
    created() {
        console.log(this.ncdInfo);
        console.log('门店圭');
        this.$store.commit('app/SET_ROUTER', '/home/chronicDisease/index')
        this.prescriptionid = this.$route.query.prescriptionid
        this.getList(this.prescriptionid)
        console.log(this.ncdInfo.prescriptionid)
        console.log(this.ncdInfo.inputmanid)
        console.log(this.ncdInfo.companyid)
    },
    methods: {
        ...mapActions(
            {
                getpurchaseRecord: 'chronicDisease/getpurchaseRecord',
                buyAgain: 'chronicDisease/buyAgain',
            }
        ),
        goBack() {
            this.$router.back(-1)
        },
        headClass({row, column, rowIndex, columnIndex}) {
            return 'background:#36c2aa;'
        },
        async buy() {
            const {prescriptionid, companyid, inputmanid} = this.ncdInfo
            await this.buyAgain({prescriptionid, companyid, inputmanid})
            await this.getList(prescriptionid)
            setTimeout(()=>{
                this.$router.push({
                    path: '/dashboard'
                })
            },3000)
        },
        async getList(prescriptionid) {
            this.tableData = await this.getpurchaseRecord({prescriptionid})
        }
    }
}
</script>

<style scoped lang="scss">
    .detail {
        height: 100%;

        .box-card {
            height: 100%;

            & /deep/ .el-card__body {
                display: flex;
                flex-direction: row;
                /*justify-content: space-between;*/
                /*align-items: center;*/
                justify-items: center;
                align-items: center;
                height: 100%;

                .left {
                    border: 1px solid #BFBFBF;
                    height: 100%;
                    width: 500px;
                    padding: 20px 20px 0px 20px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);

                    .card {
                        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
                        height: 400px;
                        padding: 10px;

                        .mb10 {
                            margin-bottom: 10px;
                        }

                        .last-col {
                            max-height: 70px;

                            .purple {
                                .zd {
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    display: -webkit-box;
                                    -webkit-line-clamp: 4;
                                    -webkit-box-orient: vertical;
                                    padding-left: 60px;
                                }
                            }
                        }

                        .img1 {
                            height: 400px;
                        }
                    }

                }

                .border1 {
                    height: 80%;
                    /*margin-top: 4%;*/
                    margin-left: 50px;
                    border: 1px dashed #454545;
                }

                .right {
                    align-self: flex-start;
                    padding-top: 20px;
                    flex: 1;
                    min-width: 600px;
                    padding-left: 50px;
                    height: 100%;
                    display: flex;
                    flex-direction: column;

                    .bottom-BOX {
                        flex: 1;
                    }
                }
            }

        }
    }
</style>
