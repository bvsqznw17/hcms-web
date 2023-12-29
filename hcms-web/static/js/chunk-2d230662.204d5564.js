(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d230662"],{ebb1:function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"app-container"},[a("el-form",{directives:[{name:"show",rawName:"v-show",value:e.showSearch,expression:"showSearch"}],ref:"queryForm",attrs:{model:e.queryParams,size:"small",inline:!0,"label-width":"68px"}},[a("el-form-item",{attrs:{label:"操作人",prop:"operator"}},[a("el-input",{attrs:{placeholder:"请输入操作人",clearable:""},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.handleQuery(t)}},model:{value:e.queryParams.operator,callback:function(t){e.$set(e.queryParams,"operator",t)},expression:"queryParams.operator"}})],1),a("el-form-item",{attrs:{label:"设备编码",prop:"devName"}},[a("el-input",{attrs:{placeholder:"请输入设备编码",clearable:""},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.handleQuery(t)}},model:{value:e.queryParams.devName,callback:function(t){e.$set(e.queryParams,"devName",t)},expression:"queryParams.devName"}})],1),a("el-form-item",{attrs:{label:"设备型号",prop:"devModel"}},[a("el-input",{attrs:{placeholder:"请输入设备型号",clearable:""},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.handleQuery(t)}},model:{value:e.queryParams.devModel,callback:function(t){e.$set(e.queryParams,"devModel",t)},expression:"queryParams.devModel"}})],1),a("el-form-item",{attrs:{label:"参数名称",prop:"paramname"}},[a("el-input",{attrs:{placeholder:"请输入参数名称",clearable:""},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.handleQuery(t)}},model:{value:e.queryParams.paramname,callback:function(t){e.$set(e.queryParams,"paramname",t)},expression:"queryParams.paramname"}})],1),a("el-form-item",{attrs:{label:"参数值",prop:"paramvalue"}},[a("el-input",{attrs:{placeholder:"请输入参数值",clearable:""},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.handleQuery(t)}},model:{value:e.queryParams.paramvalue,callback:function(t){e.$set(e.queryParams,"paramvalue",t)},expression:"queryParams.paramvalue"}})],1),a("el-form-item",{attrs:{label:"更新时间",prop:"dtUpdate"}},[a("el-date-picker",{attrs:{clearable:"",type:"date","value-format":"yyyy-MM-dd",placeholder:"请选择更新时间"},model:{value:e.queryParams.dtUpdate,callback:function(t){e.$set(e.queryParams,"dtUpdate",t)},expression:"queryParams.dtUpdate"}})],1),a("el-form-item",[a("el-button",{attrs:{type:"primary",icon:"el-icon-search",size:"mini"},on:{click:e.handleQuery}},[e._v("搜索")]),a("el-button",{attrs:{icon:"el-icon-refresh",size:"mini"},on:{click:e.resetQuery}},[e._v("重置")])],1)],1),a("el-row",{staticClass:"mb8",attrs:{gutter:10}},[a("el-col",{attrs:{span:1.5}},[a("el-button",{directives:[{name:"hasPermi",rawName:"v-hasPermi",value:["system:devChangeLog:add"],expression:"['system:devChangeLog:add']"}],attrs:{type:"primary",plain:"",icon:"el-icon-plus",size:"mini"},on:{click:e.handleAdd}},[e._v("新增")])],1),a("el-col",{attrs:{span:1.5}},[a("el-button",{directives:[{name:"hasPermi",rawName:"v-hasPermi",value:["system:devChangeLog:edit"],expression:"['system:devChangeLog:edit']"}],attrs:{type:"success",plain:"",icon:"el-icon-edit",size:"mini",disabled:e.single},on:{click:e.handleUpdate}},[e._v("修改")])],1),a("el-col",{attrs:{span:1.5}},[a("el-button",{directives:[{name:"hasPermi",rawName:"v-hasPermi",value:["system:devChangeLog:remove"],expression:"['system:devChangeLog:remove']"}],attrs:{type:"danger",plain:"",icon:"el-icon-delete",size:"mini",disabled:e.multiple},on:{click:e.handleDelete}},[e._v("删除")])],1),a("el-col",{attrs:{span:1.5}},[a("el-button",{directives:[{name:"hasPermi",rawName:"v-hasPermi",value:["system:devChangeLog:export"],expression:"['system:devChangeLog:export']"}],attrs:{type:"warning",plain:"",icon:"el-icon-download",size:"mini"},on:{click:e.handleExport}},[e._v("导出")])],1),a("right-toolbar",{attrs:{showSearch:e.showSearch},on:{"update:showSearch":function(t){e.showSearch=t},"update:show-search":function(t){e.showSearch=t},queryTable:e.getList}})],1),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],attrs:{data:e.devChangeLogList},on:{"selection-change":e.handleSelectionChange}},[a("el-table-column",{attrs:{type:"selection",width:"55",align:"center"}}),a("el-table-column",{attrs:{label:"${comment}",align:"center",prop:"id"}}),a("el-table-column",{attrs:{label:"操作人",align:"center",prop:"operator"}}),a("el-table-column",{attrs:{label:"设备编码",align:"center",prop:"devName"}}),a("el-table-column",{attrs:{label:"设备型号",align:"center",prop:"devModel"}}),a("el-table-column",{attrs:{label:"参数名称",align:"center",prop:"paramname"}}),a("el-table-column",{attrs:{label:"参数值",align:"center",prop:"paramvalue"}}),a("el-table-column",{attrs:{label:"更新时间",align:"center",prop:"dtUpdate",width:"180"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(e.parseTime(t.row.dtUpdate,"{y}-{m}-{d}")))])]}}])}),a("el-table-column",{attrs:{label:"修改内容",align:"center",prop:"content"}}),a("el-table-column",{attrs:{label:"操作",align:"center","class-name":"small-padding fixed-width"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{directives:[{name:"hasPermi",rawName:"v-hasPermi",value:["system:devChangeLog:edit"],expression:"['system:devChangeLog:edit']"}],attrs:{size:"mini",type:"text",icon:"el-icon-edit"},on:{click:function(a){return e.handleUpdate(t.row)}}},[e._v("修改")]),a("el-button",{directives:[{name:"hasPermi",rawName:"v-hasPermi",value:["system:devChangeLog:remove"],expression:"['system:devChangeLog:remove']"}],attrs:{size:"mini",type:"text",icon:"el-icon-delete"},on:{click:function(a){return e.handleDelete(t.row)}}},[e._v("删除")])]}}])})],1),a("pagination",{directives:[{name:"show",rawName:"v-show",value:e.total>0,expression:"total>0"}],attrs:{total:e.total,page:e.queryParams.pageNum,limit:e.queryParams.pageSize},on:{"update:page":function(t){return e.$set(e.queryParams,"pageNum",t)},"update:limit":function(t){return e.$set(e.queryParams,"pageSize",t)},pagination:e.getList}}),a("el-dialog",{attrs:{title:e.title,visible:e.open,width:"500px","append-to-body":""},on:{"update:visible":function(t){e.open=t}}},[a("el-form",{ref:"form",attrs:{model:e.form,rules:e.rules,"label-width":"80px"}},[a("el-form-item",{attrs:{label:"操作人",prop:"operator"}},[a("el-input",{attrs:{placeholder:"请输入操作人"},model:{value:e.form.operator,callback:function(t){e.$set(e.form,"operator",t)},expression:"form.operator"}})],1),a("el-form-item",{attrs:{label:"设备编码",prop:"devName"}},[a("el-input",{attrs:{placeholder:"请输入设备编码"},model:{value:e.form.devName,callback:function(t){e.$set(e.form,"devName",t)},expression:"form.devName"}})],1),a("el-form-item",{attrs:{label:"设备型号",prop:"devModel"}},[a("el-input",{attrs:{placeholder:"请输入设备型号"},model:{value:e.form.devModel,callback:function(t){e.$set(e.form,"devModel",t)},expression:"form.devModel"}})],1),a("el-form-item",{attrs:{label:"参数名称",prop:"paramname"}},[a("el-input",{attrs:{placeholder:"请输入参数名称"},model:{value:e.form.paramname,callback:function(t){e.$set(e.form,"paramname",t)},expression:"form.paramname"}})],1),a("el-form-item",{attrs:{label:"参数值",prop:"paramvalue"}},[a("el-input",{attrs:{placeholder:"请输入参数值"},model:{value:e.form.paramvalue,callback:function(t){e.$set(e.form,"paramvalue",t)},expression:"form.paramvalue"}})],1),a("el-form-item",{attrs:{label:"更新时间",prop:"dtUpdate"}},[a("el-date-picker",{attrs:{clearable:"",type:"date","value-format":"yyyy-MM-dd",placeholder:"请选择更新时间"},model:{value:e.form.dtUpdate,callback:function(t){e.$set(e.form,"dtUpdate",t)},expression:"form.dtUpdate"}})],1),a("el-form-item",{attrs:{label:"修改内容"}},[a("editor",{attrs:{"min-height":192},model:{value:e.form.content,callback:function(t){e.$set(e.form,"content",t)},expression:"form.content"}})],1)],1),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{type:"primary"},on:{click:e.submitForm}},[e._v("确 定")]),a("el-button",{on:{click:e.cancel}},[e._v("取 消")])],1)],1)],1)},l=[],n=a("5530"),o=(a("d81d"),a("b775"));function i(e){return Object(o["a"])({url:"/statistic/devChangeLog/list",method:"get",params:e})}function s(e){return Object(o["a"])({url:"/statistic/devChangeLog/"+e,method:"get"})}function m(e){return Object(o["a"])({url:"/statistic/devChangeLog",method:"post",data:e})}function d(e){return Object(o["a"])({url:"/statistic/devChangeLog",method:"put",data:e})}function u(e){return Object(o["a"])({url:"/statistic/devChangeLog/"+e,method:"delete"})}var c={name:"DevChangeLog",data:function(){return{loading:!0,ids:[],single:!0,multiple:!0,showSearch:!0,total:0,devChangeLogList:[],title:"",open:!1,queryParams:{pageNum:1,pageSize:10,operator:null,devName:null,devModel:null,paramname:null,paramvalue:null,dtUpdate:null},form:{},rules:{}}},created:function(){this.getList()},methods:{getList:function(){var e=this;this.loading=!0,i(this.queryParams).then((function(t){e.devChangeLogList=t.rows,e.total=t.total,e.loading=!1}))},cancel:function(){this.open=!1,this.reset()},reset:function(){this.form={id:null,operator:null,devName:null,devModel:null,paramname:null,paramvalue:null,dtUpdate:null,content:null},this.resetForm("form")},handleQuery:function(){this.queryParams.pageNum=1,this.getList()},resetQuery:function(){this.resetForm("queryForm"),this.handleQuery()},handleSelectionChange:function(e){this.ids=e.map((function(e){return e.id})),this.single=1!==e.length,this.multiple=!e.length},handleAdd:function(){this.reset(),this.open=!0,this.title="添加设备参数修改日志"},handleUpdate:function(e){var t=this;this.reset();var a=e.id||this.ids;s(a).then((function(e){t.form=e.data,t.open=!0,t.title="修改设备参数修改日志"}))},submitForm:function(){var e=this;this.$refs["form"].validate((function(t){t&&(null!=e.form.id?d(e.form).then((function(t){e.$modal.msgSuccess("修改成功"),e.open=!1,e.getList()})):m(e.form).then((function(t){e.$modal.msgSuccess("新增成功"),e.open=!1,e.getList()})))}))},handleDelete:function(e){var t=this,a=e.id||this.ids;this.$modal.confirm('是否确认删除设备参数修改日志编号为"'+a+'"的数据项？').then((function(){return u(a)})).then((function(){t.getList(),t.$modal.msgSuccess("删除成功")})).catch((function(){}))},handleExport:function(){this.download("system/devChangeLog/export",Object(n["a"])({},this.queryParams),"devChangeLog_".concat((new Date).getTime(),".xlsx"))}}},p=c,h=a("2877"),v=Object(h["a"])(p,r,l,!1,null,null,null);t["default"]=v.exports}}]);