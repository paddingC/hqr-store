<template>
    <div class="home">
        <el-card class="box-card" shadow="hover">
            <img
                src="../../assets/img/chronicDisease01.png"
                :fit="fit"></img>
            <el-button class="search" @click="toBuild">建立慢病档案</el-button>
        </el-card>
        <el-card class="box-card" shadow="hover">
            <img
                src="../../assets/img/chronicDisease02.png"
                :fit="fit"></img>
            <el-button class="search" @click="toSearch">慢病档案查询</el-button>
        </el-card>
    </div>
</template>

<script>
export default {
    name: "home",
    data() {
        return {
            fit: 'fill'
        }
    },
    methods: {
        toSearch() {
            this.$router.push({
                path: '/home/chronicDisease/search'
            })
        },
        toBuild() {
            this.$router.push({
                path: '/home/chronicDisease/buildsProfiles'
            })
        }
    },
    created() {
        let path = this.$route.path
        console.log(path)
        this.$store.commit('app/SET_ROUTER', path)
    },
}
</script>

<style lang="scss" scoped>
    .home {
        .search {
            color: #FFF;
            background-color: $color-btn;
            border-color: $color-btn;
        }

        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;

        .box-card {
            width: 25%;
            min-width: 250px;
            height: 550px;

            & /deep/ .el-card__body {
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                align-items: center;
                height: 100%;

                img {
                    height: 300px;
                    width: 250px;
                }
            }
        }

        .box-card /deep/ .el-card__body {

        }
    }

</style>
