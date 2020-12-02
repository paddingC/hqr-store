<template>
    <div class="login-container" style="height: 100%">
        <el-container style="height: 100%;">
            <el-header class="el-header-box">
                <div class="left">
                    <p v-if="realmName!=null && realmName != ''">
                        {{realmName.companysortname}}药事服务门店端
                    </p>
                    <p v-else>
                        药事服务门店端
                    </p>
                    <span style="font-size: 18px; font-weight: normal">
                        ({{userInfo.deptname}})
                    </span>
                </div>
                <ul class="center">
                    <img v-if="isleft" @click="leftEvent" class="icon_ icon_left" src="@/assets/img/left_arrow.png" />
                    <img v-if="isright" @click="rightEvent" class="icon_ icon_right" src="@/assets/img/right_arrow.png" />
<!--                    <ul class="centerScroll">-->
<!--                        <li :class="{active:item.to===activeRouer}" v-for="(item ,index) in routerList1"-->
<!--                            @click="setRoute(item.to)"-->
<!--                            tag="li" :key="index">-->
<!--                            <i :class="item.className"></i> <span>{{item.name}}</span>-->
<!--                        </li>-->
<!--                    </ul>-->
                    <ul class="centerScroll">
                        <li :class="{active:item.homeurl===activeRouer}" v-for="(item ,index) in routerList1"
                            @click="setRoute(item.homeurl)"
                            tag="li" :key="index">
                            <img :src="item.iconcls"> <span>{{item.opname}}</span>
                        </li>
                    </ul>
                </ul>
                <ul class="right">
                    <li :class="{active:item.to===activeRouer}" v-for="(item ,index) in routerList2"
                        @click="setRoute(item.to)"
                        tag="li" :key="index">
                        <i :class="item.className"></i> <span>{{item.name}}</span>
                    </li>
                </ul>
            </el-header>
            <el-main class="login-main">
                <slot>
                    <router-view/>
                </slot>
            </el-main>
            <el-footer class="login-footer" v-if="realmName!=null && realmName != ''">
                {{realmName.companyname}}远程药事服务平台
            </el-footer>
            <el-footer class="login-footer" v-else>
                远程药事服务平台
            </el-footer>
        </el-container>
    </div>
</template>

