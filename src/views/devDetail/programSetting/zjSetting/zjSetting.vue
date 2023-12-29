<template>
  <div>
    <el-form v-if="pvList && pvList.length > 0" label-position="left" label-width="130px">
      <!-- 第一个卡片区域，包含前三个参数 -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-card>
            <el-row :gutter="20">
              <el-col :span="8" v-for="(it, idx) in pvList.slice(0, 3)" :key="idx">
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
              <el-col :span="8" v-for="(it, idx) in pvList.slice(3)" :key="idx">
                <el-form-item :label="it.paramName">
                  <el-input type="text" v-model="it.paramValue" :disabled="it.disabled" @change="changeInput(it)"></el-input>
                </el-form-item>
              </el-col>
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
      userModel: 1,
    };
  },
  created() {
    this.queryParams.devId = this.$store.getters.devId;
    this.queryParams.paramSubType = 3;
    this.getList();
  },
  methods: {
    getList() {
      listForParam(this.queryParams).then((res) => {
        console.log(res);
        // 如果参数名称为"线振振幅*"，只取线振振幅1-14，其余的不要
        res.data.map((item, index) => {
          if (item.paramName.indexOf("线振振幅") != -1) {
            let num = item.paramName.replace("线振振幅", "");
            if (parseInt(num) > 14) {
              return null;
            } else {
              this.pvList.push(item);
            }
          } else {
            this.pvList.push(item);
          }
        });
        this.preData = deepCopy(this.pvList);
      });
    },
    // input修改事件
    changeInput(it) {
      // 校验修改的值是否超出范围并提示
      console.log(it);
      if (it.paramName.indexOf(this.strValidParamName) == -1) {
        let min = it.minV;
        let max = it.maxV;
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
        console.log(res);
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
            // 因为一些业务原因，导致了regAddr是+1位的，这会导致无法修改成功，因此将regAddr-1
            // it.regAddr = it.regAddr - 1;
            updateParamValue(it).then((res) => {
              num++;
              console.log(res);
              // 之后再格式化作为显示
              it.paramValue = formatNumber(it.paramValue, it.decimalNum);
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
