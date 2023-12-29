<template>
  <div>
    <!-- 使用 Tabs 组件 -->
    <el-tabs v-model="activeTab" tab-position="top">
      <!-- 循环遍历 dataList 来创建 TabPane -->
      <el-tab-pane v-for="(item, index) in dataList" :key="index" :label="item.text" :name="item.param">
        <!-- Tab 内容 -->
        <el-table :data="item.data">
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column prop="version" label="版本号" width="180">
            <template v-slot="scope">
              <el-tag>{{ scope.row.version }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="180">
            <template v-slot="scope">
              <el-switch v-model="scope.row.status" disabled></el-switch>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
      
<script>
import { collModuleStatus, getMkParam } from "@/api/device/paramValue";
export default {
  data() {
    return {
      activeTab: "0", // 默认激活的 Tab
      dataList: [
        { text: "主控板", param: "0", data: [] },
        { text: "分立板", param: "1", data: [] },
        { text: "振机板", param: "2", data: [] },
        { text: "振动板", param: "3", data: [] },
        { text: "拓展板", param: "4", data: [] },
      ],
      devName: null,
    };
  },
  created(opt) {
    // this.loadModuleParam();
    // 检测设备是否在线
    listDevMsg({
      devId: this.$store.getters.devId,
    }).then((res) => {
      if (res.rows.length > 0 && res.rows[0].status == 0) {
        this.$modal.msgError("当前设备处于离线状态");
        return;
      }
      this.$modal.loading("模块数据采集中");
      collModuleStatus({ devId: this.$store.getters.devId }).then((res) => {
        console.log(res);
        this.$modal.closeLoading();
        if (res.code == 200) {
          this.$modal.msgSuccess("采集完毕");
          this.loadModuleParam();
        } else {
          this.$modal.msgError("采集失败");
        }
      });
    });
  },
  methods: {
    // 加载模块参数
    loadModuleParam() {
      const devId = this.$store.getters.devId;
      const promises = this.dataList.map((item) =>
        getMkParam({
          param: item.param,
          devId: devId,
        })
      );

      Promise.all(promises).then((responses) => {
        responses.forEach((response, index) => {
          console.log(response);
          this.dataList[index].data = response.data.map((it, idx) => {
            if (it.paramValue !== null) {
              it.version = it.paramValue.split("|")[0];
              it.status = it.paramValue.split("|")[1] == "1" ? true : false;
            }
            return it;
          });
        });
      });
    },
  },
};
</script>

<style>
.row {
  margin-bottom: 20px; /* 添加间距 */
}
</style>
