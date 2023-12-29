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
            <el-input style="width:50%;" v-else type="text" v-model="it.paramValue" :disabled="it.disabled" @change="changeInput(it)"></el-input>
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
import { deepCopy, formatNumber, trimPoint } from "@/utils/util.js";
import { checkDevStatus, getSysConfig } from "@/api/device/business.js";
import { listSettings, updateSettings } from "@/api/device/sysSettings.js";
export default {
  components: {},
  data() {
    return {
      queryParams: {
        devId: null,
        pageNum: 1,
        pageSize: 50,
      },
      pvList: [],
      updIdMap: {},
      strValidParamName: ["产品名称"],
      preData: {},
      userModel: 1,
      pbMap: {
        sys_Unit: ["g", "kg", "lb", "oz"],
        sys_ZDSense: ["振动", "旋转"],
        sys_RunMode: ["单循环", "双循环", "异步"],
        sys_AutoZeroMode: ["计时间", "计次数"],
        sys_TrackMode: ["脉冲带记忆", "脉冲不记忆", "电平带记忆", "电平不记忆"],
        sys_YC_FLFS: ["间隔时间", "总体时间"],
        sys_FL_FS: ["单集料斗", "超差选别", "AB各自"],
      },
      baseSwitch: ["关", "开"],
      // 需要应用baseSwitch的参数
      baseSwitchKeyList: [
        "sys_JLD_state",
        "sys_LWJC_FS",
        "sys_VibrationSen",
        "sys_QP_2CJL",
        "sys_QPDGSel",
        "sys_PLCJMS",
      ],
      pbIndexs: {
        sys_Unit: 0,
        sys_ZDSense: 0,
        sys_RunMode: 0,
        sys_AutoZeroMode: 0,
        sys_TrackMode: 0,
        sys_YC_FLFS: 0,
        sys_FL_FS: 0,
        sys_JLD_state: 0,
        sys_LWJC_FS: 0,
        sys_VibrationSen: 0,
        sys_QP_2CJL: 0,
        sys_QPDGSel: 0,
        sys_PLCJMS: 0,
      },
      inputStyles: {
        borderColor: "#2979FF",
        disableColor: "#5e9aff",
      },
      dotNum: 0,
    };
  },
  created(opt) {
    this.dotNum = this.$store.getters.dotNum;
    this.dotNum = parseInt(this.dotNum) % 4;
    (this.queryParams.devId = this.$store.getters.devId),
      (this.queryParams.devId = this.$store.getters.devId);
    this.queryParams.paramSubType = 8;
    this.getList();
  },
  methods: {
    getList() {
      this.$modal.loading("数据加载中,请稍后...");
      listForParam(this.queryParams)
        .then((res) => {
          console.log(res);
          let pvList = res.data;
          // 根据decimalNum将paramValue转换成小数
          pvList.map((item, index) => {
            item.paramValue = formatNumber(item.paramValue, item.decimalNum);
          });
          console.log(pvList);
          this.getRuleList(pvList);
        })
        .finally(() => {
          this.$modal.closeLoading();
        });
    },
    getRuleList(pvList) {
      let pbKeyList = Object.keys(this.pbIndexs);

      getSysConfig().then((res) => {
        console.log("getSysConfig", res);
        pvList.map((item, index) => {
          Object.keys(res.data).forEach((key) => {
            if (item.paramKey == key) {
              // 如果paramKey在baseSwitchKeyList中，设置item的pbList为baseSwitch
              if (this.baseSwitchKeyList.indexOf(item.paramKey) != -1) {
                item.pbList = this.baseSwitch;
              } else if (pbKeyList.indexOf(item.paramKey) != -1) {
                item.pbList = this.pbMap[key];
              }
            }
          });
        });
        this.pvList = pvList;
        this.caculateAllDisabled();
        this.pvList = this.rearrangeArray(this.pvList);
        this.preData = deepCopy(pvList);
        console.log(this.pvList);
      });
    },
    // input修改事件
    changeInput(it) {
      // 校验修改的值是否超出范围并提示
      console.log(it);
      if (it.paramName.indexOf(this.strValidParamName) == -1) {
        let min = formatNumber(it.minV, it.decimalNum);
        let max = formatNumber(it.maxV, it.decimalNum);
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
    async saveData(data) {
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
            let oldValue = it.paramValue;
            it.paramValue = trimPoint(it.paramValue);
            updateParamValue(it).then((res) => {
              num++;
              console.log(res);
              // 将修改后的值改为原来的值
              it.paramValue = oldValue;
              if (num == len) {
                this.updIdMap = {};
                this.$modal.msgSuccess("保存成功");
              }
            });
          }
        });
      });
    },
    // 更新系统设置
    async updateSysSettings(it) {
      console.log(it);
      res = await updateSettings(it).then((res) => {
        console.log(res.code == 200);
      });
    },
    bindPickerChange(it, e) {
      console.log(it, e);
      this.pbIndexs[it.paramKey] = e.detail.value;
      it.paramValue = e.detail.value;
      this.updIdMap[it.regAddr] = it.regAddr;
      this.caculateAllDisabled();
    },
    // 计算是否禁用组件
    caculateDisabled(it) {
      let disabled = false;
      if (it.paramKey == "sys_FL_FS") {
        if (this.pbIndexs["sys_JLD_state"] == 0) {
          disabled = true;
        }
      }
      return disabled;
    },
    // 计算所有的禁用组件
    caculateAllDisabled() {
      this.pvList.map((it, idx) => {
        it.disabled = this.caculateDisabled(it);
      });
    },
    handleClick(e) {
      console.log("handleClick");
      e.stopPropagation();
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
