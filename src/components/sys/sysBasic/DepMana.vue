<template>
    <div style="width: 40%">
        <el-input
                placeholder="输入关键字进行过滤"
                v-model="filterText">
        </el-input>

        <el-tree
                :expand-on-click-node="false"
                class="filter-tree"
                :data="data"
                :props="defaultProps"
                :filter-node-method="filterNode"
                ref="tree">
             <span class="custom-tree-node" style="display: flex;justify-content: space-between;width: 100%;"
                   slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
                  class="deptbtn"
                  type="primary"
                  size="mini"
                  @click="() => deptShowAdd(data)">
            添加
          </el-button>
          <el-button
                  class="deptbtn"
                  type="danger"
                  size="mini"
                  @click="() => deptDelete( data)">
            删除
          </el-button>
        </span>
      </span>
        </el-tree>
        <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                width="30%">
               <!-- :before-close="handleClose"-->
            <div>
                <table style="margin-left: 100px;">
                    <tr>
                        <td>
                            上级部门：
                        </td>

                        <td>
                            <el-input v-model="pName" size="small" placeholder="上级部门名称" :disabled="true"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            部门名称：
                        </td>
                        <td>
                            <el-input v-model="dept.name" size="small" placeholder="请输入部门名称"></el-input>
                        </td>
                    </tr>
                </table>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="deptAdd">保 存</el-button>
          </span>
        </el-dialog>
    </div>

</template>

<script>
    export default {
        name: "DepMana",
        data() {
            return {
                dialogVisible: false,
                filterText: "",
                data: [],
                dept: {
                    name: "",
                    parentid: -1
                },
                pName: "",
                defaultProps: {
                    children: 'children',
                    label: 'name'
                }
            }
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        methods: {
            initTree(data,obj) {
                for (let i = 0; i < data.length; i++) {
                    let dep = data[i];
                    if (dep.id == obj.parentid) {
                        dep.children = dep.children.concat(obj)
                    } else {
                        this.initTree(dep.children,obj);
                    }
                }
            },
            deptAdd() {
                this.postRequest("/system/basic/department/", this.dept).then(resp => {
                    if (resp) {
                        this.initTree(this.data,resp.obj);
                        this.dept.name = "";
                        this.dialogVisible = false;
                    }
                })
            },
            deptShowAdd(data) {
                this.dept.parentid = data.id;
                this.pName = data.name;
                this.dialogVisible = true;
            },
            deptDelete(data) {

            },
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            initData() {
                this.getRequest("/system/basic/department/").then(resp => {
                    this.data = resp;
                })
            }
        },
        mounted() {
            this.initData();
        }
    }
</script>

<style scoped>
    .deptbtn {
        padding: 2px;
    }
</style>