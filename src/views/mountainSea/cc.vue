
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
<div>
    <el-form-item label="照片" prop="answer">
        <el-button v-if="userInfo.highShotMeterType === '1'" @click="capPhoto">拍照上传</el-button>
        <el-button v-else id="photographPriAudio">拍照上传</el-button>
        <div class="showframe">
            <img v-if="userInfo.highShotMeterType === '2' || userInfo.highShotMeterType === '3' || userInfo.highShotMeterType === '4'" id="bigPriDev" alt="">
            <div v-if="userInfo.highShotMeterType === '1'" id="bigPriDev1"></div>
        </div>
    </el-form-item>
</div>
</el-form>
