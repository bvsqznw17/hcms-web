<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="软件名称" prop="softwareName">
        <el-input
          v-model="queryParams.softwareName"
          placeholder="请输入软件名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="版本" prop="version">
        <el-input
          v-model="queryParams.version"
          placeholder="请输入版本"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="下载地址" prop="url">
        <el-input
          v-model="queryParams.url"
          placeholder="请输入下载地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="更新时间" prop="dtUpdate">
        <el-date-picker
          clearable
          v-model="queryParams.dtUpdate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择更新时间"
        >
        </el-date-picker>
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
          v-hasPermi="['device:version:add']"
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
          v-hasPermi="['device:version:edit']"
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
          v-hasPermi="['device:version:remove']"
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
          v-hasPermi="['device:version:export']"
          >导出</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-upload"
          size="mini"
          @click="handleUpload"
          v-hasPermi="['device:version:update']"
          >上传</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="versionList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="软件类型" align="center" prop="type" :formatter="fileTypeFormat" />
      <el-table-column label="软件名称" align="center" prop="name" />
      <el-table-column label="版本" align="center" prop="version" />
      <!-- <el-table-column label="下载地址" align="center" prop="url" /> -->
      <el-table-column
        label="更新时间"
        align="center"
        prop="dtUpdate"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.dtUpdate) }}</span>
        </template>
      </el-table-column>
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
            v-hasPermi="['device:version:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['device:version:remove']"
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

    <!-- 添加或修改软件版本对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="软件名称" prop="softwareName">
          <el-input v-model="form.name" placeholder="请输入软件名称" />
        </el-form-item>
        <el-form-item label="版本号" prop="version">
          <el-input v-model="form.version" placeholder="请输入版本号" />
        </el-form-item>
        <el-form-item label="下载地址" prop="url">
          <el-input v-model="form.url" placeholder="请输入下载地址" />
        </el-form-item>
        <el-form-item label="更新时间" prop="dtUpdate">
          <el-date-picker
            clearable
            v-model="form.dtUpdate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择更新时间"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 文件上传对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="upd_open"
      width="500px"
      append-to-body
    >
      <el-form
        ref="uploadForm"
        :model="uploadForm"
        :rules="upd_rules"
        label-width="80px"
      >
        <!-- <el-form-item label="设备型号" prop="type">
          <el-select v-model="uploadForm.devModel" placeholder="请选择设备型号">
            <el-option
              v-for="dict in devModelList"
              :key="dict.devModel"
              :label="dict.devModel"
              :value="dict.devModel"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="文件类型" prop="type">
          <el-select v-model="uploadForm.type" placeholder="请选择文件类型">
            <el-option
              v-for="dict in typeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="软件名称" prop="softwareName">
          <el-input v-model="uploadForm.name" placeholder="请输入软件名称" />
        </el-form-item>
        <el-form-item label="版本号" prop="versionNum">
          <el-input v-model="uploadForm.versionNum" placeholder="请输入版本号" />
        </el-form-item>
        <el-form-item label="上传文件" prop="uploadFileList">
          <el-upload
            ref="uploadFile"
            action=""
            multiple
            :before-upload="beforeUpload"
            :on-remove="handleRemove"
            :on-change="fileChange"
            :before-remove="beforeRemove"
            :auto-upload="false"
            :file-list="uploadFileList"
          >
            <el-button size="small" type="primary" icon="el-icon-upload"
              >点击上传</el-button
            >
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitUploadForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listVersion,
  getVersion,
  delVersion,
  addVersion,
  updateVersion,
  uploadVersionFile,
  downloadVersionFile,
} from "@/api/device/version";
import { listDevice } from "@/api/device/device";

export default {
  name: "Version",
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
      // 软件版本表格数据
      versionList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 设备型号列表
      devModelList: [],
      // 文件类型列表
      typeOptions: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        softwareName: null,
        version: null,
        url: null,
        dtUpdate: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      // 是否显示上传对话框
      upd_open: false,
      // 上传表单参数
      uploadForm: {},
      // 上传文件列表
      uploadFileList: [],
      // 上传表单校验
      upd_rules: {
        // devName: [
        //   { required: true, message: "设备名称不能为空", trigger: "blur" },
        // ],
        type: [
          { required: true, message: "文件类型不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
    /** 查询设备型号列表 */
    listDevice(this.queryParams).then((response) => {
      this.devModelList = response.rows;
    });
  },
  methods: {
    /** 查询软件版本列表 */
    getList() {
      this.loading = true;
      listVersion(this.queryParams).then((response) => {
        this.versionList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      this.getDicts("up_file_type").then((response) => {
        this.typeOptions = response.data;
      });
    },
    // 文件类型字典翻译
    fileTypeFormat(row, column) {
      let dict = {
        'lan': '语言包',
        'up': '升级程序'
      }
      return dict[row.type]
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.upd_open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        softwareName: null,
        version: null,
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
      this.title = "添加软件版本";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getVersion(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改软件版本";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateVersion(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addVersion(this.form).then((response) => {
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
        .confirm('是否确认删除软件版本编号为"' + ids + '"的数据项？')
        .then(function () {
          return delVersion(ids);
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
        "device/version/export",
        {
          ...this.queryParams,
        },
        `version_${new Date().getTime()}.xlsx`
      );
    },
    // 文件预上传格式限制
    beforeUpload(file) {
      let isRightSize = file.size / 1024 / 1024 < 10;
      if (!isRightSize) {
        this.$message.error("文件大小超过 10MB");
      }
      return isRightSize;
    },
    // 文件移除时
    handleRemove(file, fileList) {
      this.uploadForm.uploadFileList = fileList;
    },
    // 文件改变时
    fileChange(file, fileList) {
      this.uploadForm.uploadFileList = fileList;
    },
    // 文件移除之前
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    /** 上传按钮操作 */
    handleUpload(row) {
      // TODO 定制一个上传对话框，可设置设备编号，可选文件类型
      this.upd_open = true;
      // this.uploadForm.devName = row.devName;
    },
    // 上传文件
    submitUploadForm() {
      this.$refs["uploadForm"].validate((valid) => {
        if (valid) {
          let formData = new FormData();
          // formData.append("devModel", this.uploadForm.devModel);
          formData.append("name", this.uploadForm.name);
          formData.append("type", this.uploadForm.type);
          formData.append("versionNum", this.uploadForm.versionNum);
          // 手动加入更新时间
          this.uploadForm.dtUpdate = new Date()
            .toLocaleDateString()
            .replaceAll("/", "-");
          formData.append("uploadFile", this.uploadForm.uploadFileList[0].raw);
          uploadVersionFile(formData).then((res) => {
            console.log(res);
            // this.open = false;
            this.$message.info("上传成功");
            //刷新table
            this.getList();
            this.uploadFileList = [];
          });
        } else {
          return;
        }
        this.upd_open = false;
        this.resetForm("uploadForm");
      });
    },
    handleDownload(row) {
      let fileName = row.name;
      let filePath = row.url;
      if (!fileName) return;
      // 将文件路径直接送给下载接口
      downloadVersionFile({ filePath: filePath }).then((res) => {
        console.log(res);
        let blob = new Blob([res], {
          type: "application/octet-stream",
        });
        var a = document.createElement("a");
        a.href = window.URL.createObjectURL(blob);
        const extension = fileName.substring(
          fileName.lastIndexOf("."),
          fileName.length
        );
        a.download =
          row.devName + "_" + this.businessTypeFormat(row) + extension;
        a.click();
        //释放内存
        window.URL.revokeObjectURL(a.href);
      });
    },
  },
};
</script>
