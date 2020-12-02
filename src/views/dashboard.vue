<template>
    <div class="login-container">
        <el-container style="height: 100%">
            <el-header class="el-header-box">
                <div class="left">
                    <span v-if="realmName!=null && realmName != ''">{{realmName.companysortname}}药事服务门店端</span>
                    <span v-else>药事服务门店端</span>

                    <span style="font-size: 18px; font-weight: normal">({{userInfo.deptname}})</span>
                    <!--智云-->
<!--                    <img src="../assets/img/qeys.png" class="penguin-doctor" @click="checkZnsf" alt="">-->
                </div>
                <ul class="right">
                    <router-link to="/home/userSeting" tag="li" exact-active-class exact>
                        <i class="user-Seting-img"></i>
                        <span>账户设置</span>
                    </router-link>
                    <li @click="routerTO">
                        <i class="logout"></i>
                        <span>退出登录</span>
                    </li>
                </ul>
            </el-header>
            <el-main class="login-main">
                <ul v-if="menuList.length < 8" class="main-ul main-ul1">
                    <li v-for="(item, index) in menuList" :key="index" class="main-li" @click="toLink(item)">{{item.opname}}</li>
                </ul>
                <ul v-if="menuList.length == 8" class="main-ul main-ul2">
                    <li v-for="(item, index) in menuList" :key="index" class="main-li" @click="toLink(item)">{{item.opname}}</li>
                </ul>
                <ul v-if="menuList.length >= 9 && menuList.length <= 10" class="main-ul main-ul3">
                    <li v-for="(item, index) in menuList" :key="index" class="main-li" @click="toLink(item)">{{item.opname}}</li>
                </ul>
                <ul v-if="menuList.length >= 11 && menuList.length <= 12" class="main-ul main-ul4">
                    <li v-for="(item, index) in menuList" :key="index" class="main-li" @click="toLink(item)">{{item.opname}}</li>
                </ul>
                <ul v-if="menuList.length >= 13 && menuList.length <= 14" class="main-ul main-ul5">
                    <li v-for="(item, index) in menuList" :key="index" class="main-li" @click="toLink(item)">{{item.opname}}</li>
                </ul>
            </el-main>
            <el-footer class="login-footer" v-if="realmName!=null && realmName != ''">{{realmName.companyname}}远程药事服务平台</el-footer>
            <el-footer class="login-footer" v-else>远程药事服务平台</el-footer>
        </el-container>
    </div>
</template>

