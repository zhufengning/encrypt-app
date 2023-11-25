import { createRouter, createWebHashHistory } from 'vue-router'

import a from '../a.vue'
import rsa from '../rsa.vue'
import c from '../c.vue'
import ecc from '../ecc.vue'
import dh from '../dh.vue'
import ecdh from '../ecdh.vue'


const routes = [
  { path: '/1', component: a, name: "经典" },
  { path: '/2', component: rsa, name: "rsa" },
  { path: '/4', component: ecc, name: "ecc(Curve25519)" },
  { path: '/ecdh', component: ecdh, name: "椭圆曲线DH密钥交换" },
  { path: '/dh', component: dh, name: "DH密钥交换" },
  { path: '/3', component: c, name: "联机" },
  { path: '/', redirect: '/1' },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
