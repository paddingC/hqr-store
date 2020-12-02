<template>
	<div class="consultation">
		<div class="header">
			<div class="pagetitle">问诊医生</div>
			<!-- #FF7C2D -->
			<el-button class="endConsultation" size="mini" @click="stop">结束问诊</el-button>
		</div>

		<div class="home">
			<div class="chatscroller" v-loading="loading" element-loading-text="连接中">
				<span class="doctorName">{{doctorInfo.nickName}}</span>
				<div class="chatbox">
					<div class="chatList" ref="List">
						<div class="chatItem" v-for="(item,index) in chatList" :key="index">
							<div class="user" v-if="item.owner.userId == userInfo.uid">
								<!-- <div class="icon">
                  <div class="userIco">
                    <img :src="userInfo.avatar" alt />
								</div>-->
								<!-- <div class="name">{{ userInfo.ownerName }}</div> -->
								<!-- </div> -->
								<!-- <div class="time" v-if="item.str">{{item.dateStr}}</div> -->
								<div class="message_container">
									<!-- div -->
									<span class="time">{{item.dateStr}}</span>
									<messageType :item="item"></messageType>
									<!-- <div class="loading" v-if="item.done == 1" v-loading="item.done == 1">发送中</div> -->
									<div class="loading" v-if="item.done == 3">
										<img
											style="width: 20px; height: 20px"
											@click="resend(item)"
											src="../../assets/img/fail.png"
										/>
									</div>
								</div>
							</div>
							<div class="doctor" v-if="item.owner.userId == doctorInfo.uid">
								<!-- <div class="icon">
                  <div class="userIco">
                    <el-image :src="doctorInfo.avatar" alt></el-image>
								</div>-->
								<!-- <div class="name">{{ doctorInfo.ownerName }}：</div> -->
								<!-- </div> -->
								<span class="time">{{item.dateStr}}</span>
								<div class="message_container">
									<messageType :item="item"></messageType>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="footer">
					<el-input
						v-model="input"
						size="large"
						style="width:598px"
						@keyup.enter.native="send"
						placeholder="请输入"
					></el-input>
					<el-button class="search" size="large" @click="send">发送</el-button>
					<div
						style="width:42px;height:42px;background:#E6E6E6;line-height:42px;text-align:center;margin-left:8px"
					>
						<img
							style="width: 22px; height: 22px;vertical-align:middle"
							@click="upload"
							src="../../assets/img/pic.png"
						/>
					</div>

					<input
						type="file"
						class="input"
						accept="image/*"
						@change="fileChange"
						v-show="false"
						ref="imgUploader"
					/>
				</div>
			</div>
		</div>
		<el-dialog title="发送图片" :visible.sync="drugVisible">
			<!-- <img :src="img" alt /> -->
			<el-image style="margin:auto;display:block" width="80%" :src="img" alt></el-image>
			<span slot="footer" class="dialog-footer">
				<el-button @click="drugVisible=false">取 消</el-button>
				<el-button class="search" @click="sendImg">发 送</el-button>
			</span>
		</el-dialog>
		<el-dialog
			title="导诊"
			width="mini"
			:visible.sync="dialogVisible"
			:show-close="false"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
		>
			<template>
				<template>
					<div class="questionDataContent">{{ questionData.content }}</div>
				</template>
				<template v-if="questionData.questionType == `SINGLE_CHOICE`">
					<div class="SINGLE_CHOICE">
						<template v-for="i in questionData.answers">
							<el-button @click="selectSolution(i)">{{ i.answerText }}</el-button>
						</template>
					</div>
				</template>
				<template v-if="questionData.questionType == `MULTIPLE_CHOICE`">
					<div class="MULTIPLE_CHOICE">
						<template v-for="i in questionData.answers">
							<el-button :type="renderHight(i)" @click="addMULTIPLE_CHOICE_INPUT(i)">{{ i.answerText }}</el-button>
						</template>
						<div class="input" v-if="messageShow">
							<el-input v-model="otherMessage" placeholder="请输入内容"></el-input>
						</div>
						<div class="buttom">
							<el-button @click="answer(`${questionData.questionType}`)">提交</el-button>
						</div>
					</div>
				</template>
				<template v-if="questionData.questionType == `MULTIPLE_CHOICE_INPUT`">
					<div class="MULTIPLE_CHOICE_INPUT">
						<template v-for="i in questionData.answers">
							<el-button :type="renderHight(i)" @click="addMULTIPLE_CHOICE_INPUT(i)">{{ i.answerText }}</el-button>
						</template>
						<div class="input" v-if="messageShow">
							<el-input v-model="otherMessage" placeholder="请输入内容"></el-input>
						</div>
						<div class="buttom">
							<el-button @click="answer(`${questionData.questionType}`)">提交</el-button>
						</div>
					</div>
				</template>
			</template>
		</el-dialog>
	</div>
