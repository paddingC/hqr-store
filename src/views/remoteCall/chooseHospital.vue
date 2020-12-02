<template>
    <div>
        <div class="chooseL">
            <p v-for="(item, index) in hospitalList" :key="index" @click="chooseHospitalEvent(item, index)" :class="hIndex==index?'curp':''">
                <a>{{item.hospitalName}}</a>
                <img :src="item.logo">
            </p>
        </div>
        <div class="chooseC">
            <h3>选择科室</h3>
            <div class="chooseC-con">
                <p v-for="(item, index) in departmentList" :key="index" @click="chooseDepartmentEvent(item, index)" :class="dIndex==index?'curp':''">
                    <a>{{item.deptName}}</a>
                </p>
            </div>
        </div>
        <div class="chooseR">
            <li v-for="(item, index) in classList" :key="index" @click="chooseClassEvent(item, index)" :class="cIndex==index?'curli':''">
                {{item.deptName}}
            </li>
        </div>
    </div>
</template>

<script>
import {mapGetters} from "vuex";
export default {
    name: "chooseHospital",
    data () {
        return {
            hospitalList: [],
            hIndex: 0,
            dIndex: 0,
            departmentList: [],
            classList: [],
            cIndex: -1,
            hospitalId: ''
        }
    },
    computed: {
        ...mapGetters([
            'userInfo',
        ])
    },
    mounted() {
        this.getList()
    },
    methods:　{
        chooseHospitalEvent (item, idx) {
            this.hIndex = idx
            this.classList = []
            this.hospitalId = item.hospitalId
            this.getStructure(item)
        },
        chooseDepartmentEvent (item, idx) {
            this.dIndex = idx
            this.getClass(item)
        },
        chooseClassEvent (item, idx) {
            this.cIndex = idx
            this.$router.push({
                path: '/home/remoteCall/callDoctor',
                query: {
                    deptId: item.deptId,
                    hospitalId: this.hospitalId
                }
            })
            // /home/remoteCall/chooseHospital
        },
        getList () {
            this.$store.dispatch('remoteAuditing/queryHospitalList',{
                companyId: this.userInfo.companyid
            }).then(res => {
                console.log(res);
                if (res.status === 200) {
                    if (res.data.length >= 1) {
                        this.hospitalList = res.data
                        this.hospitalId = this.hospitalList[0].hospitalId
                        this.getStructure(this.hospitalList[0])
                    } else {
                        this.hospitalList = []
                    }
                }
            }).catch(err => {
                console.log(err);
            })
        },
        getStructure (item) {
            this.$store.dispatch('remoteAuditing/structure',{
                companyId: this.userInfo.companyid,
                data: item.hospitalId
            }).then(res => {
                console.log(res);
                if (res.status === 200) {
                    if (res.data.length >= 1) {
                        this.departmentList = res.data
                        this.getClass(this.departmentList[this.dIndex])
                    } else {
                        this.departmentList = []
                    }
                }
            }).catch(err => {
                console.log(err);
            })
        },
        getClass (item) {
            this.classList = item.deptList
        }
    },
    beforeDestroy () {
        window.location.reload()
    }
}
</script>

<style scoped lang="scss">
    .chooseL{
        width: 276px;
        height: 546px;
        overflow: auto;
        margin-right: 40px;
        background: #fff;
        float: left;
        p{
            height: 52px;
            line-height: 52px;
            margin-bottom: 12px;
            cursor: pointer;
            a{
                line-height: 52px;
                display: inline-block;
                color: #666;
                width: calc(276px - 89px);
                float: left;
                margin-left: 19px;
                text-overflow:ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
            img{
                float: right;
                margin-left: 5px;
                margin-right: 5px;
                width: 50px;
                height: 52px;
                vertical-align: middle;
            }
        }
        .curp{
            background:rgba(250,250,250,1);
        }
    }
    .chooseC{
        width: 170px;
        background:rgba(240,248,250,1);
        float: left;
        text-align: center;
        margin-right: 40px;
        h3{
            font-size:18px;
            font-family:PingFangSC-Medium,PingFang SC;
            color:rgba(51,51,51,1);
            line-height: 38px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .chooseC-con{
            height: 498px;
            overflow: auto;
            p{
                font-size:14px;
                line-height: 48px;
                cursor: pointer;
                overflow: auto;
            }
            .curp{
                background: #fff;
            }
        }

    }
    .chooseR{
        float: left;
        min-height: 546px;
        background: #fff;
        width: 720px;
        li{
            float: left;
            line-height: 38px;
            width: 140px;
            margin-left: 45px;
            margin-right: 45px;
            cursor: pointer;
        }
        .curli{
            color: #42b983;
        }
    }
</style>
