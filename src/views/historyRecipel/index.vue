<template>
    <div class="historyRecipel">
        <div class="timeCon">
            <div class="before" v-show="flage===false">
                <div class="loading">
                    <img
                        src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1576062520511&di=00fac763d7cf79087aedfed389e8754c&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0152395be39c37a80121ab5d479b6c.gif"
                        alt="">
                </div>
                <div class="time">
                    <p>请稍后正在为您匹配合适的药师</p>
                    <p>{{time}}</p>
                    <el-button style="width: 200px;" @click="goBack" class="search">返回</el-button>
                </div>
            </div>
        </div>
        <div style="clear: both"></div>
        <div v-if="flage === true">
            <div class="form-serch">
                <el-form :inline="true" class="left" :model="formInline" label-width="100px" style="margin-top: 20px!important;">
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
                </el-form>
                <el-form class="right" style="margin-right: 10px">
                    <el-form-item>
                        <el-button @click="moreSearch">更多</el-button>
                        <el-button class="search" type="success" @click="search">查询</el-button>
                        <el-button @click="clearBtn">清空</el-button>

                        <div class="submit-right" style="margin-top: 6px;text-align: center">
                            <el-button @click="printSelectEvent">打印</el-button>
                            <el-button @click="downs">下载</el-button>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table" style="height: calc(100% - 145px)">
                <div class="left">
                    <div style="height: 58px;">
                        <span>
                            处方列表共 {{toatal}} 条
                        </span>
                        <div style="margin: 6px 0;"></div>
                        <el-checkbox-group style="padding: 5px" v-model="checkedCities" @change="handleCheckedCitiesChange">
                            <el-checkbox v-for="type in types" :label="type.label" :key="type.label">{{type.value}}
                            </el-checkbox>
                        </el-checkbox-group>
                    </div>
                    <vxe-table
                        height="320px"
                        :loading="loading"
                        border
                        resizable
                        show-overflow
                        ref="tableData"
                        :header-cell-style="headClass"
                        :sort-config="{trigger: 'cell', defaultSort: {field: 'prescriptionno'}}"
                        highlight-hover-row
                        @cell-click="rowChose"
                        @edit-actived="editActivedEvent"
                        :edit-config="{trigger: 'click', mode: 'row',showStatus: true, icon: 'fa fa-edit'}"
                        :data="tableData">
                        <vxe-table-column type="checkbox" width="60" fixed="left"></vxe-table-column>
                        <vxe-table-column type="index" title="序号" width="60"></vxe-table-column>
                        <vxe-table-column field="inputdate" title="制单时间" sortable width="100"
                                          formatter="toDateString"></vxe-table-column>
                        <vxe-table-column field="prescriptionno" sortable title="处方单号" width="100"></vxe-table-column>
                        <vxe-table-column field="patient" title="患者姓名" :edit-render="{name: 'input',attrs: {disabled: false}}" sortable min-width="100px"></vxe-table-column>
                        <vxe-table-column field="idcard" title="身份证号" sortable width="100"></vxe-table-column>
                        <vxe-table-column field="insiderphone" title="联系方式" :edit-render="{name: 'input',attrs: {disabled: false}}" sortable min-width="100px">
                            <template v-slot="{ row }">
                                <template>
                                    {{row.insiderphone}}
                                    <!--{{row.insiderphone |formatPhone}}-->
                                </template>
                            </template>
                        </vxe-table-column>
                        <vxe-table-column field="prescriptiontype" sortable width="100" title="处方类型"
                                          :formatter="prescriptiontype"></vxe-table-column>
                        <vxe-table-column field="attribute" title="处方属性" sortable width="100"
                                          :formatter="attribute"></vxe-table-column>
                        <vxe-table-column field="comefrom" title="处方来源" sortable width="100"
                                          :formatter="comefrom"></vxe-table-column>
                        <vxe-table-column field="approvalstatus" sortable width="100" title="审核状态"
                                          :formatter="approvalstatus"></vxe-table-column>
                        <vxe-table-column field="reason" title="审批意见" sortable width="100"></vxe-table-column>
                        <vxe-table-column field="pharmacistname" title="审方药师" sortable width="100"></vxe-table-column>
                        <vxe-table-column field="pointapprovalstatus"  width="120" sortable :formatter="pointapprovalstatusM" title="门店审核状态"></vxe-table-column>
                        <vxe-table-column field="pointapprovalman"  width="120" sortable title="门店审核人"></vxe-table-column>
                        <vxe-table-column field="dispensemanname" title="调配药师" sortable width="100"></vxe-table-column>
                        <vxe-table-column field="checkmanname" title="复核药师" sortable width="100"></vxe-table-column>
                        <vxe-table-column title="操作" width="100" fixed="right">
                            <template v-slot="{ row }">
                                <template>
                                    <div @click="lookEvent(row)"
                                         style="color: #00ffff;line-height: 30px;cursor: pointer">查看处方
                                    </div>
                                </template>
                            </template>
                        </vxe-table-column>
                        <vxe-table-column title="审方视频" width="120" fixed="right">
                            <template v-slot="{ row }">
                                <el-button :disabled="row.approvalvideourl == ''" @click.stop="lookVedio(row)" type="mini">审方视频</el-button>
                            </template>
                        </vxe-table-column>
                        <vxe-table-column title="呼叫执业药师" width="120" fixed="right">
                            <template v-slot="{ row }">
                                <el-button size="small" :disabled="row.approvalstatus == 1 || row.approvalstatus == 2 || row.approvalMode == 2" @click="callVideo(row)">呼叫</el-button>
                            </template>
                        </vxe-table-column>
                        <vxe-table-column field="goodsname" title="药品名称" sortable width="100"></vxe-table-column>
                        <vxe-table-column field="goodstype" title="规格" sortable width="100"></vxe-table-column>
                        <vxe-table-column field="factoryname" title="生产厂商" sortable width="100"></vxe-table-column>
                        <vxe-table-column field="lotno" title="生产批号" sortable width="100"></vxe-table-column>
                        <vxe-table-column field="goodsqty" title="数量" sortable width="100"></vxe-table-column>

                    </vxe-table>
                    <div style="height: 2%">&nbsp;</div>
                    <vxe-table
                        border
                        resizable
                        :loading="loading2"
                        ref="dtltableData"
                        :header-cell-style="headClass"
                        :edit-config="{trigger: 'click', mode: 'row'}"
                        :data="dtlData">
                        <vxe-table-column type="checkbox" width="60" fixed="left"></vxe-table-column>
                        <vxe-table-column type="index" title="序号" width="60"></vxe-table-column>
                        <vxe-table-column sortable field="goodsid" title="商品ID"></vxe-table-column>
                        <vxe-table-column sortable field="goodsname" title="药品名"></vxe-table-column>
                        <vxe-table-column sortable field="goodstype" title="商品规格"></vxe-table-column>
                        <vxe-table-column sortable field="goodsqty" title="数量"></vxe-table-column>
                        <vxe-table-column sortable field="factoryname" width="180px" title="生产企业">
                            <template v-slot="{ row }">
                                <el-input v-model="row.factoryname" style="width: 140px;"></el-input>
                            </template>
                        </vxe-table-column>
                        <vxe-table-column sortable field="lotno" width="180px" title="生产批号">
                            <template v-slot="{ row }">
                                <el-input v-model="row.lotno" style="width: 140px;"></el-input>
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
                        style="width: 100%;height: 55vh"
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
                    </el-form-item>
                    <br />
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
        </div>
        <!--视频-->
        <el-dialog title="审方视频" :visible.sync="vedioVisible" :close-on-click-modal="false" :showClose="false">
            <div ref="player" id="play-box">
                <video id="player-container-id" preload="auto" style="width: 100%" height="360" playsinline webkit-playsinline>
                </video>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="vedioClose">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import dayjs                    from 'dayjs'
