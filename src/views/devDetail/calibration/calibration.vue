<template>
  <div class="app">
    <!-- 小方格和分割线 -->
    <div class="small-box-section">
      <!-- 小方格 -->
      <DouImage ref="douImage" :followDouStatus="false" :zzjState="zzjState" :showWeightLabel="isCkAll" @boxClicked="boxClicked" @zzClicked="zzClicked"></DouImage>
    </div>

    <el-row :gutter="5" style="background-color: #333; padding-top:5px;">
      <el-col :span="16">
        <el-row :gutter="5">
          <el-col :span="12">
            <!-- 实时重量 -->
            <div class="weight">
              <div class="weight-value-container">
                <span class="weight-value">{{ realtimeWeight }}</span>
                <span class="weight-unit">{{ weight_unit }}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <!-- 振动单选项 -->
            <div class="vibration-radio">
              <el-radio-group class="rg" @change="radioChange1">
                <el-radio :label="1" :disabled="zdno[0]">振动1</el-radio>
                <el-radio :label="2" :disabled="zdno[1]">振动2</el-radio>
                <el-radio :label="3" :disabled="zdno[2]">振动3</el-radio>
                <el-radio :label="4" :disabled="zdno[3]">振动4</el-radio>
              </el-radio-group>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <!-- 输入字段 -->
          <el-form class="input-container" label-position="left" label-width="80px">
            <el-col :span="12">
              <el-form-item label="砝码重量:">
                <span slot="label" style="color: #fff;">砝码重量:</span>
                <el-input v-model="weightPvs.sys_nov_czd" :disabled="weightDisable"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="满量程:">
                <span slot="label" style="color: #fff;">满量程:</span>
                <el-input v-model="weightPvs.sys_max_czd" :disabled="weightDisable"></el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </el-col>
      <el-col :span="8">
        <!-- 标定操作区域 -->
        <el-row class="sub-area" style="height: 200px;">
          <el-col :span="12">
            <div class="bd-radio-group">
              <!-- 单选项 -->
              <el-radio-group @change="radioChange2">
                <el-radio :label="0">初始标定</el-radio>
                <el-radio :label="1" checked>重新标定</el-radio>
              </el-radio-group>

              <!-- 复选框 -->
              <el-checkbox :v-model="isCkAll">标定所有</el-checkbox>
            </div>
          </el-col>
          <el-col :span="12">
            <!-- 操作按钮 -->
            <div class="oper-btn">
              <el-button @click="zero" :disabled="disbtn['zero']">置零</el-button>
              <el-button @click="full" :disabled="disbtn['full']">满度</el-button>
            </div>
          </el-col>
        </el-row>

      </el-col>
    </el-row>

    <!-- 最底部 -->
    <div class="bottom">
      <!-- 左侧按钮 -->
      <el-button @click="backMain">返回主界面</el-button>

      <!-- 程序信息显示区域 -->
      <div class="program-info">
        <div class="program-info-item">
          <span class="program-info-label">程序号：</span>
          <span class="program-info-value">{{ programNum }}</span>
        </div>
        <div class="program-info-item">
          <span class="program-info-label">产品名称：</span>
          <span class="program-info-value">{{ productName }}</span>
        </div>
      </div>
    </div>

    <simple-process :show="showProgress" :message="processMsg" :progress="progress"></simple-process>
  </div>
</template>

