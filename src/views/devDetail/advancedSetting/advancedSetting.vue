<template>
  <div>
    <el-tabs class="tabs" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="(item, index) in menuList" :key="index" :label="item.text" :name="index + ''">
        <component :is="item.component" v-if="activeName === index + ''"></component>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>


<script>
export default {
  components: {
    systemParam: () => import("./systemParam/systemParam"),
    motorModel: () => import("./motorModel/motorModel"),
    plzy: () => import("./plzy/plzy"),
    mkStatus: () => import("./mkStatus/mkStatus"),
  },
  data() {
    return {
      activeName: "0",
      menuList: [
        {
          text: "系统参数",
          component: "systemParam",
        },
        {
          text: "马达模式",
          component: "motorModel",
        },
        {
          text: "频率增益",
          component: "plzy",
        },
        {
          text: "模块状态",
          component: "mkStatus",
        },
      ],
      pbIndexs: {},
      updIdMap: {},
    };
  },
  created(opt) {},
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
