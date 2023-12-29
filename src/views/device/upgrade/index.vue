<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="当前版本" prop="version">
        <el-input v-model="queryParams.version" placeholder="请输入当前版本" clearable @keyup.enter.native="handleQuery" />
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
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['device:upgrade:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['device:upgrade:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['device:upgrade:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['device:upgrade:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="upgradeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="设备名称" align="center" prop="devName" />
      <el-table-column label="设备型号" align="center" prop="devModel" />
      <el-table-column label="当前版本" align="center" prop="version" />
      <el-table-column label="更新时间" align="center" prop="dtUpdate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.dtUpdate, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['device:upgrade:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['device:upgrade:remove']">删除</el-button>
          <el-button size="mini" type="text" icon="el-icon-upload" @click="handleUpgrade(scope.row)" v-hasPermi="['device:upgrade:edit']">升级</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改软件升级对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备名称" prop="devName">
          <el-input v-model="form.devName" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="当前版本" prop="version">
          <el-input v-model="form.version" placeholder="请输入当前版本" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 升级到指定版本 -->
    <el-dialog title="升级到指定版本" :visible.sync="up_open" width="500px" append-to-body>
      <el-form ref="up_form" label-width="80px">
        <el-select v-model="targetVersion" placeholder="请选择版本" clearable>
          <el-option v-for="it in versionList" :key="it.id" :label="it.version" :value="it.version" />
        </el-select>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="up_submit">确 定</el-button>
        <el-button @click="up_cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listUpgrade,
  getUpgrade,
  delUpgrade,
  addUpgrade,
  updateUpgrade,
  upgradeToNew,
} from "@/api/device/upgrade";
import { listVersion } from "@/api/device/version";

export default {
  name: "Upgrade",
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
      // 软件升级表格数据
      upgradeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层-升级
      up_open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        ip: null,
        name: null,
        version: null,
        dtUpdate: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        ip: [{ required: true, message: "设备ip不能为空", trigger: "blur" }],
        name: [
          { required: true, message: "软件名称不能为空", trigger: "blur" },
        ],
      },
      // 版本列表
      versionList: [],
      // 目标版本
      targetVersion: null,
    };
  },
  created() {
    this.getList();
    listVersion().then((res) => {
      console.log(res);
      this.versionList = res.rows;
    });
  },
  methods: {
    /** 查询软件升级列表 */
    getList() {
      this.loading = true;
      listUpgrade(this.queryParams).then((response) => {
        this.upgradeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 软件升级-取消
    up_cancel() {
      this.up_open = false;
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        ip: null,
        name: null,
        version: null,
        newVersion: null,
        url: null,
        dtUpdate: null,
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
      this.title = "添加软件升级";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getUpgrade(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改软件升级";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateUpgrade(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addUpgrade(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    // 软件升级-提交
    up_submit() {
      this.up_open = false;
      // TODO
      // 通过targetVersion在verisonList中找到对应的记录
      let targetVersion = this.targetVersion;
      let upParam = null;
      this.versionList.map((it, idx) => {
        if (it.version == targetVersion) {
          upParam = it;
        }
      });
      if (upParam != null) {
        upgradeToNew(this.upParam).then((res) => {
          console.log(res);
          if (res.code == 200) {
            this.$modal.msgSuccess("下发成功");
          }
        });
      } else {
        this.$modal.msgSuccess("请选择有效的软件版本！");
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除软件升级编号为"' + ids + '"的数据项？')
        .then(function () {
          return delUpgrade(ids);
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
        "device/upgrade/export",
        {
          ...this.queryParams,
        },
        `upgrade_${new Date().getTime()}.xlsx`
      );
    },
    /** 升级 */
    handleUpgrade(row) {
      console.log(row);
      console.log("upgrade");
      // TODO 排查搜索条件
      listVersion({ softwareName: row.name }).then((res) => {
        console.log(res);
        this.versionList = res.rows.map((it, idx) => {
          it.devName = row.devName;
          return it;
        });
        this.up_open = true;
      });
    },
  },
};
</script>
