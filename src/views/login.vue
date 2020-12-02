<template>
    <div class="login-container">
        <el-container style="height: 100vh">
            <el-header class="el-header-box"  v-if="realmName!=null && realmName != ''">
                {{realmName.companysortname}}药事服务门店端
            </el-header>
            <el-header class="el-header-box"  v-else>
                药事服务门店端
            </el-header>
            <el-main class="login-main login-input">
                <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on"
                         label-position="left">
                    <div class="title-container">
                        <div class="logo"  v-if="realmName!=null && realmName != ''">
                            <img :src="realmName.logopath" alt="logo">
                        </div>
                        <div class="logo"  v-else>
                            <img src="" alt="logo">
                        </div>
                        <h3 class="title">药事服务门店端</h3>
                    </div>
                    <el-form-item prop="username">
                        <span class="svg-container">
                            <i class="el-icon-user "></i>
                         </span>
                        <el-input
                            ref="username"
                            v-model="loginForm.loginid"
                            placeholder="请输入用户名"
                            name="loginid"
                            type="text"
                            tabindex="1"
                            autocomplete="off"
                        />
                    </el-form-item>
                    <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
                        <el-form-item prop="password">
                              <span class="svg-container">
                              <i class="el-icon-lock  "></i>
                              </span>
                            <el-input
                                :key="passwordType"
                                ref="password"
                                v-model="loginForm.loginpwd"
                                :type="passwordType"
                                placeholder="请输入登录密码"
                                name="loginpwd"
                                tabindex="2"
                                autocomplete="off"
                                @keyup.native="checkCapslock"
                                @blur="capsTooltip = false"
                                @keyup.enter.native="handleLogin"
                            />
                            <span class="show-pwd" @click="showPwd">
                    <!--            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />-->
                              </span>
                        </el-form-item>
                    </el-tooltip>
                    <el-button :loading="loading" type="primary"
                               style="width:100%;margin:15px 0;background-color: #1abc9c;"
                               @click.native.prevent="handleLogin">
                        登录
                    </el-button>
                </el-form>
            </el-main>
            <el-footer class="login-footer"  v-if="realmName!=null && realmName != ''">
                {{realmName.companyname}}远程药事服务平台
            </el-footer>
            <el-footer class="login-footer"  v-else>
                远程药事服务平台
            </el-footer>
        </el-container>
    </div>
</template>

