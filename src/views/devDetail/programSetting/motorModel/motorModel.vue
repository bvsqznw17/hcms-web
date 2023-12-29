<template>
  <div>
    <!-- 表单部分 -->
    <el-form style="width:80%;" v-if="pvList && pvList.length > 0" label-position="left" label-width="130px">
      <!-- 表单项 -->
      <el-row :gutter="20">
        <el-col :span="12" v-for="(it, idx) in pvList" :key="idx">
          <el-form-item :label="it.paramName">
            <el-input type="text" v-model="it.paramValue" :disabled="it.disabled" @change="changeInput(it)"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 暂无数据部分 -->
    <div class="noData" v-if="pvList.length == 0">暂无数据</div>

    <!-- 保存按钮的新位置和样式 -->
    <div class="btn-wrapper">
      <el-button type="primary" plain @click="saveData">保存</el-button>
    </div>
  </div>
</template>

<script>
import { listForParam, updateParamValue } from "@/api/device/paramValue.js";
import { deepCopy, formatNumber } from "@/utils/util.js";
import { checkDevStatus } from "@/api/device/business.js";
export default {
  data() {
    return {
      queryParams: {
        devId: null,
        paramSubType: 1,
      },
      pvList: [],
      updIdMap: {},
      preData: {},
    };
  },
  created(opt) {
    this.queryParams.devId = this.$store.getters.devId;
    this.queryParams.paramSubType = 5;
    this.getList();
  },
  methods: {
    getList() {
      listForParam(this.queryParams).then((res) => {
        console.log(res);
        this.pvList = res.data;
        this.preData = deepCopy(this.pvList);
      });
    },
    // input修改事件
    changeInput(it) {
      // 校验修改的值是否超出范围并提示
      console.log(it);
      console.log(this.preData);
      console.log(this.pvList);
      if (it.paramName.indexOf(this.strValidParamName) == -1) {
        let min = it.minV;
        let max = it.maxV;
        let pv = parseInt(it.paramValue);
        if ((pv != 0 && !pv) || pv > +max || pv < +min) {
          this.$modal.msgError(it.paramName + "取值范围在" + min + "~" + max);
          // 将修改的值改回原来的值
          this.preData.map((item, index) => {
            if (item.paramName == it.paramName) {
              it.paramValue = item.paramValue;
            }
          });
          this.pvList = this.pvList.map((item, index) => {
            if (item.paramName == it.paramName) {
              item.paramValue = it.paramValue;
            }
            return item;
          });
        } else {
          // 将修改后的值做格式化处理，保留小数点后几位，按照decimalNum
          it.paramValue = (+it.paramValue).toFixed(it.decimalNum);
          this.updIdMap[it.regAddr] = it.regAddr;
          this.preData = deepCopy(this.pvList);
        }
      }
    },
    // 保存页面数据
    saveData(data) {
      // 检测设备是否在线
      checkDevStatus({
        devId: this.$store.getters.devId,
      }).then((res) => {
        if (res.msg != 200) {
          this.$modal.msgError("当前设备" + res.msg);
          return;
        }

        let tabData = data || this.pvList;
        // 遍历tabData，判断是否在updIdMap中，在就修改
        let keys = Object.keys(this.updIdMap);
        let len = keys.length;
        let num = 0;
        tabData.map((it, idx) => {
          if (it.regAddr in this.updIdMap) {
            // 对小数点反格式化后再进行存储
            if (it.paramName.indexOf(this.strValidParamName) == -1) {
              it.paramValue = this.trimPoint(it.paramValue);
            }

            updateParamValue(it).then((res) => {
              num++;
              console.log(res);
              // 之后再格式化作为显示
              it.paramValue = (
                it.paramValue / Math.pow(10, it.decimalNum)
              ).toFixed(it.decimalNum);
              if (num == len) {
                this.updIdMap = {};
                this.$modal.msgSuccess("保存成功");
              }
            });
          }
        });
      });
    },
    // 过滤小数点转为整数
    trimPoint(v) {
      return parseInt(String(v).replace(".", "")) | v;
    },
  },
};
</script>

<style>
.btn-wrapper {
  text-align: center; /* 按钮靠右对齐 */
  margin-top: 40px; /* 与表单项的间隔 */
  width: 80%;
}

/* 暂无数据样式调整 */
.noData {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px; /* 根据需要设置适当的高度 */
}
</style>
