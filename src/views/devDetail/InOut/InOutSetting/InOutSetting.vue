<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" width="80" label="端口号" align="center">
      </el-table-column>
      <!-- 功能列 -->
      <el-table-column prop="value" label="功能" width="180" align="center">
        <template slot-scope="scope">
          <el-select v-model="scope.row.value" placeholder="请选择" size="mini" @change="changeFunc(scope.row)">
            <el-option v-for="(item, index) in funcList" :key="index" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>

      <!-- 翻转列 -->
      <el-table-column prop="reverse" label="翻转" width="120" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.reverse" @change="changeReverse(scope.row, $event)" size="mini"></el-switch>
        </template>
      </el-table-column>

      <!-- 状态列 -->
      <el-table-column prop="status" label="状态" width="120" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" size="mini" disabled></el-switch>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { updateParamValue } from "@/api/device/paramValue.js";
import {
  readParam,
  readParams,
  checkDevStatus,
} from "@/api/device/business.js";
export default {
  props: ["param"],
  data() {
    return {
      form: {
        inOut: 0,
        param: null,
        portNum: 0,
        reverse: false,
        status: false,
      },
      queryParams: {
        devId: null,
        ip: null,
        paramSubType: 6,
        pageNum: 1,
        pageSize: 50,
      },
      navTitlePre: "输入端口", // 导航栏标题前缀
      funcList: [],
      funcIndex: 0,
      isBorder: true,
      reverse: false,
      status: false,
      hasChange: false,
      tableData: [],
      ioinFuncList: [
        { name: "无", value: 0 },
        { name: "包装机A请求放料信号输入", value: 1 },
        { name: "包装机B请求放料信号输入", value: 2 },
        { name: "包装机C请求放料信号输入", value: 3 },
        { name: "包装机D请求放料信号输入", value: 4 },
        { name: "料位检测信号输入A", value: 5 },
        { name: "料位检测信号输入B", value: 6 },
        { name: "料位检测信号输入C", value: 7 },
        { name: "料位检测信号输入D", value: 8 },
        { name: "", value: 9 },
        { name: "运行", value: 10 },
      ],
      iooutFuncList: this.generateIooutFuncList(),
      funcList: [], // 功能列表
    };
  },
  created() {
    this.funcList = this.param == 0 ? this.ioinFuncList : this.iooutFuncList;
    this.readData();
  },
  methods: {
    // 读取输入输出参数
    readData() {
      let paramKeys = this.genParamKeys();
      console.log(paramKeys);

      Promise.all([
        readParams({
          devId: this.$store.getters.devId,
          paramKeys: JSON.stringify(paramKeys),
        }),
        readParam({
          devId: this.$store.getters.devId,
          paramKey: this.param == 0 ? "sys_ioin_status" : "sys_ioout_status",
        }),
      ])
        .then(([res1, res2]) => {
          console.log(res1);
          console.log(res2);

          this.tableData = this.createTableData(res1.data, res2.data);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    // 生成paramKeys
    genParamKeys() {
      let paramKeys = [];
      const prefix = this.param == 0 ? "sys_ioin_pin" : "sys_ioout_pin";
      const len = this.param == 0 ? 4 : 12;
      for (let i = 0; i < len; i++) {
        paramKeys.push(prefix + "[" + i + "]");
      }
      return paramKeys;
    },
    // 创建tableData
    createTableData(data, status) {
      let tableData = [];
      for (let key in data) {
        let high8 = (data[key] >> 8) & 0xff; // 高8位
        let low8 = data[key] & 0xff; // 低8位

        // 处理低8位
        tableData.push({
          value: (low8 & 0x7f) % this.funcList.length,
          reverse: low8 & 0x80,
          paramKey: key + "_1",
          halfValue: low8,
          paramValue: data[key],
        });

        // 处理高8位
        tableData.push({
          value: (high8 & 0x7f) % this.funcList.length,
          reverse: high8 & 0x80,
          paramKey: key + "_2",
          halfValue: high8,
          paramValue: data[key],
        });
      }

      // 对每个项目更新状态
      tableData = tableData.map((item, i) => {
        item.status = status & (0x01 << i);
        return item;
      });

      console.log(tableData);
      return tableData;
    },

    // 修改端口func
    changeFunc(row) {
      let newValue;

      if (row.paramKey.endsWith("_1")) {
        // 如果修改的是低8位，则保持高8位不变，只修改低8位
        newValue = (((row.paramValue >> 8) & 0xff) << 8) | (row.value & 0x7f);
      } else if (row.paramKey.endsWith("_2")) {
        // 如果修改的是高8位，则保持低8位不变，只修改高8位
        newValue = (row.paramValue & 0xff) | ((row.value & 0x7f) << 8);
      } else {
        // 如果不匹配，则不做修改
        newValue = row.paramValue;
      }

      // 保持最高位（第8位或第16位）的原始值
      newValue |= row.paramValue & 0x8080;

      row.paramValue = newValue;
      this.saveData(row);
    },
    // 修改端口翻转
    changeReverse(row, b) {
      if (row.paramKey.endsWith("_1")) {
        // 如果是低8位
        if (b) {
          row.paramValue = row.paramValue | 0x80; // 设置低8位的翻转位
        } else {
          row.paramValue = row.paramValue & 0xff7f; // 清除低8位的翻转位
        }
      } else if (row.paramKey.endsWith("_2")) {
        // 如果是高8位
        if (b) {
          row.paramValue = row.paramValue | 0x8000; // 设置高8位的翻转位
        } else {
          row.paramValue = row.paramValue & 0x7fff; // 清除高8位的翻转位
        }
      }

      this.saveData(row);
    },

    // 保存页面数据
    saveData(pv) {
      // 如果pv的paramKey以_1或_2结尾，需要把这个_1或_2去掉
      if (pv.paramKey.endsWith("_1") || pv.paramKey.endsWith("_2")) {
        pv.paramKey = pv.paramKey.substring(0, pv.paramKey.length - 2);
        console.log(pv.paramKey);
      }
      // 检测设备是否在线
      checkDevStatus({
        devId: this.$store.getters.devId,
      }).then((res) => {
        if (res.msg != 200) {
          this.$modal.msgError("当前设备" + res.msg);
          return;
        }
        this.$modal.loading("数据正在保存中,请稍后...");
        updateParamValue({
          devId: this.$store.getters.devId,
          paramKey: pv.paramKey,
          paramValue: pv.paramValue,
        })
          .then((res) => {
            console.log(res);
            this.$modal.msgSuccess("保存成功");
          })
          .finally(() => {
            this.$modal.closeLoading();
          });
      });
    },
    // 生成iooutFuncList
    generateIooutFuncList() {
      var iooutFuncList = [{ name: "无", value: 0 }];

      for (var i = 1; i <= 5; i++) {
        iooutFuncList.push({
          name: "组合秤就绪 " + i + "A",
          value: (i - 1) * 4 + 1,
        });
        iooutFuncList.push({ name: "放料 " + i + "B", value: (i - 1) * 4 + 2 });
        iooutFuncList.push({ name: "超重 " + i + "C", value: (i - 1) * 4 + 3 });
        iooutFuncList.push({
          name: "料位加料 " + i + "D",
          value: (i - 1) * 4 + 4,
        });
      }

      iooutFuncList.push({ name: "正在运行", value: 21 });
      iooutFuncList.push({ name: "有报警", value: 22 });

      for (var j = 23; j < 30; j++) {
        iooutFuncList.push({ name: "", value: j });
      }

      for (var k = 30; k < 44; k++) {
        iooutFuncList.push({ name: "振机" + (k - 29) + "信号", value: k });
      }

      return iooutFuncList;
    },
  },
};
</script>

<style>
.form-style {
  background-color: #fff;
}

.btn-wrapper {
  margin-top: 20px;
}

.btn-wrapper-button {
  width: 180upx;
  line-height: 80upx;
  height: 80upx;
}
</style>
