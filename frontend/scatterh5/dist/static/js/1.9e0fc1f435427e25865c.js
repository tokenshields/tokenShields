webpackJsonp([1],{Y1tj:function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n={name:"limitWhite",data:function(){return{whiteList:[],transaction_id:"",activeName:"1",pickerOptions:{disabledDate:function(t){return t.getTime()<=Date.now()}},range:"",ruleForm:{limitation:"",range:""},rules:{limitation:[{required:!0,message:"limitation",min:1,trigger:"blur"}],range:[{required:!0,message:"range",min:1,trigger:"blur"}]},accountruleForm:{account:""},accountrules:{account:[{required:!0,message:"account",min:1,trigger:"blur"}]},dialog:!1}},watch:{range:function(){console.log(this.range),this.ruleForm.range=String(this.range)}},mounted:function(){this.getWhiteList()},methods:{getWhiteList:function(){var t=this;this.$axios.post("/get_table_rows",{code:"tokenshields",json:!0,limit:-1,lower_bound:"",scope:sessionStorage.getItem("accountName"),table:"accounts",table_key:"",upper_bound:""}).then(function(e){console.log(e.rows[0].whitelist),console.log(e);var o=[];e.rows[0].whitelist.forEach(function(t){var e={account:t};o.push(e)}),t.whiteList=o,console.log(o)}).catch(function(t){console.log(t)})},addWhite:function(){this.dialog=!0,this.accountruleForm={}},handleClick:function(t,e){},changeDate:function(){console.log(range)},submitForm:function(t){var e=this;this.$refs[t].validate(function(t){if(!t)return!1;e.getUserScatter()})},config:function(t){var e=this;this.$refs[t].validate(function(t){if(!t)return!1;e.getAccountUserScatter()})},getUserScatter:function(){var t=this,e=(new WebSocket("ws://127.0.0.1:50005/socket.io/?EIO=3&transport=websocket"),{blockchain:"eos",protocol:"http",host:"api.eossweden.se",port:80,chainId:"aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906"});this.$ScatterJS.scatter.connect("My App").then(function(o){if(console.log(o),!o)return!1;var n=t.$ScatterJS.scatter,a={accounts:[e]};n.getIdentity(a).then(function(o){var a=n.identity.accounts.find(function(t){return"eos"===t.blockchain&&"owner"===t.authority}),i=n.eos(e,t.$Eos,{expireInSeconds:60}),c={authorization:[a.name+"@"+a.authority]};i.contract("tokenshields").then(function(e){e.setlimit(a.name,t.ruleForm.limitation+" TSL",86e3*t.range,c).then(function(e){console.log(e),e.transaction_id&&(t.$message.success("success"),t.ruleForm={},t.range=""),t.transaction_id=e.transaction_id}).catch(function(e){console.log(e),t.$message({showClose:!0,message:e,type:"error",duration:0})})})}).catch(function(e){console.error(e),t.$message({showClose:!0,message:"permisson not right ! please switch to other key(owner or active)",type:"error",duration:0})})})},getAccountUserScatter:function(){var t=this,e=(new WebSocket("ws://127.0.0.1:50005/socket.io/?EIO=3&transport=websocket"),{blockchain:"eos",protocol:"http",host:"api.eossweden.se",port:80,chainId:"aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906"});this.$ScatterJS.scatter.connect("My App").then(function(o){if(console.log(o),!o)return!1;var n=t.$ScatterJS.scatter,a={accounts:[e]};n.getIdentity(a).then(function(o){var a=n.identity.accounts.find(function(t){return"eos"===t.blockchain&&"owner"===t.authority}),i=n.eos(e,t.$Eos,{expireInSeconds:60}),c={authorization:[a.name+"@"+a.authority]};i.contract("tokenshields").then(function(e){e.addwhitelist(a.name,"1.0000 TSL",t.accountruleForm.account,c).then(function(e){console.log(e),e.transaction_id&&(t.$message.success("success"),t.getWhiteList(),t.dialog=!1),t.transaction_id=e.transaction_id}).catch(function(e){console.log(e),t.$message({showClose:!0,message:e,type:"error",duration:0})})})}).catch(function(e){console.error(e),t.$message({showClose:!0,message:"permisson not right ! please switch to other key(owner or active)",type:"error",duration:0})})})},removeUserWhite:function(t){var e=this,o=(new WebSocket("ws://127.0.0.1:50005/socket.io/?EIO=3&transport=websocket"),{blockchain:"eos",protocol:"http",host:"api.eossweden.se",port:80,chainId:"aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906"});this.$ScatterJS.scatter.connect("My App").then(function(n){if(console.log(n),!n)return!1;var a=e.$ScatterJS.scatter,i={accounts:[o]};a.getIdentity(i).then(function(n){var i=a.identity.accounts.find(function(t){return"eos"===t.blockchain&&"owner"===t.authority}),c=a.eos(o,e.$Eos,{expireInSeconds:60}),r={authorization:[i.name+"@"+i.authority]};c.contract("tokenshields").then(function(o){o.rmwhitelist(i.name,"1.0000 TSL",t,r).then(function(t){console.log(t),t.transaction_id&&(e.$message.success("success"),e.getWhiteList()),e.transaction_id=t.transaction_id}).catch(function(t){console.log(JSON.parse(t)),e.$message({showClose:!0,message:t,type:"error",duration:0})})})}).catch(function(t){console.error(t),e.$message({showClose:!0,message:"permisson not right ! please switch to other key(owner or active)",type:"error",duration:0})})})},deleteWhite:function(t){console.log(t),this.removeUserWhite(t.account)}}},a={render:function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"limitWhite"},[o("el-tabs",{attrs:{type:"border-card"},on:{"tab-click":t.handleClick},model:{value:t.activeName,callback:function(e){t.activeName=e},expression:"activeName"}},[o("el-tab-pane",{attrs:{label:"Limitation",name:"1"}},[o("el-form",{ref:"ruleForm",staticClass:"demo-ruleForm",attrs:{model:t.ruleForm,rules:t.rules,"label-width":"100px"}},[o("el-form-item",{attrs:{label:"limitation",prop:"limitation"}},[o("el-input",{attrs:{placeholder:"limitation"},model:{value:t.ruleForm.limitation,callback:function(e){t.$set(t.ruleForm,"limitation",e)},expression:"ruleForm.limitation"}},[o("i",{attrs:{slot:"suffix"},slot:"suffix"},[t._v("TSL")])])],1),t._v(" "),o("el-form-item",{attrs:{label:"time span",prop:"range"}},[o("el-input",{attrs:{placeholder:"Day"},model:{value:t.range,callback:function(e){t.range=e},expression:"range"}})],1),t._v(" "),o("el-form-item",[o("el-button",{staticClass:"confirm",attrs:{type:"primary"},on:{click:function(e){t.submitForm("ruleForm")}}},[t._v("confirm")])],1)],1)],1),t._v(" "),o("el-tab-pane",{attrs:{label:"White List",name:"2"}},[o("el-button",{staticClass:"addWhiteBox",attrs:{type:"primary",icon:"el-icon-plus"},on:{click:t.addWhite}},[t._v(" add account")]),t._v(" "),o("el-table",{staticStyle:{width:"100%"},attrs:{data:t.whiteList}},[o("el-table-column",{attrs:{type:"index",label:"No.","min-width":"80"}}),t._v(" "),o("el-table-column",{attrs:{prop:"account",label:"Account","min-width":"40"}}),t._v(" "),o("el-table-column",{attrs:{label:"Operation","min-width":"40"},scopedSlots:t._u([{key:"default",fn:function(e){return[o("el-button",{attrs:{type:"danger",icon:"el-icon-delete",plain:""},on:{click:function(o){t.deleteWhite(e.row)}}},[t._v("remove")])]}}])})],1)],1)],1),t._v(" "),o("el-dialog",{attrs:{visible:t.dialog},on:{"update:visible":function(e){t.dialog=e}}},[o("el-form",{ref:"accountruleForm",staticClass:"demo-ruleForm",attrs:{model:t.accountruleForm,rules:t.accountrules,"label-width":"100px"}},[o("el-form-item",{attrs:{label:"account",prop:"account"}},[o("el-input",{attrs:{placeholder:"account"},model:{value:t.accountruleForm.account,callback:function(e){t.$set(t.accountruleForm,"account",e)},expression:"accountruleForm.account"}})],1),t._v(" "),o("el-form-item",[o("el-button",{attrs:{type:"primary"},on:{click:function(e){t.config("accountruleForm")}}},[t._v("add")])],1)],1)],1)],1)},staticRenderFns:[]};var i=o("VU/8")(n,a,!1,function(t){o("ly19")},"data-v-f58650b2",null);e.default=i.exports},ly19:function(t,e){}});
//# sourceMappingURL=1.9e0fc1f435427e25865c.js.map