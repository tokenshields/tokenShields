webpackJsonp([4],{"+l+g":function(t,e){},"M/4o":function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n={name:"sidebox",data:function(){return{}},mounted:function(){this.setMinHeight()},methods:{setMinHeight:function(){this.$refs.sidebox.style.minHeight=document.documentElement.clientHeight-105+"px"||document.body.clientHeight-105+"px"},goAccount:function(){this.$router.push("/tokenIndex/sidebox/account")},goTransfer:function(){this.$router.push("/tokenIndex/sidebox/transfer")},goSetting:function(){this.$router.push("/tokenIndex/sidebox/limitWhite")}}},s={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{ref:"sidebox",staticClass:"sidebox"},[i("el-container",[i("el-aside",{attrs:{width:"205px"}},[i("el-menu",{staticClass:"el-menu-vertical-demo",attrs:{"default-active":"2"}},[i("el-menu-item",{attrs:{index:"1",disabled:""}},[i("i",{staticClass:"el-icon-menu"}),t._v(" "),i("span",{attrs:{slot:"title"},slot:"title"},[t._v("My account")])]),t._v(" "),i("el-menu-item",{attrs:{index:"2"},on:{click:t.goAccount}},[i("i",{staticClass:"el-icon-document"}),t._v(" "),i("span",{attrs:{slot:"title"},slot:"title"},[t._v("Account information")])]),t._v(" "),i("el-menu-item",{attrs:{index:"3"},on:{click:t.goTransfer}},[i("i",{staticClass:"el-icon-setting"}),t._v(" "),i("span",{attrs:{slot:"title"},slot:"title"},[t._v("Transfer")])]),t._v(" "),i("el-menu-item",{attrs:{index:"4"},on:{click:t.goSetting}},[i("i",{staticClass:"el-icon-setting"}),t._v(" "),i("span",{attrs:{slot:"title"},slot:"title"},[t._v("Setting")])])],1)],1),t._v(" "),i("el-main",[i("router-view")],1)],1)],1)},staticRenderFns:[]};var o=i("VU/8")(n,s,!1,function(t){i("+l+g")},"data-v-3f246b3c",null);e.default=o.exports}});
//# sourceMappingURL=4.94c0a277cb3a1c1a6e10.js.map