<script>
    import { mapGetters } from "vuex";
    import { penguinDoctor } from "@/api/app";
    export default {
        name: "dashboard",
        data() {
            return {
                companyId: sessionStorage.getItem("needCompanyid"),
                menuList: []
            };
        },
        mounted() {
            history.pushState(null, null, document.URL);
            window.addEventListener("popstate", function() {
                history.pushState(null, null, document.URL);
            });
        },
        created() {
            console.log(this.userInfo);
            this.getMenu()
            this.$store.commit("app/SET_CALLFLAGE", false);
            this.$store.commit("app/SET_ROUTER", "");
        },
        computed: {
            ...mapGetters([
                "storeInfo",
                "userInfo",
                "realmName",
                'loginid'
            ])
        },
        sockets: {
            connect: function() {
                console.log("链接成功");
            },
            connecting: function() {
                console.log("正在连接");
            },
            connect_failed: function() {
                console.log("连接失败");
            },
            disconnect: function() {
                console.log("断开连接");
            },
            error: function() {
                console.log("错误发生，并且无法被其他事件类型所处理");
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
            routerTO() {
                this.$store.commit("user/SET_REMOVERINFO");
                this.$socket.disconnect();
                sessionStorage.setItem("needUserid", "");
                sessionStorage.setItem("needCompanyid", "");
                this.$router.replace("/login");
            },
            toLink (item) {
                console.log(item.homeurl);
                if (item.opname === '企鹅医生') {
                    let params = {
                        companyid: this.userInfo.companyid,
                        erppointid: this.userInfo.erppointid
                    };
                    penguinDoctor(params).then(response => {
                        console.log(response);
                        const { data } = response;
                        window.open(
                            data,
                            "_blank",
                            "width=375px,height=667px,top=100px,left=0px"
                        );
                    });
                } else if (item.opname === '社区580') {
                    this.$store.dispatch('inquiry/status', this.userInfo.userpkid).then(res => {
                        if (res.status === 200) {
                            if (res.data != null) {
                                window.open(res.data)
                            } else {
                                window.open('/inquiry')
                            }
                        }
                    }).catch(err => {
                        console.log(err);
                    })
                } else if (item.opname === '智云') {
                    window.open('/znsf')
                } else if (item.opname === '山屿海') {
                    window.open('/mountainSea')
                } else {
                    this.$router.push({
                        path: item.homeurl
                    });
                }
            },
            //获取菜单
            getMenu () {
                // 15601866197_test
                this.$store.dispatch('user/findnavtree', {loginid: this.loginid}).then(res => {
                    console.log(res);
                    if (res.status === 200) {
                        console.log(res.data[0].children);
                        this.menuList = res.data[0].children
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            // 企鹅医生
            // checkPenguin() {
            //     let params = {
            //         companyid: this.userInfo.companyid,
            //         erppointid: this.userInfo.erppointid
            //     };
            //     penguinDoctor(params).then(response => {
            //         console.log(response);
            //         const { data } = response;
            //         window.open(
            //             data,
            //             "_blank",
            //             "width=375px,height=667px,top=100px,left=0px"
            //         );
            //     });
            // },
        },
        beforeDestroy() {
            window.location.reload();
        }
    };
</script>


<style lang="scss" scoped>
    /* 修复input 背景不协调 和光标变色 */
    /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

    $bg: #fff;
    $light_gray: black;
    $cursor: black;

    @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
        .login-container .el-input input {
            color: $cursor;
        }
    }

    /* reset element-ui css */
    .login-container {
        .el-input {
            display: inline-block;
            height: 47px;
            width: 85%;

            input {
                background: transparent;
                -webkit-appearance: none;
                border-radius: 0px;
                padding: 12px 5px 12px 15px;
                color: $light_gray;
                height: 47px;
                caret-color: $cursor;

                &:-webkit-autofill {
                    box-shadow: 0 0 0px 1000px $bg inset !important;
                    -webkit-text-fill-color: $cursor !important;
                }
            }
        }

        .el-form-item {
            /*border: 1px solid #dbdbdb;*/
            background: #ffffff;
            border-radius: 5px;
            color: #454545;
        }
    }
</style>

<style lang="scss" scoped>
    $bg: #2d3a4b;
    $dark_gray: #889aa4;
    $light_gray: #eee;

    .login-container {
        height: 100%;
        width: 100%;
        background-color: $bg;
        overflow: hidden;
        font-family: "Arial Negreta", "Arial Normal", "Arial";

        .el-header-box {
            height: 90px !important;
            background: inherit;
            background-color: #fff;
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

            .right {
                font-style: normal;
                font-size: 16px;
                color: #666;
                display: flex;
                justify-content: space-around;
                align-items: center;

                li {
                    width: 150px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .logout {
                        background: url("../assets/img/logout.png");
                        background-size: cover;
                    }

                    .user-Seting-img {
                        background: url("../assets/img/user.png");
                        background-size: cover;
                    }

                    i {
                        display: inline-block;
                        width: 30px;
                        height: 30px;
                    }

                    span {
                        padding-left: 10px;
                    }

                    &:hover {
                        cursor: pointer;
                    }
                }
            }
        }

        .login-main {
            background: url("~@/assets/img/login-bg.png") no-repeat;
            -webkit-background-size: 100% 100%;
            background-size: 100% 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            .main-ul {
                /*width: 100%;*/
                /*display: flex;*/
                /*justify-content: space-around;*/
                /*align-items: center;*/
                /*flex-wrap: nowrap;*/
                .main-li {
                    cursor: pointer;
                    background-color: #fff;
                    height: 176px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 176px;
                    border-radius: 50%;
                    text-align: center;
                    border: 1px solid #49c7b2;
                    font-size: 20px;
                    box-shadow: 0 12px 14px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
                    color: #49c7b2;
                    float: left;
                    margin-right: 24px;
                    margin-bottom: 24px;
                }
            }
            .main-ul1{ /*图标小于8*/
                width: 1400px;
            }
            .main-ul2{ /*图标等于8*/
                width: 800px;
            }
            .main-ul3{ /*图标>=9 && <=10*/
                width: 1000px;
            }
            .main-ul4{/*图标>=11 && <=12*/
                width: 1200px;
            }
            .main-ul5{/*图标>=13 && <=14*/
                width: 1400px;
            }
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
            font-style: normal;
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
    .penguin-doctor {
        cursor: pointer;
        width: 200px;
        height: 65px;
        margin-left: 50px;
        vertical-align: middle;
    }
</style>