<script>
    import $ from 'jquery';
    import {mapGetters, mapMutations} from 'vuex'
    export default {
        name: "Layout",
        data() {
            return {
                routerList1: [],
                routerList2: [
                    {
                        to: '/logout',
                        className: 'logout',
                        name: '退出登录'
                    }, {
                        to: '/home/userSeting',
                        className: 'user-Seting-img',
                        name: '账户设置'
                    }, {
                        to: '/dashboard',
                        className: 'toindex',
                        name: '返回首页'
                    }
                ],
                defartIndex: 0,
                ulNum: 0,
                isleft: false,
                isright: true
            }
        },
        computed: {
            ...mapGetters([
                'storeInfo',
                'userInfo',
                'activeRouer',
                'callFlage',
                'realmName',
                'loginid'
            ])
        },
        sockets: {
            connect: function () {
                console.log('链接成功')
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
            otheruserlogin: function (data) {
                if (data.status === 400) {
                    this.$message.warning(data.msg)
                    setTimeout(() => {
                        this.$store.commit('user/SET_REMOVERINFO')
                        sessionStorage.setItem('needUserid', '')
                        sessionStorage.setItem('needCompanyid', '')
                        this.$socket.disconnect()
                        this.$router.push({
                            path: '/'
                        })
                    }, 1000)
                }
            }
        },
        methods: {
            getMenu () {
                this.$store.dispatch('user/findnavtree', {loginid: this.loginid}).then(res => {
                    console.log(res);
                    if (res.status === 200) {
                        this.routerList1 = res.data[0].children
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            rightEvent () {
                this.isleft = true
                if (this.defartIndex >= this.routerList1.length - 8) {
                    this.isright = false
                }else{
                    this.defartIndex++
                    this.ulNum = this.ulNum -150
                    $('.centerScroll').animate({left:this.ulNum},300);
                }
            },
            leftEvent () {
                if (this.defartIndex < 1) {
                    this.isleft = false
                }else{
                    this.defartIndex--
                    this.isright = true
                    this.ulNum = this.ulNum + 150
                    $('.centerScroll').animate({left:this.ulNum},300);
                }
            },
            setRoute(path) {
                if (this.callFlage) {
                    let url = window.location.href
                    if (url.includes('/home/remoteReferral/connectPhysician')) {
                        this.$message.warning('门店结束复诊后在进行本操作')
                        return false
                    } else {
                        this.$message.warning('请在结束视频通话后进行本操作')
                        return false
                    }
                }
                if (path === '/logout') {
                    this.$store.commit('user/SET_REMOVERINFO')
                    this.$socket.disconnect()
                    this.$message.success('退出成功')
                    sessionStorage.setItem('needUserid', '')
                    sessionStorage.setItem('needCompanyid', '')
                    this.$router.push({
                        path: '/'
                    })
                    return false
                }
                let pathNow = this.$route.path
                if (pathNow === path) {
                    window.location.reload()
                    return false
                }
                this.$router.push({
                    path: path
                })
                this.$store.commit('app/SET_ROUTER', path)
            }
        },
        created() {
            this.getMenu()
        },
        mounted() {
            // this.setRoute()
            // this.$store.commit('app/SET_ROUTER', path)
            console.log(this.activeRouer)
            console.log(this.routerList1.length);

            setTimeout(() => {
                console.log(this.routerList1.length);
                this.isright = this.routerList1.length > 8
            }, 1000)
        },
        beforeDestroy(){
            window.location.reload()
        }
    }
</script>
<style lang="scss" scoped>
    $bg: #2d3a4b;
    $dark_gray: #889aa4;
    $light_gray: #eee;
    .active {
        color: #36c2aa;
    }

    .login-container {
        width: 100%;
        background-color: $color-common;;

        font-family: 'Arial Negreta', 'Arial Normal', 'Arial';

        .el-header-box {
            height: 90px !important;
            background: inherit;
            background-color: rgba(240, 248, 250, 1);
            border: none;
            border-radius: 0px;
            line-height: 90px;
            display: flex;
            justify-content: space-between;
            .left {
                /*font-weight: 700;*/
                font-style: normal;
                font-size: 24px;
                color: #666;
            }

            .center {
                position: relative;
                /*flex: 1;*/
                text-align: right;
                /*padding-left: 125px;*/
                font-style: normal;
                font-size: 20px;
                color: #666;
                width: 1200px;
                z-index: 99;
                overflow: hidden;
                /*display: flex;*/
                /*justify-content: center;*/
                .icon_{
                    position: absolute;
                    top: 22px;
                    width: 33px;
                    height: 42px;
                    vertical-align: middle;
                    cursor: pointer;
                    z-index: 999;
                }
                .icon_left{
                    left: 0px;
                }
                .icon_right{
                    right: 0px;
                }
                .centerScroll{
                    position: relative;
                    width: 4000px;
                    height: 90px;
                    overflow: hidden;
                    text-align: right;
                    li{
                        float: left!important;
                    }
                    img{
                        width: 32px;
                        height: 32px;
                    }
                }
                li {
                    height: 100%;
                    float: left;
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    flex-direction: column;
                    width: 150px;
                    .remoteAuditing-img {
                        background: url("../assets/img/remoteAuditing.png") no-repeat center;
                        background-size: 32px 32px;
                    }
                    .chronicDisease-img {
                        background: url("../assets/img/chronicDisease.png") no-repeat center;
                        /*background-size: contain;*/
                        background-size: 32px 32px;
                    }
                    .drugAdministration-img {
                        background: url("../assets/img/drugAdministration.png") no-repeat center;
                        background-size: 32px 32px;
                    }
                    .pharmacyAudit-img {
                        background: url("../assets/img/pharmacyAudit.png") no-repeat center;
                        background-size: 32px 32px;
                    }
                    .medicationGuidance-img {
                        background: url("../assets/img/medicationGuidance.png") no-repeat center;
                        background-size: 32px 32px;
                    }
                    .historyRecipel-img {
                        background: url("../assets/img/historyRecipel.png") no-repeat center;
                        background-size: 32px 32px;
                    }

                    i {
                        font-size: 60px;
                        height: 50px;
                        width: 50px;
                        text-align: center;
                        display: inline-block;
                        margin-bottom: 10px;
                        /*width: 30px;*/
                        /*height: 30px;*/
                    }

                    span {

                        font-size: 16px;
                        line-height: 30px;
                    }

                    &:hover {
                        cursor: pointer;
                    }
                }
            }

            .right {
                font-style: normal;
                font-size: 14px;
                color: #666;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;

                li {
                    //text-align: right;
                    width: 150px;
                    height: 30px;
                    line-height: 30px;

                    .logout {
                        background: url("../assets/img/logout.png");
                        background-size: cover;
                        width: 15px;
                        height: 15px;
                    }

                    .user-Seting-img {
                        background: url("../assets/img/user.png");
                        background-size: cover;
                        width: 15px;
                        height: 15px;
                    }

                    .toindex {
                        background: url("../assets/img/toindex.png");
                        background-size: cover;
                        width: 15px;
                        height: 15px;
                    }

                    i {
                        font-size: 18px;
                        display: inline-block;
                    }

                    span {
                        padding-left: 10px;
                        font-size: 16px;
                    }

                    &:hover {
                        cursor: pointer;
                    }
                }
            }
        }

        .login-main {
            /*background: url("~@/assets/img/login-bg.jpg") no-repeat;*/
            /*-webkit-background-size: 100% 100%;*/
            /*background-size: 100% 100%;*/
            background-color: rgb(242, 242, 242);
            overflow: auto;
            /*height: 750px;*/
            /*min-height: 750px;*/
            height: calc(100vh - 44px - 90px);
            color: #454545;
            padding: 20px 130px !important;
            box-sizing: border-box;

        }

        .login-footer {
            text-align: center;
            height: 44px !important;
            background: inherit;
            background-color: rgba(240, 248, 250, 1);
            border: none;
            border-radius: 0px;
            line-height: 44px;
            /*font-weight: 700;*/
            font-size: 16px;
            color: #666;
        }


        @media only screen and (max-width: 470px) {
            .thirdparty-button {
                display: none;
            }
        }
    }

    .el-input {
        background-color: #fff !important;
    }
</style>
