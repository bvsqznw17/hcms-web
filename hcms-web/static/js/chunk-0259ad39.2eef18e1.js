(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-0259ad39"],{"023f":function(e,t,a){"use strict";a.d(t,"d",(function(){return n})),a.d(t,"c",(function(){return o})),a.d(t,"a",(function(){return i})),a.d(t,"e",(function(){return l})),a.d(t,"b",(function(){return s}));var r=a("b775");function n(e){return Object(r["a"])({url:"/device/device/list",method:"get",params:e})}function o(e){return Object(r["a"])({url:"/device/device/"+e,method:"get"})}function i(e){return Object(r["a"])({url:"/device/device",method:"post",data:e})}function l(e){return Object(r["a"])({url:"/device/device",method:"put",data:e})}function s(e){return Object(r["a"])({url:"/device/device/"+e,method:"delete"})}},c403:function(e,t,a){"use strict";a.d(t,"e",(function(){return n})),a.d(t,"d",(function(){return o})),a.d(t,"a",(function(){return i})),a.d(t,"f",(function(){return l})),a.d(t,"b",(function(){return s})),a.d(t,"g",(function(){return u})),a.d(t,"c",(function(){return d}));var r=a("b775");function n(e){return Object(r["a"])({url:"/device/version/list",method:"get",params:e})}function o(e){return Object(r["a"])({url:"/device/version/"+e,method:"get"})}function i(e){return Object(r["a"])({url:"/device/version",method:"post",data:e})}function l(e){return Object(r["a"])({url:"/device/version",method:"put",data:e})}function s(e){return Object(r["a"])({url:"/device/version/"+e,method:"delete"})}function u(e){return Object(r["a"])({url:"/device/version/uploadVersionFile",method:"post",timeout:0,data:e})}function d(e){return Object(r["a"])({url:"/device/version/downloadVersionFile",method:"get",params:e,responseType:"blob"})}},e96f:function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"app-container"},[a("el-form",{directives:[{name:"show",rawName:"v-show",value:e.showSearch,expression:"showSearch"}],ref:"queryForm",attrs:{model:e.queryParams,size:"small",inline:!0,"label-width":"68px"}},[a("el-form-item",{attrs:{label:"软件名称",prop:"softwareName"}},[a("el-input",{attrs:{placeholder:"请输入软件名称",clearable:""},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.handleQuery(t)}},model:{value:e.queryParams.softwareName,callback:function(t){e.$set(e.queryParams,"softwareName",t)},expression:"queryParams.softwareName"}})],1),a("el-form-item",{attrs:{label:"版本",prop:"version"}},[a("el-input",{attrs:{placeholder:"请输入版本",clearable:""},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.handleQuery(t)}},model:{value:e.queryParams.version,callback:function(t){e.$set(e.queryParams,"version",t)},expression:"queryParams.version"}})],1),a("el-form-item",{attrs:{label:"更新时间",prop:"dtUpdate"}},[a("el-date-picker",{attrs:{clearable:"",type:"date","value-format":"yyyy-MM-dd",placeholder:"请选择更新时间"},model:{value:e.queryParams.dtUpdate,callback:function(t){e.$set(e.queryParams,"dtUpdate",t)},expression:"queryParams.dtUpdate"}})],1),a("el-form-item",[a("el-button",{attrs:{type:"primary",icon:"el-icon-search",size:"mini"},on:{click:e.handleQuery}},[e._v("搜索")]),a("el-button",{attrs:{icon:"el-icon-refresh",size:"mini"},on:{click:e.resetQuery}},[e._v("重置")])],1)],1),a("el-row",{staticClass:"mb8",attrs:{gutter:10}},[a("el-col",{attrs:{span:1.5}},[a("el-button",{directives:[{name:"hasPermi",rawName:"v-hasPermi",value:["device:version:add"],expression:"['device:version:add']"}],attrs:{type:"primary",plain:"",icon:"el-icon-plus",size:"mini"},on:{click:e.handleAdd}},[e._v("新增")])],1),a("el-col",{attrs:{span:1.5}},[a("el-button",{directives:[{name:"hasPermi",rawName:"v-hasPermi",value:["device:version:edit"],expression:"['device:version:edit']"}],attrs:{type:"success",plain:"",icon:"el-icon-edit",size:"mini",disabled:e.single},on:{click:e.handleUpdate}},[e._v("修改")])],1),a("el-col",{attrs:{span:1.5}},[a("el-button",{directives:[{name:"hasPermi",rawName:"v-hasPermi",value:["device:version:remove"],expression:"['device:version:remove']"}],attrs:{type:"danger",plain:"",icon:"el-icon-delete",size:"mini",disabled:e.multiple},on:{click:e.handleDelete}},[e._v("删除")])],1),a("el-col",{attrs:{span:1.5}},[a("el-button",{directives:[{name:"hasPermi",rawName:"v-hasPermi",value:["device:version:export"],expression:"['device:version:export']"}],attrs:{type:"warning",plain:"",icon:"el-icon-download",size:"mini"},on:{click:e.handleExport}},[e._v("导出")])],1),a("el-col",{attrs:{span:1.5}},[a("el-button",{directives:[{name:"hasPermi",rawName:"v-hasPermi",value:["device:version:update"],expression:"['device:version:update']"}],attrs:{type:"primary",plain:"",icon:"el-icon-upload",size:"mini"},on:{click:e.handleUpload}},[e._v("上传")])],1),a("right-toolbar",{attrs:{showSearch:e.showSearch},on:{"update:showSearch":function(t){e.showSearch=t},"update:show-search":function(t){e.showSearch=t},queryTable:e.getList}})],1),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],attrs:{data:e.versionList},on:{"selection-change":e.handleSelectionChange}},[a("el-table-column",{attrs:{type:"selection",width:"55",align:"center"}}),a("el-table-column",{attrs:{label:"软件类型",align:"center",prop:"type",formatter:e.fileTypeFormat}}),a("el-table-column",{attrs:{label:"软件名称",align:"center",prop:"name"}}),a("el-table-column",{attrs:{label:"版本",align:"center",prop:"version"}}),a("el-table-column",{attrs:{label:"更新时间",align:"center",prop:"dtUpdate",width:"180"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(e.parseTime(t.row.dtUpdate)))])]}}])}),a("el-table-column",{attrs:{label:"操作",align:"center","class-name":"small-padding fixed-width"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{directives:[{name:"hasPermi",rawName:"v-hasPermi",value:["device:version:edit"],expression:"['device:version:edit']"}],attrs:{size:"mini",type:"text",icon:"el-icon-edit"},on:{click:function(a){return e.handleUpdate(t.row)}}},[e._v("修改")]),a("el-button",{directives:[{name:"hasPermi",rawName:"v-hasPermi",value:["device:version:remove"],expression:"['device:version:remove']"}],attrs:{size:"mini",type:"text",icon:"el-icon-delete"},on:{click:function(a){return e.handleDelete(t.row)}}},[e._v("删除")])]}}])})],1),a("pagination",{directives:[{name:"show",rawName:"v-show",value:e.total>0,expression:"total > 0"}],attrs:{total:e.total,page:e.queryParams.pageNum,limit:e.queryParams.pageSize},on:{"update:page":function(t){return e.$set(e.queryParams,"pageNum",t)},"update:limit":function(t){return e.$set(e.queryParams,"pageSize",t)},pagination:e.getList}}),a("el-dialog",{attrs:{title:e.title,visible:e.open,width:"500px","append-to-body":""},on:{"update:visible":function(t){e.open=t}}},[a("el-form",{ref:"form",attrs:{model:e.form,rules:e.rules,"label-width":"80px"}},[a("el-form-item",{attrs:{label:"软件名称",prop:"softwareName"}},[a("el-input",{attrs:{placeholder:"请输入软件名称"},model:{value:e.form.name,callback:function(t){e.$set(e.form,"name",t)},expression:"form.name"}})],1),a("el-form-item",{attrs:{label:"版本号",prop:"version"}},[a("el-input",{attrs:{placeholder:"请输入版本号"},model:{value:e.form.version,callback:function(t){e.$set(e.form,"version",t)},expression:"form.version"}})],1),a("el-form-item",{attrs:{label:"下载地址",prop:"url"}},[a("el-input",{attrs:{placeholder:"请输入下载地址"},model:{value:e.form.url,callback:function(t){e.$set(e.form,"url",t)},expression:"form.url"}})],1),a("el-form-item",{attrs:{label:"更新时间",prop:"dtUpdate"}},[a("el-date-picker",{attrs:{clearable:"",type:"date","value-format":"yyyy-MM-dd",placeholder:"请选择更新时间"},model:{value:e.form.dtUpdate,callback:function(t){e.$set(e.form,"dtUpdate",t)},expression:"form.dtUpdate"}})],1)],1),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{type:"primary"},on:{click:e.submitForm}},[e._v("确 定")]),a("el-button",{on:{click:e.cancel}},[e._v("取 消")])],1)],1),a("el-dialog",{attrs:{title:e.title,visible:e.upd_open,width:"500px","append-to-body":""},on:{"update:visible":function(t){e.upd_open=t}}},[a("el-form",{ref:"uploadForm",attrs:{model:e.uploadForm,rules:e.upd_rules,"label-width":"80px"}},[a("el-form-item",{attrs:{label:"文件类型",prop:"type"}},[a("el-select",{attrs:{placeholder:"请选择文件类型"},model:{value:e.uploadForm.type,callback:function(t){e.$set(e.uploadForm,"type",t)},expression:"uploadForm.type"}},e._l(e.typeOptions,(function(e){return a("el-option",{key:e.dictValue,attrs:{label:e.dictLabel,value:e.dictValue}})})),1)],1),a("el-form-item",{attrs:{label:"软件名称",prop:"softwareName"}},[a("el-input",{attrs:{placeholder:"请输入软件名称"},model:{value:e.uploadForm.name,callback:function(t){e.$set(e.uploadForm,"name",t)},expression:"uploadForm.name"}})],1),a("el-form-item",{attrs:{label:"版本号",prop:"versionNum"}},[a("el-input",{attrs:{placeholder:"请输入版本号"},model:{value:e.uploadForm.versionNum,callback:function(t){e.$set(e.uploadForm,"versionNum",t)},expression:"uploadForm.versionNum"}})],1),a("el-form-item",{attrs:{label:"上传文件",prop:"uploadFileList"}},[a("el-upload",{ref:"uploadFile",attrs:{action:"",multiple:"","before-upload":e.beforeUpload,"on-remove":e.handleRemove,"on-change":e.fileChange,"before-remove":e.beforeRemove,"auto-upload":!1,"file-list":e.uploadFileList}},[a("el-button",{attrs:{size:"small",type:"primary",icon:"el-icon-upload"}},[e._v("点击上传")])],1)],1)],1),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{type:"primary"},on:{click:e.submitUploadForm}},[e._v("确 定")]),a("el-button",{on:{click:e.cancel}},[e._v("取 消")])],1)],1)],1)},n=[],o=a("5530"),i=(a("d81d"),a("b0c0"),a("ac1f"),a("5319"),a("5b81"),a("d3b7"),a("3ca3"),a("ddb0"),a("2b3d"),a("9861"),a("c403")),l=a("023f"),s={name:"Version",data:function(){return{loading:!0,ids:[],single:!0,multiple:!0,showSearch:!0,total:0,versionList:[],title:"",open:!1,devModelList:[],typeOptions:{},queryParams:{pageNum:1,pageSize:10,softwareName:null,version:null,url:null,dtUpdate:null},form:{},rules:{},upd_open:!1,uploadForm:{},uploadFileList:[],upd_rules:{type:[{required:!0,message:"文件类型不能为空",trigger:"blur"}]}}},created:function(){var e=this;this.getList(),Object(l["d"])(this.queryParams).then((function(t){e.devModelList=t.rows}))},methods:{getList:function(){var e=this;this.loading=!0,Object(i["e"])(this.queryParams).then((function(t){e.versionList=t.rows,e.total=t.total,e.loading=!1})),this.getDicts("up_file_type").then((function(t){e.typeOptions=t.data}))},fileTypeFormat:function(e,t){var a={lan:"语言包",up:"升级程序"};return a[e.type]},cancel:function(){this.open=!1,this.upd_open=!1,this.reset()},reset:function(){this.form={id:null,softwareName:null,version:null,url:null,dtUpdate:null},this.resetForm("form")},handleQuery:function(){this.queryParams.pageNum=1,this.getList()},resetQuery:function(){this.resetForm("queryForm"),this.handleQuery()},handleSelectionChange:function(e){this.ids=e.map((function(e){return e.id})),this.single=1!==e.length,this.multiple=!e.length},handleAdd:function(){this.reset(),this.open=!0,this.title="添加软件版本"},handleUpdate:function(e){var t=this;this.reset();var a=e.id||this.ids;Object(i["d"])(a).then((function(e){t.form=e.data,t.open=!0,t.title="修改软件版本"}))},submitForm:function(){var e=this;this.$refs["form"].validate((function(t){t&&(null!=e.form.id?Object(i["f"])(e.form).then((function(t){e.$modal.msgSuccess("修改成功"),e.open=!1,e.getList()})):Object(i["a"])(e.form).then((function(t){e.$modal.msgSuccess("新增成功"),e.open=!1,e.getList()})))}))},handleDelete:function(e){var t=this,a=e.id||this.ids;this.$modal.confirm('是否确认删除软件版本编号为"'+a+'"的数据项？').then((function(){return Object(i["b"])(a)})).then((function(){t.getList(),t.$modal.msgSuccess("删除成功")})).catch((function(){}))},handleExport:function(){this.download("device/version/export",Object(o["a"])({},this.queryParams),"version_".concat((new Date).getTime(),".xlsx"))},beforeUpload:function(e){var t=e.size/1024/1024<10;return t||this.$message.error("文件大小超过 10MB"),t},handleRemove:function(e,t){this.uploadForm.uploadFileList=t},fileChange:function(e,t){this.uploadForm.uploadFileList=t},beforeRemove:function(e,t){return this.$confirm("确定移除 ".concat(e.name,"？"))},handleUpload:function(e){this.upd_open=!0},submitUploadForm:function(){var e=this;this.$refs["uploadForm"].validate((function(t){if(t){var a=new FormData;a.append("name",e.uploadForm.name),a.append("type",e.uploadForm.type),a.append("versionNum",e.uploadForm.versionNum),e.uploadForm.dtUpdate=(new Date).toLocaleDateString().replaceAll("/","-"),a.append("uploadFile",e.uploadForm.uploadFileList[0].raw),Object(i["g"])(a).then((function(t){console.log(t),e.$message.info("上传成功"),e.getList(),e.uploadFileList=[]})),e.upd_open=!1,e.resetForm("uploadForm")}}))},handleDownload:function(e){var t=this,a=e.name,r=e.url;a&&Object(i["c"])({filePath:r}).then((function(r){console.log(r);var n=new Blob([r],{type:"application/octet-stream"}),o=document.createElement("a");o.href=window.URL.createObjectURL(n);var i=a.substring(a.lastIndexOf("."),a.length);o.download=e.devName+"_"+t.businessTypeFormat(e)+i,o.click(),window.URL.revokeObjectURL(o.href)}))}}},u=s,d=a("2877"),c=Object(d["a"])(u,r,n,!1,null,null,null);t["default"]=c.exports}}]);