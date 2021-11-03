<template>
    <div>
        <el-tabs v-model="activeName">
            <el-tab-pane label="部门管理" name="first"><DepMana></DepMana></el-tab-pane>
            <el-tab-pane label="职位管理" name="second"><PosMana></PosMana></el-tab-pane>
            <el-tab-pane label="职称管理" name="third"><JobLevelMana></JobLevelMana></el-tab-pane>
            <el-tab-pane label="奖惩规则" name="fourth1"><EcMana></EcMana></el-tab-pane>
            <el-tab-pane label="权限组" name="fourth2"><PermissMana></PermissMana></el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import DepMana from "../../components/sys/sysBasic/DepMana";
    import EcMana from "../../components/sys/sysBasic/EcMana";
    import JobLevelMana from "../../components/sys/sysBasic/JobLevelMana";
    import PermissMana from "../../components/sys/sysBasic/PermissMana";
    import PosMana from "../../components/sys/sysBasic/PosMana";
    export default {
        name: "SysBasic",
        data(){
            return{
                activeName:'first'
            }
        },
        components:{
            DepMana,
            EcMana,
            JobLevelMana,
            PermissMana,
            PosMana
        }
    }
</script>

<style scoped>

</style>