<script>
import {validUsername} from '@/common/validate'
import {mapGetters}    from 'vuex'
export default {
    name: 'login',
    data() {
        const validateUsername = (rule, value, callback) => {
            if (!validUsername(value)) {
                callback(new Error('请输入用户名'))
            } else {
                callback()
            }
        }
        const validatePassword = (rule, value, callback) => {
            if (value.length < 6) {
                callback(new Error('密码长度不能少于6位'))
            } else {
                callback()
            }
        }
        return {
            loginForm: {
                loginid: '',
                loginpwd: '',
            },
            loginRules: {
                loginid: [ {required: true, trigger: 'blur', validator: validateUsername} ],
                loginpwd: [ {required: true, trigger: 'blur', validator: validatePassword} ]
            },
            passwordType: 'password',
            capsTooltip: false,
            loading: false,
            showDialog: false,
            redirect: undefined,
            otherQuery: {}
        }
    },
    watch: {
        $route: {
            handler: function (route) {
                const query = route.query
                if (query) {
                    this.redirect = query.redirect
                    this.otherQuery = this.getOtherQuery(query)
                }
            },
            immediate: true
        }
    },
    computed: {
        ...mapGetters([
            'storeInfo',
            'realmName'
        ])
    },
    sockets: {
        connect: function () {
            console.log('socket 链接成功--------------------')
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
        // 登录成功
        loginback: function (data) {
            if (data.status === 207) {
                this.$confirm(data.msg, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$socket.emit('loginshop', JSON.stringify({
                        loginid: this.loginForm.loginid,
                        loginpwd: this.loginForm.loginpwd,
                        again: 1
                    }))
                }).catch(err => {
                    this.$message.warning('已取消')
                })
            } else if (data.status === 200) {
                if (data.data) {
                    sessionStorage.setItem('isLogin', 1)
                    this.$store.commit('user/SET_TOKEN', data.data.userid)
                    this.$store.commit('user/SET_USERINFO', data.data)
                    sessionStorage.setItem('companyUrl', 'yes')
                    sessionStorage.setItem('needUserid', data.data.userid)
                    sessionStorage.setItem('needCompanyid', data.data.companyid)
                    sessionStorage.setItem('neddHighShotMeterType', data.data.highShotMeterType)
                    this.$store.commit('app/SET_CALLFLAGE', false)
                    this.loading = false
                    this.$router.replace({path: '/dashboard'})
                }
            } else {
                this.$message.error(data.msg)
                this.loading = false
                return false
            }
        }
    },
    mounted() {
        window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
        window.addEventListener('unload', e => this.unloadHandler(e))
        if (this.loginForm.username === '') {
            this.$refs.username.focus()
        } else if (this.loginForm.password === '') {
            this.$refs.password.focus()
        }
        //防止页面后退
        history.pushState(null, null, document.URL);
        window.addEventListener('popstate', function () {
            history.pushState(null, null, document.URL);
        });
        this.getRealm()
    },
    methods: {
        getRealm(){
            let that = this
            that.realIntv=setInterval(() => {
                if (that.realmName) {
                    console.log(this.realmName);
                    console.log('域名获取的信息' + this.realmCount);
                    that.$nextTick(() => {

                        that.logopath =  that.realmName.logopath
                        that.companyname=that.realmName.companyname
                    })
                    console.log(that.realmName.companyname);
                    clearInterval(that.realIntv)
                } else {
                    if (that.realmCount > 30){
                        clearInterval(that.realIntv)
                    }
                }
                that.realmCount ++
            }, 1000)
        },
        checkCapslock({shiftKey, key} = {}) {
            if (key && key.length === 1) {
                if (shiftKey && ( key >= 'a' && key <= 'z' ) || !shiftKey && ( key >= 'A' && key <= 'Z' )) {
                    this.capsTooltip = true
                } else {
                    this.capsTooltip = false
                }
            }
            if (key === 'CapsLock' && this.capsTooltip === true) {
                this.capsTooltip = false
            }
        },
        showPwd() {
            if (this.passwordType === 'password') {
                this.passwordType = ''
            } else {
                this.passwordType = 'password'
            }
            this.$nextTick(() => {
                this.$refs.password.focus()
            })
        },
        handleLogin() {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    this.loading = true
                    this.$socket.emit('loginshop', JSON.stringify({
                        loginid: this.loginForm.loginid,
                        loginpwd: this.loginForm.loginpwd
                    }))
                    this.$store.commit('app/SET_LOGINID', this.loginForm.loginid)
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        get_VideoKey(form) {
            const that = this
            this.$store.dispatch('app/getKey', form).then(res => {
                that.$router.replace({path: '/dashboard'})
                this.$store.commit('app/SET_CALLFLAGE', false)
                this.loading = false
            }).catch(err => {
                this.loading = false
            })
        },
        getOtherQuery(query) {
            return Object.keys(query).reduce((acc, cur) => {
                if (cur !== 'redirect') {
                    acc[ cur ] = query[ cur ]
                }
                return acc
            }, {})
        },
        beforeunloadHandler() {
            this._beforeUnload_time = new Date().getTime()
        },
        unloadHandler(e) {
            this._gap_time = new Date().getTime() - this._beforeUnload_time
            //判断是窗口关闭还是刷新
            if (this._gap_time <= 5) {
                //如果是登录状态，关闭窗口前，移除用户
                // if (!this.showLoginButton) {
                //     $.ajax({
                //         url: '/pictureweb/user/remove',
                //         type: 'get',
                //         async: false, //或false,是否异步
                //
                //     })
                // }
                // return "您的文章尚未保存！";
                localStorage.removeItem('token')
            }else {

            }
        }
    },
    created() {
        this.$store.commit('app/SET_ROUTER', '')
    },
}
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
                border: 0px;
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
            border: 1px solid #dbdbdb;
            background: #ffffff;
            border-radius: 5px;
            color: #454545;
        }
    }

  //  $bg: #2d3a4b;
    $dark_gray: #889aa4;
    $light_gray: #eee;

    .login-container {
        height: 100%;
        width: 100%;
/*        background-color: $bg;*/
        overflow: hidden;
        font-family: 'Arial Negreta', 'Arial Normal', 'Arial';

        .login-input {
            & /deep/ .el-input input {
                background: transparent;
                border: 0;
                -webkit-appearance: none;
                border-radius: 0;
                padding: 12px 5px 12px 15px;
                color: black;
                height: 47px;
                caret-color: black;
            }
        }

        .el-header-box, .login-footer {
            height: 70px !important;
            background: inherit;
            background-color: rgba(240, 248, 250, 1);
            border: none;
            border-radius: 0px;
            line-height: 70px;
            font-weight: 700;
            font-style: normal;
            font-size: 28px;
            color: #36C2AA;
        }

        .el-header-box {
            height: 100px !important;
            line-height: 100px;
        }

        .login-main {
            background: url("~@/assets/img/login-bg.png") no-repeat;
            -webkit-background-size: 100% 100%;
            background-size: 100% 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .login-footer {
            text-align: center;
            font-weight: 700;
        }

        .login-form {
            background-color: #fff;
            position: relative;
            width: 450px;
            height: 420px;
            padding: 20px 25px 70px 25px;
            margin: 0 auto;
            overflow: hidden;

            .logo {

                padding-bottom: 10px;
                height: 80px;
                text-align: center;

                img {
                    height: 100%;
                }
            }
        }

        .tips {
            font-size: 14px;
            color: #fff;
            margin-bottom: 10px;

            span {
                &:first-of-type {
                    margin-right: 16px;
                }
            }
        }

        .svg-container {
            font-size: 30px;
            padding: 6px 5px 6px 10px;
            color: $dark_gray;
            vertical-align: middle;
            width: 41px;
            display: inline-block;
        }

        .title-container {
            position: relative;

            .title {
                font-family: '微软雅黑 Bold', '微软雅黑';
                font-weight: 700;
                font-style: normal;
                font-size: 24px;
                color: #1ABC9C;
                line-height: 28px;
                text-align: center;
                margin-bottom: 22px;
            }
        }

        .show-pwd {
            position: absolute;
            right: 10px;
            top: 7px;
            font-size: 16px;
            color: $dark_gray;
            cursor: pointer;
            user-select: none;
        }

        .thirdparty-button {
            position: absolute;
            right: 0;
            bottom: 6px;
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

