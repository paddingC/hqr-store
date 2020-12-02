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
				label-width="100px"
				:rules="rules"
			>
				<el-form-item label="患者姓名" prop="patientName">
					<el-input
						style="margin-right:24px"
						v-model="formInline.patientName"
						placeholder="请输入"
						class="inputWidth"
					></el-input>
				</el-form-item>

				<!-- </el-form-item> -->
				<!-- <br /> -->

				<!-- <br /> -->
				<el-form-item label="年龄" prop="patientAge">
					<el-input
						v-model.number="formInline.patientAge"
						style="margin-right:24px"
						placeholder="请输入"
						class="inputWidth"
					></el-input>
				</el-form-item>
				<br />
				<el-form-item label="手机号" prop="applyMobile">
					<el-input
						v-model="formInline.applyMobile"
						class="inputWidth"
						style="margin-right:24px"
						placeholder="请输入"
					></el-input>
				</el-form-item>
				<!-- <br /> -->
				<el-form-item label="性别" prop="patientGender">
					<el-radio
						v-for="(item,index) in sexOption"
						:key="index"
						v-model="formInline.patientGender"
						:label="item.dictValue"
					>{{item.dictDtlName}}</el-radio>
				</el-form-item>
				<br />
				<el-form-item label="证件类型" prop="patientCardType">
					<el-select
						v-model="formInline.patientCardType"
						class="inputWidth"
						size="mini"
						style="margin-right:24px"
						placeholder="请选择"
					>
						<el-option
							v-for="item in cardOption"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						></el-option>
					</el-select>
				</el-form-item>
				<!-- <br /> -->
				<el-form-item label="证件号" prop="patientCardId">
					<el-input v-model="formInline.patientCardId" placeholder="请输入" class="inputWidth"></el-input>
				</el-form-item>
				<br />
				<el-form-item label="主诉" prop="symptom">
					<el-input
						v-model="formInline.symptom"
						type="textarea"
						placeholder="请输入"
						rows="3"
						class="inputWidth"
						style="margin-right:24px"
					></el-input>
				</el-form-item>
				<el-form-item label="疾病诊断" prop="illness">
					<el-input
						v-model="formInline.illness"
						class="inputWidth"
						type="textarea"
						placeholder="请输入"
						rows="3"
					></el-input>
				</el-form-item>
				<br />
				<el-form-item label="肝功能状态" prop="liverFunction">
					<el-select
						v-model="formInline.liverFunction"
						size="mini"
						class="inputWidth"
						style="margin-right:24px"
						placeholder="请选择"
					>
						<el-option
							v-for="item in statusOption"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="肾功能状态" prop="renalFunction">
					<el-select v-model="formInline.renalFunction" size="mini" class="inputWidth" placeholder="请选择">
						<el-option
							v-for="item in statusOption"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						></el-option>
					</el-select>
				</el-form-item>
				<br />
				<el-form-item label>
					<el-button class="search" size="small" @click="consultation">发起咨询</el-button>
					<el-button size="small" @click="backToIndex">返回首页</el-button>
				</el-form-item>
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
					<vxe-table-column field="spec" title="规格"></vxe-table-column>
					<vxe-table-column
						field="usage"
						title="用法"
						:edit-render="{name: 'input',immediate: true, defaultValue: ''}"
					>
						<template slot-scope="scope">
							<el-input size="mini" v-model="scope.row.usage"></el-input>
						</template>
					</vxe-table-column>
					<!-- :formatter="formatterType" -->
					<vxe-table-column
						field="num"
						title="数量"
						:edit-render="{name: 'input', immediate: true,defaultValue: ''}"
					>
						<template slot-scope="scope">
							<el-input size="mini" v-model="scope.row.num"></el-input>
						</template>
					</vxe-table-column>
					<vxe-table-column field="unit" title="包装单位"></vxe-table-column>
					<vxe-table-column
						field="dose"
						title="用药天数"
						:edit-render="{name: 'input',immediate: true, defaultValue: ''}"
					>
						<template slot-scope="scope">
							<el-input size="mini" v-model="scope.row.dose"></el-input>
						</template>
					</vxe-table-column>
					<vxe-table-column field="usageFrequencyCode" title="频次">
						<template slot-scope="scope">
							<!-- <el-input size="mini" v-model="scope.row.usageFrequencyCode"></el-input> -->
							<el-select v-model="scope.row.usageFrequencyCode" size="mini" placeholder="请选择">
								<el-option
									v-for="item in options"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								></el-option>
							</el-select>
						</template>
					</vxe-table-column>
					<vxe-table-column
						field="perNum"
						title="每次用量"
						:edit-render="{name: 'input',immediate: true, defaultValue: ''}"
					>
						<template slot-scope="scope">
							<el-input size="mini" v-model="scope.row.perNum"></el-input>
						</template>
					</vxe-table-column>
					<vxe-table-column
						field="perUnit"
						title="每次用量单位"
						:edit-render="{name: 'input',immediate: true, defaultValue: ''}"
					>
						<template slot-scope="scope">
							<el-input size="mini" v-model="scope.row.perUnit"></el-input>
						</template>
					</vxe-table-column>
					<!-- <vxe-table-column field="erpgoodsid" title="创建人员"></vxe-table-column> -->
					<!-- <vxe-table-column field="erpgoodsid" title="创建时间"></vxe-table-column> -->
					<!-- <vxe-table-column field="cz" title="操作" fixed="right" width="150"> -->
					<!-- <template slot-scope="scope"> -->
					<!-- <el-button type="default" size="mini" @click="checkEdit(scope)">编辑</el-button> -->
					<!-- <el-button type="danger" size="mini" @click="deleteRowDrugs(scope)">移除</el-button> -->
					<!-- </template> -->
					<!-- </vxe-table-column> -->
				</vxe-table>
				<!--分页-->
			</div>

			<!-- 弹窗 -->
			<el-dialog :visible.sync="dialogAdd" title="药品库明细" width="1040px" top="2%" @open="handleOpen">
				<el-form :inline="true" class="left" :model="formInline">
					<el-form-item>
						<el-input v-model="formInline.key" style="width:552px" placeholder="通用名/商品名/条形码/批准文号"></el-input>
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
// import XEUtils from 'xe-utils']
import { goodsFind, sendPrescriptionApply, rxClose } from '../../api/znsf'
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
			sexOption: [
				{
					dictDtlName: '男',
					dictValue: 1
				},
				{
					dictDtlName: '女',
					dictValue: 0
				}
			],
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
				usage: [
					{
						required: true,
						message: '请输入药品用法',
						trigger: 'blur'
					}
				],
				dose: [
					{
						required: true,
						message: '请输入用药天数',
						trigger: 'blur'
					}
				],
				num: [
					{
						required: true,
						message: '请输入药品数量',
						trigger: 'blur'
					}
				],
				perNum: [
					{
						required: true,
						message: '请输入每次用量',
						trigger: 'blur'
					}
				],
				perUnit: [
					{
						required: true,
						message: '请输入每次用量单位',
						trigger: 'blur'
					}
				],
				usageFrequencyCode: [
					{
						required: true,
						message: '请选择用药频次',
						trigger: 'change'
					}
				]
			},
			rules: {
				patientName: [
					{
						required: true,
						trigger: 'blur',
						message: '请输入患者姓名'
					}
				],
				patientCardId: [
					{
						required: true,
						trigger: 'blur',
						validator: IdCard
					}
				],
				// phone: [
				//   {
				//     required: true,
				//     trigger: 'blur',
				//     validator: valPhone
				//   }
				// ],
				patientAge: [
					{
						required: true,
						trigger: 'blur',
						message: '请输入患者年龄'
					},
					{
						type: 'number',
						message: '只能输入数字'
					}
				],
				applyMobile: [
					{
						required: true,
						trigger: 'blur',
						validator: valPhone
					}
				],
				patientGender: [
					{
						required: true,
						trigger: 'change',
						message: '请选择患者性别'
					}
				],
				symptom: [
					{
						required: true,
						trigger: 'blur',
						message: '请输入主诉'
					}
				],
				illness: [
					{
						required: true,
						trigger: 'blur',
						message: '请输入疾病诊断'
					}
				],
				liverFunction: [
					{
						required: true,
						trigger: 'blur',
						message: '请选择肝功能状态'
					}
				],
				renalFunction: [
					{
						required: true,
						trigger: 'blur',
						message: '请选择肾功能状态'
					}
				],
				patientCardType: [
					{
						required: true,
						trigger: 'blur',
						message: '请选择证件类型'
					}
				]
			},
			resData: {},
			statusOption: [
				{
					value: 'NORMAL',
					label: '正常'
				},
				{
					value: 'ABNORMAL',
					label: '异常'
				},
				{
					value: 'UNKOWN',
					label: '未知'
				}
			],
			cardOption: [
				{
					value: 1,
					label: '身份证'
				}
			]
			//       prescriptionId: 323134302167352
			// applyId: 123327581
			// imSessionId: 771601
			// isNew: true
		}
	},
	computed: {
		...mapGetters(['userInfo'])
	},
	created() {},
	mounted() {
		//  this.rxClose(4301059480635)
	},
	methods: {
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
				// this.$router.push({path:'/consultation'})
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
						patientMobile: this.formInline.applyMobile,
						applyMobile: this.userInfo.phonenum,
						applyName: this.userInfo.username,
						patientCardId: this.formInline.patientCardId,
						applyStoreName: this.userInfo.deptname,
						cardType: 1,
						companyId: this.userInfo.companyid,
						companyName: this.userInfo.companyname,
						deptId: this.userInfo.deptid,
						illness: this.formInline.illness,
						patientAge: this.formInline.patientAge,
						patientGender: this.formInline.patientGender,
						inputmanId: this.userInfo.userid,
						inputmanName: this.userInfo.username,
						patientName: this.formInline.patientName,
						prescriptionDetails: this.checkedGoods,
						symptom: this.formInline.symptom,
						applyType: 2,
						patientCardType: this.formInline.patientCardType,
						renalFunction: this.formInline.renalFunction,
						liverFunction: this.formInline.liverFunction
					}
					// let params = {
					// 	patientMobile: '17610111996',
					// 	applyMobile: '13501237165',
					// 	applyName: '测试',
					// 	patientCardId: '232325199611210015',
					// 	applyStoreName: '【产品测试中心】英克演示公司',
					// 	cardType: 1,
					// 	companyId: 'ee842b218438418bace33c148727eefa',
					// 	companyName: '【产品测试中心】英克演示公司',
					// 	deptId: 'ee842b218438418bace33c148727eefa',
					// 	illness: '十大',
					// 	patientAge: 23,
					// 	patientGender: 1,
					// 	inputmanId: '0cee762fc3c84c9f8984bd924a95783f',
					// 	inputmanName: '测试',
					// 	patientName: '张勤勇',
					// 	prescriptionDetails: [
					// 		{
					// 			popularizename: null,
					// 			drugName: '阿莫西林胶囊',
					// 			goodstype: '0.25g*10粒*3板',
					// 			erpgoodsid: null,
					// 			bizId: '44673',
					// 			spec: '0.25g*10粒*3板',
					// 			unit: '盒',
					// 			_XID: 'row_93',
					// 			usage: '45',
					// 			num: '55',
					// 			dose: '2',
					// 			perNum: '32',
					// 			perUnit: '4',
					// 			usageFrequencyCode: 6,
					// 			usageFrequencyName: '1次/3小时'
					// 		}
					// 	],
					// 	symptom: '20',
					// 	applyType: 2,
					// 	patientCardType: 1,
					// 	renalFunction: 'ABNORMAL',
					// 	liverFunction: 'NORMAL'
					// }
					sendPrescriptionApply(params)
						.then(response => {
							this.loading = false
							this.$router.push({
								path: '/consultation',
								query: {
									userid: response.data.applyId,
									advisoryId: response.data.advisoryId
								}
							})
						})
						.catch(error => {
							if (error.status === 407) {
								this.$confirm('该用户当前已有用药咨询进行中，是否继续未完成的处方问诊', {
									confirmButtonText: '确定',
									cancelButtonText: '取消',
									type: 'warning'
								})
									.then(() => {
										this.$router.push({
											path: '/consultation',
											query: {
												userid: error.data.applyId,
												advisoryId:
													error.data.advisoryId
											}
										})
									})
									.catch(err => {
										this.rxClose(error.data.advisoryId)
										this.loading = false
									})
							}
							this.loading = false
						})
				}
			})

			// }
			// }
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
			this.dialogAdd = true
		},
		submitCheck() {
			let rows = this.$refs.formList.getCheckboxRecords()
			if (rows.length) {
				rows.forEach((item, index) => {
					// console.log(item)
					this.checkedGoods.push({
						popularizename: item.popularizename,
						drugName: item.goodsname,
						goodstype: item.goodstype,
						erpgoodsid: item.erpgoodsid,
						bizId: item.pkid,
						spec: item.goodstype,
						unit: item.goodsunit
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
                key: this.formInline.key,
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
</style>
