<template>
  <div>
    <!-- 表单部分 -->
    <el-form v-if="pvList && pvList.length > 0" label-position="left" label-width="100px">
      <!-- 表单项 -->
      <el-row :gutter="20">
        <el-col :span="8" v-for="(it, idx) in pvList" :key="idx">
          <el-form-item :label="it.paramName">
            <el-select v-if="it.pbList != undefined" v-model="pbIndexs[it.paramKey]" @change="selChange(it, $event)" :disabled="it.disabled">
              <el-option v-for="(item, index) in it.pbList" :key="index" :label="item" :value="index"></el-option>
            </el-select>
            <el-input v-else type="text" v-model="it.paramValue" :disabled="it.disabled" @change="changeInput(it)"></el-input>
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
  name: "baseParam",
  data() {
    return {
      queryParams: {
        devId: null,
        paramSubType: 1,
        pageNum: 1,
        pageSize: 50,
      },
      pvList: [],
      updIdMap: {},
      strValidParamName: ["产品名称"],
      preData: {},
      pbMap: {
        prm_WorP: ["重量-重量", "重量-包数", "包数-包数", "包数-皮重"],
      },
      disableKeyList: ["prm_DWW_UpLimit", "prm_DWW_DownLimit", "prm_P2Cnt"],
      pbIndexs: {
        prm_WorP: 0,
      },
      // 需要根据包数-包数的值来设置decimalNum的参数列表
      ndDecimalList: [
        "prm_SetWeight",
        "prm_SetWeight1",
        "prm_SetWeight2",
        "prm_PCL",
      ],
      baseDecimalNum: 0,
    };
  },
  created(opt) {
    this.queryParams.devId = this.$store.getters.devId;
    this.queryParams.paramSubType = 1;
    this.getList();
  },
  methods: {
    getList() {
      listForParam(this.queryParams).then((res) => {
        console.log(res);
        let pvList = res.data;
        // console.log(pvList);
        this.getRuleList(pvList);
      });
    },
    getRuleList(pvList) {
      let pbKeyList = Object.keys(this.pbIndexs);

      listSettings(this.queryParams).then((res) => {
        // 计算规则：当it.paramKey=='sys_RunMode'且it.paramValue>0时，设置item.maxV=160
        // 首先遍历res.rows，找到it.paramKey=='sys_RunMode'且it.paramValue>0的数据
        let isSetMaxV = false;
        res.rows.map((it, idx) => {
          if (it.paramKey == "sys_RunMode" && it.paramValue > 0) {
            isSetMaxV = true;
          }
          // 设置基础decimalNum
          if (it.paramKey == "sys_dot_num") {
            this.baseDecimalNum = it.paramValue;
          }
        });
        pvList.map((item, index) => {
          if (pbKeyList.indexOf(item.paramKey) != -1) {
            item.pbList = this.pbMap[item.paramKey];
          }
          if (isSetMaxV && item.paramKey == "prm_speed") {
            item.maxV = 160;
          }
        });
        this.pvList = pvList;
        this.caculateAllRule();
        this.pvList = this.rearrangeArray(this.pvList);
        this.preData = deepCopy(this.pvList);
        console.log(this.pvList);
      });
    },
    changeInput(it) {
      const { paramName, minV, maxV, paramValue, decimalNum, regAddr } = it;

      if (paramName.indexOf(this.strValidParamName) === -1) {
        const pv = +paramValue;
        if ((pv != 0 && !pv) || pv > +maxV || pv < +minV) {
          this.$modal.msgError(`${paramName}取值范围在${minV}~${maxV}`);
          this.revertValue(it);
        } else {
          it.paramValue = (+paramValue).toFixed(decimalNum);
          this.updIdMap[regAddr] = regAddr;
          this.preData = deepCopy(this.pvList);
        }
      } else {
        this.updIdMap[regAddr] = regAddr;
        this.preData = deepCopy(this.pvList);
      }
    },

    revertValue(it) {
      this.preData.forEach((item, index) => {
        if (item.paramKey === it.paramKey) {
          it.paramValue = item.paramValue;
        }
      });

      this.pvList.forEach((item, index) => {
        if (item.paramKey === it.paramKey) {
          item.paramValue = it.paramValue;
        }
      });
    },
    // 保存页面数据
    saveData() {
      // 检测设备是否在线
      checkDevStatus({
        devId: this.queryParams.devId,
      }).then((res) => {
        console.log(res);
        if (res.msg != 200) {
          this.$modal.msgError("当前设备" + res.msg);
          return;
        }

        let tabData = this.pvList;
        // 遍历tabData，判断是否在updIdMap中，在就修改
        let keys = Object.keys(this.updIdMap);
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
            console.log("更新", it);
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
    selChange(it, e) {
      console.log(it, e);
      this.pbIndexs[it.paramKey] = e.detail.value;
      it.paramValue = e.detail.value;
      this.updIdMap[it.regAddr] = it.regAddr;
      this.caculateAllRule();
    },
    // 计算是否禁用组件
    caculateDisabled(it) {
      let disabled = false;
      if (this.disableKeyList.indexOf(it.paramKey) != -1) {
        if (this.pbIndexs["prm_WorP"] != 2) {
          disabled = true;
        }
      } else if (it.paramKey == "prm_TWW") {
        if (this.pbIndexs["prm_WorP"] != 3) {
          disabled = true;
        }
      }
      return disabled;
    },
    // 计算decimalNum
    caculateDecimalNum(param) {
      const pbIndexs = this.pbIndexs;
      const ndDecimalList = this.ndDecimalList;
      const prm_WorP = pbIndexs["prm_WorP"];
      // console.log(prm_WorP);
      const isZero =
        ndDecimalList.indexOf(param.paramKey) !== -1 &&
        (prm_WorP == 1 || prm_WorP == 2);
      const ignorePCL = param.paramKey == "prm_PCL" && prm_WorP == 1;
      let decimalNum = 0;
      if (isZero) {
        decimalNum = 0;
        if (ignorePCL) decimalNum = this.baseDecimalNum;
      } else {
        decimalNum = this.baseDecimalNum;
      }
      // console.log(param.paramKey, decimalNum);
      return decimalNum;
    },
    // 计算并修改pvList中的属性值
    caculateAllRule() {
      this.pvList.map((it, idx) => {
        // 过滤掉设置速度
        if (it.paramKey == "prm_speed") {
          return;
        }
        it.disabled = this.caculateDisabled(it);
        it.decimalNum = this.caculateDecimalNum(it);
      });
      this.formatAllRule();
    },
    // 根据decimalNum格式化pvList中的属性值
    formatAllRule() {
      this.pvList.map((it, idx) => {
        // 跳过对 strValidParamName 中的参数进行格式化
        if (this.strValidParamName.indexOf(it.paramName) !== -1) {
          return;
        }
        it.paramValue = formatNumber(it.paramValue, it.decimalNum);
      });
    },
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
