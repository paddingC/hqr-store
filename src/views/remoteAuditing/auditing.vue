<script src="../../store/getters.js"></script>
<template>
    <!--<div class="auditing" style="height: 100%">-->
    <!--<p style="font-size: 16px;line-height: 20px;margin-bottom: 10px;">请将您的处方放置在处方采集设备下,并摆放整齐,确认处方无误后点击发送处方</p>-->
    <!--<el-steps :active="active" finish-status="success">-->
    <!--<el-step title="上传处方"></el-step>-->
    <!--<el-step title="远程审方"></el-step>-->
    <!--</el-steps>-->
    <!--<el-divider class="divider"></el-divider>-->
    <!--<div class="main2" v-show="active===1">-->
    <!--<div class="photo">-->
    <!--<img v-if="userInfo.highShotMeterType === '2' || userInfo.highShotMeterType === '3' || userInfo.highShotMeterType === '4'" id="bigPriDev" style="width: 100%;height: 100%" alt="">-->
    <!--<div v-if="userInfo.highShotMeterType === '1'" id="bigPriDev1"></div>-->
    <!--<div v-if="userInfo.highShotMeterType === '1'">-->
    <!--设备：<select id="DeviceName" name="D1" onchange="ChangeDevice()" style=" width: 180px;height: 42px;line-height: 42px;border-radius: 5px;margin: 12px;"></select>-->
    <!--</div>-->
    <!--</div>-->
    <!--<div class="form2">-->
    <!--<el-form :model="form" ref="form2" label-width="200px" class="demo-ruleForm">-->
    <!--<el-form-item label="处方类型" prop="resource">-->
    <!--<el-radio-group v-model="form2.type">-->
    <!--<el-radio v-for="item in comefrom"-->
    <!--:key="item.value"-->
    <!--:label="item.value"-->
    <!--&gt;-->
    <!--{{item.label}}-->
    <!--</el-radio>-->
    <!--</el-radio-group>-->
    <!--</el-form-item>-->
    <!--<span v-if="userInfo.highShotMeterType === '2' || userInfo.highShotMeterType === '3' || userInfo.highShotMeterType === '4'">-->
    <!--<el-button id="photographPriAudio" v-show="conactAgain===false" :disabled="clickPhoto" style="margin-left: 131px;margin-bottom: 22px;" class="search">拍照</el-button>-->
    <!--</span>-->
    <!--<span v-if="userInfo.highShotMeterType === '1'">-->
    <!--<el-button @click="capPhoto" v-show="conactAgain===false" :disabled="clickPhoto" style="margin-left: 131px;margin-bottom: 22px;" class="search">拍照</el-button>-->
    <!--</span>-->

    <!--<el-button v-show="conactAgain" style="margin-left: 131px;margin-bottom: 22px;" class="search" @click="takePhoto">重新呼叫</el-button>-->
    <!--<div class="fileDiv1" v-if="upImgClick">-->
    <!--<el-button class="fileDiv2">上传本地</el-button>-->
    <!--<input class="file_input" type="file" ref="fileBtn" @change="Preview" />-->
    <!--</div>-->
    <!--<el-button v-else disabled="disabled" style="margin-left: 120px;">上传本地</el-button>-->

    <!--<div style="margin-left: 131px;margin-bottom: 22px;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);" class="demo-image__preview">-->
    <!--<el-image-->
    <!--style="width: 500px; height: 350px"-->
    <!--:src="url[0]"-->
    <!--:preview-src-list="url">-->
    <!--<div slot="error" class="image-slot" style="height: 100%;display: flex;justify-content: center;align-items: center;">-->
    <!--<i style="font-size: 50px" class="el-icon-picture-outline"></i>-->
    <!--</div>-->
    <!--</el-image>-->
    <!--</div>-->
    <!--</el-form>-->
    <!--</div>-->
    <!--</div>-->
    <!--<div class="main3" v-show="active===2">-->
    <!--<div class="before" v-show="logins">-->
    <!--<div class="loading">-->
    <!--<img-->
    <!--src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1576062520511&di=00fac763d7cf79087aedfed389e8754c&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0152395be39c37a80121ab5d479b6c.gif"-->
    <!--alt="">-->
    <!--</div>-->
    <!--<div class="time">-->
    <!--<p>请稍后正在为您匹配合适的药师</p>-->
    <!--<p>{{time}}</p>-->
    <!--<el-button style="width: 200px;" @click="goBack" :disabled="isclick" class="search">返回</el-button>-->
    <!--</div>-->
    <!--</div>-->
    <!--<div class="conact-success" v-show="logins===false">-->
    <!--<div class="left-BOX">-->
    <!--&lt;!&ndash;                    <div @click="goRoom"> 11111111</div>&ndash;&gt;-->
    <!--<el-popover-->
    <!--placement="top-start"-->
    <!--title="证书图片"-->
    <!--trigger="hover"-->
    <!--:placement="placement"-->
    <!--content="点击查看全部图片">-->
    <!--<el-image-->
    <!--slot="reference"-->
    <!--style="height: 50%;"-->
    <!--:src="certificate[0]"-->
    <!--alt="证书图片"-->
    <!--:preview-src-list="certificate">-->
    <!--</el-image>-->
    <!--</el-popover>-->
    <!--<div style="height: 50%;">-->
    <!--<el-popover-->
    <!--placement="top-start"-->
    <!--title="处方图片"-->
    <!--trigger="hover"-->
    <!--:placement="placement"-->
    <!--content="点击查看全部图片">-->
    <!--<el-image-->
    <!--slot="reference"-->
    <!--style="height: 100%"-->
    <!--:src="recipelList[0]"-->
    <!--alt="处方图片"-->
    <!--:preview-src-list="recipelList">-->
    <!--</el-image>-->
    <!--</el-popover>-->
    <!--</div>-->
    <!--</div>-->
    <!--<div class="right-Box" id="remote_stream" style="position: relative;">-->
    <!--<div class="local" id="local_stream"-->
    <!--style="position: absolute; z-index: 9999;width: 200px;height: 200px;background-color: #f0f8fa;right: 0;bottom: 0px"></div>-->
    <!--</div>-->
    <!--<div style="position: absolute;bottom: 105px;left: 40%">-->
    <!--<label style="margin-left: 95px">切换摄像头&nbsp;&nbsp;</label>-->
    <!--<el-select v-model="chooseValue" @change="changeCamera" placeholder="请选择" >-->
    <!--<el-option-->
    <!--v-for="(item, index) in options"-->
    <!--:key="item.deviceId"-->
    <!--:label="item.label"-->
    <!--:value="index">-->
    <!--</el-option>-->
    <!--</el-select>-->
    <!--<el-button v-if="remoteLeave" @click="leaveRoom" style="margin-left: 25px">退出</el-button>-->
    <!--<el-button v-else disabled="disabled" style="margin-left: 25px">退出</el-button>-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->
    <div class="auditingMain" style="height: 100%">
        <el-steps :active="active" finish-status="success" simple style="margin-top: 20px">
            <el-step title="上传处方"></el-step>
            <el-step v-if="userInfo.beforeApproval == '1'" title="维护药品"></el-step>
            <el-step title="远程审方"></el-step>
        </el-steps>
        <!--步骤一-->
        <div class="stepMain_one" v-show="active===1">
            <el-row :gutter="20">
                <el-col :span="12">
                    <div class="stepMain_oneL">
                        <div class="stepMain_oneL_top">
                            高拍仪&nbsp;&nbsp;
                            <span>{{highShotMeterType}}</span>
                            <a @click="goEdit">去修改</a>
                            <!--devices为所有设备，sCapheight为良田能兼容的设备-->
                            <span v-if="userInfo.highShotMeterType === '1'">
                                <el-button id="d_changeCamera" @click="dCapheight" v-show="devices.length > 1" class="btnNocur" style="float: right;padding: 6px 12px;margin-top: 6px;font-size: 12px" size="small">切换摄像头</el-button>
                            </span>
                            <span v-else>
                                <el-button id="changeCamera" v-show="devices.length > 1 && sCapheight.length > 1" class="btnNocur" style="float: right;padding: 6px 12px;margin-top: 6px;font-size: 12px" size="small">切换摄像头</el-button>
                            </span>
                        </div>
                        <!--调用高拍仪实时画面-->
                        <div class="stepMain_oneL_bottom">
                            <img v-if="userInfo.highShotMeterType === '2' || userInfo.highShotMeterType === '3' || userInfo.highShotMeterType === '4'" id="bigPriDev" alt="">
                            <div v-if="userInfo.highShotMeterType === '1'" id="bigPriDev1"></div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="stepMain_oneR">
                        <div class="stepMain_oneR_top">
                            <el-radio-group v-model="form2.type">
                                <el-radio v-for="item in comefrom" :key="item.value" :label="item.value">
                                    {{item.label}}
                                </el-radio>
                            </el-radio-group>
                            <!--良田-->
                            <span v-if="userInfo.highShotMeterType === '2' || userInfo.highShotMeterType === '3' || userInfo.highShotMeterType === '4'">
                                <el-button id="photographPriAudio" v-show="conactAgain===false" :disabled="clickPhoto" style="padding: 6px 12px;margin-top: 6px;font-size: 12px;margin-left: 32px;background: #36c2aa;color: #fff" size="small" class="search">拍照</el-button>
                            </span>
                            <!--点易拍-->
                            <span v-if="userInfo.highShotMeterType === '1'">
                                <el-button @click="capPhoto" v-show="conactAgain===false" :disabled="clickPhoto" style="padding: 6px 12px;margin-top: 6px;font-size: 12px;margin-left: 32px;background: #36c2aa;color: #fff" size="small" class="search">拍照</el-button>
                            </span>

                            <el-button v-show="conactAgain" style="padding: 6px 12px;margin-top: 6px;font-size: 12px;margin-left: 32px;" size="small" @click="takePhoto">下一步</el-button>
                            <div class="fileDiv1" v-if="upImgClick">
                                <el-button class="fileDiv2" style="padding: 6px 12px;margin-top: 6px;font-size: 12px;margin-left: 32px;background: #36c2aa;color: #fff">上传本地</el-button>
                                <input class="file_input" type="file" ref="fileBtn" @change="Preview" />
                            </div>
                            <el-button v-else disabled="disabled" style="padding: 6px 12px;margin-top: 6px;font-size: 12px;margin-left: 32px;background: #36c2aa;color: #fff" size="small">上传本地</el-button>
                        </div>
                        <!--拍照显示图-->
                        <div class="stepMain_oneR_bottom">
                            <el-image
                                style="width: 100%; height: 100%"
                                :src="url[0]"
                                :preview-src-list="url">
                                <div slot="error" class="image-slot" style="height: 100%;display: flex;justify-content: center;align-items: center;">
                                    <i style="font-size: 50px;color: #efefef"></i>
                                </div>
                            </el-image>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!--步骤二-->
        <div class="stepMain_two" v-show="active===2  &&  userInfo.beforeApproval == '1'">
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="stepMain_twoL">
                        <div class="stepMain_twoL_top">
                            <el-button class="active_btn" @click="goBackOne">返回上一步</el-button>
                            <el-radio-group v-model="form2.type" style="float: right;line-height: 46px">
                                <el-radio v-for="item in comefrom" :key="item.value" :label="item.value" disabled="disabled">
                                    {{item.label}}
                                </el-radio>
                            </el-radio-group>
                        </div>
                        <div class="stepMain_twoL_bottom">
                            <el-image
                                style="width: 100%; height: 100%"
                                :src="url[0]"
                                :preview-src-list="url">
                                <div slot="error" class="image-slot" style="height: 100%;display: flex;justify-content: center;align-items: center;">
                                    <i style="font-size: 50px;color: #efefef"></i>
                                </div>
                            </el-image>
                        </div>
                    </div>
                </el-col>
                <el-col :span="16">
                    <div class="stepMain_twoR">
                        <div class="stepMain_twoR_top">
                            <el-button @click="addDrugs" class="active2_btn">新增</el-button>
                            <el-button @click="dtlDelete" class="active2_btn">删除</el-button>
                            <el-button @click="callPharmacist" type="warning" class="active2_btn" style="float: right;margin-top: 8px">远程审方</el-button>
                        </div>
                        <div class="stepMain_twoR_bottom">
                            <vxe-table
                                border
                                v-loading="tableLoading"
                                ref="tableData"
                                :header-cell-style="headClass"
                                highlight-hover-row
                                :edit-config="{trigger: 'click', mode: 'row',showStatus: true, icon: 'fa fa-edit'}"
                                :data="tableData">
                                <vxe-table-column type="checkbox" width="52" fixed="left"></vxe-table-column>
                                <vxe-table-column type="index" title="序号" width="52"></vxe-table-column>
                                <vxe-table-column field="goodsname" title="药品名称"></vxe-table-column>
                                <vxe-table-column field="goodstype" title="商品规格"></vxe-table-column>
                                <vxe-table-column field="goodsunit" title="基本单位"></vxe-table-column>
                                <vxe-table-column field="prodarea" title="产地"></vxe-table-column>
                                <vxe-table-column field="goodsqty" title="数量" width="180px">
                                    <template v-slot="{ row }">
                                        <el-input-number :min="1" v-model="row.goodsqty" style="width: 140px;"></el-input-number>
                                    </template>
                                </vxe-table-column>
                                <vxe-table-column field="yfyl" title="用法用量" width="240px">
                                    <template v-slot="{ row }">
                                        <el-autocomplete
                                            class="inline-input1"
                                            v-model="row.yfyl"
                                            filterable
                                            allow-create
                                            default-first-option
                                            :fetch-suggestions="querySearchYfyl"
                                        ></el-autocomplete>
