webpackJsonp([0],{ALKL:function(t,e){},aqtB:function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n={name:"setlimt",data:function(){return{whiteList:[],transaction_id:"",activeName:"1",pickerOptions:{disabledDate:function(t){return t.getTime()<=Date.now()}},range:"",ruleForm:{limitation:"",range:""},rules:{limitation:[{required:!0,message:"limitation",min:1,trigger:"blur"}],range:[{required:!0,message:"range",min:1,trigger:"blur"}]},accountruleForm:{account:""},accountrules:{account:[{required:!0,message:"account",min:1,trigger:"blur"}]},dialog:!1}},watch:{range:function(){console.log(this.range),this.ruleForm.range=String(this.range)}},mounted:function(){this.getWhiteList()},methods:{goback:function(){this.$router.push("index")},getWhiteList:function(){var t=this;this.$axios.post("/get_table_rows",{code:"tokenshields",json:!0,limit:-1,lower_bound:"",scope:sessionStorage.getItem("accountName"),table:"accounts",table_key:"",upper_bound:""}).then(function(e){console.log(e.rows[0].whitelist),console.log(e);var o=[];e.rows[0].whitelist.forEach(function(t){var e={account:t};o.push(e)}),t.whiteList=o,console.log(o)}).catch(function(t){console.log(t)})},addWhite:function(){this.dialog=!0},handleClick:function(t,e){},changeDate:function(){console.log(range)},submitForm:function(t){var e=this;this.$refs[t].validate(function(t){if(!t)return!1;e.getUserScatter()})},config:function(t){var e=this;this.$refs[t].validate(function(t){if(!t)return!1;e.getAccountUserScatter()})},getUserScatter:function(){var t=this,e=(new WebSocket("ws://127.0.0.1:50005/socket.io/?EIO=3&transport=websocket"),{blockchain:"eos",protocol:"http",host:"api.eossweden.se",port:80,chainId:"aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906"});this.$ScatterJS.scatter.connect("My App").then(function(o){if(console.log(o),!o)return!1;var n=t.$ScatterJS.scatter,c={accounts:[e]};n.getIdentity(c).then(function(o){var c=n.identity.accounts.find(function(t){return"eos"===t.blockchain&&"owner"===t.authority}),a=n.eos(e,t.$Eos,{expireInSeconds:60}),i={authorization:[c.name+"@"+c.authority]};a.contract("tokenshields").then(function(e){e.setlimit(c.name,t.ruleForm.limitation+" TSL",t.range-(new Date).getTime(),i).then(function(e){console.log(e),e.transaction_id&&t.$message.success("success"),t.transaction_id=e.transaction_id}).catch(function(t){console.log(t)})})}).catch(function(t){console.error(t)})})},getAccountUserScatter:function(){var t=this,e=(new WebSocket("ws://127.0.0.1:50005/socket.io/?EIO=3&transport=websocket"),{blockchain:"eos",protocol:"http",host:"api.eossweden.se",port:80,chainId:"aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906"});this.$ScatterJS.scatter.connect("My App").then(function(o){if(console.log(o),!o)return!1;var n=t.$ScatterJS.scatter,c={accounts:[e]};n.getIdentity(c).then(function(o){var c=n.identity.accounts.find(function(t){return"eos"===t.blockchain&&"owner"===t.authority}),a=n.eos(e,t.$Eos,{expireInSeconds:60}),i={authorization:[c.name+"@"+c.authority]};a.contract("tokenshields").then(function(e){e.addwhitelist(c.name,"1.0000 TSL",t.accountruleForm.account,i).then(function(e){console.log(e),e.transaction_id&&(t.$message.success("success"),t.getWhiteList(),t.dialog=!1),t.transaction_id=e.transaction_id}).catch(function(t){console.log(t)})})}).catch(function(t){console.error(t)})})},removeUserWhite:function(t){var e=this,o=(new WebSocket("ws://127.0.0.1:50005/socket.io/?EIO=3&transport=websocket"),{blockchain:"eos",protocol:"http",host:"api.eossweden.se",port:80,chainId:"aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906"});this.$ScatterJS.scatter.connect("My App").then(function(n){if(console.log(n),!n)return!1;var c=e.$ScatterJS.scatter,a={accounts:[o]};c.getIdentity(a).then(function(n){var a=c.identity.accounts.find(function(t){return"eos"===t.blockchain&&"owner"===t.authority}),i=c.eos(o,e.$Eos,{expireInSeconds:60}),r={authorization:[a.name+"@"+a.authority]};i.contract("tokenshields").then(function(o){o.rmwhitelist(a.name,"1.0000 TSL",t,r).then(function(t){console.log(t),t.transaction_id&&(e.$message.success("success"),e.getWhiteList()),e.transaction_id=t.transaction_id}).catch(function(t){console.log(t)})})}).catch(function(t){console.error(t)})})},deleteWhite:function(t){console.log(t),this.removeUserWhite(t.account)}}},c={render:function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"setlimt"},[o("i",{staticClass:"el-icon-d-arrow-left",on:{click:t.goback}}),t._v(" "),o("br"),t._v(" "),o("el-tabs",{attrs:{type:"border-card"},on:{"tab-click":t.handleClick},model:{value:t.activeName,callback:function(e){t.activeName=e},expression:"activeName"}},[o("el-tab-pane",{attrs:{label:"limitation",name:"1"}},[o("el-form",{ref:"ruleForm",staticClass:"demo-ruleForm",attrs:{model:t.ruleForm,rules:t.rules,"label-width":"100px"}},[o("el-form-item",{attrs:{label:"limitation",prop:"limitation"}},[o("el-input",{attrs:{placeholder:"limitation"},model:{value:t.ruleForm.limitation,callback:function(e){t.$set(t.ruleForm,"limitation",e)},expression:"ruleForm.limitation"}})],1),t._v(" "),o("el-form-item",{attrs:{label:"time span",prop:"range"}},[o("div",{staticClass:"block"},[o("el-date-picker",{attrs:{change:"changeDate",type:"datetime","value-format":"timestamp","picker-options":t.pickerOptions,placeholder:"datetime"},model:{value:t.range,callback:function(e){t.range=e},expression:"range"}})],1)]),t._v(" "),o("el-form-item",[o("el-button",{attrs:{type:"primary"},on:{click:function(e){t.submitForm("ruleForm")}}},[t._v("confirm")])],1)],1)],1),t._v(" "),o("el-tab-pane",{attrs:{label:"White Lists",name:"2"}},[o("el-button",{attrs:{type:"primary",icon:"el-icon-plus"},on:{click:t.addWhite}},[t._v("add account")]),t._v(" "),o("el-table",{staticStyle:{width:"100%"},attrs:{data:t.whiteList}},[o("el-table-column",{attrs:{type:"index",label:"No.","min-width":"80"}}),t._v(" "),o("el-table-column",{attrs:{prop:"account",label:"Account","min-width":"40"}}),t._v(" "),o("el-table-column",{attrs:{label:"Operation","min-width":"40"},scopedSlots:t._u([{key:"default",fn:function(e){return[o("el-button",{attrs:{type:"info",icon:"el-icon-delete"},on:{click:function(o){t.deleteWhite(e.row)}}},[t._v("remove")])]}}])})],1)],1)],1),t._v(" "),o("el-dialog",{attrs:{visible:t.dialog},on:{"update:visible":function(e){t.dialog=e}}},[o("el-form",{ref:"accountruleForm",staticClass:"demo-ruleForm",attrs:{model:t.accountruleForm,rules:t.accountrules,"label-width":"100px"}},[o("el-form-item",{attrs:{label:"account",prop:"account"}},[o("el-input",{attrs:{placeholder:"account"},model:{value:t.accountruleForm.account,callback:function(e){t.$set(t.accountruleForm,"account",e)},expression:"accountruleForm.account"}})],1),t._v(" "),o("el-form-item",[o("el-button",{attrs:{type:"primary"},on:{click:function(e){t.config("accountruleForm")}}},[t._v("config")])],1)],1)],1)],1)},staticRenderFns:[]};var a=o("VU/8")(n,c,!1,function(t){o("ALKL")},"data-v-73ab6178",null);e.default=a.exports}});
//# sourceMappingURL=0.a84a0110198a8d3d8e51.js.map