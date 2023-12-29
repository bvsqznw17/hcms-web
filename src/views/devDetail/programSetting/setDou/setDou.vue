<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <!-- 指定斗编号列 -->
      <el-table-column label="编号">
        <template slot-scope="scope">
          <!-- 这里可以根据实际情况插入自定义组件或内容 -->
          <div>{{ scope.row.setDou.paramName }}</div>
        </template>
      </el-table-column>
      <!-- 指定斗列 -->
      <el-table-column label="指定斗">
        <template slot-scope="scope">
          <!-- 点击时打开弹出对话框 -->
          <div class="dou-select" @click="openSelectDouDialog(scope.row)">{{ getSelectedDouDisplay(scope.row) }}</div>
        </template>
      </el-table-column>

      <!-- 重量上限列 -->
      <el-table-column label="重量上限">
        <template slot-scope="scope">
          <el-row :gutter="10">
            <el-col :span="18">
              <el-input v-model="scope.row.weightUp.paramValue" @change="changeInput('up', scope.row)"></el-input>
            </el-col>
            <el-col :span="6">
              <span>{{unit}}</span>
            </el-col>
          </el-row>
        </template>
      </el-table-column>

      <!-- 重量下限列 -->
      <el-table-column label="重量下限">
        <template slot-scope="scope">
          <el-row :gutter="10">
            <el-col :span="18">
              <el-input v-model="scope.row.weightDown.paramValue" @change="changeInput('down', scope.row)"></el-input>
            </el-col>
            <el-col :span="6">
              <span>{{unit}}</span>
            </el-col>
          </el-row>
        </template>
      </el-table-column>

      <!-- 多斗组合列 -->
      <el-table-column label="多斗组合">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isMultiDou" @change="newValue => changeMultiDou(scope.row,newValue)"></el-switch>
        </template>
      </el-table-column>

      <!-- 超强轻排列 -->
      <el-table-column label="超强轻排">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isSuperLight" @change="newValue => changeSuperLight(scope.row,newValue)"></el-switch>
        </template>
      </el-table-column>

    </el-table>
    <!-- 弹出对话框 -->
    <el-dialog title="选择斗" :visible="selectDouDialogVisible" @close="closeSelectDouDialog">
      <axb-check-box :key="checkBoxKey" ref="radio" :multi="true" :list="douList" @change="selectBox"></axb-check-box>
      <span slot="footer" class="dialog-footer">
        <el-button @click="selectDouDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveSetDou()">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import { getDouParam, updateParamValue } from "@/api/device/paramValue.js";
