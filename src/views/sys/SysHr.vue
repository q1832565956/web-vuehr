<template>
    <div>
        <div style="margin-top: 10px; display: flex;justify-content: center;">
            <el-input v-model="rName" style="width: 400px;" placeholder="请输入需要查询的操作员姓名"><i slot="prefix"
                                                                                           class="el-input__icon el-icon-search"></i>
            </el-input>
            <el-button style="margin-left: 4px;" @click="search()" type="primary">搜索</el-button>
        </div>
        <div class="div-body">
            <el-card class="div-card" v-for="(hr,index) in hrs">
                <div slot="header" class="clearfix">
                    <span>{{hr.name}}</span>
                    <el-button style="float: right; padding: 3px 0;color: red;" type="text" @click="deleteHr(hr)"  ><i class="el-icon-delete"></i></el-button>
                </div>
                <div>
                    <div class="div-img"><img class="jpg" :src="hr.userface" :title="hr.name"/></div>
                    <div>用户名：{{hr.name}}</div>
                    <div>手机号码：{{hr.phone}}</div>
                    <div>电话号码：{{hr.telephone}}</div>
                    <div>地址：{{hr.address}}</div>
                    <div>用户状态：
                        <el-switch
                                @change="changEnable(hr)"
                                style="display: block"
                                v-model="hr.enabled"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                active-text="启用"
                                inactive-text="禁用">
                        </el-switch>
                    </div>
                    <div>用户角色：
                        <el-tag v-for="role in hr.list">{{role.namezh}}</el-tag>
                        <el-popover
                                placement="right"
                                width="400"
                                @show="show(hr.list)"
                                @hide="hide(hr)"
                                trigger="click">
                            <el-select v-model="roleIds" multiple placeholder="请选择">
                                <el-option
                                        v-for="role in roles"
                                        :key="role.id"
                                        :label="role.namezh"
                                        :value="role.id">
                                </el-option>
                            </el-select>
                            <el-button slot="reference" type="text"> ...<!-- slot="reference"--></el-button>
                        </el-popover>

                        <!--   <el-tooltip class="item" effect="dark"  placement="right">
                               <div slot="content">

                               </div>
                               <el-button type="text" style="margin-left: 2px; ">...</el-button>
                           </el-tooltip>-->

                    </div>
                    <div>备注：{{hr.remark}}</div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
    import {deleteRequest, getRequest, putRequest} from "../../utils/api";

    export default {
        name: "SysHr",
        data() {
            return {
                rName: "",
                hrs: [],
                roles: [],
                roleIds: []

            }
        },
        methods: {
            deleteHr(hr){

                this.$confirm('此操作将永久删除【'+hr.name+'】, 是否继续?', '提示', {
                    cancelButtonText: '取消',
                    confirmButtonText: '确定',
                    type: 'error'
                }).then(() => {
                    deleteRequest("/system/operator/"+hr.id).then(resp=>{
                        this.initHrs();
                    })
                })
            },
            search(){
                this.initHrs();
            },
            changEnable(hr){
                putRequest("/system/operator/",hr).then(resp=>{
                    if (resp){
                        this.initHrs();
                    }
                })
            },
            initHrs() {
                getRequest("/system/operator/hr?name=" + this.rName).then(resp => {
                    if (resp) {
                        this.hrs = resp;
                    }
                })
            },
            initRoles() {
                getRequest("/system/operator/role").then(resp => {
                    if (resp) {
                        this.roles = resp;
                    }
                })
            },
            show(roles) {
                this.roleIds = [];
                roles.forEach((role, index) => {
                    this.roleIds[index] = role.id;
                })

            },
            hide(hr) {
                let roles = hr.list;
                let falg = false; //不发送请求
                if (this.roleIds.length != roles.length){
                    falg = true;
                }
                roles.forEach(role=>{
                    this.roleIds.forEach(rid=>{
                        if (rid = role.id){
                            falg = false;
                            throw  new Error("out foreach！");
                        }
                        falg = true;
                    })
                })
                if (falg) {
                    let url = "/system/operator/hrrole?hrid=" + hr.id;
                    this.roleIds.forEach(rid => {
                        console.log(rid);
                        url += "&rid=" + rid;
                    })
                    putRequest(url).then(resp => {
                        if (resp) {
                            this.initHrs();
                        }
                    })
                }
            }
        },
        mounted() {
            this.initHrs();
            this.initRoles();
        }
    }
</script>

<style>
    .div-card {
        width: 500px;
        margin-left: 10px;
        margin-top: 10px;

    }

    .div-body {
        margin-top: 40px;
        Float: left;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
    }

    .div-img {
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .jpg {
        width: 48px;
        height: 48px;
        border-radius: 24px;
        margin-left: 10px;
    }
</style>