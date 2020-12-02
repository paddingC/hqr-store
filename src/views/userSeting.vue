<template>
    <div class="userSeting" v-loading="loading">
        <el-tabs type="border-card" v-model="activeName">
            <el-tab-pane label="我的账户" name="first">
                <el-form :inline="true" :model="companyInfo" label-width="120px" class="form-inline">
                    <el-form-item label="用户姓名">
                        <el-input class="inputL" disabled="" v-model="companyInfo.username"
                                  placeholder="用户姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="药店全称">
                        <el-input class="inputL" disabled="" v-model="companyInfo.deptname"
                                  placeholder="药店全称"></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话">
                        <el-input class="inputL" v-model="companyInfo.telephone" placeholder="联系电话"></el-input>
                    </el-form-item>
                    <el-form-item label="药店地址">
                        <el-input class="inputL" v-model="companyInfo.address" placeholder="药店地址"></el-input>
                    </el-form-item>
                    <el-form-item label="注册日期">
                        <el-input class="inputL" disabled="" v-model="companyInfo.credate"
                                  placeholder="注册日期"></el-input>
                    </el-form-item>
                    <el-form-item style="width:840px; padding-left: 120px;margin-top: 50px;">
                        <el-button class="search" @click="onSubmit" :loading="companyLoading">提交</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>

            <el-tab-pane label="修改密码" name="second">
                <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="120px"
                         class="demo-ruleForm">
                    <el-form-item required label="原密码" prop="oldpwd">
                        <el-input style="width: 400px" type="password" v-model="ruleForm.oldpwd"></el-input>
                    </el-form-item>
                    <el-form-item required label="新密码" prop="newpwd">
                        <el-input style="width: 400px" type="password" v-model="ruleForm.newpwd"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item required label="确认新密码" prop="againpwd">
                        <el-input type="password" style="width: 400px" v-model="ruleForm.againpwd"
                                  autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" class="search" @click="submitForm('ruleForm')"
                                   :loading="passwordLoading">提交
                        </el-button>
                        <el-button @click="resetForm('ruleForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="硬件管理" name="third">
                <el-form :inline="true" :model="formSet" label-width="120px" style="left: 42px;top: 68px;position: absolute">
                    <el-form-item label="高拍仪型号">
                        <el-select v-model="formSet.highShotMeterType" placeholder="请选择"  style="width: 286px">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div style="left: 162px;position: absolute">
                    <el-button class="search" @click="saveSet('formSet')">保 存</el-button>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
export default {
    name: "userSeting",
    data() {
        var checkPassOld = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入密码'))
            }
            setTimeout(() => {
                callback()
            }, 1000)
        }
        var newpwd = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'))
            } else {
                if (this.ruleForm.againpwd !== '') {
                    this.$refs.ruleForm.validateField('againpwd')
                }
                callback()
            }
        }
        var againpwd = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'))
            } else if (value !== this.ruleForm.newpwd) {
                callback(new Error('两次输入密码不一致!'))
            } else {
                callback()
            }
        }
        return {
            loading: false,
            passwordLoading: false,
            companyLoading: false,
            appMsg: {},
            companyInfo: {
                address: '',
                telephone: '',
                deptid: '',
                enterdate: ''
            },
            activeName: 'first',
            ruleForm: {
                newpwd: '',
                againpwd: '',
                oldpwd: '',
                loginid: ''
            },
            formSet: {
                highShotMeterType: sessionStorage.getItem('neddHighShotMeterType')
            },
            options: [
                {
                    value: '1',
                    label: '点易拍Q15'
                }, {
                    value: '2',
                    label: '良田S300L'
                }, {
                    value: '3',
                    label: '良田S818YJ'
                }, {
                    value: '4',
                    label: '良田S200L'
                }
            ],
            rules: {
                oldpwd: [
                    {validator: checkPassOld, trigger: 'blur'}
                ],
                newpwd: [
                    {validator: newpwd, trigger: 'blur'}
                ],
                againpwd: [
                    {validator: againpwd, trigger: 'blur'}
                ],
            }
        }
    },
    computed: {
        // 使用对象展开运算符将 getter 混入 computed 对象中
        ...mapGetters([
            'appInfo',
            'userInfo'
            // ...
        ])
    },
    methods: {
        ...mapActions({
            'saveCompanyInfo': 'user/saveCompanyInfo',
            'changepassword': 'user/changepassword',
            'getInfo': 'user/getInfo',
            'saveUserConfig': 'user/saveUserConfig',
            'getUserInfo': 'user/getUserInfo'
        }),
        onSubmit() {
            this.companyLoading = true
            this.saveCompanyInfo(this.companyInfo)
                .then(res => {
                    this.$message.success('修改成功')
                    this.getConfig()
                    this.companyLoading = false
                })
                .catch(err => {
                    console.log(err)
                    this.companyLoading = false
                })
        },
        submitForm(formName) {
            this.passwordLoading = true
            this.$refs[ formName ].validate((valid) => {
                if (valid) {
                    const {name} = this.userInfo.token
                    this.ruleForm.loginid = name
                    this.changepassword(this.ruleForm)
                        .then(res => {
                            this.$message.success("修改成功")
                            this.passwordLoading = false
                        }).catch(err => {
                        this.passwordLoading = false
                        console.log(err)
                    })
                } else {
                    console.log('error submit!!')
                    this.passwordLoading = false
                    return false
                }
            })
        },
        saveSet () {
            this.saveUserConfig({
                companyId: this.userInfo.companyid,
                data: {
                    userid: this.userInfo.userid,
                    highShotMeterType: this.formSet.highShotMeterType
                }
            }).then(res => {
                if(res.status === 200) {
                    this.$store.commit('user/SET_USERINFO_height', this.formSet.highShotMeterType)
                    sessionStorage.setItem('neddHighShotMeterType', this.formSet.highShotMeterType)
                    this.$message.success('更改高拍仪配置成功')
                }
            }).catch(err => {
                console.log(err);
            })
        },
        resetForm(formName) {
            this.$refs[ formName ].resetFields()
        },
        getConfig() {
            this.getUserInfo({
                data: this.userInfo.userid
            }).then(res => {
                if (res.status === 200) {
                    this.companyInfo = res.data
                }
            }).catch(err => {
                console.log(err);
            })
        }
    },
    mounted () {
        this.getConfig()
    },
    created() {
        let path = this.$route.path
        if (path !== '/home/userSeting') { return }
        this.$store.commit('app/SET_ROUTER', path)
        if (this.$route.query.editHeight === 'Yes') {
            this.activeName = 'third'
        }
    }
}
</script>

<style lang="scss" scoped>
    .userSeting {
        width: 100%;
        height: 100%;

        & /deep/ .el-tabs--border-card {
            height: 100%;
        }

        & /deep/ .el-tabs__content {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 60vh;
            width: 100%;
        }

        .form-inline {
            width: 900px;
            display: flex;
            flex-wrap: wrap;
            /*justify-content: center;*/
            /*align-items: center;*/
            .inputL {
                width: 300px;
            }
        }

        .search {
            color: #FFF;
            background-color: $color-btn;
            border-color: $color-btn;
        }
    }
</style>
