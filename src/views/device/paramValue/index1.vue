<template>
  <div>
    <el-row>
      <el-col :span="8" class="center">
        <el-input
          v-model="search"
          @focus="focus"
          @blur="blur"
          @keyup.enter.native="searchHandler"
          placeholder="请输入ip地址"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            id="search"
            :style="{ background: btnColor }"
            @click="searchHandler"
          ></el-button>
        </el-input>
        <!---设置z-index优先级,防止被走马灯效果遮挡-->
        <el-card
          @mouseenter="enterSearchBoxHanlder"
          v-if="isSearch"
          class="box-card"
          id="search-box"
          style="position: relative; z-index: 15"
        >
          <dl v-if="isHistorySearch">
            <dt class="search-title" v-show="history">历史搜索</dt>
            <dt
              class="remove-history"
              style="cursor: pointer"
              v-show="history"
              @click="removeAllHistory"
            >
              <i class="el-icon-delete"></i>清空历史记录
            </dt>
            <el-tag
              v-for="search in historySearchList"
              :key="search.id"
              closable
              :type="search.type"
              @close="closeHandler(search)"
              @click="changeSearch(search)"
              style="margin-right: 5px; margin-bottom: 5px; cursor: pointer"
              >{{ search.name }}</el-tag
            >
          </dl>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { listParamValue, collData } from "@/api/device/paramValue";
import RandomUtil from "@/utils/search/randomUtil";
import Store from "@/utils/search/store";
export default {
  name: "ParamValue1",
  data() {
    return {
      search: "", //当前输入框的值
      isFocus: false, //是否聚焦
      historySearchList: [], //历史搜索数据
      searchList: ["暂无数据"], //搜索返回数据,
      history: false,
      types: ["", "success", "info", "warning", "danger"], //搜索历史tag式样
      btnColor: this.$store.state.settings.theme,
    };
  },
  methods: {
    focus() {
      this.isFocus = true;
      this.historySearchList =
        Store.loadHistory() == null ? [] : Store.loadHistory();
      this.history = this.historySearchList.length == 0 ? false : true;
    },
    blur() {
      var self = this;
      this.searchBoxTimeout = setTimeout(function () {
        self.isFocus = false;
      }, 300);
    },
    enterSearchBoxHanlder() {
      clearTimeout(this.searchBoxTimeout);
    },
    searchHandler() {
      // 加载loading页面
      this.$modal.loading("正在采集数据...");
      // 校验ip地址格式
      let ip = this.search;
      const reg =
        /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
      if (!reg.test(ip) && ip !== "") {
        this.$modal.msgError("请输入正确的IP地址");
        this.$modal.closeLoading();
      }
      // 发送采集指令
      collData({ ip: ip }).then((res) => {
        console.log(res);
        // TODO 等待集合面板进行测试
        this.$emit('closePv', true);
        if (res.data === 1) {
          // 等待3s后进行页面刷新
          setTimeout(() => {
            this.$modal.closeLoading();
            // 加载新的页面进行展示
            this.$emit('__showPage', true)
            // this.$router.push({
            //   name: "ParamPage1",
            //   query: {
            //     ip: ip,
            //   },
            // });
          }, 3000);
        } else {
          this.$modal.closeLoading();
          // 处理各种异常情况
          let msg = "通信失败";
          this.$modal.msgError(msg);
        }
      });
      //随机生成搜索历史tag式样
      let n = RandomUtil.getRandomNumber(0, 5);

      let exist =
        this.historySearchList.filter((value) => {
          return value.name == this.search;
        }).length == 0
          ? false
          : true;
      if (!exist) {
        this.historySearchList.push({ name: this.search, type: this.types[n] });
        Store.saveHistory(this.historySearchList);
      }
      this.history = this.historySearchList.length == 0 ? false : true;
    },
    closeHandler(search) {
      this.historySearchList.splice(this.historySearchList.indexOf(search), 1);
      Store.saveHistory(this.historySearchList);
      clearTimeout(this.searchBoxTimeout);
      if (this.historySearchList.length == 0) {
        this.history = false;
      }
    },
    // 改变search的值
    changeSearch(search) {
      this.search = search.name;
    },
    removeAllHistory() {
      Store.removeAllHistory();
    },
  },
  computed: {
    isHistorySearch() {
      return this.isFocus;
      // return this.isFocus && !this.search;
    },
    isSearchList() {
      return this.isFocus;
      // return this.isFocus && this.search;
    },
    isSearch() {
      return this.isFocus;
    },
  },
};
</script>

<style>
.left {
  margin-left: 200px;
}
.center {
  margin-top: 10%;
  margin-left: 30%;
}
#search {
  /* background-color: #ffc300; */
  color: #fff;
  border-radius: 0%;
}
.search-title {
  color: #bdbaba;
  font-size: 15px;
  margin-bottom: 5px;
}
.remove-history {
  color: #bdbaba;
  font-size: 15px;
  float: right;
  margin-top: -22px;
}
#search-box {
  width: 555px;
  height: 300px;
  margin-top: 0px;
  padding-bottom: 20px;
}
</style>