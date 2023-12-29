<template>
  <div class="app-container">
    <!-- 左侧设备树 -->
    <div class="tree_wrapper">
      <div class="left_tree">
        <el-input placeholder="搜索设备" v-model="filterText"> </el-input>
        <el-tree :data="devTreeData" :props="defaultProps" :default-expanded-keys="topNodeKeys" show-checkbox check-on-click-node accordion ref="devTree" highlight-current @check-change="selectDevNodeCheckChange" :filter-node-method="filterNode" :expand-on-click-node="false" node-key="id">
          <span slot-scope="{ data }"><img :src="dev_icon" width="22px" alt="" /><span>
              {{ data.label }}</span></span>
        </el-tree>
      </div>
    </div>
  </div>
</template>

<script>
import { getDevTree } from "@/api/devAuth/devAuth";
import dev_icon from "@/assets/images/device.png";

export default {
  name: "AddAuth",
  components: {},
  props: ["addAuthData", "pName"],
  computed: {
    pid: function () {
      let pid = this.addAuthData.pid;
      return pid;
    },
  },
  watch: {
    addAuthFormData: function (newVal) {
      console.log(newVal);
      this.$emit("addAuth", newVal);
    },
    filterText(val) {
      this.$refs.devTree.filter(val);
    },
  },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "label",
      },
      devTreeData: [],
      devTreeCheckedNodes: [],
      filterText: "",
      dev_icon: dev_icon,
      // 搜索
      search: "",
      // 添加权限表单数据
      addAuthFormData: [],
      // 设备权限树顶层节点
      topNodeKeys: [0],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        agentId: null,
      },
    };
  },
  created() {
    setTimeout(() => {
      console.log(this.pName);
      if (this.pName && this.pName == "agent") {
        this.getDevTree();
      } else {
        this.queryParams.agentId = this.addAuthData.pid;
        this.getDevTree();
      }
    }, 1500);
  },
  methods: {
    /** 获取设备树 */
    getDevTree() {
      getDevTree(this.queryParams).then((res) => {
        console.log("设备树", res);
        this.topNodeKeys = [res.data.id];
        this.devTreeData = this.handleDevData(res.data);
        // 移除根目录
        // this.devTreeData = res.data.children;
      });
    },
    // 处理设备树数据
    handleDevData(data) {
      let treeData = [];
      data.forEach((item) => {
        let obj = {
          id: item.id,
          label: item.devName,
          children: [],
        };
        if (item.children) {
          obj.children = this.handleDevData(item.children);
        }
        treeData.push(obj);
      });

      console.log("处理后的设备树数据", treeData);
      return treeData;
    },
    // 设备树过滤方法
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    //  选择设备事件
    selectDevNodeCheckChange(data) {
      this.devTreeCheckedNodes = this.$refs.devTree.getCheckedNodes();
      console.log("选择目录", this.devTreeCheckedNodes);
      this.computedAddAuthFormData();
    },
    // 搜索按钮操作
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    // 取消按钮操作
    cancel() {
      this.$emit("addAuthVisible", false);
    },
    // 计算addAuthFormData
    computedAddAuthFormData() {
      let devTreeCheckedNodes = this.devTreeCheckedNodes;
      let addAuthFormData = [];

      devTreeCheckedNodes.forEach((item) => {
        addAuthFormData.push({
          devId: item.id,
          agentId: this.pid,
        });
      });
      this.addAuthFormData = addAuthFormData;
    },
  },
};
</script>

<style scoped>
.search {
  /* float: right; */
  display: inline-block;
}
.tree_wrapper {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: auto;
}
.left_tree {
  float: left;
  width: 49.8%;
  margin-right: 0.2%;
}
.right_tree {
  float: left;
  width: 49.8%;
  margin-left: 0.2%;
}
.bottom_select {
  float: left;
  width: 100%;
}
</style>