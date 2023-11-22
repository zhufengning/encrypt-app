import { createRouter, createWebHashHistory } from 'vue-router'

import a from '../a.vue'
import rsa from '../rsa.vue'
import c from '../c.vue'

const routes = [
  { path: '/1', component: a, name: "经典" },
  { path: '/2', component: rsa, name: "rsa" },
  { path: '/3', component: c, name: "联机" },
  { path: '/', redirect: '/1' },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
