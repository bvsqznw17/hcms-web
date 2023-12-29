(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-97316d22"],{"8a05":function(e,t,n){"use strict";n.r(t);var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"app-container"},[n("el-form",{directives:[{name:"show",rawName:"v-show",value:e.showSearch,expression:"showSearch"}],ref:"queryForm",attrs:{model:e.queryParams,size:"small",inline:!0,"label-width":"68px"}},[n("el-form-item",{attrs:{label:"软件名称",prop:"name"}},[n("el-input",{attrs:{placeholder:"请输入软件名称",clearable:""},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.handleQuery(t)}},model:{value:e.queryParams.name,callback:function(t){e.$set(e.queryParams,"name",t)},expression:"queryParams.name"}})],1),n("el-form-item",{attrs:{label:"当前版本",prop:"version"}},[n("el-input",{attrs:{placeholder:"请输入当前版本",clearable:""},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.handleQuery(t)}},model:{value:e.queryParams.version,callback:function(t){e.$set(e.queryParams,"version",t)},expression:"queryParams.version"}})],1),n("el-form-item",{attrs:{label:"更新时间",prop:"dtUpdate"}},[n("el-date-picker",{attrs:{clearable:"",type:"date","value-format":"yyyy-MM-dd",placeholder:"请选择更新时间"},model:{value:e.queryParams.dtUpdate,callback:function(t){e.$set(e.queryParams,"dtUpdate",t)},expression:"queryParams.dtUpdate"}})],1),n("el-form-item",[n("el-button",{attrs:{type:"primary",icon:"el-icon-search",size:"mini"},on:{click:e.handleQuery}},[e._v("搜索")]),n("el-button",{attrs:{icon:"el-icon-refresh",size:"mini"},on:{click:e.resetQuery}},[e._v("重置")])],1)],1),n("el-row",{staticClass:"mb8",attrs:{gutter:10}},[n("el-col",{attrs:{span:1.5}},[n("el-button",{directives:[{name:"hasPermi",rawName:"v-hasPermi",value:["device:upgrade:add"],expression:"['device:upgrade:add']"}],attrs:{type:"primary",plain:"",icon:"el-icon-plus",size:"mini"},on:{click:e.handleAdd}},[e._v("新增")])],1),n("el-col",{attrs:{span:1.5}},[n("el-button",{directives:[{name:"hasPermi",rawName:"v-hasPermi",value:["device:upgrade:edit"],expression:"['device:upgrade:edit']"}],attrs:{type:"success",plain:"",icon:"el-icon-edit",size:"mini",disabled:e.single},on:{click:e.handleUpdate}},[e._v("修改")])],1),n("el-col",{attrs:{span:1.5}},[n("el-button",{directives:[{name:"hasPermi",rawName:"v-hasPermi",value:["device:upgrade:remove"],expression:"['device:upgrade:remove']"}],attrs:{type:"danger",plain:"",icon:"el-icon-delete",size:"mini",disabled:e.multiple},on:{click:e.handleDelete}},[e._v("删除")])],1),n("el-col",{attrs:{span:1.5}},[n("el-button",{directives:[{name:"hasPermi",rawName:"v-hasPermi",value:["device:upgrade:export"],expression:"['device:upgrade:export']"}],attrs:{type:"warning",plain:"",icon:"el-icon-download",size:"mini"},on:{click:e.handleExport}},[e._v("导出")])],1),n("right-toolbar",{attrs:{showSearch:e.showSearch},on:{"update:showSearch":function(t){e.showSearch=t},"update:show-search":function(t){e.showSearch=t},queryTable:e.getList}})],1),n("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],attrs:{data:e.upgradeList},on:{"selection-change":e.handleSelectionChange}},[n("el-table-column",{attrs:{type:"selection",width:"55",align:"center"}}),n("el-table-column",{attrs:{label:"设备名称",align:"center",prop:"devName"}}),n("el-table-column",{attrs:{label:"软件名称",align:"center",prop:"name"}}),n("el-table-column",{attrs:{label:"当前版本",align:"center",prop:"version"}}),n("el-table-column",{attrs:{label:"更新时间",align:"center",prop:"dtUpdate",width:"180"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",[e._v(e._s(e.parseTime(t.row.dtUpdate,"{y}-{m}-{d}")))])]}}])}),n("el-table-column",{attrs:{label:"操作",align:"center","class-name":"small-padding fixed-width"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("el-button",{directives:[{name:"hasPermi",rawName:"v-hasPermi",value:["device:upgrade:edit"],expression:"['device:upgrade:edit']"}],attrs:{size:"mini",type:"text",icon:"el-icon-edit"},on:{click:function(n){return e.handleUpdate(t.row)}}},[e._v("修改")]),n("el-button",{directives:[{name:"hasPermi",rawName:"v-hasPermi",value:["device:upgrade:remove"],expression:"['device:upgrade:remove']"}],attrs:{size:"mini",type:"text",icon:"el-icon-delete"},on:{click:function(n){return e.handleDelete(t.row)}}},[e._v("删除")]),n("el-button",{directives:[{name:"hasPermi",rawName:"v-hasPermi",value:["device:upgrade:edit"],expression:"['device:upgrade:edit']"}],attrs:{size:"mini",type:"text",icon:"el-icon-upload"},on:{click:function(n){return e.handleUpgrade(t.row)}}},[e._v("升级")])]}}])})],1),n("pagination",{directives:[{name:"show",rawName:"v-show",value:e.total>0,expression:"total > 0"}],attrs:{total:e.total,page:e.queryParams.pageNum,limit:e.queryParams.pageSize},on:{"update:page":function(t){return e.$set(e.queryParams,"pageNum",t)},"update:limit":function(t){return e.$set(e.queryParams,"pageSize",t)},pagination:e.getList}}),n("el-dialog",{attrs:{title:e.title,visible:e.open,width:"500px","append-to-body":""},on:{"update:visible":function(t){e.open=t}}},[n("el-form",{ref:"form",attrs:{model:e.form,rules:e.rules,"label-width":"80px"}},[n("el-form-item",{attrs:{label:"设备名称",prop:"devName"}},[n("el-input",{attrs:{placeholder:"请输入设备名称"},model:{value:e.form.devName,callback:function(t){e.$set(e.form,"devName",t)},expression:"form.devName"}})],1),n("el-form-item",{attrs:{label:"软件名称",prop:"name"}},[n("el-input",{attrs:{placeholder:"请输入软件名称"},model:{value:e.form.name,callback:function(t){e.$set(e.form,"name",t)},expression:"form.name"}})],1),n("el-form-item",{attrs:{label:"当前版本",prop:"version"}},[n("el-input",{attrs:{placeholder:"请输入当前版本"},model:{value:e.form.version,callback:function(t){e.$set(e.form,"version",t)},expression:"form.version"}})],1)],1),n("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[n("el-button",{attrs:{type:"primary"},on:{click:e.submitForm}},[e._v("确 定")]),n("el-button",{on:{click:e.cancel}},[e._v("取 消")])],1)],1),n("el-dialog",{attrs:{title:"升级到指定版本",visible:e.up_open,width:"500px","append-to-body":""},on:{"update:visible":function(t){e.up_open=t}}},[n("el-form",{ref:"up_form",attrs:{"label-width":"80px"}},[n("el-select",{attrs:{placeholder:"请选择版本",clearable:""},model:{value:e.targetVersion,callback:function(t){e.targetVersion=t},expression:"targetVersion"}},e._l(e.versionList,(function(e){return n("el-option",{key:e.id,attrs:{label:e.version,value:e.version}})})),1)],1),n("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[n("el-button",{attrs:{type:"primary"},on:{click:e.up_submit}},[e._v("确 定")]),n("el-button",{on:{click:e.up_cancel}},[e._v("取 消")])],1)],1)],1)},r=[],i=n("5530"),o=(n("d81d"),n("b0c0"),n("b775"));function l(e){return Object(o["a"])({url:"/device/upgrade/list",method:"get",params:e})}function s(e){return Object(o["a"])({url:"/device/upgrade/"+e,method:"get"})}function u(e){return Object(o["a"])({url:"/device/upgrade",method:"post",data:e})}function c(e){return Object(o["a"])({url:"/device/upgrade",method:"put",data:e})}function d(e){return Object(o["a"])({url:"/device/upgrade/"+e,method:"delete"})}function p(e){return Object(o["a"])({url:"/device/upgrade/upgradeToNew",method:"put",data:e})}var m=n("c403"),h={name:"Upgrade",data:function(){return{loading:!0,ids:[],single:!0,multiple:!0,showSearch:!0,total:0,upgradeList:[],title:"",open:!1,up_open:!1,queryParams:{pageNum:1,pageSize:10,ip:null,name:null,version:null,dtUpdate:null},form:{},rules:{ip:[{required:!0,message:"设备ip不能为空",trigger:"blur"}],name:[{required:!0,message:"软件名称不能为空",trigger:"blur"}]},versionList:[],targetVersion:null}},created:function(){var e=this;this.getList(),Object(m["e"])().then((function(t){console.log(t),e.versionList=t.rows}))},methods:{getList:function(){var e=this;this.loading=!0,l(this.queryParams).then((function(t){e.upgradeList=t.rows,e.total=t.total,e.loading=!1}))},cancel:function(){this.open=!1,this.reset()},up_cancel:function(){this.up_open=!1},reset:function(){this.form={id:null,ip:null,name:null,version:null,newVersion:null,url:null,dtUpdate:null},this.resetForm("form")},handleQuery:function(){this.queryParams.pageNum=1,this.getList()},resetQuery:function(){this.resetForm("queryForm"),this.handleQuery()},handleSelectionChange:function(e){this.ids=e.map((function(e){return e.id})),this.single=1!==e.length,this.multiple=!e.length},handleAdd:function(){this.reset(),this.open=!0,this.title="添加软件升级"},handleUpdate:function(e){var t=this;this.reset();var n=e.id||this.ids;s(n).then((function(e){t.form=e.data,t.open=!0,t.title="修改软件升级"}))},submitForm:function(){var e=this;this.$refs["form"].validate((function(t){t&&(null!=e.form.id?c(e.form).then((function(t){e.$modal.msgSuccess("修改成功"),e.open=!1,e.getList()})):u(e.form).then((function(t){e.$modal.msgSuccess("新增成功"),e.open=!1,e.getList()})))}))},up_submit:function(){var e=this;this.up_open=!1;var t=this.targetVersion,n=null;this.versionList.map((function(e,a){e.version==t&&(n=e)})),null!=n?p(this.upParam).then((function(t){console.log(t),200==t.code&&e.$modal.msgSuccess("下发成功")})):this.$modal.msgSuccess("请选择有效的软件版本！")},handleDelete:function(e){var t=this,n=e.id||this.ids;this.$modal.confirm('是否确认删除软件升级编号为"'+n+'"的数据项？').then((function(){return d(n)})).then((function(){t.getList(),t.$modal.msgSuccess("删除成功")})).catch((function(){}))},handleExport:function(){this.download("device/upgrade/export",Object(i["a"])({},this.queryParams),"upgrade_".concat((new Date).getTime(),".xlsx"))},handleUpgrade:function(e){var t=this;console.log(e),console.log("upgrade"),Object(m["e"])({softwareName:e.name}).then((function(n){console.log(n),t.versionList=n.rows.map((function(t,n){return t.devName=e.devName,t})),t.up_open=!0}))}}},v=h,f=n("2877"),g=Object(f["a"])(v,a,r,!1,null,null,null);t["default"]=g.exports},c403:function(e,t,n){"use strict";n.d(t,"e",(function(){return r})),n.d(t,"d",(function(){return i})),n.d(t,"a",(function(){return o})),n.d(t,"f",(function(){return l})),n.d(t,"b",(function(){return s})),n.d(t,"g",(function(){return u})),n.d(t,"c",(function(){return c}));var a=n("b775");function r(e){return Object(a["a"])({url:"/device/version/list",method:"get",params:e})}function i(e){return Object(a["a"])({url:"/device/version/"+e,method:"get"})}function o(e){return Object(a["a"])({url:"/device/version",method:"post",data:e})}function l(e){return Object(a["a"])({url:"/device/version",method:"put",data:e})}function s(e){return Object(a["a"])({url:"/device/version/"+e,method:"delete"})}function u(e){return Object(a["a"])({url:"/device/version/uploadVersionFile",method:"post",timeout:0,data:e})}function c(e){return Object(a["a"])({url:"/device/version/downloadVersionFile",method:"get",params:e,responseType:"blob"})}}}]);