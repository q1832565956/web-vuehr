<template>
    <div>
        <div>
            <el-input
                    size="small"
                    class="jobInput"
                    placeholder="添加职称"
                    v-model="jobLevel.name">
                <i slot="prefix" class="el-input__icon el-icon-plus"></i>
            </el-input>
            <el-select class="jobSelected" size="small" v-model="jobLevel.titlelevel" placeholder="职位等级">
                <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <el-button type="primary"  size="small" class="el-icon-plus" @click="addJobLevel">添加</el-button>
        </div>
        <div class="space">
            <el-table
                    :data="jobs"
                    stripe
                    @selection-change="handleSelectionChange"
                    style="width: 60%">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="id"
                        label="编号"
                        width="80">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="职位名称"
                        width="140">

                </el-table-column>
                <el-table-column
                        prop="titlelevel"
                        label="职位等级"
                        width="120">

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
                        width="180">

                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="space">
            <el-button type="danger" :disabled="disabled" @click="deleteAll">批量删除</el-button>
        </div>
        <div>
            <el-dialog
                    title="职称修改"
                    :visible.sync="dialogVisible"
                    width="30%"
                    >
                <table width="100%" >
                    <tr>
                        <td align="right">职位名称 :</td>
                        <td>
                            <el-input

                                    class="dialog"
                                    size="small"
                                    placeholder="修改职称"
                                    v-model="updateJob.name">
                            </el-input>
                        </td>
                    </tr>
                    <tr>
                        <td align="right">职位等级 :</td>
                        <td>
                            <el-select class="dialog" size="small" v-model="updateJob.titlelevel" placeholder="职位等级">
                                <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </td>
                    </tr>
                    <tr>
                        <td align="right">是否启用 :</td>
                        <td>
                            <el-switch class="dialog"
                                    v-model="updateJob.enabled"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949">
                            </el-switch>
                        </td>
                    </tr>
                </table>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="update">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: "JobMana",
        data(){
            return{
                options: [{
                    value: '正高级',
                    label: '正高级'
                }, {
                    value: '副高级',
                    label: '副高级'
                }, {
                    value: '中级',
                    label: '中级'
                }, {
                    value: '初级',
                    label: '初级'
                }, {
                    value: '员级',
                    label: '员级'
                }],
                value:'',
                jobLevel:{
                    name:'',
                    titlelevel:''
                },
                updateJob:{
                    name:'',
                    titlelevel:'',
                    enabled:false
                },
                jobs: [],
                deleteJobs:[],
                disabled:true,
                dialogVisible:false,
            }
        },
        methods:{
            update(){
                this.dialogVisible = false;
                this.putRequest('/system/basic/job/',this.updateJob).then(resp=>{
                    this.getAll()
                })
            },
            deleteAll(){
                this.$confirm('此操作将永久删除选中条数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest('/system/basic/job/deleteALl',this.deleteJobs).then(resp=>{
                        this.getAll();
                        this.disabled=true;
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            getAll(){
                this.getRequest('/system/basic/job/').then(resp=>{
                    if (resp){
                        this.jobs = resp;
                    }
                })
            },
            addJobLevel(){
                if (this.jobLevel.name && this.jobLevel.titlelevel){
                    this.postRequest('/system/basic/job/',this.jobLevel).then(resp=>{
                        this.getAll()
                        this.jobLevel.name = '';
                        this.jobLevel.titleLevel = '';
                    })
                }else{
                    this.$message.error("请完善职称信息！")
                }
            },
            handleEdit(index,row){
                this.dialogVisible = true;
                Object.assign(this.updateJob,row);
                //this.dialogJob = row;
            },
            handleDelete(index,row){
                this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest('/system/basic/job/'+row.id).then(resp=>{
                        this.getAll();
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            handleSelectionChange(val) {
                if (val.length > 0) {
                    this.disabled=false;
                    this.deleteJobs = val;
                }else{
                    this.disabled=true;
                }
            }

        },
        mounted() {
            this.getAll();
        }
    }
</script>

<style>
    .dialog{
        margin-left: 15px;
        width: 80%;
    }
    .jobInput{
        width: 20%;
        margin-right: 10px;
        margin-left: 10px;
    }
    .jobSelected{
        margin-right: 10px;
    }
    .space{
        margin-top: 10px;
    }
</style>