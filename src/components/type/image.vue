<template>
  <div class="imgbox">
    <el-image
      fit="fit"
      style="width: 140px; height: 72px"
      :src="msg.body.fileUrl || msg.body.thumbnail||'../../assets/img/pic.png'"
      @click="cg"
    ></el-image>
    <el-dialog :visible.sync="dialogVisible">
      <el-image
        style="margin:auto;display:block"
        width="100%"
        :src="msg.body.url || msg.body.fileUrl || msg.body.fileUrl"
        alt
      ></el-image>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: ["msg"],
  data() {
    return {
      dialogVisible: false
    };
  },
  methods: {
    cg() {
      this.dialogVisible = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.imgbox {
  img {
    width: 200px;
    height: 200px;
  }
}
</style>
