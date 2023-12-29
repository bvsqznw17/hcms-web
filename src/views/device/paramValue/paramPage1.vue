<template>
  <div class="app-container">
    <ParamValue1 v-show="!isShowPage" @closePv="closePv"></ParamValue1>
    <div class="inner-box" v-show="isShowPage">
      <div class="rightToolBarDiv">
        <el-tooltip class="item" effect="dark" content="更换ip" placement="top">
          <el-button
            size="mini"
            circle
            icon="el-icon-top-right"
            @click="backToSearchIp()"
          />
        </el-tooltip>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index"
          :label="item.dictLabel"
          :name="String(item.dictValue)"
        >
          <el-row
            :gutter="15"
            align="left"
            style="width: 50%"
            v-if="item.tabData && item.tabData.length > 0"
          >
            <el-form
              label-width="auto"
              :model="item.vmd"
              :rules="item.rules"
            >
              <el-col :span="12" v-for="(it, idx) in item.tabData" :key="idx">
                <el-form-item :label="it.paramName" :prop="it.paramName">
                  <el-input
                    @change="(val) => changeInput(it.id)"
                    v-model="item.vmd[it.paramName]"
                    :disabled="!hasPerm('device:devList:edit')"
                    style="width: auto"
                  />
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
          <Empty v-else :imageStyle="imageStyle"></Empty>
        </el-tab-pane>
      </el-tabs>
      <!-- 保存按钮 -->
      <div class="save-btn">
        <el-button type="primary" @click="(val) => savePageData()"
          >保存</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import Empty from "../../components/Empty";
import { listParamValue, updateParamValue } from "@/api/device/paramValue";
import ParamValue1 from "./index1";

