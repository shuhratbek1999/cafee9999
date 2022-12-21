import { h, resolveComponent } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout'

const routes = [
  {
    path: '/selling-window',
    name: 'Selling window',
    component: () => import('../views/selling-window/index.vue'),
  },
  {
    path: '/selling-window-entry',
    name: 'Selling Entry',
    component: () => import('../views/selling-window/enter.vue'),
  },
  {
    path: '/selling-window-table',
    name: 'Selling table',
    component: () => import('../views/selling-window/table.vue'),
    props: true,
  },
  {
    path: '/',
    name: 'Home',
    component: DefaultLayout,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard.vue'),
      },
      {
        path: '/kirim_docs',
        name: 'Kirim_Xujjat',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/kirim_docs/sklad',
        children: [
          {
            path: '/kirim_docs/sklad',
            name: 'Sklad',
            components: {
              default: () => import('@/views/kirim_docs/sklad/Index.vue'),
            },
          },
          {
            path: '/kirim_docs/chief',
            name: 'Chief',
            component: () => import('@/views/kirim_docs/oshpazlar/Index.vue'),
          },
          {
            path: '/kirim_docs/waiter',
            name: 'Waiter',
            component: () => import('@/views/kirim_docs/ofitsantlar/Index.vue'),
          },
          {
            path: '/kirim_docs/caisher',
            name: 'Caisher',
            component: () => import('@/views/kirim_docs/kassirlar/Index.vue'),
          },
          {
            path: '/kirim_docs/worker',
            name: 'Worker',
            component: () => import('@/views/kirim_docs/ishchilar/Index.vue'),
          },
          {
            path: '/kirim_docs/doc_salary',
            name: 'Doc_Salary',
            component: () =>
              import('@/views/kirim_docs/ishchiga_tolov/Index.vue'),
          },
          {
            path: '/kirim_docs/foods',
            name: 'Xomashyolar',
            component: () => import('@/views/kirim_docs/xomashyo/Index.vue'),
          },
          {
            path: '/kirim_docs/kirimlar',
            name: 'Kirimlar',
            component: () => import('@/views/kirim_docs/kirimlar/Index.vue'),
          },
          {
            path: '/kirim_docs/taminotchilar',
            name: 'Taminotchilar',
            component: () =>
              import('@/views/kirim_docs/taminotchilar/Index.vue'),
          },
          {
            path: '/kirim_docs/measure',
            name: "O'lchov birlik",
            component: () => import('@/views/kirim_docs/measure/Index.vue'),
          },
          {
            path: '/kirim_docs/test',
            name: 'Test',
            component: () => import('@/views/test/test.vue'),
          },
        ],
      },
      {
        path: '/payments/',
        name: 'Tolovlar',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/payments/',
        children: [
          {
            path: '/payments/pay-supplier',
            name: 'PaySupplier',
            component: () => import('@/views/tolovlar/pay-supplier/Index.vue'),
          },
          {
            path: '/payments/pay-worker',
            name: 'PayWorker',
            component: () => import('@/views/tolovlar/pay-worker/Index.vue'),
          },
          {
            path: '/payments/pay-waiter',
            name: 'PayWaiter',
            component: () => import('@/views/tolovlar/pay-waiter/Index.vue'),
          },
          {
            path: '/payments/pay-chief',
            name: 'PayChief',
            component: () => import('@/views/tolovlar/pay-chief/Index.vue'),
          },
        ],
      },
      {
        path: '/savdo_docs',
        name: 'SavdoXujjat',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/savdo_docs/branch',
        children: [
          {
            path: '/savdo_docs/branch',
            name: 'Branch',
            component: () => import('@/views/savdo_docs/branch/Index.vue'),
          },
          {
            path: '/savdo_docs/extra-service',
            name: "Qo'shimcha hizmat",
            component: () =>
              import('@/views/savdo_docs/extra_service/Index.vue'),
          },
          {
            path: '/savdo_docs/room',
            name: 'Room',
            component: () => import('@/views/savdo_docs/room/Index.vue'),
          },
          {
            path: '/savdo_docs/role',
            name: 'Role',
            component: () => import('@/views/savdo_docs/role/Index.vue'),
          },
          {
            path: '/savdo_docs/client',
            name: 'Client',
            component: () => import('@/views/savdo_docs/client/Index.vue'),
          },
          {
            path: '/savdo_docs/table',
            name: 'Table',
            component: () => import('@/views/savdo_docs/table/Index.vue'),
          },
          {
            path: '/savdo_docs/food-distrubute',
            name: 'Food-distrubute-group',
            component: () =>
              import('@/views/savdo_docs/food-distrubute/Index.vue'),
          },
          {
            path: '/savdo_docs/printer',
            name: 'Printer',
            component: () => import('@/views/savdo_docs/printer/Index.vue'),
          },
          {
            path: '/savdo_docs/food-group',
            name: 'Food-group',
            component: () => import('@/views/savdo_docs/food-group/Index.vue'),
          },
          {
            path: '/savdo_docs/food',
            name: 'Food',
            component: () => import('@/views/savdo_docs/food/Index.vue'),
          },
          {
            path: '/savdo_docs/order',
            name: 'Order',
            component: () => import('@/views/savdo_docs/order/Index.vue'),
          },
        ],
      },
      {
        path: '/report-act',
        name: 'Hisobotlar Sverka',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/report-act/supplier',
        children: [
          {
            path: '/report-act/supplier',
            name: 'supplier',
            component: () =>
              import('../views/HisobotAktSverka/taminotchi/index.vue'),
          },
          {
            path: '/report-act/cash',
            name: 'kassa',
            component: () =>
              import('../views/HisobotAktSverka/Kassa/index.vue'),
          },
          {
            path: '/report-act/product',
            name: 'Product',
            component: () =>
              import('../views/HisobotAktSverka/Mahsulot/index.vue'),
          },
          {
            path: '/report-act/sold-food',
            name: 'Sold-food',
            component: () =>
              import('../views/HisobotAktSverka/Sotilgan taomlar/index.vue'),
          },
        ],
      },
      {
        path: '/report',
        name: 'Hisobotlar',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/report/restir-caisher',
        children: [
          {
            path: '/report/restir-caisher',
            name: 'Restir Kassa',
            component: () =>
              import('../views/Hisobotlar/Restir kassa/index.vue'),
          },
          {
            path: '/report/refound-food',
            name: 'Bekor qilingan taomlar',
            component: () =>
              import('../views/Hisobotlar/Bekor qilingan taomlar/index.vue'),
          },
          {
            path: '/report/supplier',
            name: "Ta'minotchi",
            component: () =>
              import("../views/Hisobotlar/Ta'minotchi/index.vue"),
          },
          {
            path: '/report/waiter',
            name: 'Offitsant',
            component: () => import('../views/Hisobotlar/Offitsant/index.vue'),
          },
          {
            path: '/report/profit-food',
            name: 'Foyda hisoboti',
            component: () =>
              import('../views/Hisobotlar/Foyda hisoboti/index.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/pages',
    redirect: '/pages/404',
    name: 'Pages',
    component: {
      render() {
        return h(resolveComponent('router-view'))
      },
    },
    children: [
      {
        path: '404',
        name: 'Page404',
        component: () => import('@/views/pages/Page404'),
      },
      {
        path: '500',
        name: 'Page500',
        component: () => import('@/views/pages/Page500'),
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/pages/Login'),
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/pages/Register'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/pages/login']
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = localStorage.getItem('token')

  // trying to access a restricted page + not logged in
  // redirect to login page
  if (authRequired && !loggedIn) {
    next('/pages/login')
  } else {
    next()
  }
})

export default router
