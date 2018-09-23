import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/index"
    },
    {
      path: '/login',
      component: resolve => require(['../components/login.vue'], resolve)
    },
    {
      path: '/index',
      component: resolve => require(['../components/index.vue'], resolve)
    },
    {
      path: '/send',
      component: resolve => require(['../components/send.vue'], resolve)
    },
    {
      path: '/setlimt',
      component: resolve => require(['../components/setlimt.vue'], resolve)
    },
    {
      path: '/tokenIndex',
      component: resolve => require(['../components/tokenIndex.vue'], resolve),
      children: [
        {
          path: '/',
          redirect: 'sidebox'
        },
        {
          path: 'sidebox',
          component: resolve => require(['@/components/sidebox.vue'], resolve),
        },
      ]
    },
  ]
})