import print                    from 'print-js'
export default {
    name: "index",
    data() {
        return {
            time: 120,
            timeOut: '',
            loading: true,
            tableData: [],
            checkAll: false,
            checkedCities: [],
            types: [ {
                label: '2',
                value: '慢病处方',
            },
                {
                    label: '3',
                    value: '特殊药品处方',
                } ],
            url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
            imageurl: [],
            dispensestatus: [
                {
                    value: '',
                    label: '全部'
                },
                {
                    value: '1',
                    label: '调配完成'
                },
                {
                    value: '2',
                    label: '不调配'
                }
            ],
            approvalstatusList: [
                { value: '', label: '全部'},
                { value: '0', label: '待审核'},
                { value: '1', label: '审核通过'},
                { value: '2', label: '审核不通过'},
                { value: '4', label: '驳回'}
            ],
            formInline: {
                goodsname: '',
                insiderphone: '',
                patient: '',
                region: '',
                dispensestatus: '',//调配
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
            },
            flage: true,
            moreVisible: false,
            handleCheckAllChange(val) {
                // this.checkedCities = val ? cityOptions : []
                // this.isIndeterminate = false
            },
            handleCheckedCitiesChange(value) {
                console.log(value)
                // let checkedCount = value.length
                // this.checkAll = checkedCount === this.cities.length
                // this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
            },
            vedioVisible: false,
            dtlData: [],
            loading2: false,
            docData: {},
            docChange: false,
            source: ''
        }
    },
    sockets: {
        connect: function () {
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
            if (data.type == 1) {
                clearInterval(this.setInterval)
                this.$router.push({
                    path:'/home/videopage'
                })
                this.$store.commit('user/SET_PHARMACISTINFO', data)
            }
        },
        cancelCallback: function (data) {
            if (data.status === 200) {
                clearInterval(this.setInterval)
                this.flage = true
                // window.location.reload();
            }else if (data.status === 400) {
                this.$message.warning(data.msg)
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
    methods: {
        ...mapActions(
            {
                findList: 'pharmacyAudit/finddoc',
                findDtl: 'pharmacyAudit/finddtl',
                savedtl: 'pharmacyAudit/savedtl',
                downloadfile: 'pharmacyAudit/downloadfile',
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
        goBack() {
            this.$socket.emit('cancelCall', JSON.stringify({
                userid: this.userInfo.userid, companyid: this.userInfo.companyid
            }))
        },
        moreSearch(){
            this.moreVisible = true
        },
        throttle(fn, wait) {
            console.log(1111)
            var timer = null
            var startTime = Date.now()
            return function () {
                var curTime = Date.now()
                var remaining = wait - ( curTime - startTime )
                var context = this
                var args = arguments
                clearTimeout(timer)
                if (remaining <= 0) {
                    fn.apply(context, args)
                    startTime = Date.now()
                } else {
                    timer = setTimeout(fn, remaining)
                }
            }
        },
        sortNameMethod(a, b) {
            // 例如：名称不区分大小写的排序
            /*            var v1 = (a.prescriptionno || '').toLowerCase()
                        var v2 = (b.prescriptionno || '').toLowerCase()
                        return v1 < v2 ? -1 : v1 > v2 ? 1 : 0*/
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
            window.addEventListener("mousemove", this.handle, true)
            // window.addEventListener("keyup", this.throttle(this.handle, 2000), true);
            // window.addEventListener("mouseup", this.throttle(this.handle, 2000), true);
            // window.addEventListener("click", this.throttle(this.handle, 2000), true);
            // window.addEventListener("touchend", this.throttle(this.handle, 2000), true);
            // window.addEventListener('resize', this.throttle(this.handle, 2000))
            // window.addEventListener('scroll', this.throttle(this.handle, 2000))
        },
        attribute(row) {
            let {cellValue} = row
            return cellValue = cellValue === '1' ? '普通处方' : cellValue = cellValue === '2' ? '慢病处方' : '特药处方'
        },
        approvalstatus(row) {
            // 0 待审核  1审核通过 2审核拒绝
            let {cellValue} = row
            if (cellValue === '0') {
                return '待审核'
            } else if(cellValue === '1') {
                return '审核通过'
            } else if(cellValue === '2') {
                return '审核不通过'
            } else if(cellValue===  '4') {
                return '驳回'
            }
            // return cellValue = cellValue === '0' ? '待审核' : cellValue = cellValue === '2' ? '审核不通过' : '审核通过'

        },
        rowChose (val) {
            console.log(val);
            let row = val.row
            this.docData = row
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

        dtlEdit (row) {
            console.log(row);
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
        comefrom(row) {
            // 1:拍照处方，2:电子处方
            let {cellValue} = row
            return cellValue === '1' ? '拍照处方' : '电子处方'
        },
        prescriptiontype(row) {
            // 1 西药 2 草药
            let {cellValue} = row
            return cellValue === '1' ? '西药' : '草药'
        },
        // 呼叫执业药师
        callVideo (row) {
            console.log(row);
            let that = this
            that.flage = false
            that.time = 120
            that.$store.commit('user/SET_REMOTELEAVE', false)
            this.$socket.emit('getPharmacist', JSON.stringify({
                userid: this.userInfo.userid,
                companyid: this.userInfo.companyid,
                prescriptionid: row.prescriptionid
            }))
            that.setInterval = setInterval(() => {
                that.time--
                if (that.time <= 0) {
                    that.$socket.emit('cancelCall', JSON.stringify({
                        userid: this.userInfo.userid,
                        companyid: this.userInfo.companyid
                    }))
                    clearInterval(that.setInterval)
                    that.flage = true
                    that.$store.commit('app/SET_CALLFLAGE', false)
                    that.time = '链接超时'
                }
            }, 1000)
            // this.$router.push({
            //     path: '/home/videopage',
            //     query: ({id: row.prescriptionid})
            // })
        },
        lookVedio (row) {
            this.vedioVisible = true
            console.log(row);
            console.log(row.approvalvideourl);
            console.log(row.appid);
            this.$nextTick(()=>{
                this.player = TCPlayer('player-container-id', {
                    fileID: row.approvalvideourl,
                    appID: row.appid,
                    plugins: {
                        ProgressMarker: true
                    }
                });
            })
        },
        vedioClose () {
            this.player.dispose()
            let player = this.$refs.player
            let newView = document.createElement('video')
            newView.style.width = '100%'
            newView.setAttribute('height', '360')
            newView.setAttribute('playsinline', 'true')
            newView.setAttribute('webkit-playsinline', 'true')
            newView.setAttribute('id', 'player-container-id')
            player.appendChild(newView)
            this.vedioVisible = false
        },
        //查看处方
        lookEvent(row) {
            console.log(row)
            this.imageurl = row.imageurl
            this.source = row.source
        },
        headClass({row, column, rowIndex, columnIndex}) {
            return 'background:#36c2aa;'
        },
        search() {
            // this.$refs.tableData.recalculate()
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
        onSubmit() {
            console.log('submit!')
        },
        editActivedEvent({row}) {
            console.log(row)
            let xTable = this.$refs.tableData
            // attribute
            let patientColumn = xTable.getColumnByField('patient')
            let phoneColumn = xTable.getColumnByField('insiderphone')

            let patientDisabled = row.attribute !== '1'
            let phoneDisabled = row.attribute !== '1'

            patientColumn.editRender.attrs.disabled = patientDisabled
            phoneColumn.editRender.attrs.disabled = phoneDisabled
        },
        activeCellMethod() {},

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
            }
        },
        getList() {
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
                this.tableData = res.list
                this.loading = false
            }).catch(err => {
                console.log(err)
                this.loading = false
            })
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
        pointapprovalstatusM(row){
            let {cellValue} = row
            return cellValue === '1' ? '已审核' : '未审核'
        },
        //打印处方
        printSelectEvent() {
            if (this.choseList.length !== 1) {
                this.$message.warning("请选择一条数据进行打印")
            } else {
                print({printable: this.choseList[ 0 ].imageurl, type: 'image', header: ''})
            }
        }
    },
    created() {
        this.isTimeOut()
        this.formInline.approvaldate =dayjs().format('YYYY-MM-DD')
        this.formInline.beginapprovaldate = dayjs().format('YYYY-MM-DD')
        this.formInline.endapprovaldate = dayjs().format('YYYY-MM-DD')
        this.search()
    },
    watch: {
        flage (val) {
            console.log(val);
            if (!val) {
                this.handle()
            }
        }
    },
    destroyed() {
        clearInterval(this.timeOut)
        window.removeEventListener("mousemove", this.handle, true)
    }
}
</script>
<style>
    .form-serch .left >>>.el-form-item{
        margin-right: 0!important;
    }
</style>
<style scoped lang="scss">
    .timeCon{
        .before {
            width: 30%;
            display: flex;
            flex-direction: column;
            justify-content: center;
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
    }
    .historyRecipel {
        height: 100%;
        width: 100%;
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
            width: 200px !important;
        }
        .form-serch {
            height: 145px;
            display: flex;
            flex-wrap: wrap;
            /*justify-content: space-around;*/
            justify-content:space-between;
            align-items: center;
            border: 1px solid #c9c9c9;
            box-sizing: border-box;
            .left{
            }
            .right {}
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
            }
        }
    }
</style>
