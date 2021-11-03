<template>
    <div>
        <div>
            <el-input
                    size="small"
                    class="posInput"
                    placeholder="添加职位"
                    v-model="position.name"
                    @keydown.enter.native="insert"
            >
                <i slot="prefix" class="el-input__icon el-icon-plus"></i>
            </el-input>
            <el-button size="small" type="primary" icon="el-icon-plus" @click="insert" >添加</el-button>
        </div>
        <div class="space">
            <el-table
                    :data="positions"
                    stripe
                    style="width: 70%"
                    @selection-change="handleSelectionChange">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="id"
                        label="编号"
                        width="170">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="职位名称"
                        width="250">
                </el-table-column>
                <el-table-column
                        label="是否启用"
                        width="100">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper" >
                            <el-tag size="medium" :type="scope.row.enabled ? 'primary' : 'danger'">{{ scope.row.enabled ? '启用' : '禁用' }}</el-tag>
                        </div>
                    </template>

                </el-table-column>
                <el-table-column
                        prop="createdate"
                        label="创建时间"
                        width="200">
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="250"
                >
                    <template slot-scope="scope">
                        <el-button size="mini" @click="openEdit(scope.$index,scope.row)">编辑</el-button>
                        <el-button size="mini" @click="deletePosition(scope.$index,scope.row)"  type="danger">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="space">
            <el-button type="danger" :disabled="disabled" @click="deleteAll">批量删除</el-button>
        </div>
        <div>
            <el-dialog
                    title="更新岗位"
                    :visible.sync="dialogVisible"
                    width="30%"
                    :before-close="closeEdit"
                    >
               <div>
                   <table width="100%" >
                       <tr>
                           <td align="right">职位名称 :</td>
                           <td>
                               <el-input class="dialog"
                                       placeholder="更新职位"
                                       v-model="updatePosition.name">
                               </el-input>
                           </td>
                       </tr>
                       <tr>
                           <td align="right">是否启用 :</td>
                           <td>
                               <el-switch class="dialog"
                                          v-model="updatePosition.enabled"
                                          active-color="#13ce66"
                                          inactive-color="#ff4949">
                               </el-switch>
                           </td>
                       </tr>
                   </table>

               </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="closeEdit">取 消</el-button>
                    <el-button type="primary" @click="update">更 新</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import {getRequest, putRequest, postRequest, deleteRequest} from "../../../utils/api";
    export default {
        name: "PosMana",
        data(){
            return{
                dialogVisible: false,
                position:{
                    name
                },
                updatePosition:{
                    name:'',
                    enabled:false
                },
                positions:[],
                disabled:true,
                deletePositions:[]
            }
        },
        methods: {
            deleteAll(){
                this.$confirm('此操作将永久删除选中数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    deleteRequest("/system/basic/pos/deleteAll",this.deletePositions).then(data=>{
                        this.getAll();
                        this.disabled =true;
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            handleSelectionChange(val) {
                if (val.length>0){
                    this.disabled = false;
                    this.deletePositions = val
                }else{
                    this.disabled =true;
                }
            },
            closeEdit(){
                this.dialogVisible = false;
                this.getAll();
            },
            openEdit(index,position){
                this.dialogVisible = true;
                Object.assign(this.updatePosition,position)
            },
            getAll(){
                getRequest("/system/basic/pos/").then(data=>{
                   this.positions=data;
                })
            },
            update(){
                putRequest("/system/basic/pos/",this.updatePosition).then(data=>{
                    this.dialogVisible = false;
                    this.getAll();
                })
            },
            deletePosition(index,position){
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    deleteRequest("/system/basic/pos/"+position.id).then(data=>{
                        this.getAll();
                    })
                    this.getAll();
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            insert(){
                if (this.position.name==undefined||this.position.name==""){
                    this.$message.error('请填写职位名称！');
                    return;
                }
                postRequest("/system/basic/pos/",this.position).then(data=>{
                    this.getAll();
                    this.position.name = '';
                })
            }
        },
        mounted() {
            this.getAll();
        }
    }
</script>

<style >
    .dialog{
        margin-left: 15px;
        width: 80%;
    }
    .space{
        margin-top: 10px;
    }
    .posInput{
        width: 30%;
        padding-right: 10px;
        margin-left: 10px ;
    }

</style>