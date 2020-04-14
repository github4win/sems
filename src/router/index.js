import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// const routes = [

// ]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes:[
    // 도서 관리 Start
    {
      path: '/Rent_Book',
      name: '도서 대여',
      component: () => import(/* webpackChunkName: "about" */ '../views/BOOK/Rent_Book.vue')
    },
    {
      path: '/Return_Book',
      name: '도서 반납',
      component: () => import(/* webpackChunkName: "about" */ '../views/BOOK/Return_Book.vue')
    },
    {
      path: '/Management_Book',
      name: '도서 관리',
      component: () => import(/* webpackChunkName: "about" */ '../views/BOOK/Management_Book.vue')
    },
    {
      path: '/Status_Purchase',
      name: '구매 현황',
      component: () => import(/* webpackChunkName: "about" */ '../views/BOOK/Status_Purchase.vue')
    },
    // 도서 관리 End

    // 정부 과제 Start
    {
      path: '/2',
      name: '과제 목록',
      component: () => import(/* webpackChunkName: "about" */ '../views/GOVERMENT/Page2.vue')
    },
    {
      path: '/Status_Use',
      name: '사용 현황',
      component: () => import(/* webpackChunkName: "about" */ '../views/GOVERMENT/Status_Use.vue')
    },
    {
      path: '/Status_Execution',
      name: '집행 현황',
      component: () => import(/* webpackChunkName: "about" */ '../views/GOVERMENT/Status_Execution.vue')
    },
    {
      path: '/2',
      name: '과제 목록',
      component: () => import(/* webpackChunkName: "about" */ '../views/GOVERMENT/Page2.vue')
    },
    {
      path: '/Status_Business',
      name: '출장 현황',
      component: () => import(/* webpackChunkName: "about" */ '../views/GOVERMENT/Status_Business.vue')
    },
     // 정부 과제 End

    // 관리자 기능 Start
    {
      path: '/Enrollment_Menu',
      name: '메뉴 등록',
      component: () => import(/* webpackChunkName: "about" */ '../views/ADMIN/Enrollment_Menu.vue')
    },
    {
      path: '/Enrollment_Menu2',
      name: '메뉴 등록',
      component: () => import(/* webpackChunkName: "about" */ '../views/ADMIN/Enrollment_Menu2.vue')
    },
    {
      path: '/Management_Code',
      name: '코드 관리',
      component: () => import(/* webpackChunkName: "about" */ '../views/ADMIN/Management_Code.vue')
    },
    {
      path: '/Management_User',
      name: '사용자 관리',
      component: () => import(/* webpackChunkName: "about" */ '../views/ADMIN/Management_User.vue')
    },
    // 관리자 기능 End

    // 장비관리  Start
    {
      path: '/Status_Asset',
      name: '장비 현황',
      component: () => import(/* webpackChunkName: "about" */ '../views/ASSET/Status_Asset.vue')
    },
    {
      path: '/Enrollment_Asset',
      name: '장비 등록(본체)',
      component: () => import(/* webpackChunkName: "about" */ '../views/ASSET/Enrollment_Asset.vue'),
      props:true
    },
    {
      path: '/Asset_Out',
      name: '장비 출고',
      component: () => import(/* webpackChunkName: "about" */ '../views/ASSET/Asset_Out.vue')
    },
    {
      path: '/Asset_Out_Add',
      name: '장비 출고 추가/수정',
      props : true,
      component: () => import(/* webpackChunkName: "about" */ '../views/ASSET/Asset_Out_Add.vue')
    },
    {
      path: '/Asset_In',
      name: '장비 입고',
      component: () => import(/* webpackChunkName: "about" */ '../views/ASSET/Asset_In.vue')
    },
    {
      path: '/Asset_In_Add',
      name: '장비 입고 추가/수정',
      props : true,
      component: () => import(/* webpackChunkName: "about" */ '../views/ASSET/Asset_In_Add.vue')
    },
    {
      path: '/Enrollment_Asset_Add',
      name: '장비(본체) 등록 추가',
      props : true,
      component: () => import(/* webpackChunkName: "about" */ '../views/ASSET/Enrollment_Asset_Add.vue')
    },
    {
      path: '/Asset_Monitoring',
      name: '장비 모니터링',
      props : true,
      component: () => import(/* webpackChunkName: "about" */ '../views/ASSET/Asset_Monitoring.vue')
    },
    {
      path: '/CHB_Test',
      name: '차현빈 테스트',
      component: () => import(/* webpackChunkName: "about" */ '../views/ASSET/CHB_Test.vue')
    },
    // 장비관리 End

    // TEST 메뉴
    {
      path: '/Test_main', 
      name: '테스트 메뉴',
      props : true,
      component: () => import(/* webpackChunkName: "about" */  '../views/TEST/Test_main.vue')
    },
    {
      path: '/SEMS_Map',
      name: '유해환경 맵',
      component: () => import(/* webpackChunkName: "about" */  '../views/TEST/SEMS_Map.vue')
    },

    {
      path: '/SEMS_Test',
      name: '유해환경 테스트',
      component: () => import(/* webpackChunkName: "about" */  '../views/TEST/SEMS_Test.vue')
    },
  ]
})

export default router
