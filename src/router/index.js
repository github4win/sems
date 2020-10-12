import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'SEMS_Monitoring',
    component: () => import(/* webpackChunkName: "about" */ '../views/TEST/SEMS_Monitoring.vue')
  },
  {
    path: '/SEMS_DANGER_MNT',
    name: 'SEMS_Danger_Monitoring',
    component: () => import(/* webpackChunkName: "about" */ '../views/Management_Options/Danger_Monitoring.vue')
  },
  {
    path: '/SEMS_Menu_MNG',
    name: 'SEMS_Menu_Mng',
    component: () => import(/* webpackChunkName: "about" */ '../views/Management_Options/Menu_Management.vue')
  },
  {
    path: '/SEMS_Com_MNG',
    name: 'SEMS_Com_MNG',
    component: () => import(/* webpackChunkName: "about" */ '../views/Management_Options/Code_Management.vue')
  },
  {
    path: '/SEMS_Danger_MNG',
    name: 'SEMS_Danger_Mng',
    component: () => import(/* webpackChunkName: "about" */ '../views/Management_Options/Danger_Management.vue')
  },
  {
    path: '/SEMS_Sensor_MNG',
    name: 'SEMS_Sensor_MNG',
    component: () => import(/* webpackChunkName: "about" */ '../views/Management_Options/Sensor_Management.vue')
  },
  {
    path: '/SEMS_Area_MNG',
    name: 'SEMS_Area_MNG',
    component: () => import(/* webpackChunkName: "about" */ '../views/Management_Options/Area_Management.vue')
  }
  ,
  {
    path: '/SEMS_Notice_MNG',
    name: 'SEMS_Notice_MNG',
    component: () => import(/* webpackChunkName: "about" */ '../views/Management_Options/Notice_Management.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes
})

export default router
