<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="auto"
    >
      <el-form-item label="参数名称" prop="paramName">
        <el-input
          v-model="queryParams.paramName"
          placeholder="请输入参数名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备型号" prop="devModel">
        <el-select
          v-model="queryParams.devModel"
          placeholder="请选择设备型号"
          clearable
        >
          <el-option
            v-for="dict in devModelList"
            :key="dict.devModel"
            :label="dict.devModel"
            :value="dict.devModel"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="参数大类" prop="paramType">
        <el-select
          v-model="queryParams.paramType"
          placeholder="请选择参数大类"
          clearable
        >
          <el-option
            v-for="dict in dict.type.param_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="参数子类" prop="paramSubType">
        <el-select
          v-model="queryParams.paramSubType"
          placeholder="请选择参数子类"
          clearable
        >
          <el-option
            v-for="dict in dict.type.param_sub_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['base:regLib:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['base:regLib:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['base:regLib:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['base:regLib:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="regLibList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="设备型号" align="center" prop="devModel">
      </el-table-column>
      <el-table-column label="参数大类" align="center" prop="paramType">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.param_type"
            :value="scope.row.paramType"
          />
        </template>
      </el-table-column>
      <el-table-column label="参数子类" align="center" prop="paramSubType">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.param_sub_type"
            :value="scope.row.paramSubType"
          />
        </template>
      </el-table-column>
      <el-table-column label="参数名称" align="center" prop="paramName" />
      <el-table-column label="寄存器地址" align="center" prop="regAddr" />
      <el-table-column label="寄存器数量" align="center" prop="regNum" />
      <el-table-column label="数据类型" align="center" prop="dataType">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.data_type"
            :value="scope.row.dataType"
          />
        </template>
      </el-table-column>
      <el-table-column label="最小值" align="center" prop="minV" />
      <el-table-column label="最大值" align="center" prop="maxV" />
      <el-table-column label="小数位数" align="center" prop="decimalNum" />
      <el-table-column label="单位" align="center" prop="unit">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.param_unit" :value="scope.row.unit" />
        </template>
      </el-table-column>
      <el-table-column label="读写性" align="center" prop="operateType">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.reg_type"
            :value="scope.row.operateType"
          />
        </template>
      </el-table-column>
      <el-table-column label="页面顺序" align="center" prop="pageSeq" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['base:regLib:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['base:regLib:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改基础库配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="auto">
        <el-form-item label="设备型号" prop="devModel">
          <el-select v-model="form.devModel" placeholder="请选择设备型号">
            <el-option
              v-for="dict in devModelList"
              :key="dict.devModel"
              :label="dict.devModel"
              :value="dict.devModel"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参数大类" prop="paramType">
          <el-select v-model="form.paramType" placeholder="请选择参数大类">
            <el-option
              v-for="dict in dict.type.param_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参数子类" prop="paramSubType">
          <el-select v-model="form.paramSubType" placeholder="请选择参数子类">
            <el-option
              v-for="dict in dict.type.param_sub_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参数名称" prop="paramName">
          <el-input v-model="form.paramName" placeholder="请输入参数名称" />
        </el-form-item>
        <el-form-item label="寄存器地址" prop="regAddr">
          <el-input v-model="form.regAddr" placeholder="请输入寄存器地址" />
        </el-form-item>
        <el-form-item label="寄存器数量" prop="regNum">
          <el-input v-model="form.regNum" placeholder="请输入寄存器数量" />
        </el-form-item>
        <el-form-item label="数据类型" prop="dataType">
          <el-select v-model="form.dataType" placeholder="请选择数据类型">
            <el-option
              v-for="dict in dict.type.data_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="最小值" prop="minV">
          <el-input v-model="form.minV" placeholder="请输入最小值" />
        </el-form-item>
        <el-form-item label="最大值" prop="maxV">
          <el-input v-model="form.maxV" placeholder="请输入最大值" />
        </el-form-item>
        <el-form-item label="小数位数" prop="decimalNum">
          <el-input v-model="form.decimalNum" placeholder="请输入小数位数" />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="form.unit" placeholder="请输入单位" />
        </el-form-item>
        <el-form-item label="读写性" prop="operateType">
          <el-select v-model="form.operateType" placeholder="请选择读写性">
            <el-option
              v-for="dict in dict.type.reg_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="页面顺序" prop="pageSeq">
          <el-input v-model="form.pageSeq" placeholder="页面顺序" />
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
  listRegLib,
  getRegLib,
  delRegLib,
  addRegLib,
  updateRegLib,
} from "@/api/base/regLib";
import { listDevice } from "@/api/device/device";

export default {
  name: "RegLib",
  dicts: ["reg_type", "param_type", "param_sub_type", "data_type"],
  
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
      // 基础库配置表格数据
      regLibList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        paramType: null,
        paramSubType: null,
        paramName: null,
        operateType: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        devModel: [
          { required: true, message: "设备型号不能为空", trigger: "change" },
        ],
        paramType: [
          { required: true, message: "参数大类不能为空", trigger: "change" },
        ],
        paramSubType: [
          { required: true, message: "参数子类不能为空", trigger: "change" },
        ],
        paramName: [
          { required: true, message: "参数名称不能为空", trigger: "blur" },
        ],
        regAddr: [
          { required: true, message: "寄存器地址不能为空", trigger: "blur" },
        ],
        regNum: [
          { required: true, message: "寄存器数量不能为空", trigger: "blur" },
        ],
        dataType: [
          { required: true, message: "数据类型不能为空", trigger: "change" },
        ],
        minV: [{ required: true, message: "最小值不能为空", trigger: "blur" }],
        maxV: [{ required: true, message: "最大值不能为空", trigger: "blur" }],
        decimalNum: [
          { required: true, message: "小数位数不能为空", trigger: "blur" },
        ],
        unit: [{ required: true, message: "单位不能为空", trigger: "blur" }],
        operateType: [
          { required: true, message: "读写性不能为空", trigger: "change" },
        ],
      },
      // 设备类型列表
      devModelList: []
    };
  },
  created() {
    this.getList();
    // 获取设备类型列表
      listDevice().then(response => {
        console.log(response)
        this.devModelList = response.rows;
      });
  },
  methods: {
    /** 查询基础库配置列表 */
    getList() {
      this.loading = true;
      listRegLib(this.queryParams).then((response) => {
        this.regLibList = response.rows;
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
        paramType: null,
        paramSubType: null,
        paramName: null,
        regAddr: null,
        regNum: null,
        dataType: null,
        minV: null,
        maxV: null,
        decimalNum: null,
        unit: null,
        operateType: null,
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
      this.title = "添加基础库配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getRegLib(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改基础库配置";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateRegLib(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRegLib(this.form).then((response) => {
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
        .confirm('是否确认删除基础库配置编号为"' + ids + '"的数据项？')
        .then(function () {
          return delRegLib(ids);
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
        "base/regLib/export",
        {
          ...this.queryParams,
        },
        `regLib_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
