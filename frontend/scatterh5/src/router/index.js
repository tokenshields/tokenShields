import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/tokenIndex"
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
          children: [
            {
              path: '/',
              redirect: 'account'
            },
            {
              path: 'account',
              component: resolve => require(['@/components/account.vue'], resolve),
            },
            {
              path: 'transfer',
              component: resolve => require(['@/components/transfer.vue'], resolve),
            },
            {
              path: 'limitWhite',
              component: resolve => require(['@/components/limitWhite.vue'], resolve),
            },
          ]
        },
      ]
    },
  ]
})
