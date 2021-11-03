<template>
    <div>
        <div>
            <el-input class="perInputClass"  size="small" placeholder="请输入角色英文名称..." v-model="role.name">
                <template slot="prepend">ROLE_</template>
            </el-input>
            <el-input class="perInputClass" @keydown.enter.native="addRole"   size="small" placeholder="请输入角色中文名称..." v-model="role.namezh">
            </el-input>
            <el-button type="primary" size="small" icon="el-icon-plus" @click="addRole">添加角色</el-button>
        </div>
        <div class="body">
            <el-collapse v-model="activeName"  accordion @change="showTree">
                <el-collapse-item :title="role.namezh" v-for="(role,index) in roles" :key="index"  :name="role.id"  >
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>可访问的资源</span>
                            <el-button style="float: right; padding: 3px 0;color: red;" @click="deleteRole(role)" type="text" icon="el-icon-delete"></el-button>
                        </div>
                        <el-tree
                                @click="handleNodeClick"
                                :key="index"
                                :data="menus"
                                show-checkbox
                                node-key="id"
                                ref="tree"
                                :default-checked-keys="selectMenus"
                                :props="defaultProps">
                        </el-tree>
                        <div class="rightButton">
                            <el-button @click="CencalUpdate">取消修改</el-button>
                            <el-button type="primary" @click="doUpdate(role.id,index)">确认修改</el-button>
                        </div>
                    </el-card>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PermissMana",
        data(){
            return{
                role:{
                    name:'',
                    namezh:''
                },
                activeName: -1,
                roles:[],
                selectMenus:[],
                menus: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                }
            }
        },
        methods:{
            showTree(rid){
                if (rid){
                    this.getTreeMenu();
                    this.getSelectTreeMenu(rid);
                }
            },
            CencalUpdate(){
                this.activeName = -1;
            },
            doUpdate(rid,index){
                let selectKeys=this.$refs.tree[index].getCheckedKeys(true);
                let url = "/system/basic/menu/?rid=" + rid;
                selectKeys.forEach(key=>{
                    url += '&mids=' + key ;
                })
                this.putRequest(url).then(resp=>{
                   if (resp){
                       this.activeName = -1;
                   }
                })
            },
            handleNodeClick(data) {
                console.log(data);
            },
            addRole(){
                if (!this.role.name||!this.role.namezh){
                    this.$message.error("请填写完整的角色信息");
                    return;
                }
                this.role.name = 'ROLE_'+this.role.name;
                this.postRequest('/system/basic/role/',this.role).then(resp=>{
                    this.role.name = '';
                    this.role.namezh = '';
                    this.getAll();
                });
            },
            getAll(){
                this.getRequest('/system/basic/role/').then(data=>{
                    this.roles = data;
                })
            },
            getSelectTreeMenu(rid){
                this.getRequest('/system/basic/menu/getMenusById/'+rid).then(resp=>{
                    this.selectMenus = resp;
                    console.log(this.selectMenus);
                })
            },
            getTreeMenu(){
                this.getRequest('/system/basic/menu/').then(data=>{
                    this.menus = data;
                })
            },
            deleteRole(role){
                this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest('/system/basic/role/'+role.id).then(resp=>{
                        this.getAll();
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        },
        mounted() {
            this.getAll();
            this.getTreeMenu();
        }

    }
</script>

<style>
    .rightButton{
        text-align: right;
    }
    .perInputClass{
        width: 20%;
        margin-right: 7px;
    }
    .body{
        width: 50%;
    }
    div{
        margin-top: 10px;
    }
</style>