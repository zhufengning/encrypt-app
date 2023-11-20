import { createRouter, createWebHistory } from 'vue-router'

import App from '../App.vue'
import bo from '../bo.vue'

const routes = [
    { path: '/', component: App },
    { path: '/about', component: bo },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
