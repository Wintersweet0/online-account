import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Bill from '../views/Bill.vue'

const routes = [
  {
    path: '/',
    name: 'index',
    redirect: '/home',
    component: () => import('@/layout/index'),
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/Home')
      },
      {
        path: 'statistics',
        name: 'statistics',
        component: () => import('@/views/Statistics')
      },
    ]
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
