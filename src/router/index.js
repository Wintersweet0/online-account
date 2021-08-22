import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Bill from '../views/Bill.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/bill',
    name: 'bill',
    component: Bill
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
