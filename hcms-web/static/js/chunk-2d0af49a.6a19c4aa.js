(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0af49a"],{"0e4c":function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"app-container"},[a("el-form",{directives:[{name:"show",rawName:"v-show",value:e.showSearch,expression:"showSearch"}],ref:"queryForm",attrs:{model:e.queryParams,size:"small",inline:!0,"label-width":"68px"}},[a("el-form-item",{attrs:{label:"设备名称",prop:"devName"}},[a("el-input",{attrs:{placeholder:"请输入设备名称",clearable:""},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.handleQuery(t)}},model:{value:e.queryParams.devName,callback:function(t){e.$set(e.queryParams,"devName",t)},expression:"queryParams.devName"}})],1),a("el-form-item",{attrs:{label:"ip地址",prop:"ip"}},[a("el-input",{attrs:{placeholder:"请输入ip地址",clearable:""},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.handleQuery(t)}},model:{value:e.queryParams.ip,callback:function(t){e.$set(e.queryParams,"ip",t)},expression:"queryParams.ip"}})],1),a("el-form-item",{attrs:{label:"端口",prop:"port"}},[a("el-input",{attrs:{placeholder:"请输入端口",clearable:""},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.handleQuery(t)}},model:{value:e.queryParams.port,callback:function(t){e.$set(e.queryParams,"port",t)},expression:"queryParams.port"}})],1),a("el-form-item",{attrs:{label:"更新时间",prop:"dtUpdate"}},[a("el-date-picker",{attrs:{clearable:"",type:"date","value-format":"yyyy-MM-dd",placeholder:"请选择更新时间"},model:{value:e.queryParams.dtUpdate,callback:function(t){e.$set(e.queryParams,"dtUpdate",t)},expression:"queryParams.dtUpdate"}})],1),a("el-form-item",[a("el-button",{attrs:{type:"primary",icon:"el-icon-search",size:"mini"},on:{click:e.handleQuery}},[e._v("搜索")]),a("el-button",{attrs:{icon:"el-icon-refresh",size:"mini"},on:{click:e.resetQuery}},[e._v("重置")])],1)],1),a("el-row",{staticClass:"mb8",attrs:{gutter:10}},[a("el-col",{attrs:{span:1.5}},[a("el-button",{directives:[{name:"hasPermi",rawName:"v-hasPermi",value:["device:devMsg:add"],expression:"['device:devMsg:add']"}],attrs:{type:"primary",plain:"",icon:"el-icon-plus",size:"mini"},on:{click:e.handleAdd}},[e._v("新增")])],1),a("el-col",{attrs:{span:1.5}},[a("el-button",{directives:[{name:"hasPermi",rawName:"v-hasPermi",value:["device:devMsg:edit"],expression:"['device:devMsg:edit']"}],attrs:{type:"success",plain:"",icon:"el-icon-edit",size:"mini",disabled:e.single},on:{click:e.handleUpdate}},[e._v("修改")])],1),a("el-col",{attrs:{span:1.5}},[a("el-button",{directives:[{name:"hasPermi",rawName:"v-hasPermi",value:["device:devMsg:remove"],expression:"['device:devMsg:remove']"}],attrs:{type:"danger",plain:"",icon:"el-icon-delete",size:"mini",disabled:e.multiple},on:{click:e.handleDelete}},[e._v("删除")])],1),a("el-col",{attrs:{span:1.5}},[a("el-button",{directives:[{name:"hasPermi",rawName:"v-hasPermi",value:["device:devMsg:export"],expression:"['device:devMsg:export']"}],attrs:{type:"warning",plain:"",icon:"el-icon-download",size:"mini"},on:{click:e.handleExport}},[e._v("导出")])],1),a("right-toolbar",{attrs:{showSearch:e.showSearch},on:{"update:showSearch":function(t){e.showSearch=t},"update:show-search":function(t){e.showSearch=t},queryTable:e.getList}})],1),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],attrs:{data:e.devMsgList},on:{"selection-change":e.handleSelectionChange}},[a("el-table-column",{attrs:{type:"selection",width:"55",align:"center"}}),a("el-table-column",{attrs:{label:"设备名称",align:"center",prop:"devName"}}),a("el-table-column",{attrs:{label:"ip地址",align:"center",prop:"ip"}}),a("el-table-column",{attrs:{label:"端口",align:"center",prop:"port"}}),a("el-table-column",{attrs:{label:"地区",align:"center",prop:"area"}}),a("el-table-column",{attrs:{label:"通信状态",align:"center",prop:"status"}}),a("el-table-column",{attrs:{label:"创建时间",align:"center",prop:"dtCreate",width:"180"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(e.parseTime(t.row.dtCreate,"{y}-{m}-{d}")))])]}}])}),a("el-table-column",{attrs:{label:"更新时间",align:"center",prop:"dtUpdate",width:"180"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(e.parseTime(t.row.dtUpdate,"{y}-{m}-{d}")))])]}}])}),a("el-table-column",{attrs:{label:"注释",align:"center",prop:"comment"}}),a("el-table-column",{attrs:{label:"操作",align:"center","class-name":"small-padding fixed-width"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{directives:[{name:"hasPermi",rawName:"v-hasPermi",value:["device:devMsg:edit"],expression:"['device:devMsg:edit']"}],attrs:{size:"mini",type:"text",icon:"el-icon-edit"},on:{click:function(a){return e.handleUpdate(t.row)}}},[e._v("修改")]),a("el-button",{directives:[{name:"hasPermi",rawName:"v-hasPermi",value:["device:devMsg:remove"],expression:"['device:devMsg:remove']"}],attrs:{size:"mini",type:"text",icon:"el-icon-delete"},on:{click:function(a){return e.handleDelete(t.row)}}},[e._v("删除")])]}}])})],1),a("pagination",{directives:[{name:"show",rawName:"v-show",value:e.total>0,expression:"total>0"}],attrs:{total:e.total,page:e.queryParams.pageNum,limit:e.queryParams.pageSize},on:{"update:page":function(t){return e.$set(e.queryParams,"pageNum",t)},"update:limit":function(t){return e.$set(e.queryParams,"pageSize",t)},pagination:e.getList}}),a("el-dialog",{attrs:{title:e.title,visible:e.open,width:"500px","append-to-body":""},on:{"update:visible":function(t){e.open=t}}},[a("el-form",{ref:"form",attrs:{model:e.form,rules:e.rules,"label-width":"80px"}},[a("el-form-item",{attrs:{label:"名称",prop:"devName"}},[a("el-input",{attrs:{placeholder:"请输入名称"},model:{value:e.form.devName,callback:function(t){e.$set(e.form,"devName",t)},expression:"form.devName"}})],1),a("el-form-item",{attrs:{label:"ip地址",prop:"ip"}},[a("el-input",{attrs:{placeholder:"请输入ip地址"},model:{value:e.form.ip,callback:function(t){e.$set(e.form,"ip",t)},expression:"form.ip"}})],1),a("el-form-item",{attrs:{label:"端口",prop:"port"}},[a("el-input",{attrs:{placeholder:"请输入端口"},model:{value:e.form.port,callback:function(t){e.$set(e.form,"port",t)},expression:"form.port"}})],1),a("el-form-item",{attrs:{label:"地区",prop:"area"}},[a("el-input",{attrs:{placeholder:"请输入地区"},model:{value:e.form.area,callback:function(t){e.$set(e.form,"area",t)},expression:"form.area"}})],1),a("el-form-item",{attrs:{label:"注释",prop:"comment"}},[a("el-input",{attrs:{placeholder:"请输入注释"},model:{value:e.form.comment,callback:function(t){e.$set(e.form,"comment",t)},expression:"form.comment"}})],1)],1),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{type:"primary"},on:{click:e.submitForm}},[e._v("确 定")]),a("el-button",{on:{click:e.cancel}},[e._v("取 消")])],1)],1)],1)},n=[],l=a("5530"),i=(a("d81d"),a("b775"));function o(e){return Object(i["a"])({url:"/device/devMsg/list",method:"get",params:e})}function s(e){return Object(i["a"])({url:"/device/devMsg/"+e,method:"get"})}function c(e){return Object(i["a"])({url:"/device/devMsg",method:"post",data:e})}function d(e){return Object(i["a"])({url:"/device/devMsg",method:"put",data:e})}function u(e){return Object(i["a"])({url:"/device/devMsg/"+e,method:"delete"})}var m={name:"DevMsg",data:function(){return{loading:!0,ids:[],single:!0,multiple:!0,showSearch:!0,total:0,devMsgList:[],title:"",open:!1,queryParams:{pageNum:1,pageSize:10,devName:null,ip:null,port:null,dtUpdate:null},form:{},rules:{}}},created:function(){this.getList()},methods:{getList:function(){var e=this;this.loading=!0,o(this.queryParams).then((function(t){e.devMsgList=t.rows,e.total=t.total,e.loading=!1}))},cancel:function(){this.open=!1,this.reset()},reset:function(){this.form={id:null,devName:null,ip:null,port:null,area:null,status:0,dtCreate:null,dtUpdate:null,comment:null},this.resetForm("form")},handleQuery:function(){this.queryParams.pageNum=1,this.getList()},resetQuery:function(){this.resetForm("queryForm"),this.handleQuery()},handleSelectionChange:function(e){this.ids=e.map((function(e){return e.id})),this.single=1!==e.length,this.multiple=!e.length},handleAdd:function(){this.reset(),this.open=!0,this.title="添加设备信息"},handleUpdate:function(e){var t=this;this.reset();var a=e.id||this.ids;s(a).then((function(e){t.form=e.data,t.open=!0,t.title="修改设备信息"}))},submitForm:function(){var e=this;this.$refs["form"].validate((function(t){t&&(null!=e.form.id?d(e.form).then((function(t){e.$modal.msgSuccess("修改成功"),e.open=!1,e.getList()})):c(e.form).then((function(t){e.$modal.msgSuccess("新增成功"),e.open=!1,e.getList()})))}))},handleDelete:function(e){var t=this,a=e.id||this.ids;this.$modal.confirm('是否确认删除设备信息编号为"'+a+'"的数据项？').then((function(){return u(a)})).then((function(){t.getList(),t.$modal.msgSuccess("删除成功")})).catch((function(){}))},handleExport:function(){this.download("device/devMsg/export",Object(l["a"])({},this.queryParams),"devMsg_".concat((new Date).getTime(),".xlsx"))}}},p=m,v=a("2877"),h=Object(v["a"])(p,r,n,!1,null,null,null);t["default"]=h.exports}}]);