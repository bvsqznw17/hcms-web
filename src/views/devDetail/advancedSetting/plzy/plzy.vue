<template>
  <div>
    <el-form v-if="pvList && pvList.length > 0" label-position="left" label-width="130px">
      <!-- 第一个卡片区域，包含前两个参数 -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-card>
            <el-row :gutter="20">
              <el-col :span="8" v-for="(it, idx) in pvList.slice(0, 2)" :key="idx">
                <el-form-item :label="it.paramName">
                  <el-input type="text" v-model="it.paramValue" :disabled="it.disabled" @change="changeInput(it)"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>

      <!-- 其他参数区域 -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-card>
            <el-row :gutter="20">
              <template v-for="(it, idx) in pvList.slice(2)">
                <el-col :span="8" :key="idx">
                  <el-form-item :label="it.paramName">
                    <el-input type="text" v-model="it.paramValue" :disabled="it.disabled" @change="changeInput(it)"></el-input>
                  </el-form-item>
                </el-col>
                <!-- 每两个元素后添加一个空的el-col占位 -->
                <el-col :span="8" v-if="(idx + 1) % 2 == 0" :key="'blank-' + idx">
                  <el-form-item style="visibility: hidden;">
                    <el-input style="width: 66%" type="text"></el-input>
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
          </el-card>
        </el-col>
      </el-row>

    </el-form>

    <div class="noData" v-if="pvList.length == 0">暂无数据</div>
    <div class="btn-wrapper">
      <el-button type="primary" plain @click="saveData">保存</el-button>
    </div>
  </div>
</template>
<script>
import { listForParam, setPlzyParam } from "@/api/device/paramValue.js";
import { deepCopy } from "@/utils/util.js";
import { checkDevStatus } from "@/api/device/business.js";
export default {
  data() {
    return {
      queryParams: {
        devId: null,
        paramType: 1,
        paramSubType: 10,
      },
      pvList: [],
      updIdMap: {},
      preData: {},
    };
  },
  created(opt) {
    this.queryParams.devId = this.$store.getters.devId;
    this.queryParams.paramSubType = 10;
    this.getList();
  },
  methods: {
    getList() {
      listForParam(this.queryParams).then((res) => {
        console.log(res);
        // 首先将res.data根据regAddr进行排序，小地址在前
        res.data = res.data.sort((a, b) => {
          return a.regAddr - b.regAddr;
        });
        this.pvList = [];
        let mainPl = null;
        let mainZy = null;
        // 通常共有32个参数，16个为频率，16个为增益
        // 取第15个为主振频率，取第31个为主振增益
        // 第16个抛弃，第32个抛弃
        res.data.map((it, idx) => {
          if (idx == 14) {
            it.paramName = "主振频率";
            mainPl = it;
          } else if (idx == 30) {
            it.paramName = "主振增益";
            mainZy = it;
          } else if (idx != 14 && idx != 30 && idx != 15 && idx != 31) {
            this.pvList.push(it);
          }
        });

        // 进一步数据处理：将频率和增益进行配对，第一个元素为频率，第二个为增益，以此类推
        // 首先使用slice拆分为两个数组
        let fArr = this.pvList.slice(0, 14);
        let zArr = this.pvList.slice(14, 28);

        // 将频率和增益进行配对
        this.pvList = [];
        for (let i = 0; i < fArr.length; i++) {
          this.pvList.push(fArr[i]);
          this.pvList.push(zArr[i]);
        }

        this.pvList.unshift(mainZy);
        this.pvList.unshift(mainPl);

        console.log(this.pvList);
        this.preData = deepCopy(this.pvList);
      });
    },
    // input修改事件
    changeInput(it) {
      // 校验修改的值是否超出范围并提示
      if (it.paramName.indexOf(this.strValidParamName) == -1) {
        let min = (it.minV / Math.pow(10, it.decimalNum)).toFixed(
          it.decimalNum
        );
        let max = (it.maxV / Math.pow(10, it.decimalNum)).toFixed(
          it.decimalNum
        );
        let pv = parseInt(it.paramValue);
        if ((pv != 0 && !pv) || pv > max || pv < min) {
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
          // 可修改之后将参数加入到待修改列表
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
          console.log(res);
          this.$modal.msgError("当前设备" + res.msg);
          return;
        }

        let tabData = data || this.pvList;
        // 遍历tabData，判断是否在updIdMap中，在就修改
        let keys = Object.keys(this.updIdMap);
        console.log(keys);
        let len = keys.length;
        let num = 0;
        tabData.map((it, idx) => {
          if (it.regAddr in this.updIdMap) {
            // 对小数点反格式化后再进行存储
            it.paramValue = this.trimPoint(it.paramValue);
            // 将主振频率和主振增益的name改回原来的
            if (it.paramName == "主振频率") {
              it.paramName = "单个振机频率15";
            } else if (it.paramName == "主振增益") {
              it.paramName = "单个振机增益15";
            }
            (it.devId = this.$store.getters.devId),
              setPlzyParam(it).then((res) => {
                num++;
                console.log(res);
                // 之后再格式化作为显示
                it.paramValue = (
                  it.paramValue / Math.pow(10, it.decimalNum)
                ).toFixed(it.decimalNum);
                // 将主振频率和主振增益的name改回原来的
                if (it.paramName == "单个振机频率15") {
                  it.paramName = "主振频率";
                } else if (it.paramName == "单个振机增益15") {
                  it.paramName = "主振增益";
                }
                if (num == len) {
                  console.log("clear");
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

.el-card {
  margin-bottom: 20px; /* 为卡片添加底部间隔 */
}
</style>