import { checkDevStatus } from "@/api/device/business.js";
import axbCheckBox from "@/components/axb-checkbox/axb-checkbox";
export default {
  components: {
    axbCheckBox: axbCheckBox,
  },
  data() {
    return {
      douList: [
        { name: "1", value: 1, checked: 0 },
        { name: "2", value: 2, checked: 0 },
        { name: "3", value: 3, checked: 0 },
        { name: "4", value: 4, checked: 0 },
        { name: "5", value: 5, checked: 0 },
        { name: "6", value: 6, checked: 0 },
        { name: "7", value: 7, checked: 0 },
        { name: "8", value: 8, checked: 0 },
        { name: "9", value: 9, checked: 0 },
        { name: "10", value: 10, checked: 0 },
        { name: "11", value: 11, checked: 0 },
        { name: "12", value: 12, checked: 0 },
        { name: "13", value: 13, checked: 0 },
        { name: "14", value: 14, checked: 0 },
      ],
      setDouIdx: 0, // 当前操作的指定斗index
      selectedDou: 0, // 已经选中的斗
      tableData: [],
      douParamList: [],
      selectDouDialogVisible: false,
      unit: "g",
      baseDecimalNum: 0,
      originalDouList: [], // 用于保存原始的douList状态
      checkBoxKey: 1165165, // 初始值
      isSuperLight: 0, // 超强轻排
      isMultiDou: 0, // 多斗
    };
  },
  created(opt) {
    this.baseDecimalNum = this.$store.getters.dotNum;
    this.unit = this.$store.getters.unit;
    this.calculateSelectedDou();
  },
  methods: {
    // input修改事件
    changeInput(tag, row) {
      let pv = row.weightUp;
      if (tag == "down") {
        pv = row.weightDown;
      }
      console.log(pv.paramValue);
      // 校验修改的值是否超出范围并提示
      // 取单个的值的上下限来进行比较
      let min = this.formatNumber(1, this.baseDecimalNum);
      let max = this.formatNumber(10000, this.baseDecimalNum);
      // 将上下限应用小数点位数
      let val = +pv.paramValue;
      if ((val != 0 && !val) || val > max || val < min) {
        this.$modal.msgError("取值范围在" + min + "~" + max);
        this.calculateSelectedDou();
      } else {
        this.saveData(pv);
      }
    },
    // 保存页面数据
    saveData(pv) {
      // 检测设备是否在线
      checkDevStatus({
        devId: this.$store.getters.devId,
      }).then((res) => {
        if (res.msg != 200) {
          this.$modal.msgError("当前设备" + res.msg);
          return;
        }
        console.log(pv);
        // 将pv的paramValue转为整数
        let oldVal = pv.paramValue;
        pv.paramValue = this.trimPoint(pv.paramValue);
        this.$modal.loading("数据正在保存中,请稍后...");
        updateParamValue(pv).then((res) => {
          console.log(res);
          this.$modal.msgSuccess("保存成功");
          this.$modal.closeLoading();
          // 将修改的值改回原来的值
          pv.paramValue = oldVal;
        });
      });
    },
    // 更新 isMultiDou 的逻辑
    changeMultiDou(row, newValue) {
      let paramIndex = row.paramIndex;
      let val = this.isMultiDou.paramValue;
      console.log(val);
      if (newValue) {
        val |= 1 << paramIndex;
      } else {
        val &= ~(1 << paramIndex);
      }
      console.log(val);
      this.isMultiDou.paramValue = val;
      this.saveData(this.isMultiDou);
    },

    // 更新 isSuperLight 的逻辑
    changeSuperLight(row, newValue) {
      let paramIndex = row.paramIndex;
      let val = this.isSuperLight.paramValue;
      console.log(val);
      if (newValue) {
        val |= 1 << paramIndex;
      } else {
        val &= ~(1 << paramIndex);
      }
      console.log(val);
      this.isSuperLight.paramValue = val;
      this.saveData(this.isSuperLight);
    },
    // 选择dou
    selectBox(e) {
      console.log(e);
      let re = e.re;
      let re_all = e.re_all;
      // 因为是多选，所以e是数组
      // 然后总共有14个斗，但是我们的值是一个整数，所以需要对这个整数进行位运算，按16位来进行
      // 1.先将所有的值清空
      this.tableData[this.setDouIdx].setDou.paramValue = 0;
      // 2.遍历e，将选中的值进行位运算
      for (let i in re) {
        this.tableData[this.setDouIdx].setDou.paramValue |= 1 << (re[i] - 1);
      }
      // 根据改变的结果，重新计算selectedDou
      this.selectedDou = 0;
      for (let i in re_all) {
        this.selectedDou |= 1 << (re_all[i] - 1);
      }
      // this.saveData(this.tableData[this.setDouIdx].setDou);
    },
    // 保存设置斗的参数
    saveSetDou() {
      this.saveData(this.tableData[this.setDouIdx].setDou);
      this.selectDouDialogVisible = false;
    },
    calculateSelectedDou() {
      let promises = [];

      // 收集所有dou参数的请求
      for (let i = 0; i < 7; i++) {
        promises.push(
          getDouParam({
            devId: this.$store.getters.devId,
            param: i,
          })
        );
      }

      // 当所有请求完成后
      Promise.all(promises)
        .then((responses) => {
          // 首先，计算selectedDou
          this.selectedDou = responses.reduce((selected, response) => {
            return selected | parseInt(response.data.setDou.paramValue);
          }, 0);

          // 然后，更新tableData
          this.tableData = responses.map((response, index) => {
            const row = response.data;
            const setDouValue = parseInt(row.setDou.paramValue);

            // 更新douList中每个斗的状态
            this.douList.forEach((dou) => {
              dou.checked = 0;
              if (setDouValue & (1 << (dou.value - 1))) {
                dou.checked = 1;
              }
              if (this.selectedDou & (1 << (dou.value - 1))) {
                dou.checked = 2;
              }
            });

            // 设置isMultiDou和isSuperLight【因为实际上所有的row都共用同样的isMultiDou和isSuperLight】
            this.isMultiDou = row.isMultiDou;
            this.isSuperLight = row.isSuperLight;

            // 格式化weightDown和weightUp的paramValue
            return {
              ...row,
              paramIndex: index,
              weightDown: {
                ...row.weightDown,
                paramValue: this.formatNumber(
                  row.weightDown.paramValue,
                  this.baseDecimalNum
                ),
              },
              weightUp: {
                ...row.weightUp,
                paramValue: this.formatNumber(
                  row.weightUp.paramValue,
                  this.baseDecimalNum
                ),
              },
              isMultiDou: (row.isMultiDou.paramValue & (1 << index)) !== 0,
              isSuperLight: (row.isSuperLight.paramValue & (1 << index)) !== 0,
            };
          });
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });
    },

    getSelectedDouDisplay(row) {
      const selectedDou = row.setDou.paramValue;
      const selectedDouList = this.douList
        .filter((dou) => selectedDou & (1 << (dou.value - 1)))
        .map((dou) => dou.name);

      return selectedDouList.length > 0 ? selectedDouList.join(", ") : "请选择";
    },

    // 打开选择斗对话框
    openSelectDouDialog(row) {
      this.setDouIdx = row.paramIndex;
      this.selectDouDialogVisible = true;
      this.checkBoxKey = new Date().getTime();
      const selectedDou = row.setDou.paramValue;
      // 保存当前douList状态
      this.originalDouList = JSON.parse(JSON.stringify(this.douList));
      // 根据 row 数据初始化 axb-check-box 组件: 把selectedDou对应的数组项的checked设为1
      this.douList.forEach((dou) => {
        if (selectedDou & (1 << (dou.value - 1))) {
          dou.checked = 1;
        }
      });
    },
    // 关闭对话框时还原douList
    closeSelectDouDialog() {
      console.log("closeSelectDouDialog");
      this.selectDouDialogVisible = false;
      // 还原douList到打开对话框之前的状态
      this.douList = JSON.parse(JSON.stringify(this.originalDouList));
    },
  },
};
</script>

<style>
.dou-select {
  color: #409eff;
  cursor: pointer;
}
</style>
