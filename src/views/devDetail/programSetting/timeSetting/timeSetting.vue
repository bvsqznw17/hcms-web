<template>
  <div>
    <!-- 表单部分 -->
    <el-form v-if="pvList && pvList.length > 0" label-position="left" label-width="130px">
      <!-- 表单项 -->
      <el-row :gutter="20">
        <el-col :span="8" v-for="(it, idx) in pvList" :key="idx">
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
import { listSettings } from "@/api/device/sysSettings.js";
export default {
  data() {
    return {
      queryParams: {
        devId: null,
        paramSubType: 1,
      },
      pvList: [],
      updIdMap: {},
      strValidParamName: ["产品名称"],
      preData: {},
      QPDGRelativeKey: ["prm_Dou_PauseTime[2]", "prm_JYD_Dly", "prm_JYD_Dly2"],
    };
  },
  created(opt) {
    this.queryParams.devId = this.$store.getters.devId;
    this.queryParams.paramSubType = 4;
    this.getList();
  },
  methods: {
    getList() {
      listForParam(this.queryParams).then((res) => {
        console.log(res);
        let pvList = res.data;
        // 根据decimalNum将paramValue转换成小数
        pvList.map((item, index) => {
          item.paramValue = formatNumber(item.paramValue, item.decimalNum);
        });
        console.log(pvList);
        this.preData = deepCopy(pvList);
        this.getRuleList(pvList);
      });
    },
    getRuleList(pvList) {
      listSettings({
        devId: this.queryParams.devId,
        pageNum: 1,
        pageSize: 100,
      }).then((res) => {
        console.log(res);
        this.pvList = pvList;
        let ruleList = res.rows;
        // 遍历ruleList，如果paramKey=="sys_QPDGSel" 且 paramValue==0，则将pvList中的paramKey in QPDGRelativeKey的项的disabled设置为true
        ruleList.map((it, idx) => {
          if (it.paramKey == "sys_QPDGSel" && it.paramValue == 1) {
            this.pvList.map((item, index) => {
              if (this.QPDGRelativeKey.indexOf(item.paramKey) != -1) {
                item.disabled = true;
                return item;
              }
            });
          }
        });
        this.pvList = this.rearrangeArray(this.pvList);
        console.log(this.pvList);
      });
    },
    // input修改事件
    changeInput(it) {
      // 校验修改的值是否超出范围并提示
      console.log(it);
      if (it.paramName.indexOf(this.strValidParamName) == -1) {
        let min = it.minV;
        let max = it.maxV;
        let pv = +it.paramValue;
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
      } else {
        this.updIdMap[it.regAddr] = it.regAddr;
        this.preData = deepCopy(this.pvList);
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
        console.log(this.updIdMap);
        let len = keys.length;
        let num = 0;
        tabData.map((it, idx) => {
          if (it.regAddr in this.updIdMap) {
            // 对小数点反格式化后再进行存储
            if (it.paramName.indexOf(this.strValidParamName) == -1) {
              it.paramValue = parseInt(
                it.paramValue * Math.pow(10, it.decimalNum)
              );
            }
            console.log("更新");
            updateParamValue(it).then((res) => {
              num++;
              console.log(res);
              // 之后再格式化作为显示
              if (it.paramName.indexOf(this.strValidParamName) == -1) {
                it.paramValue = formatNumber(it.paramValue, it.decimalNum);
              }
              if (num == len) {
                this.updIdMap = {};
                this.$modal.msgSuccess("保存成功");
              }
            });
          }
        });
      });
    },
    // rearrangeArray(originalArray) {
    //   const n = originalArray.length;
    //   const groupSize = Math.ceil(n / 3);
    //   let rearrangedArray = [];

    //   for (let i = 0; i < groupSize; i++) {
    //     if (i < n) {
    //       rearrangedArray.push(originalArray[i]);
    //     }
    //     if (i + groupSize < n) {
    //       rearrangedArray.push(originalArray[i + groupSize]);
    //     }
    //     if (i + 2 * groupSize < n) {
    //       rearrangedArray.push(originalArray[i + 2 * groupSize]);
    //     }
    //   }

    //   return rearrangedArray;
    // },
  },
};
</script>

<style>
/* 按钮容器样式 */
.btn-wrapper {
  text-align: center; /* 按钮靠右对齐 */
  margin-top: 40px; /* 与表单项的间隔 */
}

/* 暂无数据样式调整 */
.noData {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px; /* 根据需要设置适当的高度 */
}
</style>
