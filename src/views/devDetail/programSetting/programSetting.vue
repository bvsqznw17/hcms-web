<template>
  <div>
    <el-tabs class="tabs" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="(item, index) in menuList" :key="index" :label="item.text" :name="index + ''">
        <component :is="item.component"></component>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>


<script>
export default {
  components: {
    baseParam: () => import("./baseParam/baseParam"),
    middleParam: () => import("./middleParam/middleParam"),
    zjSetting: () => import("./zjSetting/zjSetting"),
    timeSetting: () => import("./timeSetting/timeSetting"),
    motorModel: () => import("./motorModel/motorModel"),
    setDou: () => import("./setDou/setDou"),
    AFC: () => import("./AFC/AFC"),
  },
  data() {
    return {
      activeName: "0",
      menuList: [
        {
          text: "基本参数",
          component: "baseParam",
        },
        {
          text: "中级参数",
          component: "middleParam",
        },
        {
          text: "振机设置",
          component: "zjSetting",
        },
        {
          text: "时间调整",
          component: "timeSetting",
        },
        {
          text: "马达模式",
          component: "motorModel",
        },
        {
          text: "指定斗",
          component: "setDou",
        },
        {
          text: "AFC",
          component: "AFC",
        },
      ],
      pbIndexs: {},
      updIdMap: {},
    };
  },
  created(opt) {
    // listForPrParam({
    //   devId: 6043,
    //   // devId: this.$store.getters.devId,
    // }).then((res) => {
    //   console.log(res);
    //   this.menuList = this.menuList.map((it, idx) => {
    //     it.pvList = res.data[idx];
    //     return it;
    //   });
    // });
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
};
</script>

<style>
.tabs {
  margin-left: 15px;
}
</style>
