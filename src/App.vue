<template>
    <div id="app">
        <!--		<Layout>-->
        <router-view/>
        <!--		</Layout>-->
    </div>
</template>

<script>
import Layout from "@/layouts"
import {mapGetters}    from 'vuex'
export default {
    name: "App",
    components: {
        Layout
    },
    computed: {
        ...mapGetters([
            'userInfo'
            // ...
        ])
    },
    created() {
        try {
            document.body.removeChild(document.getElementById('appLoading'))
            setTimeout(function () {
                document.getElementById('app').style.display = 'block'
            }, 500)
        } catch (e) {

        }
    },
    mounted () {
        console.log(sessionStorage.getItem('needUserid'));
        console.log(sessionStorage.getItem('needCompanyid'));
    },
    sockets: {
        connect: function () {
            console.log('初始化SOCKET 链接成功--------------------')
            this.$socket.emit('login', JSON.stringify({
                userid: sessionStorage.getItem('needUserid'),
                companyid: sessionStorage.getItem('needCompanyid')
            }));
            this.$socket.emit('webSocketLogin', {
                companyId: this.userInfo.companyid,
                linkType: 1,
                webSocketId: this.userInfo.userpkid
            })
        },
        connecting: function () {
            console.log('正在连接')
        },
        connect_failed: function () {
            console.log('连接失败')
        },
        error: function () {
            console.log('错误发生，并且无法被其他事件类型所处理')
        },
        webSocketLoginback: function (data) {
            console.log(data);
        },
    },
}

</script>

<style lang="scss">
    @import "./style/normalize.scss";
    @import "./style/reset.scss";
    @import "./style/common.scss";
    @import "~@/assets/iconfont/iconfont.css";

    #app {
        font-size: $font-size-base;
        color: $color-common;
        font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "SF UI Text",
        "Helvetica Neue", STHeiti, "Microsoft Yahei", Tahoma, Simsun, sans-serif;
        min-width: 1570px;
        height: 100vh;
        box-sizing: border-box;
        overflow: auto;
    }

    .el-main {
        padding: 10px !important;
    }

    .el-form-item__label, .el-input__inner, .el-button {
        font-size: 16px !important;
    }
    .el-image-viewer__close {
        color: red;
    }

</style>
