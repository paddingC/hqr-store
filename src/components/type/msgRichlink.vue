<template>
  <div class="richLink">
    <div class="richLinkContainer">
      <div class="title">
        {{ msg.body.linkTitle }}
        <img :src="msg.body.linkImg" alt="" class="icon" />
      </div>
      <div class="detail">
        {{ msg.body.linkDetail }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['msg']
};
</script>
<style lang="scss" scoped>
.richLink {
  overflow: hidden;
  .richLinkContainer {
    border-radius: 5px;
    float: right;
    padding: 10px;
    padding-left: 40px;
    position: relative;
     background: #36c2aa;
    .detail {
    }
    .icon {
      left: 0;
      top: 0;
      width: 40px;
    }
  }
}
</style>
