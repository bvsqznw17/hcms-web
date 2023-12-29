<template>
  <div class="app-container">
    <div class="tree_wrapper">
      <!-- 右侧设备表格 -->
      <div class="right_table">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px" @submit.native.prevent>
          <el-form-item label="设备标识" prop="userId">
            <el-input v-model="queryParams.userName" placeholder="请输入设备标识搜索" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除</el-button>
          </el-col>
        </el-row>

        <el-table v-loading="loading" :data="devList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="设备名称" align="center" prop="devName" />
          <el-table-column label="设备型号" align="center" prop="devModel" />
          <el-table-column label="cpu序列号" align="center" prop="devCpusn" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template>
              <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getDevList" />
      </div>
    </div>

  </div>
</template>

<script>
import {
  listAgentDevAuth,
  deleteAuth,
  listUserDevAuth,
  deleteUserAuth,
} from "@/api/devAuth/devAuth";
import agent from "@/assets/images/agent.png";

export default {
  name: "DevAuthConfig",
  props: ["authConfigData", "pName"],
  components: {},
  data() {
    return {
      // 遮罩层
      loading: false,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      devList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        agentId: null,
        userId: null,
      },
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label",
      },
      userData: [],
      agent: agent,
      agentId: null,
    };
  },
  created() {
    setTimeout(() => {
      console.log(this.pName);
      this.getDevList();
    }, 1500);
  },
  methods: {
    // 查询设备列表
    getDevList() {
      this.loading = true;
      if (this.pName && this.pName == "agent") {
        this.queryParams.agentId = this.authConfigData.pid;
        listAgentDevAuth(this.queryParams).then((response) => {
          this.devList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      } else {
        console.log("user");
        this.queryParams.userId = this.authConfigData.pid;
        console.log("pid", this.authConfigData.pid);
        listUserDevAuth(this.queryParams).then((response) => {
          this.devList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      }
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        userId: null,
        agentId: null,
        perm: null,
      };
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getDevList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.userName = null;
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const devIds = row.id || this.ids;
      this.$confirm('是否确认删除设备编号为"' + devIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return this.deleteDevAuth(row);
        })
        .then(() => {
          this.getDevList();
          this.$message.success("删除成功");
        });
    },
    // 删除设备权限
    deleteDevAuth(row) {
      let agentId = this.queryParams.agentId;
      let userId = this.queryParams.userId;
      const devIds = row.id || this.ids;
      if (this.pName && this.pName == "agent") {
        deleteAuth({ agentId: agentId, devIds: devIds });
      } else {
        deleteUserAuth({ userId: userId, devIds: devIds });
      }
    },
  },
};
</script>

<style scoped>
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
.right_table {
  float: left;
  width: 49.8%;
  margin-left: 0.2%;
}
</style>