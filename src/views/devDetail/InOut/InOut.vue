<template>
  <div>
    <el-tabs class="tabs" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="(item, index) in dataList" :key="index" :label="item.text" :name="index + ''">
        <in-out-setting :param="item.param"></in-out-setting>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>


<script>
import InOutSetting from "./InOutSetting/InOutSetting";
export default {
  components: {
    InOutSetting,
  },
  data() {
    return {
      activeName: "0",
      dataList: [
        { text: "输入端口", param: "0" },
        { text: "输出端口", param: "1" },
        // { text: "输出端口2", param: "2" },
        // { text: "输出端口3", param: "3" },
      ],
    };
  },
  created(opt) {},
  methods: {
    handleClick(e) {
      console.log("handleClick", e);
    },
  },
};
</script>

<style>
</style>
