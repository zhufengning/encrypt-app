import { createRouter, createWebHistory } from 'vue-router'

import a from '../a.vue'
import b from '../b.vue'
import c from '../c.vue'

const routes = [
    { path: '/1', component: a },
    { path: '/2', component: b },
    { path: '/3', component: c },
    { path: '/',  redirect: '/1' },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
