<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="设备名称" prop="devName">
        <el-input v-model="queryParams.devName" placeholder="请输入设备名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="ip地址" prop="ip">
        <el-input v-model="queryParams.ip" placeholder="请输入ip地址" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="端口" prop="port">
        <el-input v-model="queryParams.port" placeholder="请输入端口" clearable @keyup.enter.native="handleQuery" />
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
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['device:devMsg:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['device:devMsg:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['device:devMsg:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['device:devMsg:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="devMsgList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="设备名称" align="center" prop="devName" />
      <el-table-column label="ip地址" align="center" prop="ip" />
      <!-- <el-table-column label="通信状态" align="center" prop="status" /> -->
      <el-table-column label="通信状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.online_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="dtCreate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.dtCreate, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="dtUpdate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.dtUpdate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="注释" align="center" prop="comment" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-info" @click="skipToDevDetail(scope.row)" v-hasPermi="['device:devList:edit']">设备详情</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['device:devMsg:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['device:devMsg:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改设备信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="devName">
          <el-input v-model="form.devName" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="ip地址" prop="ip">
          <el-input v-model="form.ip" placeholder="请输入ip地址" />
        </el-form-item>
        <el-form-item label="端口" prop="port">
          <el-input v-model="form.port" placeholder="请输入端口" />
        </el-form-item>
        <el-form-item label="地区" prop="area">
          <el-input v-model="form.area" placeholder="请输入地区" />
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
  listDevMsg,
  getDevMsg,
  delDevMsg,
  addDevMsg,
  updateDevMsg,
} from "@/api/device/devMsg";

export default {
  name: "DevMsg",
  dicts: ["online_status"],
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
      // 设备信息表格数据
      devMsgList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        devName: null,
        ip: null,
        port: null,
        dtUpdate: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询设备信息列表 */
    getList() {
      this.loading = true;
      listDevMsg(this.queryParams).then((response) => {
        this.devMsgList = response.rows;
        this.total = response.total;
        this.loading = false;
        this.$store.commit("device/SET_DEVICES", this.devMsgList);
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
        devName: null,
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
      this.title = "添加设备信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getDevMsg(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改设备信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateDevMsg(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDevMsg(this.form).then((response) => {
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
        .confirm('是否确认删除设备信息编号为"' + ids + '"的数据项？')
        .then(function () {
          return delDevMsg(ids);
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
        "device/devMsg/export",
        {
          ...this.queryParams,
        },
        `devMsg_${new Date().getTime()}.xlsx`
      );
    },
    // 跳转到设备详情
    skipToDevDetail(row) {
      console.log(row);
      this.$store.commit("device/SET_CUR_DEV", row);
      this.$store.commit("device/SET_DEV_ID", row.id);
      this.$store.commit("device/SET_DEV_NAME", row.devName);
      this.$router.push({
        name: "DevMain",
      });
    },
  },
};
</script>
