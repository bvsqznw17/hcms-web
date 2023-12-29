<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="参数类型" prop="paramType">
        <el-select v-model="queryParams.paramType" placeholder="请选择参数类型" clearable>
          <el-option
            v-for="dict in dict.type.param_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="参数子类型" prop="paramSubType">
        <el-select v-model="queryParams.paramSubType" placeholder="请选择参数子类型" clearable>
          <el-option
            v-for="dict in dict.type.param_sub_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="参数名称" prop="paramName">
        <el-input
          v-model="queryParams.paramName"
          placeholder="请输入参数名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="ip地址" prop="ip">
        <el-input
          v-model="queryParams.ip"
          placeholder="请输入ip地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="更新时间" prop="dtUpdate">
        <el-date-picker clearable
          v-model="queryParams.dtUpdate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择更新时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
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
          v-hasPermi="['param:paramValue:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['param:paramValue:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['param:paramValue:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['param:paramValue:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="paramValueList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="${comment}" align="center" prop="id" /> -->
      <el-table-column label="ip地址" align="center" prop="ip" />
      <el-table-column label="参数类型" align="center" prop="paramType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.param_type" :value="scope.row.paramType"/>
        </template>
      </el-table-column>
      <el-table-column label="参数子类型" align="center" prop="paramSubType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.param_sub_type" :value="scope.row.paramSubType"/>
        </template>
      </el-table-column>
      <el-table-column label="参数名称" align="center" prop="paramName" />
      <el-table-column label="参数值" align="center" prop="paramValue" />
      <el-table-column label="更新时间" align="center" prop="dtUpdate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.dtUpdate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['param:paramValue:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['param:paramValue:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改设备参数对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="ip地址" prop="ip">
          <el-input v-model="form.ip" placeholder="请输入ip地址" />
        </el-form-item>
        <el-form-item label="参数类型" prop="paramType">
          <el-select v-model="form.paramType" placeholder="请选择参数类型">
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
        <el-form-item label="参数值" prop="paramValue">
          <el-input v-model="form.paramValue" placeholder="请输入参数值" />
        </el-form-item>
        <el-form-item label="更新时间" prop="dtUpdate">
          <el-date-picker clearable
            v-model="form.dtUpdate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择更新时间">
          </el-date-picker>
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
import { listParamValue, getParamValue, delParamValue, addParamValue, updateParamValue } from "@/api/device/paramValue";

export default {
  name: "ParamValue",
  dicts: ['param_type', 'param_sub_type'],
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
      // 设备参数表格数据
      paramValueList: [],
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
        ip: null,
        dtUpdate: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        paramType: [
          { required: true, message: "参数类型不能为空", trigger: "change" }
        ],
        paramSubType: [
          { required: true, message: "参数子类型不能为空", trigger: "change" }
        ],
        paramName: [
          { required: true, message: "参数名称不能为空", trigger: "blur" }
        ],
        paramValue: [
          { required: true, message: "参数值不能为空", trigger: "blur" }
        ],
        ip: [
          { required: true, message: "ip地址不能为空", trigger: "blur" }
        ],
        dtUpdate: [
          { required: true, message: "更新时间不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询设备参数列表 */
    getList() {
      this.loading = true;
      listParamValue(this.queryParams).then(response => {
        this.paramValueList = response.rows;
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
        paramValue: null,
        ip: null,
        dtUpdate: null
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加设备参数";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getParamValue(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改设备参数";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateParamValue(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addParamValue(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除设备参数编号为"' + ids + '"的数据项？').then(function() {
        return delParamValue(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('param/paramValue/export', {
        ...this.queryParams
      }, `paramValue_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
