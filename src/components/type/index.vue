<template>
	<div>
		<div v-if="item.messageInfo.type == 'Text'">
			<msg-text :msg="item.messageInfo"></msg-text>
		</div>
		<div v-if="item.messageInfo.type == 'Image'">
			<msg-image :msg="item.messageInfo"></msg-image>
		</div>
		<div v-if="item.messageInfo.type == 'RichLink'">
			<msg-richlink :msg="item.messageInfo"></msg-richlink>
		</div>
		<!-- <div class="text"> -->
			<div v-if="item.messageInfo.type == 'Finish'" class="finish">{{ item.messageInfo.body.text }}</div>
		<!-- </div> -->

		<div v-if="item.messageInfo.type == 'Audio'" class="finish">暂不支持该数据类型</div>
		<div v-if="item.messageInfo.type == 'FinishNoReply'" class="finish">当前咨询医生暂无回复，建议更换医生咨询</div>
		<div v-if="item.messageInfo.type == 'SysText'" class="finish">{{ item.messageInfo.body.text }}</div>
	</div>
</template>
<script>
import msgText from './text'
import msgImage from './image'
import msgRichlink from './msgRichlink'
export default {
	components: { msgText, msgImage, msgRichlink },
	props: ['item'],
	mounted() {}
}
</script>