<script>
import {
  writeCmd,
  readParam,
  readParams,
  getCmdResult,
} from "@/api/device/business.js";
import { ctrlno } from "@/utils/devConstant.js";
import DouImage from "@/components/douImage/douImage.vue";
import { formatNumber } from "@/utils/util.js";
import simpleProcess from "@/components/simpleProgress/simpleProgress";
export default {
  components: {
    DouImage,
    simpleProcess,
  },
  data() {
    return {
      realtimeWeight: "--",
      weight_unit: "g",
      programNum: "01",
      productName: "产品名称",
      dotNum: 0,
      zdOption: "1",
      curseldn: -1, // 选中的斗
      doustatus: 0,
      isCkAll: false, // 是否全选
      bdState: "1", // 标定状态 0 是初始标定 1 是重新标定
      zzjState: 0, // 主振机状态-颜色 0 灰色 1 蓝色 2 红色
      c_anew: true, // 是否重新标定
      showWeightLabel: false, // 是否显示重量标签
      disbtn: {
        zero: false,
        full: false,
      },
      zdno: [true, true, true, true], // 是否禁用振动单选
      weightValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      weightDisable: true,
      progress: 0, // 进度条进度
      showProgress: false,
      processMsg: "",
      intervalId: null,
      weightPvs: {
        sys_nov_czd: 0,
        sys_max_czd: 0,
        sys_nov_zzj: 0,
        sys_max_zzj: 0,
        sys_nov_zd: 0,
        sys_max_zd: 0,
      },
    };
  },
  mounted() {
    this.dotNum = uni.getStorageSync("sys_dot_num");
    this.weight_unit = uni.getStorageSync("sys_Unit");
    this.dotNum = parseInt(this.dotNum) % 4;
    console.log(this.dotNum);
    this.getDouWeight();
  },
  beforeDestroy() {
    // 清除定时器，避免内存泄漏
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },

  methods: {
    // 向设备发送指令
    sendCmd(cmd, cmdParam) {
      let devId = this.$store.getters.devId;
      // uni.showLoading({
      //   title: "执行中",
      //   mask: true,
      // });
      writeCmd({
        devId: devId,
        cmd: cmd,
        cmdParam: cmdParam,
      }).then((res) => {
        console.log(res);
        if (res.code == 200) {
          getCmdResult({
            devId: devId,
          }).then((resp) => {
            if (resp.code == 200) {
              this.refreshDouWeight();
            }
          });
        } else {
          uni.showToast({
            title: "指令下发失败",
          });
        }
      });
    },
    // 读取斗状态-用于本页面的重量显示
    getDouWeight() {
      readParam({
        devId: this.$store.getters.devId,
        paramKey: "doustatus",
      }).then((res) => {
        console.log("斗状态", res);
        if (!res.data) return;
        let doustatus = JSON.parse(res.data.doustatus);

        for (let i = 0; i < doustatus.length; i++) {
          doustatus[i] = formatNumber(doustatus[i], this.dotNum);
        }
        this.doustatus = doustatus;

        // 显示14个即可
        let douNum = 14;
        let startPosition = Math.floor((douNum + 1) / 2);
        this.weightValues = doustatus.slice(
          startPosition,
          startPosition + douNum
        );
        console.log("重量数组", this.weightValues);
      });
    },
    // 读取砝码重量和量程
    readWeightAndRangeParam() {
      readParams({
        devId: this.$store.getters.devId,
        paramKeys: JSON.stringify(Object.keys(this.weightPvs)),
      }).then((res) => {
        console.log(res);
        this.weightPvs = res.data;
        // 对数组的数据进行格式化
        Object.keys(this.weightPvs).forEach((key) => {
          this.weightPvs[key] = formatNumber(this.weightPvs[key], this.dotNum);
        });
      });
    },
    // 置零操作方法
    async zero() {
      const douNumber = this.curseldn;
      if (this.isCkAll) douNumber = 0;
      if (douNumber < 0) {
        uni.showToast({
          title: "请选择斗",
        });
        return;
      }

      this.sendCmd(ctrlno.CTL_DOU_CALIZERO, douNumber);
      this.startProgress(3);

      this.setEnabledZero(true);

      if (this.c_anew) {
        setTimeout(() => {
          this.startProgress(2);
          this.setEnabledZero(false);
        }, 3050);
      }
    },
    // 满度操作方法
    full() {
      const douNumber = this.curseldn;
      if (this.isCkAll) douNumber = 0;
      if (douNumber < 0) {
        uni.showToast({
          title: "请选择斗",
        });
        return;
      }

      this.startProgress(3);
      this.sendCmd(ctrlno.CTL_DOU_CALIFULL, douNumber);

      this.setEnabledZero(false);
    },
    radioChange1(e) {
      console.log(e);
      this.zdOption = e.detail.value;
      // this.sendCmd(ctrlno.CTL_SEZ, e);
    },
    radioChange2(e) {
      this.bdState = e.detail.value;
      this.c_anew = this.bdState == "1";
    },
    selAllBox(e) {
      console.log(e);
      this.isCkAll = e.detail.value.length > 0;
      this.selAllDou(this.isCkAll);
    },
    selAllDou(b) {
      console.log("selAllDou", b);
      // if (this.isCkAll == b) {
      //   return;
      // }
      this.setBoxColor(null, b ? 7 : 0);
      this.zzjState = 0;
      this.curseldn = -1;
      this.refreshDouWeight();
    },
    // 返回主界面按钮的操作方法
    backMain() {
      uni.navigateBack({
        delta: 1,
      });
    },
    // 提示正在开发中
    InDeveloping() {
      uni.showToast({
        title: "正在开发中，该页面功能暂不可用",
        icon: "none",
      });
    },
    boxClicked(index) {
      let douNumber = index + 1;
      this.realtimeWeight = this.weightValues[index];
      if (douNumber == this.curseldn) {
        this.sendCmd(ctrlno.CTL_SEZ, douNumber);
        return false;
      }
      this.selAllDou(false);
      this.setBoxColor([index], 7);
      this.curseldn = douNumber;
      this.weightDisable = false;
      this.realtimeWeight = this.weightValues[index];
    },
    zzClicked() {
      this.isCkAll = false;
      this.selAllDou(false);
      this.zzjState = 2;
      this.curseldn = -1;
      this.weightDisable = false;
      console.log(this.doustatus);
      this.realtimeWeight = this.doustatus[14];
    },
    // 设置小方格颜色
    setBoxColor(arr, ckey) {
      if (arr != null) {
        this.$refs.douImage.setBoxColor(arr, ckey);
      } else {
        this.$refs.douImage.setBoxColor(
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
          ckey
        );
      }
    },
    setEnabledZero(b) {
      this.disbtn["zero"] = b;
      this.disbtn["full"] = !b;
      // this.c_anew = !b;
    },
    refreshDouWeight() {
      this.getDouWeight();
      this.readWeightAndRangeParam();
      this.$refs.douImage.refreshDouWeight();
    },
    updateProgress(percent) {
      if (percent < 0) {
        percent = 0;
      } else if (percent > 100) {
        percent = 100;
      }
      this.progress = percent;
      this.processMsg = "进度" + percent + "%";
    },
    startProgress(totalSeconds) {
      this.showProgress = true;
      let percent = 1;
      let intervalId = setInterval(() => {
        this.updateProgress(percent++);
        if (percent > 100) {
          clearInterval(intervalId);
          this.showProgress = false;
        }
      }, totalSeconds * 10);
    },
    // refreshUI() {
    //   let d = this.isCkAll || (this.curseldn >= 1 && this.curseldn <= 14);
    //   let g = !d && this.curseldn >= 0;
    //   let z = !d && this.curseldn == -1;
    // },
  },
};
</script>

