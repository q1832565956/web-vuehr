<template>
    <div>
        <el-container>
            <el-header class="homeHeader" >
                <div class="title">微人事</div>
                <el-dropdown @command="comHender">
                  <span class="el-dropdown-link">
                    {{user.name}}<i ><img :src="user.userface" class="jpg"></i>
                  </span>
                    <el-dropdown-menu slot="dropdown"  >
                        <el-dropdown-item command="userInfo">个人信息</el-dropdown-item>
                        <el-dropdown-item command="setting">设置</el-dropdown-item>
                        <el-dropdown-item command="logout" divided>注销登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-header>
            <el-container >
                <el-aside >
                    <el-menu unique-opened
                            class="el-menu-vertical-demo"
                            background-color="#545c64"

                            text-color="#fff"
                            active-text-color="#ffd04b" router>
                        <el-submenu :index="index+''" v-for="(item,index) in routes" :key="index" v-if="!item.hidden">
                            <template slot="title">
                                <i :class="item.iconCls" style="margin-right: 10px;color: aquamarine;"></i>
                                <span>{{item.name}}</span>
                            </template>
                            <el-menu-item v-for="(childs,cIndex) in item.children" :key="cIndex" :index="childs.path">{{childs.name}}</el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path!='/home'">
                        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
                    </el-breadcrumb>
                    <el-breadcrumb separator-class="el-icon-arrow-right" v-else="this.$router.currentRoute.path=='/home'">
                        <div class="homeBreadcrumb" >
                            欢迎来到微人事！
                        </div>
                    </el-breadcrumb>
                    <router-view class="homeRouterView"/>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "Home",
        data () {
            return {
                user:JSON.parse(window.sessionStorage.getItem("user"))
            }
        },
        computed:{
            routes(){
               return  this.$store.state.routes;
            }
        },
        methods:{
            comHender (cmd) {
                if (cmd=='logout'){
                    this.$confirm('此操作将注销用户, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.postRequest('/logout');
                        window.sessionStorage.removeItem("user");
                        this.$store.commit('');
                        this.$router.replace('/');
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消操作'
                        });
                    });
                }
            }
        }
    }
</script>

<style>

    .homeRouterView{
        padding-top: 10px;
    }
    .homeBreadcrumb{
        text-align: center;
        color: #64ddea;
        font-size: 40px;
        font-family: 微软雅黑;
        padding-top: 20px;
    }
    .homeHeader{
        background-color: #cae1e8;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0px 15px;
        box-sizing: border-box;
    }

    .homeHeader .title{
        color: #FFFFFF;
        font-size: 38px;
        font-family: 微软雅黑;
    }

    .el-dropdown-link{
        cursor: pointer;
        display: flex;
        align-items: center;
    }
    .jpg{
        width: 48px;
        height: 48px;
        border-radius: 24px;
        margin-left: 10px;
    }

</style>