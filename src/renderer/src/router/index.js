import { createRouter, createWebHashHistory } from 'vue-router'

import classical from '../classical.vue'
import rsa from '../rsa.vue'
import online from '../online.vue'
import ecc from '../ecc.vue'
import dh from '../dh.vue'
import ecdh from '../ecdh.vue'
import asym from '../asym.vue'
import key_ex from '../key_ex.vue'
import md5 from '../md5.vue'


const routes = [
  { path: '/1', component: classical, name: "经典密码" },
  { path: '/2', component: rsa, name: "rsa" },
  { path: '/4', component: ecc, name: "ecc(Curve25519)" },
  { path: '/ecdh', component: ecdh, name: "椭圆曲线DH密钥交换" },
  { path: '/dh', component: dh, name: "DH密钥交换" },
  { path: '/3', component: online, name: "联机" },
  { path: '/5', component: asym, name: "非对称密码" },
  { path: '/6', component: key_ex, name: "密钥交换" },
  { path: '/7', component: md5, name: "md5" },
  { path: '/', redirect: '/1' },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