<!--                                        <el-input v-model="row.yfyl" style="width: 180px;"></el-input>-->
<!--                                            <el-select v-model="scope.row.dosage">-->
<!--                                                <el-option-->
<!--                                                    v-for="(item, index) in dosageArr"-->
<!--                                                    :key="index"-->
<!--                                                    :label="item.dosage"-->
<!--                                                    :value="item.dosage">-->
<!--                                                </el-option>-->
<!--                                            </el-select>-->
                                    </template>
                                </vxe-table-column>
                                <vxe-table-column title="操作"  width="120" fixed="right">
                                    <template v-slot="{ row }">
                                        <div @click="dtlEdit(row)" style="color: #00ffff;display: inline-block;width: 42px;line-height: 30px;cursor: pointer">保存</div>
                                        <div @click="delEdit(row)" v-if="row.prescriptiondtlid == undefined" style="color: #f00;width: 42px;display: inline-block;line-height: 30px;cursor: pointer">移除</div>
                                    </template>
                                </vxe-table-column>
                            </vxe-table>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!--步骤三-->
        <div class="stepMain_three" v-show="active === 3">
            <div class="before" v-show="logins">
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
            <el-row :gutter="20" v-show="logins===false">
                <el-col :span="8">
                    <div class="stepMain_threeL">
                        <div class="stepMain_threeL_top">
                            <el-button @click="videoChange" class="btnNocur" style="float: right;padding: 6px 12px;margin-top: 6px;font-size: 12px" size="small">切换摄像头</el-button>
                        </div>
                        <div class="stepMain_threeL_bottom">
                            <el-popover
                                placement="top-start"
                                title="证书图片"
                                trigger="hover"
                                :placement="placement"
                                content="点击查看全部图片">
                                <el-image
                                    slot="reference"
                                    style="height: 50%;width: 100%"
                                    :src="certificate[0]"
                                    alt="证书图片"
                                    :preview-src-list="certificate">
                                </el-image>
                            </el-popover>
                            <div style="height: 50%;">
                                <el-popover
                                    placement="top-start"
                                    title="处方图片"
                                    trigger="hover"
                                    :placement="placement"
                                    content="点击查看全部图片">
                                    <el-image
                                        slot="reference"
                                        style="height: 100%;width: 100%"
                                        :src="recipelList[0]"
                                        alt="处方图片"
                                        :preview-src-list="recipelList">
                                    </el-image>
                                </el-popover>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="16">
                    <div class="stepMain_threeR">
                        <div class="stepMain_threeR_top">
                            <el-button v-if="remoteLeave" @click="leaveRoom" size="small" type="danger" style="float: right;padding: 6px 12px;margin-top: 6px;font-size: 12px">退出</el-button>
                            <el-button v-else disabled="disabled" size="small" type="danger" style="float: right;padding: 6px 12px;margin-top: 6px;font-size: 12px">退出</el-button>
                        </div>
                        <div class="stepMain_threeR_bottom">
                            <div class="right-Box" id="remote_stream">
                                <div class="local" id="local_stream"></div>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!--选择货品-->
        <el-dialog title="药品明细" :visible.sync="drugVisible" width="820px">
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
            <vxe-table
                height="420px"
                border
                resizable
                ref="dtltableData"
                :header-cell-style="headClass"
                :edit-config="{trigger: 'click', mode: 'row'}"
                :data="dtlData"
                @cell-dblclick="closeDrug">
                <vxe-table-column type="checkbox" width="60" fixed="left"></vxe-table-column>
                <vxe-table-column type="index" title="序号" width="60"></vxe-table-column>
                <vxe-table-column sortable field="pkid" title="商品ID"></vxe-table-column>
                <vxe-table-column sortable field="goodsname" title="药品名"></vxe-table-column>
                <vxe-table-column sortable field="goodstype" title="商品规格"></vxe-table-column>
                <vxe-table-column sortable field="goodsunit" title="基本单位"></vxe-table-column>
                <vxe-table-column sortable field="prodarea" title="产地"></vxe-table-column>
                <vxe-table-column field="inventory" title="库存" sortable v-if="userInfo.isinventory"></vxe-table-column>
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
        </el-dialog>
    </div>
