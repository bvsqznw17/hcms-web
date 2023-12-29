<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="ip地址" prop="ip">
        <el-input v-model="queryParams.ip" placeholder="请输入ip地址" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="通信状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择通信状态" clearable>
          <el-option v-for="dict in dict.type.online_status" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="更新时间" prop="dtUpdate">
        <el-date-picker clearable v-model="queryParams.dtUpdate" type="date" value-format="yyyy-MM-dd" placeholder="请选择更新时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['device:devList:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['device:devList:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['device:devList:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['device:devList:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="devListList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="" align="center" prop="id" /> -->
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="ip地址" align="center" prop="ip" />
      <el-table-column label="通信状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.online_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="dtUpdate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.dtUpdate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="注释" align="center" prop="comment" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-info" @click="skipToParam(scope.row)" v-hasPermi="['device:devList:edit']">设备详情</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['device:devList:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['device:devList:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改设备列表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="ip地址" prop="ip">
          <el-input v-model="form.ip" placeholder="请输入ip地址" />
        </el-form-item>
        <el-form-item label="端口" prop="port">
          <el-input v-model="form.port" placeholder="请输入端口" />
        </el-form-item>
        <el-form-item label="注释" prop="comment">
          <el-input v-model="form.comment" placeholder="请输入注释" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listDevList,
  getDevList,
  delDevList,
  addDevList,
  updateDevList,
} from "@/api/device/devList";

export default {
  name: "DevList",
  dicts: ["online_status"],
  watch: {
    $route: function (newVal, oldVal) {
      console.log(newVal);
      if (
        newVal.query.status != oldVal.query.status &&
        newVal.query.status != undefined &&
        newVal.query.status != null
      ) {
        this.queryParams.status = this.reverseStatusMap[newVal.query.status];
        this.getList();
      }
    },
  },
  data() {
    return {
      // 遮罩层
      loading: true,
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
      // 设备列表表格数据
      devListList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        ip: null,
        status: null,
        dtUpdate: null,
      },
      // 额外参数
      status: null,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        ip: [{ required: true, message: "ip地址不能为空", trigger: "blur" }],
        port: [{ required: true, message: "端口不能为空", trigger: "blur" }],
        status: [
          { required: true, message: "通信状态不能为空", trigger: "blur" },
        ],
      },
      // 在线状态转化表
      statusMap: {
        在线: 1,
        离线: 0,
        未知: 2,
      },
      // 反向转换表
      reverseStatusMap: {
        0: "离线",
        1: "在线",
        2: "未知",
      },
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    console.log(this.$route);
    if (
      this.$route.query.status != undefined &&
      this.$route.query.status != null
    ) {
      this.queryParams.status = this.reverseStatusMap[this.$route.query.status];
      this.getList();
    }
  },
  methods: {
    /** 查询设备列表列表 */
    getList() {
      this.loading = true;
      // this.queryParams.status = this.status ? this.status : this.queryParams.status
      // this.queryParams.status = this.statusMap[this.queryParams.status]
      let params = {};
      for (var key in this.queryParams) {
        if (key == "status") {
          params[key] = this.statusMap[this.queryParams.status];
        } else {
          params[key] = this.queryParams[key];
        }
      }
      console.log(params);
      listDevList(params).then((response) => {
        this.devListList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        name: null,
        ip: null,
        port: null,
        area: null,
        status: 0,
        dtCreate: null,
        dtUpdate: null,
        comment: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加设备列表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getDevList(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改设备列表";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateDevList(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDevList(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除设备列表编号为"' + ids + '"的数据项？')
        .then(function () {
          return delDevList(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "device/devList/export",
        {
          ...this.queryParams,
        },
        `devList_${new Date().getTime()}.xlsx`
      );
    },
    /** 跳转到参数页面 */
    skipToParam(row) {
      console.log(row);
      this.$store.commit("device/SET_DEV_ID", row.id);
      this.$router.push({
        name: "DevMain",
      });
    },
  },
};
</script>
