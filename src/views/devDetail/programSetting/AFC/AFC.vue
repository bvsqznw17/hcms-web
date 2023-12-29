<template>
  <div>
    <el-form v-if="pvList && pvList.length > 0" label-position="left" label-width="110px">
      <!-- 第一个参数单独占据一行 -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-card>
            <div slot="header">AFC</div>
            <el-form-item v-if="pvList.length > 0" :label="pvList[0].paramName" style="width: 30.5%">
              <el-input type="text" v-model="pvList[0].paramValue" :disabled="pvList[0].disabled" @change="changeInput(pvList[0])"></el-input>
            </el-form-item>
          </el-card>
        </el-col>
      </el-row>

      <!-- 其他参数分为三个卡片区域 -->
      <el-row :gutter="20" style="margin-top: 10px">
        <el-col :span="8" v-for="(label, n) in ['AFCT', 'AFCI', 'AFCR']" :key="label">
          <el-card>
            <div slot="header">{{ label }}</div>
            <el-form-item v-for="it in getItemsForCard(n)" :key="it.paramName" :label="it.paramName">
              <el-input type="text" v-model="it.paramValue" :disabled="it.disabled" @change="changeInput(it)"></el-input>
            </el-form-item>
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
import { deepCopy, formatNumber, trimPoint } from "@/utils/util.js";
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
      strValidParamName: ["产品名称"],
      preData: {},
      baseDecimal: 0,
    };
  },
  created(opt) {
    this.queryParams.devId = this.$store.getters.devId;
    this.queryParams.paramSubType = 7;
    this.getList();
  },
  methods: {
    getList() {
      listForParam(this.queryParams).then((res) => {
        console.log(res);
        this.pvList = res.data;
        // 根据decimalNum将paramValue转换成小数
        this.pvList.map((item, index) => {
          item.paramValue = formatNumber(item.paramValue, item.decimalNum);
        });
        console.log(this.pvList);
        this.preData = deepCopy(this.pvList);
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
            let oldVal = it.paramValue;
            it.paramValue = trimPoint(it.paramValue);
            console.log("更新");
            updateParamValue(it).then((res) => {
              num++;
              console.log(res);
              // 将修改的值改回原来的值
              it.paramValue = oldVal;
              if (num == len) {
                this.updIdMap = {};
                this.$modal.msgSuccess("保存成功");
              }
            });
          }
        });
      });
    },
    getItemsForCard(cardIndex) {
      // 为每个卡片返回对应的表单项
      const start = 1 + cardIndex * 3; // 计算每个卡片的起始索引
      const end = start + 3; // 每个卡片包含3个表单项
      return this.pvList.slice(start, end);
    },
  },
};
</script>

<style>
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

.card-header {
  font-weight: bold;
  font-size: 16px;
}
</style>
