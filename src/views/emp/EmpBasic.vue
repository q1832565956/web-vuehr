<template>
  <div>
    <div style="margin-top: 10px;">
      <table width="100%">
        <tr>
          <td>
            <el-input
                style="width: 400px;"
                placeholder="通过员工名搜索员工，记得回车哦..."
                select-when-unmatched="true"
                @keydown.enter.native="selectEmp"
                v-model="eName">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <el-button style="margin-left: 10px;" type="primary" @click="selectEmp()" icon="el-icon-search">搜索
            </el-button>
            <el-button type="primary" @click="advancedSearch()"><i class="fa fa-angle-double-down">高级搜索</i></el-button>
          </td>
          <td align="right">
            <el-upload
                style="display: inline-flex; "
                class="upload-demo"
                action="/emp/basic/upload"
                :before-upload="beforeUpload"
                :on-success="onSuccess"
                :on-error="onError"
                :show-file-list="false"
                :disabled="importDisabled">
              <el-button size="small" :disabled="importDisabled" type="primary" :icon="importIcon">{{ importTital }}</el-button>
            </el-upload>
            <!-- <el-button style="margin-left: 10px;" type="success"  icon="el-icon-sort-up">导入数据</el-button>-->
            <el-button style="margin-left: 10px;" size="small" type="primary" @click="exportData()"
                       icon="el-icon-sort-down">导出数据
            </el-button>
            <el-button style="margin-left: 10px;" type="primary" ref="employee" @click="showEdit()"
                       icon="el-icon-search">添加员工
            </el-button>
          </td>
        </tr>
        <transition name="fade">
        <tr v-show="advancedSearchShow">
          <td colspan="2" >
            <div style="border: 1px solid #409EFF;border-radius:5px; padding-top: 8px;">
              <el-form :inline="true" style="font-size: 26px;"  class="demo-form-inline">
                <el-form-item label="政治面貌" label-width="100px" style="">
                  <el-select v-model="psVlue" placeholder="请选择政治面貌" style="width: 230px">
                    <el-option
                        v-for="ps in politicsStatus"
                        :key="ps.id"
                        :label="ps.name"
                        :value="ps.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="民族"  label-width="50px" style="">
                  <el-select v-model="nation" placeholder="请选择民族">
                    <el-option
                        v-for="item in nations"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="职位"  label-width="50px"  style="">
                  <el-select v-model="position" placeholder="请选择职位">
                    <el-option
                        v-for="item in positions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="职称" label-width="50px"  style="">
                  <el-select v-model="jobLevel" placeholder="请选择职称">
                    <el-option
                        v-for="item in jobLevels"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="聘用形式" label-width="100px" style="">
                  <el-radio-group v-model="engageform">
                    <el-radio label="劳务合同"></el-radio>
                    <el-radio label="劳动合同"></el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="所属部门" label-width="100px" style="">
                  <el-popover
                      v-model="departmentDisabled"
                      placement="bottom"
                      title="请选择部门"
                      width="200"
                      trigger="click"
                      >
                    <el-tree :data="departments" :props="defaultProps" :default-expand-all="true" @node-click="handleNodeClick"></el-tree>
                    <el-input v-model="department" slot="reference" placeholder="请选择部门"></el-input>
                  </el-popover>
                </el-form-item>
                <el-form-item label="入职日期"  label-width="100px" style="">
                  <el-date-picker
                      v-model="beginDate"
                      type="date"
                      format="yyyy 年 MM 月 dd 日"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期">
                  </el-date-picker>
                  至
                  <el-date-picker
                      v-model="endDate"
                      type="date"
                      format="yyyy 年 MM 月 dd 日"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item style=" width: 580px;text-align: right;">
                  <el-button @click="initadvancedSearchData"><i class="fa fa-undo" aria-hidden="true"></i>  重置</el-button>
                  <el-button type="primary"  icon="el-icon-search" @click="selectEmp">搜索</el-button>
                </el-form-item>
              </el-form>
            </div>
          </td>
        </tr>
        </transition>
      </table>
    </div>
    <div class="div_top">
      <el-table
          :data="tableData"
          @selection-change="handleSelectionChange"
          border
          size="medium"
          style="width: 100%">
        <el-table-column
            type="selection"
            width="40">
        </el-table-column>
        <el-table-column
            fixed
            prop="name"
            label="姓名"
            width="140">
        </el-table-column>
        <el-table-column
            prop="workid"
            label="工号"
            width="130">
        </el-table-column>
        <el-table-column
            prop="gender"
            align="center"
            label="性别"
            width="60">
        </el-table-column>
        <el-table-column
            prop="birthday"
            label="出生日期"
            width="100">
        </el-table-column>
        <el-table-column
            prop="idcard"
            label="身份证号码"
            width="190">
        </el-table-column>
        <el-table-column
            prop="wedlock"
            label="婚姻状况"
            width="100">
        </el-table-column>
        <el-table-column
            prop="nation.name"
            label="民族"
            width="50">
        </el-table-column>
        <el-table-column
            prop="nativeplace"
            label="籍贯"
            width="80">
        </el-table-column>
        <el-table-column
            prop="politicsstatus.name"
            label="政治面貌"
            width="100">
        </el-table-column>
        <el-table-column
            prop="email"
            label="邮箱"
            width="200">
        </el-table-column>
        <el-table-column
            prop="phone"
            label="电话号码"
            width="120">
        </el-table-column>
        <el-table-column
            prop="address"
            label="联系地址"
            width="270">
        </el-table-column>
        <el-table-column
            prop="department.name"
            label="所属部门"
            width="120">
        </el-table-column>
        <el-table-column
            prop="position.name"
            label="职位"
            width="120">
        </el-table-column>
        <el-table-column
            prop="joblevel.name"
            label="职称"
            width="120">
        </el-table-column>
        <el-table-column
            prop="engageform"
            label="聘用形式"
            width="100">
        </el-table-column>
        <el-table-column
            prop="begindate"
            label="入职日期"
            width="100">
        </el-table-column>
        <el-table-column
            prop="conversiontime"
            label="转正日期"
            width="100">
        </el-table-column>
        <el-table-column
            prop="begincontract"
            label="合同起始日期"
            width="100">
        </el-table-column>
        <el-table-column
            prop="endcontract"
            label="合同截至日期"
            width="100">
        </el-table-column>
        <el-table-column
            prop="contractterm"
            label="合同期限"
            width="80">
        </el-table-column>
        <el-table-column
            prop="tiptopdegree"
            label="最高学历"
            width="80">
        </el-table-column>
        <el-table-column
            fixed="right"
            label="操作"
            width="260">
          <template slot-scope="scope">
            <el-button size="mini">编辑</el-button>
            <el-button @click="handleClick(scope.row)" type="primary" size="mini">查看高级资料</el-button>
            <el-button @click="handleClick(scope.row)" type="danger" size="mini">删除</el-button>

          </template>
        </el-table-column>
      </el-table>
    </div>
    <div align="right">
      <el-pagination
          background
          @current-change="handleCurrentChange"
          layout="total, prev, pager, next"
          :page-size="pageSize"
          :total="total">
      </el-pagination>
    </div>

    <!--添加员工弹出框开始-->
    <div>
      <el-dialog :title="title" :visible.sync="dialogFormVisible" width="75%">
        <el-form :model="employee" :inline="true" size="small" :rules="employeeVerifys" ref="employee">
          <!--row1 begin-->
          <el-form-item label="姓名：" :label-width="formLabelWidth" style="width: 24%;" prop="name">
            <el-input style="width:150px;"
                      placeholder="请输入员工姓名"
                      v-model="employee.name">
              <i slot="prefix" class="el-input__icon el-icon-edit"></i>
            </el-input>
          </el-form-item>
          <el-form-item label="性别：" :label-width="formLabelWidth" style="width: 24%;" prop="gender">
            <el-radio-group v-model="employee.gender">
              <el-radio label="男"></el-radio>
              <el-radio label="女"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="出生日期：" :label-width="formLabelWidth" style="width: 24%;" prop="birthday">
            <el-date-picker style="width:150px;"
                            v-model="employee.birthday"
                            type="date"
                            placeholder="出生日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="政治面貌：" :label-width="formLabelWidth" style="width: 24%;" prop="politicid">
            <el-select v-model="employee.politicid" style="width:150px;" placeholder="请选择活动区域">
              <el-option v-for="(ps,index) in politicsStatus" :label="ps.name" :value="ps.id"></el-option>
            </el-select>
          </el-form-item>
          <!--row1 end-->

          <!--row2 begin-->
          <el-form-item label="民族：" :label-width="formLabelWidth" style="width: 24%;" prop="nationid">
            <el-select v-model="employee.nationid" style="width:150px;" placeholder="请选择活动区域">
              <el-option v-for="(nation,index) in nations" :label="nation.name" :value="nation.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="籍贯：" :label-width="formLabelWidth" style="width: 24%;" prop="nativeplace">
            <el-input style="width:150px;"
                      placeholder="请输入员工籍贯"
                      v-model="employee.nativeplace">
              <i slot="prefix" class="el-input__icon el-icon-edit"></i>
            </el-input>
          </el-form-item>
          <el-form-item label="电子邮箱：" :label-width="formLabelWidth" style="width: 24%;" prop="email">
            <el-input style="width:150px;"
                      placeholder="请输入员工电子邮箱"
                      v-model="employee.email">
              <i slot="prefix" class="el-input__icon el-icon-edit"></i>
            </el-input>
          </el-form-item>
          <el-form-item label="联系地址：" :label-width="formLabelWidth" style="width: 24%;" prop="address">
            <el-input style="width:150px;"
                      placeholder="请输入员工联系地址"
                      v-model="employee.address">
              <i slot="prefix" class="el-input__icon el-icon-edit"></i>
            </el-input>
          </el-form-item>
          <!--row2 end-->

          <!--row3 begin-->
          <el-form-item label="职位：" :label-width="formLabelWidth" style="width: 24%;" prop="posid">
            <el-select v-model="employee.posid" style="width:150px;" placeholder="请选择员工职位">
              <el-option v-for="(position,index) in positions" :label="position.name" :value="position.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="职称：" :label-width="formLabelWidth" style="width: 24%;" prop="joblevelid">
            <el-select v-model="employee.joblevelid" style="width:150px;" placeholder="请选择员工职称">
              <el-option v-for="(jobLevel,index) in jobLevels" :label="jobLevel.name" :value="jobLevel.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属部门：" :label-width="formLabelWidth" style="width: 24%;" prop="departmentid">
            <el-input style="width:150px;"
                      placeholder="请输入员工所属部门"
                      v-model="employee.departmentid">
              <i slot="prefix" class="el-input__icon el-icon-edit"></i>
            </el-input>
          </el-form-item>
          <el-form-item label="电话号码：" :label-width="formLabelWidth" style="width: 24%;" prop="phone">
            <el-input style="width:150px;"
                      placeholder="请输入员工电话号码"
                      v-model="employee.phone">
              <i slot="prefix" class="el-input__icon el-icon-edit"></i>
            </el-input>
          </el-form-item>
          <!--row3 end-->

          <!--row4 begin-->
          <el-form-item label="工号：" :label-width="formLabelWidth" style="width: 24%;" prop="workid">
            <el-input style="width:150px;"
                      disabled
                      placeholder="请输入员工工号"
                      v-model="employee.workid">
              <i slot="prefix" class="el-input__icon el-icon-edit"></i>
            </el-input>
          </el-form-item>
          <el-form-item label="学历：" :label-width="formLabelWidth" style="width: 24%;" prop="tiptopdegree">
            <el-input style="width:150px;"
                      placeholder="请输入员工学历"
                      v-model="employee.tiptopdegree">
              <i slot="prefix" class="el-input__icon el-icon-edit"></i>
            </el-input>
          </el-form-item>
          <el-form-item label="毕业院校：" :label-width="formLabelWidth" style="width: 24%;" prop="school">
            <el-input style="width:150px;"
                      placeholder="请输入员工毕业院校"
                      v-model="employee.school">
              <i slot="prefix" class="el-input__icon el-icon-edit"></i>
            </el-input>
          </el-form-item>
          <el-form-item label="专业名称：" :label-width="formLabelWidth" style="width: 24%;" prop="specialty">
            <el-input style="width:150px;"
                      placeholder="请输入员工专业"
                      v-model="employee.specialty">
              <i slot="prefix" class="el-input__icon el-icon-edit"></i>
            </el-input>
          </el-form-item>
          <!--row4 end-->

          <!--row5 begin-->
          <el-form-item label="入职日期：" :label-width="formLabelWidth" style="width: 24%;" prop="begindate">
            <el-date-picker style="width:150px;"
                            v-model="employee.begindate"
                            type="date"
                            placeholder="入职日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="转正日期：" :label-width="formLabelWidth" style="width: 24%;" prop="conversiontime">
            <el-date-picker style="width:150px;"
                            v-model="employee.conversiontime"
                            type="date"
                            placeholder="转正日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="合同起始日期：" :label-width="formLabelWidth" style="width: 24%;" prop="begincontract">
            <el-date-picker style="width:150px;"
                            v-model="employee.begincontract"
                            type="date"
                            placeholder="合同起始日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="合同终止日期：" :label-width="formLabelWidth" style="width: 24%;" prop="endcontract">
            <el-date-picker style="width:150px;"
                            v-model="employee.endcontract"
                            type="date"
                            placeholder="合同终止日期">
            </el-date-picker>
          </el-form-item>
          <!--row5 end-->

          <!--row6 begin-->
          <el-form-item label="身份证号码：" class="row5_form_item" :label-width="formLabelWidth" prop="idcard">
            <el-input style="width:150px;"
                      placeholder="请输入员工身份证号码"
                      v-model="employee.idcard">
              <i slot="prefix" class="el-input__icon el-icon-edit"></i>
            </el-input>
          </el-form-item>
          <el-form-item label="聘用形式：" class="row5_form_item" :label-width="formLabelWidth" prop="engageform">
            <el-radio-group v-model="employee.engageform">
              <el-radio label="劳动合同"></el-radio>
              <el-radio label="劳务合同"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="婚姻状况：" class="row5_form_item" :label-width="formLabelWidth" prop="wedlock">
            <el-radio-group v-model="employee.wedlock">
              <el-radio label="已婚"></el-radio>
              <el-radio label="未婚"></el-radio>
              <el-radio label="离异"></el-radio>
            </el-radio-group>

          </el-form-item>
          <!--row6 end-->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('employee')">确 定</el-button>
          <el-button type="primary" @click="flushEmployee('employee')">重 置</el-button>
        </div>
      </el-dialog>
    </div>
    <!--添加员工弹出框结束-->
  </div>