</template>

<script>
    import QRCode       from "qrcodejs2"
    import QWebChannel  from '../../common/qwebchannel'
    import {mapGetters, mapActions } from 'vuex'
    require('../../common/lib-generate-test-usersig.min')
    import RtcClient from '../../common/RtcClient'
    import TRTC      from 'trtc-js-sdk'
    import $ from 'jquery'
    export default {
        name: "auditing",
        data() {
            var checkPhone = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('手机号不能为空'))
                } else {
                    const reg = /^1(2|3|4|5|6|7|8|9)\d{9}$/
                    if (reg.test(value)) {
                        callback()
                    } else {
                        return callback(new Error('请输入正确的手机号'))
                    }
                }
            }
            var checkId = (rule, value, callback) => {
                if (!value) {
                    callback()
                } else {
                    const reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/
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
                placement: 'top-end',
                certificateList: [],
                recipelList: [],
                time: 120,
                logins: false,
                setInterval: null,
                conactAgain: false,
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
                url: [],
                srcList: [],
                certificate: [], //证书图片
                active: 1,
                link: "我是二维码",
                form: {
                    patientname: '',
                    telphone: '',
                    idcardno: "",
                    openid: "",
                },
                form2: {
                    type: 1,
                },
                comefrom: [ {label: '西药处方', value: 1}, {label: '中药处方', value: 2} ],
                baseUrl: null,
                userId: 'a999999',
                client_: null,
                isPublished_: false,
                localStream_: null,
                videoType: null,
                hasIn: true,
                chooseValue: '',
                options: [],
                remoteState: false,
                isclick: false, //返回按钮不可多次点击
                clickPhoto: false,
                curRoomid: '',
                baseFile64:'',
                upImgClick: true,
                // 点易拍
                imgTimer: null,
                highShotMeterType: '',
                tableData: [],
                tableLoading: false,
                drugVisible: false,
                dtlData: [],
                pageDrug: {
                    currentPage: 1,
                    pageSize: 10,
                    totalResult: 0
                },
                devices: [],
                sCapheight: [],
                sCapheightIdx: -1,
                filterName: '',
                selectedIndex: -1,
                newTabs: [],
            }
        },
        computed: {
            ...mapGetters([
                'patientInfo',
                'userInfo',
                'token',
                'videoKey',
                'callFlage',
                //'inType',
                //'inObj',
                'prescriptionid',// 处方ID
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
                if (data.type === 1) {
                    this.logins = false
                    this.curRoomid = data.roomid
                    this.getKey(data.roomid)
                    this.certificate = data.pharmacistinfo.certificate
                    this.recipelList = []
                    this.recipelList = data.prescriptioninfo.imageurl
                    this.$store.commit('app/SET_CALLFLAGE', true)
                    if(this.userInfo.highShotMeterType === '1') {
                        CloseVideo()
                    }
                    //this.$store.commit('user/SET_INTYPE', true)
                    //this.$store.commit('user/inObj', data)
                }
            },
            approveCompletion: function (data) {
                if (this.curRoomid == data.roomid){
                    this.$store.commit('app/SET_CALLFLAGE', false)
                    this.rtc.leave()
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
                    this.$store.commit('app/SET_CALLFLAGE', false)
                    if (this.userInfo.beforeApproval === 1) {
                        this.active = 2
                    } else {
                        this.active = 1
                    }
                    this.conactAgain = true
                    this.isclick = false
                    clearInterval(this.setInterval)
                }else if (data.status === 400) {
                    this.$message.warning(data.msg)
                    this.isclick = false
                }
            }
        },
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
        created() {
            let path = this.$route.path
            if (path !== '/home/remoteAuditing/auditing') { return }
            this.$store.commit('app/SET_ROUTER', path)
            if (this.active !== 3) {
                this.$store.commit('app/SET_CALLFLAGE', false)
            }
            // 快捷键
            this.listenerHandle()
            if (sessionStorage.getItem('neddHighShotMeterType') === '1') {
                this.highShotMeterType = '点易拍Q15'
            } else if (sessionStorage.getItem('neddHighShotMeterType') === '2') {
                this.highShotMeterType = '良田S300L'
            } else if (sessionStorage.getItem('neddHighShotMeterType') === '3') {
                this.highShotMeterType = '良田S818YJ'
            } else if (sessionStorage.getItem('neddHighShotMeterType') === '4') {
                this.highShotMeterType = '良田S200L'
            }
            // 获取所有设备
            TRTC.getCameras().then(devices => {
                console.log(devices);
                this.devices = devices
                console.log(this.devices);
                console.log('获取所有摄像头设备');
            })
        },
        methods: {
            ...mapActions(
                {
                    goodList: "pharmacyAudit/goodsFind",
                    savedtl: 'pharmacyAudit/savedtl',
                    deldtl: 'pharmacyAudit/deldtl',
                    getdtl: 'pharmacyAudit/getdtl',
                    dosageList: "remoteAuditing/usageanddosageSelect",
                }
            ),
            async querySearchYfyl(queryString, cb) {
                this.endFlage = true;
                const yfyl = await this.dosageList({
                    companyid: this.userInfo.companyid,
                    key: queryString
                });
                var d = yfyl.map(item => {
                    return {
                        value: item.usageanddosage,
                        usageanddosageid: item.usageanddosageid
                    };
                });
                clearTimeout(this.timeout);
                cb(d);
            },
            // 循环切换
            changeCamera () {
                this.rtc.switchCameraClick()
                // TRTC.getCameras().then(devices => {
                //     console.log(devices);
                //     console.log('获取所有摄像头设备');
                // })
            },
            /* 修改高拍仪 */
            goEdit () {
                this.$router.push({
                    path: '/home/userSeting',
                    query: {editHeight: 'Yes'}
                })
            },
            getBase64Image(img) {
                var canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;

                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, img.width, img.height);
                var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
                var dataURL = canvas.toDataURL("image/"+ext);
                return dataURL;
            },
            goBackOne () {
                this.conactAgain = true
                this.active = 1
            },
            goBack() {
                this.isclick = true
                this.clickPhoto = false
                this.$socket.emit('cancelCall', JSON.stringify({
                    userid: this.userInfo.userid, companyid: this.userInfo.companyid
                }))
            },
            /* 本地上传 */
            Preview(){
                var that = this;
                const inputFile = this.$refs.fileBtn.files[0];
                this.inputFile = inputFile;
                if (this.inputFile) {
                    let inputFile = this.inputFile;
                    if (inputFile.type !== 'image/jpeg' && inputFile.type !== 'image/png' && inputFile.type !== 'image/gif') {
                        this.$message.warning('不是有效的图片文件！')
                        return;
                    }
                    const reader = new FileReader();
                    reader.readAsDataURL(this.inputFile);
                    reader.onload = data=> {
                        let ress = data.target
                        that.url = []
                        that.url.push(ress.result)
                        let arr=ress.result.split(',')
                        that.baseFile64 = arr[1]
                        that.upImgClick = false
                        that.sxSaveDoc()
                    };
                } else {
                    return;
                }
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
                        // 点击切换高拍仪
                        document.getElementById("changeCamera").onclick = function () {
                            if (that.sCapheightIdx > -1) {
                                that.sCapheightIdx = Number((that.sCapheightIdx + 1) % that.sCapheight.length)
                                dialog.devChanged("primaryDev_:" + that.sCapheight[that.sCapheightIdx]);
                            }
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
                            that.sxSaveDoc()
                        })
                        that.output("ready to send/receive messages!")
                        //网页加载完成信号
                        dialog.html_loaded("one")
                    })
                }
            },
            output(message) {
            },
            // 初始化高拍仪
            photoInit() {
                this.baseUrl = "ws://127.0.0.1:12345"
                this.output("Connecting at " + this.baseUrl + ".")
                this.openSocket()
            },
            takePhoto() {
                // if (this.userInfo.beforeApproval === 1) {
                //
                //     // this.active = 2
                // } else {
                //     this.active = 3
                //     this.callPharmacist()
                // }
                this.sxSaveDoc()
            },
            // changeCamera (e){
            //     // 0 高拍仪 1 摄像头
            //     this.rtc.switchCamera(e)
            // },
            submitForm(formName) {
                this.$refs[ formName ].validate((valid) => {
                    if (valid) {
                        this.$store.dispatch('remoteAuditing/savePatient', this.form)
                            .then(res => {
                                this.photoInit()
                                this.next()
                            }).catch(err => {
                            console.log(err, 'err')
                        })
                    } else {
                        return false
                    }
                })
            },
            resetForm(formName) {
                this.$refs[ formName ].resetFields()
            },
            next() {
                if (this.active++ > 2) this.active = 0
            },
            qrcode() {
                let qrcode = new QRCode('qrcode', {
                    width: 300,
                    height: 300,        // 高度
                    text: this.link,   // 二维码内容
                    // render: 'canvas' ,   // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
                    // background: '#f0f',   // 背景色
                    // foreground: '#ff0'    // 前景色
                })
            },
            getParms() {
                return {
                    prescriptiontype: this.form2.type, //处方类型
                    patient: this.form.patientname,// 患者姓名
                    idcard: this.form.idcardno,// 身份证号
                    insiderphone: this.form.telphone,// 手机号
                    patientid: '',// 患者ID 微信登录 传
                    inputmanid: this.userInfo.userid,// 录入人ID
                    deptid: this.userInfo.deptid,// 部门ID
                    companyid: this.userInfo.companyid,// 入驻企业ID
                    attribute: '1',// 普通处方
                    comefrom: '1',// 拍照处方
                    imageurl: this.url,//处方图片base64 数组
                    companyname: this.userInfo.companyname,
                    deptname: this.userInfo.deptname,
                    inputmanname: this.userInfo.username
                }
            },
            // 点击拍照、上传本地后保存处方
            sxSaveDoc () {
                const that = this
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.3)'
                })
                const parms = this.getParms()
                this.$store.dispatch('remoteAuditing/sxsavedoc', parms).then(prescriptionid => {
                    this.$store.commit('user/SET_PRESCRIPTIONID', prescriptionid)
                    loading.close()
                    if (that.userInfo.beforeApproval === 1) {
                        that.active = 2
                        let parms = {
                            prescriptionid: prescriptionid,
                            pageIndex: 1,
                            pageSize: 100
                        }
                        this.getDtllist(parms)
                    } else {
                        that.callPharmacist()
                    }

                }).catch(err => {
                    console.log(err, 'err')
                    loading.close()
                    this.$store.commit('app/SET_CALLFLAGE', false)
                })
            },
            // 呼叫
            callPharmacist() {
                //approvalMode:2 图片审方,1视频审方
                console.log(this.newTabs);
                // if (this.newTabs.length == 0) {
                //     this.$message.warning('请维护药品保存成功后再进行远程审方')
                //     return false
                // }

                if (this.userInfo.approvalMode == 1) {
                    console.log('呼叫');
                    const that = this
                    const parms = this.getParms()
                    that.$socket.emit('getPharmacist', JSON.stringify({
                        userid: parms.inputmanid, companyid: parms.companyid, prescriptionid: this.prescriptionid
                    }))
                    that.active = 3
                    that.logins = true
                    that.time = 120
                    that.setInterval = setInterval(() => {
                        that.time--
                        if (that.time <= 0) {
                            this.$socket.emit('cancelCall', JSON.stringify({
                                userid: this.userInfo.userid, companyid: this.userInfo.companyid
                            }))
                            clearInterval(that.setInterval)
                            this.$store.commit('app/SET_CALLFLAGE', false)
                            that.time = '链接超时'
                        }
                    }, 1000)
                } else if (this.userInfo.approvalMode == 2) {
                    this.$store.dispatch('remoteAuditing/submitImagePrescription', {
                        companyId: this.userInfo.companyid,
                        data: {
                            prescriptionid: this.prescriptionid,
                            prescriptiontype: this.form2.type // 西药处方还是中药处方
                        }
                    }).then(res => {
                        if (res.status === 200) {
                            this.$message.success('送审成功')
                            setTimeout(() => {
                                window.location.reload()
                            }, 1000)
                        }
                    }).catch(err => {
                        console.log(err);
                    })
                }
            },
            getKey(rooID) {
                this.$store.dispatch('app/getKey', {userid: this.userInfo.userid,  companyid: this.userInfo.companyid})
                    .then(res => {
                        let parms = res
                        parms.rooID = rooID
                        this.$nextTick(() => {
                            if (this.userInfo.highShotMeterType === '2' || this.userInfo.highShotMeterType === '3' || this.userInfo.highShotMeterType === '4'){
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
                // this.rtc.join()
                this.rtc.saveCameras()
                this.rtc.getCameraId()
                setTimeout(()=>{
                    this.options = this.camerasArr
                },1500)
            },
            videoChange () {
                this.rtc.switchCameraClick()
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
                this.$store.commit('app/SET_CALLFLAGE', false)
                this.rtc.leave()
                this.$router.replace({path: '/home/pharmacyAudit',})
            },
            // 点易拍
            dotPhoto () {
                function loadActiveX() {
                    if (!!window.ActiveXObject || "ActiveXObject" in window){
                        isIE = true;
                        //IE浏览器加载控件
                        document.getElementById("bigPriDev1").innerHTML = "<OBJECT id=\"axCam_Ocx\"  classid=\"clsid:D5BD5B4A-4FC0-4869-880B-27EE9869D706\" width=\"680px\" height=\"530px\" ></OBJECT>";
                        OcxInit();
                    } else {
                        isIE = false;
                        if (!window.WebSocket) {
                            alert("WebSocket not supported by thicameraCanvass browser!");
                        }
                        //其他浏览器加载控件
                        document.getElementById("bigPriDev1").innerHTML =" <canvas id=\"cameraCanvas\" width=\"680px\" height=\"530px\">";
                        WsInit(500,400,500,400,true);
                    }
                }
                loadActiveX()
                this.selectedIndex = 0
            },
            dCapheight () {
                let that = this
                let userCam = []
                CloseCam();
                that.devices.forEach(i => {
                    userCam.push(i.label)
                })
                console.log('点一拍设备');
                console.log(userCam);
                if (that.selectedIndex > -1) {
                    console.log('kkk');
                    console.log(that.selectedIndex);
                    that.selectedIndex = (this.selectedIndex + 1) % userCam.length
                    console.log(that.selectedIndex);
                    console.log(userCam[that.selectedIndex]);
                    ChangeCamDevice(that.selectedIndex);
                    OcxGetDeviceResolutionSecond()
                    setTimeout(() => {
                        StartVideo()
                    }, 500)
                }

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
                        this.sxSaveDoc()
                    }
                }else {
                    this.imgTimer=setTimeout(function (){
                        that.GetImgBase64()
                    },300)
                }
            },
            headClass({row, column, rowIndex, columnIndex}) {
                return 'background: #E6E6E6;color: #000'
            },
            addDrugs () {
                this.filterName = ''
                this.drugVisible = true
                this.goodList({
                    companyid: this.userInfo.companyid,
                    pageIndex: this.pageDrug.currentPage,
                    pageSize: this.pageDrug.pageSize,
                    usestatus: 1,
                    specialdrug: 0,
                    deptid: this.userInfo.deptid
                }).then(res => {
                    this.dtlData = res.list;
                    this.pageDrug.totalResult = res.info;
                })
                    .catch(err => {
                        console.log(err);
                    });
            },
            closeDrug ({row}) {
                let status = false;
                row.goodsid = row.pkid
                let getTableData = this.$refs.tableData.getTableData();
                getTableData.fullData.forEach(item => {
                    if (item.pkid == row.pkid) {
                        status = true;
                    }
                });
                if (this.userInfo.isinventory) {
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
                    this.$refs.tableData.insertAt(row, -1).then(({}) => {});
                }
            },
            filterVal(e) {
                this.goodList({
                    companyid: this.userInfo.companyid,
                    pageIndex: this.pageDrug.currentPage,
                    pageSize: this.pageDrug.pageSize,
                    usestatus: 1,
                    specialdrug: 0,
                    key: e,
                    deptid: this.userInfo.deptid
                }).then(res => {
                    this.dtlData = res.list;
                    this.pageDrug.totalResult = res.info;
                })
                    .catch(err => {
                        console.log(err);
                    });
            },
            // 获取药品名称
            diaSearch(event) {
                event.target.blur();
                this.$nextTick(() => {
                    this.$refs.formDrug.setCurrentRow(this.drugList[0]);
                });
            },
            getDtllist (e) {
                this.getdtl(e).then(res => {
                    this.tableData = res
                    if (res == null) {
                        this.newTabs = []
                    } else {
                        this.newTabs = res
                    }
                })
            },
            dtlEdit (row) {
                row.prescriptionid = this.prescriptionid
                let newArr = []
                newArr.push(row)
                if (this.userInfo.isinventory) {// 是否控制库存
                    if (row.goodsqty > row.inventory) {// 数量不能大于库存
                        this.$message.warning('药品名称为' + row.goodsname + '的库存剩余' + row.inventory + '，请修改当前数量。')
                        return false
                    }
                }
                if (row.yfyl == null || row.yfyl == '') {
                    this.$message.warning('请选择或输入用法用量')
                    return false
                }
                this.savedtl(newArr).then(res => {
                    if (res.status === 200) {
                        if (this.prescriptionid) {
                            let parms = {
                                prescriptionid: this.prescriptionid,
                                pageIndex: 1,
                                pageSize: 100
                            }
                            this.$message.success('保存成功')
                            this.tableData = []
                            this.getDtllist(parms)
                        }
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            delEdit (row) {
                this.$refs.tableData.remove(row)
            },
            dtlDelete () {
                let removerows = this.$refs.tableData.getSelectRecords()
                if (removerows.length) {
                    let newArr = []
                    let delDtl = false
                    removerows.forEach(item => {
                        if (item.prescriptiondtlid === undefined) {
                            delDtl = true
                        } else {
                            newArr.push({
                                prescriptionid: this.prescriptionid,
                                prescriptiondtlid: item.prescriptiondtlid
                            })
                        }
                    })
                    if (delDtl) {
                        this.$message.warning('删除的数据内有未保存的数据, 请移除后再进行操作')
                        return false
                    }
                    this.deldtl(newArr).then(res => {
                        if(res.status === 200) {
                            this.$message.success('删除成功')
                            // 删除细单成功 刷新
                            if (this.prescriptionid) {
                                let parms = {
                                    prescriptionid: this.prescriptionid,
                                    pageIndex: 1,
                                    pageSize: 100
                                }
                                this.tableData = []
                                this.getDtllist(parms)
                            }
                        }
                    }).catch(err => {
                        console.log(err);
                    })
                } else {
                    this.$message.warning('请选择您要删除的数据')
                }
            },
            handlePageChangeDrug({ currentPage, pageSize }) {
                this.pageDrug.currentPage = currentPage;
                this.pageDrug.pageSize = pageSize;
                this.addDrugs();
            },
        },
        beforeDestroy() {
            this.$socket.emit('cancelCall', JSON.stringify({
                userid: this.userInfo.userid, companyid: this.userInfo.companyid
            }))
            window.location.reload()
            this.$nextTick(() => {
                if (this.userInfo.highShotMeterType === '2' || this.userInfo.highShotMeterType === '3' || this.userInfo.highShotMeterType === '4') {
                    if (!!window.dialog.get_actionType) {
                        window.dialog.get_actionType("closeSignal")
                    }
                }
                clearInterval(this.setInterval)
            })
        }
    }
</script>
<style>
    .el-step__head.is-success, .el-step__title.is-success {
        color        : #36c2aa;
        border-color : #36c2aa;
    }
    .el-step.is-horizontal .el-step__line {
        height : 2px;
        top    : 30px;
        left   : 0;
        right  : 0;
    }
    .el-step__icon.is-text {
        border-radius : 50%;
        border        : 2px solid;
        border-color  : inherit;
    }
</style>
<style lang="scss" scoped>
    .auditingMain{
        padding: 20px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
        background: #fff;
        .stepMain_one{
            margin-top: 22px;
            height: 632px;
            clear: both;
            .stepMain_oneL{
                .stepMain_oneL_top{
                    height: 46px;
                    line-height: 46px;
                    a{
                        color: #36c2aa;
                        font-size: 14px;
                    }
                    span{
                        color: #000;
                        font-size: 14px;
                        margin-right: 16px;
                    }
                    .btnNoCur >>>.el-button{
                        float: right;
                        /*color: #666;*/
                        /*padding: 6px 12px;*/
                        /*background:rgba(255,255,255,1);*/
                        /*border-radius:4px;*/
                        /*font-size: 12px!important;*/
                        /*border:1px solid rgba(230,230,230,1);*/
                        width:94px;
                        height:28px;
                        background:rgba(255,255,255,1);
                        border-radius:4px;
                        border:1px solid rgba(230,230,230,1);
                    }
                }
                .stepMain_oneL_bottom{
                    height: 532px;
                    border:solid 1px #E6E6E6;
                    background: #FAFAFA;
                    border-radius: 5px;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
            }
            .stepMain_oneR{
                .stepMain_oneR_top{
                    height: 46px;
                    line-height: 46px;
                    .fileDiv1 {
                        display: inline-block;
                        position: relative;
                    }
                    .fileDiv2 {
                        color: #FFF;
                        background-color: $color-btn;
                        border-color: $color-btn;
                    }
                    .file_input {
                        width: 100px;/*因为file-input在部分浏览器中会自带一个输入框，需要双击才可以点击上传,放大后将其定位到div外面就好啦*/
                        height: 36px;
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
                .stepMain_oneR_bottom{
                    height: 532px;
                    border:solid 1px #E6E6E6;
                    border-radius: 5px;
                    background-color: #FAFAFA!important;
                    background: url("../../assets/img/pic_default.png") no-repeat;
                    background-size: 64px 64px;
                    background-position:center;
                }
            }
        }
        .stepMain_two{
            height: 632px;
            margin-top: 22px;
            clear: both;
            .stepMain_twoL{
                clear: both;
                .stepMain_twoL_top{
                    height: 46px;
                    line-height: 46px;
                    .active_btn{
                        padding: 6px 12px;
                        font-size: 14px!important;
                    }
                }
                .stepMain_twoL_bottom{
                    height: 474px;
                    border:solid 1px #E6E6E6;
                    border-radius: 5px;
                    background-color: #FAFAFA!important;
                    background: url("../../assets/img/pic_default.png") no-repeat;
                    background-size: 64px 64px;
                    background-position:center;
                }
            }
            .stepMain_twoR{
                .stepMain_twoR_top{
                    height: 46px;
                    line-height: 46px;
                    clear: both;
                    .active2_btn{
                        padding: 6px 12px;
                        text-align: center;
                        border-radius: 0px;
                        font-size: 14px!important;
                    }
                    .active2_btn:nth-child(1){
                        color: #fff;
                        background: #36c2aa!important;
                    }
                    .active2_btn:nth-child(2){
                        background: #fff!important;
                    }
                }
                .stepMain_twoR_bottom{
                    height: 474px;
                    width: auto;
                }
            }
        }
        .stepMain_three{
            margin-top: 20px;
            .before {
                width: 100%;
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
            .stepMain_threeL{
                .stepMain_threeL_top{
                    height: 46px;
                    line-height: 46px;
                    clear: both;
                }
                .stepMain_threeL_bottom{
                    height: 474px;
                    border:solid 1px #E6E6E6;
                    border-radius: 5px;
                    background-color: #FAFAFA!important;
                }
            }
            .stepMain_threeR{
                .stepMain_threeR_top{
                    height: 46px;
                    line-height: 46px;
                    clear: both;
                }
                .stepMain_threeR_bottom{
                    position: relative;
                    height: 474px;
                    border:solid 1px #E6E6E6;
                    border-radius: 5px;
                    background-color: #FAFAFA!important;
                    background: url("../../assets/img/video_default.png") no-repeat;
                    background-size: 64px 64px;
                    background-position:center;
                    .right-Box{
                        width: 100%;
                        height: 100%;
                    }
                    .local{
                        position: absolute;
                        right: 0;
                        bottom: 0px;
                        width: 280px;
                        height: 224px;
                        z-index: 9;
                        background-color: #FAFAFA;
                    }
                }
            }
        }
    }

    .auditing {
        padding: 20px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);

        .divider {
            margin: 9px 0px;
        }
        .fileDiv1 {
            display: inline-block;
            margin-left: 120px;
            position: relative;
        }

        .fileDiv2 {
            color: #FFF;
            background-color: $color-btn;
            border-color: $color-btn;
        }
        .file_input {
            width: 100px;/*因为file-input在部分浏览器中会自带一个输入框，需要双击才可以点击上传,放大后将其定位到div外面就好啦*/
            height: 36px;
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
        .search {
            color: #FFF;
            background-color: $color-btn;
            border-color: $color-btn;
        }

        width: 100%;
        box-sizing: border-box;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        .main1 {
            display: flex;
            flex: 1;
            justify-content: space-around;
            align-items: center;

            .qrcode {

                width: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .form {
                flex: 1;
            }
        }

        .main2 {
            flex: 1;
            display: flex;
            justify-content: space-around;
            align-items: center;
            flex-direction: row;

            .photo {
                width: 700px;
                height: 100%;
                /*background-color: rosybrown;*/
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            }

            .form2 {
                align-self: flex-start;
                min-width: 600px;
                height: 100%;
            }
        }

        .main3 {
            /*height: 100%;*/
            padding: 10px 0;
            height: 540px;
            /*flex: 1;*/
            display: flex;
            justify-content: space-around;
            align-items: center;
            flex-direction: row;

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
                    /*height: 80%;*/
                    height: 100%;
                    box-sizing: border-box;
                    background-color: #f0f8fa !important;
                    background: url("../../assets/img/videoIcon.png") no-repeat;
                    background-position:center;
                }
            }
        }
    }
</style>

