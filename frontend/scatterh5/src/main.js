// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Eos from 'eosjs'
import router from './router'
import ElementUI from 'element-ui'
import eventBus from './assets/script/eventBus'
import axiosPlugin from './assets/script/server'
import ScatterJS from 'scatter-js/dist/scatter.esm'

import './assets/style/reset.css'
import './assets/style/media.css'
import './assets/style/element-ui.css'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)
Vue.use(axiosPlugin)
Vue.prototype.$Eos = Eos
Vue.prototype.$eventBus = eventBus
Vue.prototype.$ScatterJS = ScatterJS
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
