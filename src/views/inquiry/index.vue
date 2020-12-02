<template>
  <div class="znsf">
    <div class="container" v-loading="loading">
        <div class="title">患者信息</div>
      <el-form
        :model="formInline"
        size="medium "
        class="base-table6-form"
        :inline="true"
        style="width: 100%;text-align: left;border-radius: 4px;display:inline-block;background:#fff;"
        ref="hosForm"
        label-width="120px"
        :rules="rules"
      >
          <el-form-item label="选择服务类型" prop="serviceType">
              <el-radio-group v-model="formInline.serviceType">
                  <el-radio :label="0">图文问诊</el-radio>
                  <el-radio :label="1">视频问诊</el-radio>
              </el-radio-group>
          </el-form-item>
          <br />
        <el-form-item label="患者姓名" prop="userFamilyName">
          <el-input
            style="margin-right:24px"
            v-model="formInline.userFamilyName"
            placeholder="请输入"
            class="inputWidth"
          ></el-input>
        </el-form-item>
          <el-form-item label="患者性别" prop="userFamilyGender">
              <el-radio-group v-model="formInline.userFamilyGender">
                  <el-radio :label="1">男</el-radio>
                  <el-radio :label="2">女</el-radio>
              </el-radio-group>
          </el-form-item>
          <br />
        <el-form-item label="患者年龄" prop="userFamilyAge">
          <el-input
            v-model="formInline.userFamilyAge"
            style="margin-right:24px"
            placeholder="请输入"
            class="inputWidth"
          ></el-input>
        </el-form-item>
          <el-form-item label="是否是孕妇" prop="isLactation">
              <el-radio-group v-model="formInline.isLactation">
                  <el-radio :label="0">否</el-radio>
                  <el-radio :label="1">是</el-radio>
              </el-radio-group>
          </el-form-item>
          <el-form-item label="是否是哺乳期" prop="isPregnantWoman">
              <el-radio-group v-model="formInline.isPregnantWoman">
                  <el-radio :label="0">否</el-radio>
                  <el-radio :label="1">是</el-radio>
              </el-radio-group>
          </el-form-item>
          <br />
          <div style="float: left">
              <el-form-item label="患者手机号" prop="userFamilyPhone">
                  <el-input v-model="formInline.userFamilyPhone"
                            style="margin-right:24px" class="inputWidth" placeholder="请输入"></el-input>
              </el-form-item>
              <br />
              <el-form-item label="与患者关系" prop="relationship">
                  <el-select v-model="formInline.relationship" placeholder="请选择" class="inputWidth">
                      <el-option
                          v-for="item in relationshipoptions"
                          :key="item.value"
                          :label="item.name"
                          :value="item.value">
                      </el-option>
                  </el-select>
              </el-form-item>
          </div>
          <div>
              <el-form-item label="主要症状" prop="answer">
                  <el-input
                      v-model="formInline.answer"
                      class="inputWidth_textarea"
                      type="textarea"
                      placeholder="请输入"
                  ></el-input>
              </el-form-item>
          </div>
        <el-form-item label>
          <el-button class="search" size="small" @click="consultation">发起咨询</el-button>