<style>
.app {
  /* 整体样式 */
}

.weight {
  /* 实时重量样式 */
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #666;
  flex-direction: column;
  border: 1px solid #ccc;
  border-radius: 10px;
}

.weight-value-container {
  /* 容器样式 */
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 150px;
  font-size: 32px;
  font-weight: bold;
  color: #39ff14;
  /* 荧光绿色 */
  position: relative;
}

.input-container {
  /* 输入框容器样式 */
  display: flex;
  align-items: center;
  padding: 10px;
}

.weight-value {
  /* 实时重量数值样式 */
  padding: 5px 10px;
}

.weight-unit {
  /* 单位样式 */
  position: absolute;
  right: 8px;
  bottom: 8px;
  font-size: 18px;
}

.small-box-section {
  /* 小方格和分割线的区域样式 */
  display: flex;
  flex-direction: column;
  border-top: 1px solid #ccc;
}

.vibration-radio {
  border-radius: 10px;
  background-color: #666;
  border: 1px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 150px; /* 调整高度以垂直居中 */
}

.rg {
  padding-top: 70px;
  padding-bottom: 70px;
}

.oper-btn {
  height: 200px;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
}

.oper-btn .el-button {
  width: 50%;
}

.action-btn {
  flex: 1;
  min-width: 0;
  margin: 0 5px;
  background-color: #fff;
  color: #333;
}

.bottom {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 90%;
  display: flex;
  justify-content: space-between; /* 使用 space-between 来将按钮和信息分布到两端 */
  padding: 10px 20px; /* 添加内边距 */
  align-items: center; /* 垂直居中对齐 */
}

.bottom-btn {
  /* 对底部按钮样式进行调整 */
  padding: 10px 15px; /* 根据需要调整按钮的大小 */
  font-size: 16px; /* 根据需要调整字体大小 */
}

.program-info {
  /* 对程序信息区域样式进行调整 */
  display: flex;
  flex-direction: column; /* 纵向排列 */
  align-items: flex-end; /* 对齐到右侧 */
}

.program-info-item {
  margin: 5px 0; /* 添加间距 */
}

.bd-radio-group {
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 0 0 30px 40%;
}

.bd-radio-group .el-radio-group {
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  height: 110px;
}

.sub-area {
  background: #666;
  border-radius: 10px;
  border: 1px solid #ccc;
}

.el-button + .el-button {
  margin-left: 0;
}

.el-checkbox__input + .el-checkbox__label {
  color: #fff;
}

.el-radio__input + .el-radio__label {
  color: #fff;
}
</style>
