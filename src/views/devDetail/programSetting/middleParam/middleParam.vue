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
        pageNum: 1,
        pageSize: 50,
      },
      pvList: [],
      updIdMap: {},
      strValidParamName: ["产品名称"],
      preData: {},
      mflKeyList: ["prm_JLD_MFLNum", "prm_MFL_Cnt"], // 集料斗多次放料次数,多次放料次数
      ndDecimalList: ["prm_CombinWeight", "prm_OverWeight"], // 禁止组合重量，单斗强排上限
      baseDecimal: 0,
      baseParam: {},
    };
  },
  created(opt) {
    this.queryParams.devId = this.$store.getters.devId;
    this.queryParams.paramSubType = 2;
    this.getList(this.queryParams);
  },
  methods: {
    getList(queryParams) {
      listForParam(queryParams).then((res) => {
        console.log(res);
        let pvList = res.data;
        // 处理pvList，根据baseParam更改pvList中禁止组合重量，单斗强排上限的上下限
        // 根据decimalNum将paramValue转换成小数
        pvList.map((item, index) => {
          item.paramValue = formatNumber(item.paramValue, item.decimalNum);
        });
        console.log(pvList);
        this.getRuleList(pvList);
      });
    },
    // 处理pvList，根据baseParam更改pvList中禁止组合重量，单斗强排上限的上下限
    dealPvList(pvList) {
      // 获取baseParam
      this.queryParams.paramSubType = 1;
      listForParam(this.queryParams).then((res) => {
        let baseParam = res.data;
        console.log(baseParam);
        // 根据baseParam中的目标值更改pvList中禁止组合重量，单斗强排上限的上下限
        /**
         * 如果目标值为10,DWW值为3,组合模式为1
            则返回的字符串范围是0 ~ 14
            因为10 * 3 / 2 - 1 = 14

            如果目标值为10,DWW值为3,组合模式为0
            则返回的字符串范围是0 ~ 4
            因为10 / 2 - 1 = 4
         */
        let wordP = baseParam[2].paramValue;
        let targetValue = baseParam[3].paramValue;
        let dww = wordP == 1 ? baseParam[7].paramValue : 0;
        let result = pvList.map((item, index) => {
          if (
            item.paramKey == "prm_CombinWeight" ||
            item.paramKey == "prm_OverWeight"
          ) {
            item.maxV = (targetValue * dww) / 2 - 1;
          }
        });
        return result;
      });
    },

    async getRuleList(pvList) {
      let disable_mfl = false;
      let res1 = await listSettings(this.queryParams).then((res) => {
        // 计算规则：当it.paramKey=='sys_FL_FS'且it.paramValue>0时，禁用所有prm_JLD_MFLNum和prm_MFL_Cnt的输入框
        // 首先遍历res.rows，找到it.paramKey=='sys_FL_FS'且it.paramValue>0的数据
        res.rows.map((it, idx) => {
          if (it.paramKey == "sys_FL_FS" && it.paramValue > 0) {
            disable_mfl = true;
          }
          // 设置基础小数位数
          if (it.paramKey == "sys_dot_num") {
            this.baseDecimal = it.paramValue;
          }
        });
      });

      let disable_p2cnt = false;
      let decimal = this.baseDecimal;
      let res2 = await listForParam({
        devId: this.$store.getters.devId,
        paramSubType: 1,
      }).then((res) => {
        // 计算规则：当it.paramKey=='prm_WorP'且it.paramValue!=2时，禁用prm_P2Cnt的输入框
        // 首先遍历res.rows，找到it.paramKey=='prm_WorP'且it.paramValue!=2的数据
        res.data.map((it, idx) => {
          if (it.paramKey == "prm_WorP" && it.paramValue != 2) {
            disable_p2cnt = true;
          }
          // 计算decimalNum： 当it.paramKey=='prm_WorP'且it.paramValue==2 || it.paramValue==1时，decimalNum=0 else decimalNum=this.baseDecimal.
          if (
            it.paramKey == "prm_WorP" &&
            (it.paramValue == 2 || it.paramValue == 1)
          ) {
            decimal = 0;
          }
        });
      });

      await Promise.all([res1, res2]);
      pvList.map((item, index) => {
        if (disable_mfl && this.mflKeyList.indexOf(item.paramKey) != -1) {
          item.disabled = true;
        }
        if (disable_p2cnt && item.paramKey == "prm_P2Cnt") {
          item.disabled = true;
        }
        if (this.ndDecimalList.indexOf(item.paramKey) != -1) {
          item.decimalNum = decimal;
          item.paramValue = formatNumber(item.paramValue, decimal);
        }
      });

      this.preData = deepCopy(pvList);
      this.pvList = this.rearrangeArray(pvList);
      console.log(this.pvList);
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