</template>

<script>
export default {
  name: "EmpBasic",
  data() {
    return {
      departmentDisabled: false,
      advancedSearchShow: true,
      importDisabled: false,
      importTital: "导入数据",
      importIcon: "el-icon-sort-up",
      eName: "",
      title: "添加员工",
      tableData: [],
      total: 0,
      page: 1,
      pageSize: 13,
      dialogFormVisible: false,
      formLabelWidth: '120px',
      employee: {},
      employeeVerifys: {
        name: [
          {required: true, message: '请输入员工姓名', trigger: 'blur'}
        ],
        gender: [
          {required: true, message: '请选择员工性别', trigger: 'change'}
        ],
        birthday: [
          {required: true, message: '请选择出生日期', trigger: 'change'}
        ],
        politicid: [
          {required: true, message: '请选择政治面貌', trigger: 'change'}
        ],
        nationid: [
          {required: true, message: '请选择员工民族', trigger: 'change'}
        ],
        nativeplace: [
          {required: true, message: '请输入员工籍贯', trigger: 'change'}
        ],
        nativeplace: [
          {required: true, message: '请输入员工邮箱', trigger: 'change'}
        ],
        address: [
          {required: true, message: '请输入员工地址', trigger: 'change'}
        ],
        posid: [
          {required: true, message: '请选择员工职位', trigger: 'change'}
        ],
        joblevelid: [
          {required: true, message: '请选择员工职称', trigger: 'change'}
        ],
        departmentid: [
          {required: true, message: '请选择员工部门', trigger: 'change'}
        ],
        phone: [
          {required: true, message: '请输入员工电话', trigger: 'change'}
        ],
        workid: [
          {required: true, message: '请输入员工工号', trigger: 'change'}
        ],
        tiptopdegree: [
          {required: true, message: '请输入员工学历', trigger: 'change'}
        ],
        school: [
          {required: true, message: '请输入员工毕业院校', trigger: 'change'}
        ],
        specialty: [
          {required: true, message: '请输入员工专业', trigger: 'change'}
        ],
        begindate: [
          {required: true, message: '请选择员工入职日期', trigger: 'change'}
        ],
        conversiontime: [
          {required: true, message: '请选择员工转正日期', trigger: 'change'}
        ],
        begincontract: [
          {required: true, message: '请选择员工合同起始日期', trigger: 'change'}
        ],
        endcontract: [
          {required: true, message: '请选择员工合同终止日期', trigger: 'change'}
        ],
        idcard: [
          {required: true, message: '请输入员工身份证号码', trigger: 'change'},
          {min: 18, max: 20, message: '身份证长度在 18 到 20 个字符', trigger: 'blur'}
        ],
        engageform: [
          {required: true, message: '请选择员工聘用形式', trigger: 'change'}
        ],
        wedlock: [
          {required: true, message: '请选择员工婚姻状况', trigger: 'change'}
        ],
        email: [
          {required: true, message: '请输入员工电子邮箱', trigger: 'change'}
        ]
      },
      politicsStatus: [],
      psVlue: "",
      nations: [],
      nation: "",
      positions: [],
      position: "",
      jobLevels: [],
      jobLevel: "",
      engageform: "",
      beginDate: "",
      endDate: "",
      departments: [],
      department: "",
      departmentId: 0,
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    };
  },
  methods: {
    handleNodeClick(node) {
      this.departmentDisabled = false;
      this.departmentId = node.id;
      this.department = node.name;
    },
    advancedSearch() {
      this.advancedSearchShow = this.advancedSearchShow == true ? false : true;
      this.initadvancedSearchData();
    },
    onSuccess() {
      this.importIcon = "el-icon-sort-up";
      this.importTital = "导入数据";
      this.importDisabled = false;
    },
    onError() {

      this.importIcon = "el-icon-sort-up";
      this.importTital = "导入数据";
      this.importDisabled = false;
    },
    beforeUpload() {
      this.importIcon = "el-icon-loading";
      this.importTital = "正在导入";
      this.importDisabled = true;
    },
    exportData() {
      window.open("/emp/basic/export", "_parent");
    },
    initDataSouce() {
      this.getRequest("/emp/basic/politic").then(resp => {
        this.politicsStatus = resp;
      })
      this.getRequest("/emp/basic/nation").then(resp => {
        this.nations = resp;
      })
      this.getRequest("/emp/basic/pos").then(resp => {
        this.positions = resp;
      })
      this.getRequest("/emp/basic/job").then(resp => {
        this.jobLevels = resp;
      })
      this.getRequest("/system/basic/department/").then(resp => {
        this.departments = resp;
      })
    },
    flushEmployee(formName) {
      this.$refs[formName].resetFields();
    },
    showEdit() {
      this.dialogFormVisible = true;
      // this.employee = {};

    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.initTable();
    },
    initTable() {
      var message = "eName=" + this.eName + "&politicsStatus=" +
          this.psVlue + "&nation=" + this.nation + "&position=" + this.position + "&jobLevel=" + this.jobLevel +
          "&engageform=" + this.engageform + "&department=" + this.department + "&beginDate=" + this.beginDate + "&endDate=" + this.endDate;
      this.getRequest("/emp/basic/?" + message + "&page=" + this.page + "&pageSize=" + this.pageSize).then(resp => {
          this.tableData = resp
      });

    },
    initadvancedSearchData() {
      this.psVlue = "";
      this.nation = "";
      this.position = "";
      this.jobLevel = "";
      this.engageform = "";
      this.department = "";
      this.beginDate = "";
      this.endDate = "";
    },
    initPage() {
      var message = "eName=" + this.eName + "&politicsStatus=" +
          this.psVlue + "&nation=" + this.nation + "&position=" + this.position + "&jobLevel=" + this.jobLevel +
          "&engageform=" + this.engageform + "&department=" + this.department + "&beginDate=" + this.beginDate + "&endDate=" + this.endDate;

      this.getRequest("/emp/basic/total?" + message).then(resp => {
        this.total = resp
      });
    },
    selectEmp() {
      this.initPage();
      this.initTable();
    },
    handleClick(row) {
      console.log(row);
    },
    handleSelectionChange(val) {
      console.log(val);
    }
  },
  mounted() {
    this.initTable();
    this.initPage();
    this.initDataSouce();
  }
}
</script>

<style>
.div_top {
  margin-top: 10px;
}

.row5_form_item {
  padding-right: 100px;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .8s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

</style>