export default {
  name: "ParamPage1",
  components: { Empty, ParamValue1 },
  data() {
    let that = this;
    return {
      // 是否显示参数页面
      isShowPage: false,
      // 当前所选tab面板的名称
      activeName: "1",
      // 之前所选tab面板的index
      preIndex: 0,
      tabList: [],
      tabData: [],
      showSearch: false,
      // 已修改id列表
      updIdMap: {},
      // 当前选中tabid
      tabIndex: 0,
      // 校验表单的绑定对象
      vmd: {},
      // String Validate paramName
      strValidParamName: ["产品名称"],
      queryParams: {
        ip: "192.168.1.111",
        paramSubType: 1,
        pageNum: 1,
        pageSize: 200,
      },
      imageStyle: {
        // width: '300px',
        // height: '300px'
      },
      rules: {},
    };
  },
  watch: {
    $route: function (newVal, oldVal) {
      console.log(newVal);
      this.isShowPage = true
      if (newVal.query.ip != oldVal.query.ip && newVal.query.ip != undefined) {
        this.queryParams.ip = newVal.query.ip;
        this.loadTabPanelData();
        // this.getList()
      }
    },
  },
  created() {
    console.log(this.$route)
    if (this.$route.query.ip != undefined) {
      this.loadTabPanelData();
      this.isShowPage = true
      this.queryParams.ip = this.$route.query.ip;
    }
  },
  mounted() {
    setTimeout(() => {
      // this.getList();
    }, 150); // 使用定时器防止网络抖动
  },
  methods: {
    // 加载tabPanel
    loadTabPanelData() {
      let that = this;
      this.getDicts("param_sub_type").then((response) => {
        // 根据paramSubType筛选tabData并存入tdMap
        let tdMap = {};
        let queryParams = {
          ip: that.queryParams.ip,
          paramSubType: null,
          pageNum: 1,
          pageSize: 200,
        }
        listParamValue(queryParams).then((res) => {
          console.log(res);
          res.rows.map((it, idx) => {
            if (it.paramSubType == 0) return;
            if (!tdMap[it.paramSubType]) {
              tdMap[it.paramSubType] = [];
              tdMap[it.paramSubType].push(it);
            } else {
              tdMap[it.paramSubType].push(it);
            }
          });
          console.log(tdMap);
          // 第二次遍历，对比并将tabData置入对应的tabList数组项
          that.tabList = response.data.map((item, index) => {
            if (item.dictValue != 0) {
              let tabData = tdMap[item.dictValue]
              item["tabData"] = tabData
              that.vmd[item.dictValue] = that.getVmd(tabData)
              item["vmd"] = that.vmd[item.dictValue]
              item["rules"] = that.createRules(tabData)
            }
            return item;
          });
          // 排除【其他参数】
          that.tabList.pop()
          // that.getList()
          console.log(that.tabList);
        });
      });
    },
    getList() {
      listParamValue(this.queryParams).then((res) => {
        console.log(res);
        // this.tabData = res.rows;
        // 遍历tabData，取其小数点位数进行格式化
        let index = parseInt(this.activeName) - 1
        this.tabList[index].tabData = res.rows.map((item, value) => {
          item.paramValue = (
            item.paramValue / Math.pow(10, item.decimalNum)
          ).toFixed(item.decimalNum);
          return item;
        });
        // 重新获取并改变tabList的kmp
        // this.tabList.forEach((item,index)=>{
        //   if (item.paramSubType == this.queryParams.paramSubType) {
        //     this.vmd[this.queryParams.paramSubType] = this.getVmd(this.tabData)
        //     item.vmd = this.vmd[this.queryParams.paramSubType]
        //     console.log(vmd)
        //     return item;
        //   }
        // })
        // this.vmd[this.queryParams.paramSubType] = this.getVmd(this.tabData)
        // console.log(this.tabList)
      });
    },
    // tab标签点击事件
    handleTabClick(tab, event) {
      // console.log(tab);
      let that = this;
      let preIndex = this.preIndex
      // 提示是否保存之前页面的修改
      if (Object.keys(this.updIdMap).length > 0) {
        this.$modal
          .confirm("是否保存之前页面的修改？")
          .then(function () {
            console.log("save data");
            that.savePageData(preIndex);
          })
          .catch(() => {
            // 重置map
            that.updIdMap = {};
          });
      }

      this.queryParams.paramSubType = parseInt(tab._props.name);
      this.preIndex = parseInt(tab.index)
      this.getList();
    },
    backToSearchIp() {
      // this.$router.push({
      //     name: 'ParamValue1',
      //   });
      this.isShowPage = false;
    },
    closePv(bool) {
      this.isShowPage = bool;
      if (bool) {
        this.loadTabPanelData()
      }
    },
    // 保存页面数据
    savePageData(preIndex) {
      console.log("savePageData");
      let index = parseInt(this.activeName) - 1;
      index = preIndex != undefined ? preIndex : index
      console.log(index)
      let vmd = this.tabList[index].vmd;
      let tabData = this.tabList[index].tabData;
      tabData = this.transVmd(vmd, tabData)
      console.log(tabData);
      console.log(this.updIdMap);
      // 遍历tabData，判断是否在updIdMap中，在就修改
      let keys = Object.keys(this.updIdMap);
      let len = keys.length;
      let num = 0;
      tabData.map((it, idx) => {
        if (it.id in this.updIdMap) {
          // 对小数点反格式化后再进行存储
          it.paramValue = this.trimPoint(it.paramValue)
          updateParamValue(it).then((res) => {
            num++;
            console.log(res);
            it.paramValue = (it.paramValue / Math.pow(10, it.decimalNum)).toFixed(it.decimalNum)
            if (num == len) {
              console.log("clear");
              this.updIdMap = {};
              this.$modal.msgSuccess("保存成功");
            }
          });
        }
      });
    },
    // input修改事件
    changeInput(id) {
      console.log(id);
      // 监听到修改之后将参数加入到待修改列表
      this.updIdMap[id] = id;
    },
    // 生成form校验需要的model数据kmp
    getKmp(tabData) {
      console.log(tabData);
      if (!tabData) return {};
      // 遍历获取所有的参数值
      let kmp = {};
      tabData.map((item, index) => {
        if (this.strValidParamName.indexOf(item.paramName) == -1) {
          item.paramValue = parseInt(item.paramValue);
        }
        kmp[item.paramName] = item;
      });
      return kmp;
    },
    // 生成form校验需要的model数据
    getVmd(tabData){
      if (!tabData) return {};
      // 遍历获取所有的参数值
      let vmd = {};
      tabData.map((item, index) => {
        vmd[item.paramName] = item.paramValue
      });
      return vmd;
    },
    // 将vmd转写为paramValue格式
    transVmd(vmd, tabData){
      tabData = tabData.map((item, index) => {
        item.paramValue = vmd[item.paramName]
        return item
      })
      return tabData
    },
    // 生成表单规则
    createRules(tabData) {
      console.log(tabData);
      if (!tabData) return {};
      // 规则定义-根据tabData生成
      let rules = {};
      // 遍历获取所有的参数值
      let kmp = this.getKmp(tabData);
      console.log(kmp);
      console.log(this.kmp);

      // 遍历keys设置rules的字段
      for (let [k, v] of Object.entries(kmp)) {
        // console.log(k);
        // console.log(v);
        rules[k] = [];
        // 根据key的不同给予不同的规则
        // 通用规则有哪些： 最大值，最小值
        let rule = {};
        if (this.strValidParamName.indexOf(v.paramName) == -1) {
          rule["trigger"] = "change";
          // rule["message"] = "取值范围在" + v.minV + "~" + v.maxV + v.unit || "";
          rule["msg"] = v.paramName + "取值范围在" + v.minV + "~" + v.maxV;
          rule["min"] = v.minV;
          rule["max"] = v.maxV;
          rule['validator'] = this.theValidator
          rules[k].push(rule);
        }
      }
      console.log(rules);
      this.rules = rules;
      return rules;
    },
    // 校验用户权限
    hasPerm(perm) {
      return this.$auth.hasPermi(perm);
    },
    // 自定义校验器
    theValidator(rule, value, callback) {
      console.log(rule)
      console.log(value)
      let intVal = parseInt(value)
      if (!intVal || intVal < rule.min || intVal > rule.max) {
        callback(rule.msg)
      }else{
        callback()
      }
    },
    // 过滤小数点转为整数
    trimPoint(v){
      return parseInt(String(v).replace('.',''))
    },
  },
};
</script>

<style scoped>
.rightToolBarDiv {
  position: absolute;
  right: 15px;
  top: -5px;
  z-index: 1;
  background: transparent;
  padding: 16px;
}
.save-btn {
  position: absolute;
  right: 415px;
  top: 50px;
  z-index: 1;
  background: transparent;
  padding: 16px;
}
</style>

