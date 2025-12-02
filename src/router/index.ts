import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PlayerDetailView from '../views/PlayerDetailView.vue'
import IconTestView from '../views/IconTestView.vue'
import SearchView from '../views/SearchView.vue'
import HomeRecommend from '../views/HomeRecommend.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    children: [
      {
        path: '',
        name: 'home-recommend',
        component: HomeRecommend
      },
      {
        path: 'search',
        name: 'search',
        component: SearchView,
        props: (route) => ({ query: route.query.q })
      }
    ]
  },
  {
    path: '/player',
    name: 'player',
    component: PlayerDetailView
  },
  {
    path: '/icon-test',
    name: 'icon-test',
    component: IconTestView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router