<!--          <el-button size="small" @click="$router.go(-1)">返回首页</el-button>-->
        </el-form-item>
      </el-form>

      <div class="main">
        <div class="tools">
            <p style="margin-left: 28px;display: inline-block;font-size:18px;font-family:PingFangSC-Medium,PingFang SC;font-weight:500;color:rgba(0,0,0,1);">药品选择</p>
          <el-button size="small" icon="el-icon-plus" class="search" @click="checkAdd">新增</el-button>
          <el-button size="small" class="delete" @click="remove">批量删除</el-button>
        </div>
        <vxe-table
          ref="checkGoods"
          height="450"
          border
          :header-cell-style="rowClass"
          :data.sync="checkedGoods"
          tooltip-effect="dark"
          :auto-resize="true"
          :sync-resize="true"
          :edit-rules="validRules"
          :edit-config="{ trigger: 'manual', mode: 'row', autoClear: false,showIcon:false}"
        >
          <vxe-table-column field="checkbox" type="checkbox" width="55"></vxe-table-column>
          <vxe-table-column type="seq" width="55"></vxe-table-column>
          <vxe-table-column field="goodsname" title="货品名称"></vxe-table-column>
          <vxe-table-column field="goodstype" title="规格"></vxe-table-column>
          <vxe-table-column field="num" title="数量" :edit-render="{name: 'input', defaultValue: ''}">
            <template slot-scope="scope">
              <el-input size="mini" v-model="scope.row.num" style="width: 100%"></el-input>
            </template>
          </vxe-table-column>
          <vxe-table-column field="goodsunit" title="包装单位"></vxe-table-column>
           <vxe-table-column field="cz" title="操作" fixed="right" width="150">
                <template slot-scope="scope">
                    <a @click="delEdit(scope.row)" style="cursor: pointer;color: #36C2AA;text-decoration: none">删除</a>
                </template>
           </vxe-table-column>
        </vxe-table>
        <!--分页-->
      </div>

      <!-- 弹窗 -->
      <el-dialog :visible.sync="dialogAdd" title="药品库明细" width="1040px" top="2%" @open="handleOpen">
        <el-form :inline="true" class="left" :model="formInline1">
          <el-form-item>
            <el-input v-model="formInline1.key" style="width:552px" placeholder="通用名/商品名/条形码/批准文号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="search" size="medium" @click="goodsFind">查询</el-button>
          </el-form-item>
        </el-form>

        <vxe-table
          ref="formList"
          height="550"
          border
          :header-cell-style="rowClass"
          :data.sync="tableData"
          tooltip-effect="dark"
        >
          <vxe-table-column field="checkbox" type="checkbox" width="55"></vxe-table-column>
          <vxe-table-column type="seq" width="55"></vxe-table-column>
          <vxe-table-column field="goodsname" title="货品名称"></vxe-table-column>
          <vxe-table-column field="goodstype" title="规格"></vxe-table-column>
          <vxe-table-column field="goodsunit" title="包装单位"></vxe-table-column>
        </vxe-table>

        <!--分页-->
        <div class="block" style="margin: 20px; text-align: right">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page.pageIndex"
            :page-sizes="[5, 10, 20, 50, 100]"
            :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.totalResult"
          ></el-pagination>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogAdd=false">取 消</el-button>
          <el-button class="search" @click="submitCheck">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// import XEUtils from 'xe-utils']
import { goodsFind, createZixun } from "../../api/inquiry";
function validIdCard(str) {
  const reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/i;
  return reg.test(str);
}
// 验证用户名
function validPhone(str) {
  const myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
  return myreg.test(str);
}

const IdCard = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入身份证号码"));
  } else if (!validIdCard(value)) {
    callback(new Error("身份证号码格式不正确"));
  } else {
    callback();
  }
};

const valPhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入手机号"));
  } else if (!validPhone(value)) {
    callback(new Error("请输入正确的手机格式"));
  } else {
    callback();
  }
};
export default {
  name: "index",
  data() {
    return {
      formInline: {
          serviceType: 0,
          userFamilyGender: 1,
          isLactation: 0,
          isPregnantWoman: 0,
          userFamilyName: '',
          userFamilyAge: '',
          userFamilyPhone: '',
          relationship: '',
      },
        formInline1: {
          key: ''
        },
      dialogAdd: false,
      loading: false,
      options: [
        {
          value: 1,
          label: "2次/天"
        },
        {
          value: 2,
          label: "2次/周"
        },
        {
          value: 3,
          label: "睡前服用"
        },
        {
          value: 4,
          label: "1次/12小时"
        },
        {
          value: 5,
          label: "1次/小时"
        },
        {
          value: 6,
          label: "1次/3小时"
        },
        {
          value: 7,
          label: "1次/6小时"
        },
        {
          value: 8,
          label: "1次/8小时"
        },
        {
          value: 9,
          label: "1次/天"
        },
        {
          value: 10,
          label: "4次/天"
        },
        {
          value: 11,
          label: "隔天1次"
        },
        {
          value: 12,
          label: "1次/周"
        },
        {
          value: 13,
          label: "立即服用"
        },
        {
          value: 14,
          label: "3次/天"
        },
        {
          value: 15,
          label: "隔周一次"
        },
        {
          value: 16,
          label: "必要时"
        },
        {
          value: 17,
          label: "紧急时"
        },
        {
          value: 18,
          label: "每两周一次"
        },
        {
          value: 99,
          label: "其它"
        }
      ],
      tableData: [],
      checkedGoods: [],
      page: {
        pageSize: 10,
        pageIndex: 1,
        totalResult: 0
      },
      validRules: {
        num: [{ required: true, message: "请输入药品数量", trigger: "change" }],
      },
        relationshipoptions: [
            {name: '本人', value: 1},
            {name: '父母', value: 2},
            {name: '配偶', value: 3},
            {name: '子女', value: 4},
            {name: '其他', value: 5}
            ],
      rules: {
          userFamilyName: {required: true, trigger: "change", message: "请输入患者姓名"},
          userFamilyGender: [{required: true, trigger: "change", message: "请选择性别"}],
          userFamilyAge: [{required: true, trigger: "change", message: "请输入年龄"}],
          userFamilyPhone: {required: true, trigger: 'blur', validator: valPhone},
        isLactation: {required: true, trigger: "change", message: "请选择"},
        isPregnantWoman: {required: true, trigger: "change", message: "请选择"},
          relationship: {required: true, trigger: "change", message: "请选择"},
          answer: {required: true, trigger: "change", message: "请输入"}
      },
      resData: {}
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created() {},
  mounted() {},
  methods: {
      numBlur () {
          console.log(this.checkedGoods);
          this.checkedGoods.forEach((item) => {

          })
      },
      delEdit (row) {
          this.checkedGoods.forEach((item2, index2) => {
              if (JSON.stringify(row) === JSON.stringify(item2)) {
                  this.checkedGoods.splice(index2, 1);
              }
          });
      },
    remove() {
      let rows = this.$refs.checkGoods.getCheckboxRecords();
      if (rows.length != 0) {
        this.$confirm("是否删除", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            rows.forEach((item, index) => {
              this.checkedGoods.forEach((item2, index2) => {
                if (JSON.stringify(item) === JSON.stringify(item2)) {
                  this.checkedGoods.splice(index2, 1);
                }
              });
            });
          })
          .catch(err => {});
      }
    },
    async consultation() {
        let answerMedicineArr = []
        let numType = false
        if (this.checkedGoods.length == 0) {
        // this.$router.push({path:'/consultation'})
        this.$message("请添加至少一项药品！");
        return;
      } else {
            let reg = /^[0-9]*[1-9][0-9]*$/
          this.checkedGoods.forEach(item => {
              answerMedicineArr.push({
                  medicineId: item.medicineId,
                  number: item.num
              })
              if (item.num <= 0 || !reg.test(item.num)) {
                  numType = true
                  return item.num = ''
              }
          })
      }
        if (numType) {
            this.$message("请完善表格中的必填项！");
            return false
        }
        const errMap = await this.$refs.checkGoods
        .validate()
        .catch(errMap => errMap);
      if (errMap) {
        this.$message("请完善表格中的必填项！");
        return;
      }

      this.$refs.hosForm.validate(valid => {
        if (valid) {
          this.loading = true;
          let params = {
              memberId: this.userInfo.userpkid,
              serviceType: this.formInline.serviceType,
              userFamilyName: this.formInline.userFamilyName,
              userFamilyGender: this.formInline.userFamilyGender,
              userFamilyAge: this.formInline.userFamilyAge,
              isLactation: this.formInline.isLactation,
              isPregnantWoman: this.formInline.isPregnantWoman,
              userFamilyPhone: this.formInline.userFamilyPhone,
              relationship: this.formInline.relationship,
              userName: this.userInfo.username,
              companyId: this.userInfo.companyid,
              companyName: this.userInfo.companyname,
              deptId: this.userInfo.deptid,
              deptName: this.userInfo.deptname,
              beforeAiDataList: [
                  {
                      answer: this.formInline.answer,
                      subjectId: 1
                  },
                  {
                      answer: '',
                      subjectId: 2,
                      answerMedicine: answerMedicineArr
                  }
              ]
          };
          console.log(params);
            createZixun (params).then(res => {
                this.loading = false;
                if (res.status === 200) {
                    if (res.data != null) {
                        window.open(res.data)
                    }
                } else {
                    this.$message.error(res.msg)
                }
            }).catch(err => {
                this.loading = false;
                console.log(err);
            })
        }
      });
    },
    rowClass() {
      return "background: #FAFAFA;color:#000; height: 54px;font-size:14px;border-color:#dddfe7;";
    },
    handleSizeChange(pageSize) {
      this.page.pageSize = pageSize;
      this.goodsFind();
    },
    handleCurrentChange(pageIndex) {
      this.page.pageIndex = pageIndex;
      this.goodsFind();
    },
    checkAdd() {
      this.formInline1 = {}
      this.dialogAdd = true;
    },
    submitCheck() {
        let rows = this.$refs.formList.getCheckboxRecords();
        if (rows.length) {
            rows.forEach((item, index) => {
                this.checkedGoods.push({
                    goodsname: item.goodsname,
                  goodstype: item.goodstype,
                  goodsunit: item.goodsunit,
                  medicineId: item.pkid,
                    num: undefined
                });
            });
            this.checkedGoods = this.deteleObject(this.checkedGoods); // 去重
            this.dialogAdd = false;
        } else {
            this.$message.warning("请至少选择一条数据");
        }
    },
    handleOpen() {
      this.goodsFind();
    },
    goodsFind() {
      let params = {
        companyid: this.userInfo.companyid,
        key: this.formInline1.key,
        page: {
            pageIndex: this.page.pageIndex,
            pageSize: this.page.pageSize
        }
      };
      goodsFind(params).then(response => {
        this.tableData = response.data.list;
        this.page.totalResult = response.data.total
      });
    },
    deteleObject(obj) {
        var uniques = [];
      var stringify = {};
      for (var i = 0; i < obj.length; i++) {
        var keys = Object.keys(obj[i]);
        keys.sort(function(a, b) {
          return Number(a) - Number(b);
        });
          var str = "";
        for (var j = 0; j < keys.length; j++) {
          if (keys[j] !== "_XID") {
            str += JSON.stringify(keys[j]);
            str += JSON.stringify(obj[i][keys[j]]);
          }
        }
          if (!stringify.hasOwnProperty(str)) {
          uniques.push(obj[i]);
          stringify[str] = true;
        }
      }
        return uniques;
    }
  }
};
</script>
<style scoped lang="scss">
.znsf {
    width: 100%;
    background: rgba(245, 245, 245, 1);
    display: flex;
    justify-content: center;

  & /deep/ .vxe-table.size--medium .vxe-body--column.col--ellipsis,
  .vxe-table.size--medium .vxe-footer--column.col--ellipsis,
  .vxe-table.size--medium .vxe-header--column.col--ellipsis,
  .vxe-table.vxe-editable.size--medium .vxe-body--column {
    height: 54px;
  }
  & /deep/ .el-form-item__label,
  .el-input__inner,
  .el-button {
    font-size: 14px !important;
  }
    & /deep/ .el-textarea__inner{
        resize: none;
        height: 98px;
    }
    & /deep/ .el-radio__input.is-checked .el-radio__inner{
        border-color: #36c2aa;
        background: #36c2aa;
    }
    & /deep/ .el-radio__input.is-checked+.el-radio__label {
        color: #36c2aa;
    }
.title{
    line-height: 66px;
    height: 66px;
    font-size:18px;
    font-family:PingFangSC-Medium,PingFang SC;
    font-weight:600;
    color:rgba(51,51,51,1);
    text-align: center;
}
    .inputWidth_textarea{
        width: 368px;
    }
  .container {
    width: 83.333%;
    overflow: hidden;
  }
  .main {
    background: #fff;
    margin-top: 16px;
      border-radius: 4px;
  }
  .base-table6-form {
    padding-top: 24px;
    padding-left: 32px;
  }
  .search {
    color: #fff;
    background-color: $color-btn;
    border-color: $color-btn;
    border-radius: 2px;
    margin-left: 120px;
  }

  .inputWidth {
    width: 368px;
  }
  .tools {
    height: 64px;
    line-height: 64px;
      .search {
          margin-left: 32px;
      }
  }
}
</style>
