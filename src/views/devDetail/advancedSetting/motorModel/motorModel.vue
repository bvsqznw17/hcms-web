<template>
  <div class="button-container">
    <!-- 第一排按钮 -->
    <div class="button-row">
      <el-button-group>
        <el-button v-for="(item, index) in btnList" :key="index" @click="chooseM(item.param, index)" size="medium" :class="{ 'is-active': activeBtnM === index }">
          {{ item.text }}
        </el-button>
      </el-button-group>
    </div>

    <!-- 第二排按钮 -->
    <div class="button-row">
      <el-button-group>
        <el-button v-for="num in 5" :key="num" @click="chooseMM(num - 1, num - 1)" size="medium" :class="{ 'is-active': activeBtnMM === num - 1 }">
          模式{{ num }}
        </el-button>
      </el-button-group>
    </div>

    <!-- 内容区域 -->
    <div class="content-area">
      <!-- 图表留白区域 -->
      <div class="chart-area">
        <!-- 图表代码暂不实现 -->
      </div>

      <!-- 数据输入区域 -->
      <el-form label-position="left" label-width="80px">
        <!-- 新增的按钮行 -->
        <div class="button-row" style="display: flex; justify-content: space-between; align-items: center;">
          <!-- 当前段 -->
          <el-form-item label="当前段" style="flex: 1;">
            <el-select v-model="currentSeg" @change="changeSeg">
              <el-option v-for="(it, idx) in motorParams" :key="'seg' + idx" :label="idx + 1" :value="idx"></el-option>
            </el-select>
          </el-form-item>
          <el-button disabled>添加（前）</el-button>
          <el-button disabled>添加（后）</el-button>
          <el-button disabled>删除</el-button>
          <el-button @click="setOrigin()">原点检测</el-button>
        </div>
      </el-form>
      <!-- 马达模式参数输入区域 -->
      <div class="input-area">
        <el-form label-position="left" label-width="80px">
          <el-row :gutter="20">
            <el-col v-for="(it, idx) in curMotorParamArr" :key="idx" :span="8">
              <el-form-item :label="it.paramName">
                <el-input type="text" v-model="it.paramValue" @change="changeInput(it)"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>

    <!-- 添加的对话框 -->
    <el-dialog title="原点检测参数" :visible.sync="isDialogVisible" width="500px">
      <el-form label-position="left" label-width="120px">
        <el-form-item v-for="(item, index) in gdData" :key="index" :label="item.paramName">
          <el-input v-model="item.paramValue" type="text" @change="changeInput(item)"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveGdData">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getMotorParam, updateParamValue } from "@/api/device/paramValue.js";
import { checkDevStatus } from "@/api/device/business.js";
export default {
  data() {
    return {
      btnList: [
        {
          text: "进料斗马达模式",
          param: "0",
        },
        {
          text: "称重斗马达模式",
          param: "1",
        },
        {
          text: "集料斗马达模式",
          param: "2",
        },
        {
          text: "主振马达模式",
          param: "3",
        },
      ],
      activeBtnM: null, // 第一排按钮的聚焦状态
      activeBtnMM: null, // 第二排按钮的聚焦状态
      mainModel: 0, // 主模式
      subModel: 0, // 子模式
      currentSeg: 0, // 当前段
      motorParams: [], // 当前选择的马达参数集
      curMotorParamArr: [], // 当前马达参数
      gdData: [], // 光电停止角度
      preData: {}, // 之前的马达参数
      dotNum: 0,
      isDialogVisible: false, // 控制对话框显示
    };
  },
  created() {
    this.dotNum = this.$store.getters.dotNum;
    this.getMotorParams();
  },
  methods: {
    // 获取马达模式参数
    getMotorParams() {
      this.$modal.loading("数据采集中");
      getMotorParam({
        devId: this.$store.getters.devId,
        mainModel: this.mainModel,
        subModel: this.subModel,
      })
        .then((res) => {
          console.log(res);
          this.motorParams = res.data.slice(0, 10);
          this.gdData = res.data.slice(10);
          console.log(this.gdData);
          this.changeSeg(0);
        })
        .finally(() => {
          this.$modal.closeLoading();
        });
    },
    chooseM(param, index) {
      this.activeBtnM = index;
      this.mainModel = param;
      this.getMotorParams();
    },
    chooseMM(mode, index) {
      this.activeBtnMM = index;
      this.subModel = mode;
      this.getMotorParams();
    },
    changeSeg(val) {
      this.curMotorParamArr = this.motorParams[val];
      this.preData = this.deepCopy(this.curMotorParamArr);
    },
    changeInput(it) {
      console.log(it);
      let min = it.minV;
      let max = it.maxV;
      let pv = this.trimPoint(it.paramValue);
      if ((pv != 0 && !pv) || pv > max || pv < min) {
        this.$modal.msgError(it.paramName + "取值范围在" + min + "~" + max);
        // 将修改的值改回原来的值
        this.curMotorParamArr = this.deepCopy(this.preData);
      } else {
        this.saveData(it);
      }
    },
    // 保存页面数据
    saveData(pv) {
      this.$modal.loading("数据正在保存中,请稍后...");
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
        updateParamValue(pv)
          .then((res) => {
            console.log(res);
            this.$modal.msgSuccess("保存成功");
            // 将修改的值改回原来的值
            pv.paramValue = oldVal;
            this.checkMaxSpeed();
            this.preData = this.deepCopy(this.curMotorParamArr);
          })
          .finally(() => {
            this.$modal.closeLoading();
          });
      });
    },
    // 检查最大速度是否是0，如果最大速度是0，修改同一个对象中的'角度'字段：paramName='停顿时间',decimalNum=0
    checkMaxSpeed() {
      let maxSpeed = this.curMotorParamArr.filter(
        (it) => it.paramName.substring(0, 4) == "最大速度"
      )[0];
      if (maxSpeed.paramValue == 0) {
        let angle = this.curMotorParamArr.filter(
          (it) => it.paramName.substring(0, 2) == "角度"
        )[0];
        angle.paramName = "停顿时间";
        angle.decimalNum = 0;
        angle.maxV = 9999;
        angle.minV = 0;
        angle.paramValue = angle.paramValue * 10;
      } else {
        let angle = this.curMotorParamArr.filter(
          (it) => it.paramName.substring(0, 4) == "停顿时间"
        )[0];
        angle.paramName = "角度";
        angle.decimalNum = 1;
        angle.maxV = 3600;
        angle.minV = -3600;
        // deal with decimalNum
        angle.paramValue = (
          angle.paramValue / Math.pow(10, angle.decimalNum)
        ).toFixed(angle.decimalNum);
      }
    },
    setOrigin() {
      this.isDialogVisible = true;
    },
    // 保存修改后的 gdData
    saveGdData() {
      this.isDialogVisible = false;
    },
  },
};
</script>

<style>
.button-container {
  text-align: left;
}

.button-row {
  margin-bottom: 10px; /* 上下两排按钮之间的空隙 */
}

.el-button {
  margin: 0 10px; /* 每个按钮之间的空隙 */
}

.is-active {
  color: #409eff; /* 激活状态的按钮颜色，您可以根据需要更改 */
  border-color: #409eff;
}

.content-area {
  margin-top: 20px;
}

.chart-area {
  height: 200px; /* 根据需要调整 */
  background-color: #f5f5f5; /* 暂时的背景色，用于区分区域 */
  margin-bottom: 20px;
}

.input-area {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 4px;
}

.dialog-footer {
  text-align: right;
}
</style>