</template>
<script>
import messageType from '../../components/type/index'
// import linkUp, { sdkConst } from '../../../public/dist';
// import linkUp, { sdkConst } from '@fastweb/linkup'
import linkUp, { sdkConst } from '@fastweb/linkup/dist/cDrugStore.js'

// console.log(linkUp);
import XEUtils from 'xe-utils'
export default {
	components: { messageType },
	data() {
		return {
			input: '',
			drugVisible: false,
			loading: false,
			mescroll: null,
			mescrollDown: {
				auto: false,
				callback: this.downCallback,
				htmlNodata: ''
			},
			mescrollUp: {
				use: false
			},
			chatList: [
				// {
				//   serverMessageId: 1566474238400,
				//   clientMsgId: 1566474238400,
				//   createDate: 1566474238400,
				//   group: {
				//     groupId: 94881,
				//     type: 1,
				//     avatar:
				//       "http://static.qa.91jkys.com/index/478d5744-81c2-4cca-aa10-e4db1298d077.png",
				//     title: "测试",
				//     subTitle: "点点滴滴",
				//     date: 1566474238400
				//   },
				//   owner: {
				//     userId: 98215506,
				//     userName: "所属",
				//     userAvatar:
				//       "http://static.qa.91jkys.com/index/478d5744-81c2-4cca-aa10-e4db1298d077.png"
				//   },
				//   messageInfo: {
				//     type: "Image",
				//     body: {
				//       fileUrl:
				//         "https://incafile.s3.cn-north-1.jcloudcs.com/files/incacloud/dzsf/prescription/img/ee842b218438418bace33c148727eefa/1591181461188/15911814611887041431157158489353.jpg"
				//     }
				//   }
				// }
			],
			userInfo: {},
			doctorInfo: {},
			img: '',
			userClose: false,
			questionData: {
				id: null,
				content: '',
				answers: null,
				questionType: '',
				questionFromSource: ''
			},
			dialogVisible: false,
			messageShow: false,
			otherMessage: '',
			myAns: []
		}
	},
	// computed:{
	//   dateStr
	// },
	watch: {
		img(val) {
			if (val) {
				this.drugVisible = true
			}
		}
	},
	methods: {
		// 选择图片
		async fileChange() {
			if (!window.FormData) {
				// 不支持formdata的不支持哦
				return
			}

			let upload = this.$refs.imgUploader
			const file = upload.files[0] // File对象
			// console.log(this.$refs.imgUploader.files)
			if (!file) {
				// 用户取消了本次操作
				return
			}
			let { size } = file

			let res = await linkUp.api.uploadImg(file)
			const { fullPath } = res.data.result
			this.img = fullPath
			this.$refs.imgUploader.value = null // 清空图片内容 否则选择相同图片不会触发change事件
			this.drugVisible = true

			console.log(res)
		},

		upload() {
			// 上传图片
			this.$refs.imgUploader.click()
		},
		// 手动关闭
		stop() {
			this.$confirm('是否结束问诊?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.userClose = true
					this.$router.go(-1)
				})
				.catch(err => {
					console.log(err)
				})
		},
		start() {
			this.init()
		},
		// 发送图片
		async sendImg() {
			const clientMsgId = Date.now()

			const img = this.img
			const message = {
				done: 1,
				owner: this.owner,
				group: this.group,
				clientMsgId,
				dateStr: XEUtils.toDateString(clientMsgId, 'MM-dd HH:mm'),
				messageInfo: {
					type: 'Image',
					body: {
						thumbnail: img, // 缩略图url

						fileUrl: img, // 大图url
						size: 1024 // 图片大小
					}
				}
			}

			this.chatList.push(message)
			let sendFlag = await this.im.sendMessage(message)
			if (sendFlag) {
				// 发送成功
				this.chatList = this.chatList.map(v => {
					if (v.clientMsgId == clientMsgId) {
						return {
							...message,
							done: 2
						}
					}
					return v
				})
			} else {
				this.chatList = this.chatList.map(v => {
					if (v.clientMsgId == clientMsgId) {
						return {
							...message,
							done: 3
						}
					}
					return v
				})
			}
			this.drugVisible = false
			this.scrollBtm()
			this.input = ''
		},
		async resend(msg) {
			// 重新发送消息
			this.scrollBtm()
			const clientMsgId = msg.clientMsgId
			const message = {
				done: 1,
				owner: this.owner,
				group: this.group,
				clientMsgId,
				dateStr: XEUtils.toDateString(clientMsgId, 'MM-dd HH:mm'),
				messageInfo: msg.messageInfo
			}

			let sendFlag = await this.im.sendMessage(message)
			if (sendFlag) {
				// 发送成功
				this.chatList = this.chatList.map(v => {
					if (v.clientMsgId == clientMsgId) {
						return {
							...message,
							done: 2
						}
					}
					return v
				})
			} else {
				this.chatList = this.chatList.map(v => {
					if (v.clientMsgId == clientMsgId) {
						return {
							...message,
							done: 3
						}
					}
					return v
				})
			}
			this.input = ''
		},
		async send() {
			if (!this.input) {
				this.$message.warning('请输入要发送的内容！')
				return
			}
			const clientMsgId = Date.now()
			const message = {
				done: 1,
				owner: this.owner,
				group: this.group,
				clientMsgId,
				dateStr: XEUtils.toDateString(clientMsgId, 'MM-dd HH:mm'),
				messageInfo: {
					type: 'Text',
					body: {
						text: this.input
					}
				}
            }
                     console.log(message)
			this.chatList.push(message)
			let sendFlag = await this.im.sendMessage(message)
			if (sendFlag) {
				// 发送成功
				this.chatList = this.chatList.map(v => {
					if (v.clientMsgId == clientMsgId) {
						return {
							...message,
							done: 2
						}
					}
					return v
				})
			} else {
				this.chatList = this.chatList.map(v => {
					if (v.clientMsgId == clientMsgId) {
						return {
							...message,
							done: 3
						}
					}
					return v
				})
			}
			this.input = ''
			// 发送消息
			this.scrollBtm()
		},
		scrollBtm() {
			this.$nextTick(() => {
				this.ListDom = this.$refs.List
				this.ListDom.scrollTop = '99999'
			})
		},
		// 连接
		async init() {
			console.log(linkUp)
			// this.loading = true
			console.log({
				// 初始化IM
				owner: this.owner,
				appInfo: 'ZG',
				advisoryId: this.$route.query.advisoryId
			})

			// try {
			// this.$nextTick(() => {
			this.im = linkUp.cDrugStore({
				// 初始化IM
				owner: this.owner,
				appInfo: 'ZG',
				advisoryId: this.$route.query.advisoryId
			})
			// })

			this.imInit()
			// } catch (err) {
			// 	console.log(err)
			// 	this.$message.error('连接失败！')
			// 	return
			// }
			// await this.getGroupMessage() // 获取当前聊天组信息
			// await this.getHistory() // 获取聊天历史记录
			// console.log(this.im.getwsStatus(), 'getwsStatus')

			// this.im.trpubsub.on('connecting', ms => {
			// 	this.connecting()
			// })
			// // this.im.trpubsub.on('LoginSuccess', () => {
			// // 	this.LoginSuccess()
			// console.log(this.im.getwsStatus(), 'getwsStatus')

			// // setInterval(() => {
			// // 	console.log(this.im.getwsStatus(), 'getwsStatus')
			// // }, 1500)
			// let status = this.im.getwsStatus()
			// status == 1 && this.LoginSuccess()
			// // status == 0 && this.init()
			// // })
			// this.im.trpubsub.on('close', () => {
			// 	console.log('=====imclose1=====')
			// 	this.close()
			// })
			// this.im.trpubsub.on('changeGroup', e => {
			// 	console.log(e)
			// 	this.groupInit(e)
			// })
			// this.im.trpubsub.on('message', ms => {
			// 	console.log(ms)
			// 	this.message(ms)
			// })
			// this.im.trpubsub.on('question', e => {
			// 	console.log(e)
			// 	this.question(e)
			// 	this.im.trpubsub.on('endQuestion', e => {
			// 		this.endQuestion(e)
			// 	})
			// })
		},
		imInit() {
			this.im.trpubsub.on('connecting', ms => {
				this.connecting()
			})
			this.im.trpubsub.on('LoginSuccess', ms => {
				this.LoginSuccess()
			})
			// this.im.trpubsub.on('LoginSuccess', () => {
			// 	this.LoginSuccess()
			console.log(this.im.getwsStatus(), 'getwsStatus')

			// setInterval(() => {
			// 	console.log(this.im.getwsStatus(), 'getwsStatus')
			// }, 1500)
			let status = this.im.getwsStatus()
			status == 1 && this.LoginSuccess()
			// status == 0 && this.init()
			// })
			this.im.trpubsub.on('close', () => {
				console.log('=====imclose1=====')
				this.close()
			})
			this.im.trpubsub.on('changeGroup', e => {
				console.log(e)
				this.groupInit(e)
			})
			this.im.trpubsub.on('message', ms => {
				console.log(ms)
				this.message(ms)
			})
			this.im.trpubsub.on('question', e => {
				this.question(e)
			})
			this.im.trpubsub.on('endQuestion', e => {
				this.endQuestion(e)
			})
		},
		// 获取当前聊天组信息(用户信息和医生信息)
		async getGroupMessage() {
			// console.log(linkUp);
			let res = await linkUp.api.getGroupMessage({
				groupId: this.group.groupId,
				ownerId: this.owner.userId
			})
			console.log(res)
			this.userInfo = res.user
			this.doctorInfo = res.doctor
			return res
		},
		// 历史记录
		async getHistory() {
			let groupId = this.group.groupId
			let res = await linkUp.api.getHistory({
				ownerId: this.owner.userId,
				groupId,
				start: 0,
				limit: 100
			})
			const { data } = res
			console.log(data)
			this.chatList = data
			this.chatList.forEach(item => {
				item.dateStr = XEUtils.toDateString(
					item.createDate,
					'MM-dd HH:mm'
				)
			})
			this.scrollBtm()
			return res
		},
		message(ms) {
			const serverMsgIds = this.chatList.map(item => {
				return item.serverMsgId
			})
			console.log(serverMsgIds)
			const { serverMsgId } = ms
			console.log(serverMsgId)
			// console.log(serverMsgIds.includes(serverMsgId))

			if (serverMsgIds.includes(serverMsgId)) return
			ms.dateStr = XEUtils.toDateString(ms.createDate, 'MM-dd HH:mm')
			this.chatList.push(ms)
			if (ms.messageInfo.type === 'Audio') {
				this.input = '我暂时不支持阅读该消息'
				this.send()
			}
			this.scrollBtm()
		},
		// 连接中
		connecting() {
			this.$message('连接中')
		},
		// 登录成功
		LoginSuccess() {
			this.$message({
				message: '连接成功',
				type: 'success'
			})
			// this.loading = false
		},
		// close IM 关闭 由于特殊情况导致连接断开会触发该方法 建议在该方法出发后出现弹窗提示用户确认重连
		close() {
			this.$message.error('连接已断开')
			if (this.userClose) return

			this.$alert('您的连接已经断开，点击确认后立即重新连接', '提示', {
				confirmButtonText: '确定',
				callback: action => {
					if (action == 'confirm') {
						this.init()
					}
				}
			})
			// 增加手动重连
		},
		endQuestion({ type, text }) {
			//答题中断
			console.warn(`答题结束`)
			this.$message(text)
			console.log(text)
		},
		question(q) {
			console.log(`收到导诊`)
			this.questionData = {
				id: q.questionCode,
				questionType: q.questionType,
				content: q.questionText,
				answers: q.answers,
				questionFromSource: q.questionFromSource
			}

			this.dialogVisible = true
		},
		renderHight(i) {
			const { myAns } = this
			if (myAns.includes(i.answerCode)) return `primary`
		},
		addMULTIPLE_CHOICE_INPUT(item) {
			console.log(item)
			const { answerCode } = item
			const { myAns } = this
			if (answerCode == `no`) {
				//独选
				this.myAns = [item.answerCode]
				this.messageShow = false
			} else {
				this.myAns = myAns.map(v => {
					if (v != answerCode && v != `no`) {
						return v
					}
				})
				if (answerCode == `other`) {
					this.messageShow = true
				}
			}
			if (myAns.includes(answerCode)) {
				//反选
				if (answerCode == `other`) {
					this.messageShow = false
				}
				this.myAns = myAns.map(v => {
					if (v != answerCode) {
						return v
					}
				})
			} else {
				this.myAns.push(item.answerCode)
			}
		},
		async selectSolution(item) {
			this.myAns = [item]
			const params = {
				answers: this.myAns
			}
			await this.im.answerQs(params)

			this.dialogVisible = false
		},
		async answer(flag) {
			const { myAns, questionData, otherMessage } = this
			if (flag == `MULTIPLE_CHOICE_INPUT`) {
				const arr = JSON.parse(JSON.stringify(questionData.answers))
				let answers = arr.filter(v => {
					if (myAns.includes(v.answerCode)) {
						if (v.answerCode == `other`) {
							v.answerText = otherMessage
						}
						return v
					}
				})
				const params = {
					answers
				}

				await this.im.answerQs(params)
				this.dialogVisible = false
			}
		},
		async groupInit(e) {
			this.group = e.group
			this.loading = true
			let r = await this.getGroupMessage() //获取当前聊天组信息
			if (r.error) {
				this.loading = false
				this.$message(r.error)
				return
			}
			// let h = await this.getHistory(); //获取聊天历史记录
			let h = await this.getHistory() //获取聊天历史记录
			// let h = await this.downCallback();
			if (h.error) {
				this.loading = false
				this.$message(h.error)
				return
			}
			this.loading = false
		}
	},
	beforeDestroy() {
		// this.userClose = true
		this.im.closeCore()
	},
	mounted() {
		linkUp
			.setEnv({
				env: sdkConst.env.H5,
				// __linkUpRuntime: 'QA'
				// __linkUpRuntime: 'PRE'
				__linkUpRuntime: 'TR'
			})
			.then(res => {
				console.log(res)
				this.owner = {
					userId: this.$route.query.userid
				}
				this.group = {
					groupId: this.$route.query.groupid
				}
				this.init()
			})
			.catch(err => {
				this.$message.error('配置文件加载失败')
			})
	}
}
</script>
<style lang="scss">
.consultation {
	width: 100%;
	// overflow: hidden;
	height: 100%;
	background: rgba(245, 245, 245, 1);

	.header {
		width: 1200px;
		margin: auto;
		position: relative;
		.pagetitle {
			color: #333;
			height: 74px;
			line-height: 74px;
			font-size: 18px;
			font-weight: 500;
			text-align: center;
		}
		.endConsultation {
			position: absolute;
			right: 0;
			top: 28px;
			z-index: 666;
		}
	}

	.search {
		color: #fff;
		background-color: $color-btn;
		border-color: $color-btn;
		border-radius: 2px;
		// margin-left: 70px;
	}
	.endConsultation {
		color: #fff;
		background-color: $color-end;
		border-color: $color-end;
		border-radius: 2px;
		// margin-left: 70px;
	}
	.doctorName {
		background: rgba(255, 255, 255, 1);
		border-radius: 4px;
		border: 1px solid rgba(230, 230, 230, 1);
		padding: 10px;
		color: #333333;
		font-size: 14px;
		display: inline-block;
		margin: 0 auto;
		// margin-top: 41px;
	}
	.home {
		overflow: hidden;
		width: 1200px;
		height: 782px;
		background: rgba(255, 255, 255, 1);
		border-radius: 4px;
		border: 1px solid rgba(230, 230, 230, 1);
		margin: auto;
		position: relative;
		.chatscroller {
			height: 100%;
			display: flex;
			flex-direction: column;
			padding-top: 32px;
			.chatbox {
				flex: 1;
				overflow: hidden;
				.chatList {
					max-height: 100%;
					overflow-y: scroll;
				}
				.chatItem {
					width: 100%;
					padding: 20px 12px;
					overflow: hidden;
					.time {
						color: #909399;
						font-size: 14px;
					}
					.message_container {
						// padding-left: 20px;
						// padding-right: 20px;
						max-width: 623px;
					}
					.doctor {
						color: #000;
						width: 100%;
						.text {
							background: rgba(245, 245, 245, 1);
							padding: 10px;
							border-radius: 4px;
							float: left;
						}
						.finish {
							padding: 10px;
							background: rgba(245, 245, 245, 1);
							color: #000;
						}
						.icon {
							padding-left: 20px;
						}
						.userIco {
							img {
								width: 40px;
								height: 40px;
								border-radius: 50%;
							}
						}
					}
					.user {
						width: 100%;
						.loading {
							color: #000;
						}
						// max-width: 623px;
						.icon {
							overflow: hidden;
							padding-right: 20px;
							.name {
								float: right;
							}
							.userIco {
								float: right;
								img {
									width: 40px;
									height: 40px;
									border-radius: 50%;
								}
							}
						}

						.message_container {
							text-align: right;
							float: right;
							color: #fff;
							max-width: 623px;
							position: relative;
							.finish {
								padding: 10px;
								background: #36c2aa;
								color: #fff;
							}
							.text {
								background: #36c2aa;
								padding: 10px;
								border-radius: 4px;
							}
							.loading {
								position: absolute;
								left: -30px;
								top: 32px;
							}
						}
					}
				}
			}
			.footer {
				height: 44px;
				// border-top: 1px solid #eee;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: 10px;
				// padding-top: 10px;
			}
		}
	}
}
</style>
