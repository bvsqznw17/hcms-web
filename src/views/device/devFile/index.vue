<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <!-- <el-form-item label="设备名称" prop="devName">
        <el-input
          v-model="queryParams.devName"
          placeholder="请输入设备名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="设备型号" prop="type">
        <el-select v-model="queryParams.devModel" placeholder="请选择设备型号">
          <el-option
            v-for="dict in devModelList"
            :key="dict.devModel"
            :label="dict.devModel"
            :value="dict.devModel"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文件类型" prop="businessType">
        <el-select
          v-model="queryParams.businessType"
          placeholder="请选择文件类型"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in businessTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="文件类型" prop="fileType">
        <el-select
          v-model="queryParams.fileType"
          placeholder="请选择文件类型"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in mediaTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item> -->
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
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['device:devFile:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-upload"
          size="mini"
          @click="handleUpload"
          v-hasPermi="['device:devFile:update']"
          >上传</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleBatchDownload"
          v-hasPermi="['device:devFile:download']"
          >打包下载</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="devFileList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="文件路径" align="center" prop="id" /> -->
      <!-- <el-table-column label="设备名称" align="center" prop="devName" /> -->
      <el-table-column label="设备型号" align="center" prop="devModel" />
      <el-table-column
        label="业务类型"
        align="center"
        prop="businessType"
        :formatter="businessTypeFormat"
      />
      <el-table-column label="上传时间" align="center" prop="uploadTime" />
      <el-table-column label="文件名" align="center" prop="fileName" />
      <!-- <el-table-column label="文件路径" align="center" prop="filePath" /> -->
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
            @click="handleDownload(scope.row)"
            v-hasPermi="['device:devFile:download']"
            >下载</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['device:devFile:remove']"
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
        <!-- <el-form-item label="设备名称" prop="devName">
          <el-input v-model="uploadForm.devName" placeholder="请输入设备名称" />
        </el-form-item> -->
        <el-form-item label="设备型号" prop="type">
          <el-select v-model="uploadForm.devModel" placeholder="请选择设备型号">
            <el-option
              v-for="dict in devModelList"
              :key="dict.devModel"
              :label="dict.devModel"
              :value="dict.devModel"
            ></el-option>
          </el-select>
        </el-form-item>
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
  listDevFile,
  getDevFile,
  delDevFile,
  addDevFile,
  updateDevFile,
  exportDevFile,
  downloadDevFile,
  batchDownloadDevFile,
  uploadDevFile,
} from "@/api/device/devFile";
import { listDevice } from "@/api/device/device";

export default {
  name: "DevFile",
  components: {},
  data() {
    return {
      // 遮罩层
      loading: true,
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
      // 设备文件表格数据
      devFileList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示上传对话框
      upd_open: false,
      // 业务类型字典
      businessTypeOptions: [],
      // 富媒体类型字典
      mediaTypeOptions: [],
      // 设备文件类型字典
      typeOptions: [],
      // 设备型号列表
      devModelList: [],
      // 上传文件列表
      uploadFileList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        // devName: null,
        devModel: null,
        businessType: null,
        fileName: null,
        filePath: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        businessType: [
          { required: true, message: "业务类型不能为空", trigger: "change" },
        ],
        fileName: [
          { required: true, message: "文件名不能为空", trigger: "blur" },
        ],
        filePath: [
          { required: true, message: "文件路径不能为空", trigger: "blur" },
        ],
      },
      // 上传表单参数
      uploadForm: {},
      // 表单校验
      rules: {},
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
    this.getDicts("file_business_type").then((response) => {
      this.businessTypeOptions = response.data;
    });
    this.getDicts("media_type").then((response) => {
      this.mediaTypeOptions = response.data;
    });
    this.getDicts("dev_file_type").then((response) => {
      this.typeOptions = response.data;
    });
    /** 查询设备型号列表 */
    listDevice(this.queryParams).then((response) => {
      this.devModelList = response.rows;
    });
  },
  methods: {
    /** 查询设备文件列表 */
    getList() {
      this.loading = true;
      listDevFile(this.queryParams).then((response) => {
        this.devFileList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 业务类型字典翻译
    businessTypeFormat(row, column) {
      return this.selectDictLabel(this.businessTypeOptions, row.businessType);
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
        devName: null,
        businessType: null,
        fileType: null,
        fileName: null,
        filePath: null,
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
      this.title = "添加设备文件";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getDevFile(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改设备文件";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateDevFile(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDevFile(this.form).then((response) => {
              this.msgSuccess("新增成功");
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
      this.$confirm(
        '是否确认删除设备文件编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delDevFile(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 打包下载按钮操作 */
    handleBatchDownload(row) {
      const ids = row.id || this.ids;
      console.log(ids);
      batchDownloadDevFile(ids).then((res) => {
        if (res.size <= 500) {
          this.msgError("没有可供下载的文件！");
          return;
        }
        let blob = new Blob([res], {
          type: "application/octet-stream",
        });
        let fileName = "视频照片" + new Date().getTime() + ".zip";
        var a = document.createElement("a");
        a.href = window.URL.createObjectURL(blob);
        a.download = fileName;
        a.click();
        //释放内存
        window.URL.revokeObjectURL(a.href);
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有设备文件数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.exportLoading = true;
          return exportDevFile(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
          this.exportLoading = false;
        });
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
          // formData.append("devName", this.uploadForm.devName);
          formData.append("devModel", this.uploadForm.devModel);
          formData.append("type", this.uploadForm.type);
          // 手动加入更新时间
          this.uploadForm.dtUpdate = new Date()
            .toLocaleDateString()
            .replaceAll("/", "-");
          formData.append("dtUpdate", this.uploadForm.dtUpdate);
          formData.append("uploadFile", this.uploadForm.uploadFileList[0].raw);
          uploadDevFile(formData).then((res) => {
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
      let fileName = row.fileName;
      let filePath = row.filePath;
      if (!fileName) return;
      // 将文件路径直接送给下载接口
      downloadDevFile({ filePath: filePath }).then((res) => {
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