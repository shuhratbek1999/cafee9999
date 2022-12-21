export default [
  {
    component: 'CNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: 'cil-speedometer',
  },
  {
    component: 'CNavTitle',
    name: 'Components',
  },
  {
    component: 'CNavGroup',
    name: 'Kirim_Xujjat',
    to: '/kirim_docs',
    icon: 'cil-calculator',
    items: [
      {
        component: 'CNavItem',
        name: 'Sklad',
        to: '/kirim_docs/sklad',
      },
      {
        component: 'CNavItem',
        name: "Ta'minotchilar",
        to: '/kirim_docs/taminotchilar',
      },
      {
        component: 'CNavItem',
        name: 'Oshpazlar',
        to: '/kirim_docs/chief',
      },
      {
        component: 'CNavItem',
        name: 'Ofitsantlar',
        to: '/kirim_docs/waiter',
      },
      {
        component: 'CNavItem',
        name: 'Kassirlar',
        to: '/kirim_docs/caisher',
      },
      {
        component: 'CNavItem',
        name: 'Ishchilar',
        to: '/kirim_docs/worker',
      },
      {
        component: 'CNavItem',
        name: "Ishchiga to'lov",
        to: '/kirim_docs/doc_salary',
      },
      {
        component: 'CNavItem',
        name: 'Xomashyolar',
        to: '/kirim_docs/foods',
      },
      {
        component: 'CNavItem',
        name: "O'lchov birlik",
        to: '/kirim_docs/measure',
      },
      {
        component: 'CNavItem',
        name: 'Kirimlar',
        to: '/kirim_docs/kirimlar',
      },
      {
        component: 'CNavItem',
        name: 'Test',
        to: '/kirim_docs/test',
      },
    ],
  },
  {
    component: 'CNavGroup',
    name: 'Savdo xujjat',
    to: '/savdo_docs',
    icon: 'cil-chart-pie',
    items: [
      {
        component: 'CNavItem',
        name: "Bo'lim",
        to: '/savdo_docs/branch',
      },
      {
        component: 'CNavItem',
        name: 'Xonalar',
        to: '/savdo_docs/room',
      },
      {
        component: 'CNavItem',
        name: 'Stol',
        to: '/savdo_docs/table',
      },
      {
        component: 'CNavItem',
        name: "Qo'shimcha hizmat",
        to: '/savdo_docs/extra-service',
      },
      {
        component: 'CNavItem',
        name: 'Xuquqlar',
        to: '/savdo_docs/role',
      },
      {
        component: 'CNavItem',
        name: 'Mijozlar',
        to: '/savdo_docs/client',
      },
      {
        component: 'CNavItem',
        name: 'Taom',
        to: '/savdo_docs/food',
      },
      {
        component: 'CNavItem',
        name: 'Buyurtmalar',
        to: '/savdo_docs/order',
      },
      {
        component: 'CNavItem',
        name: 'Ovqat Yetkazib berish',
        to: '/savdo_docs/food-distrubute',
      },
      {
        component: 'CNavItem',
        name: 'Ovqat group',
        to: '/savdo_docs/food-group',
      },
      {
        component: 'CNavItem',
        name: 'Printer',
        to: '/savdo_docs/printer',
      },
    ],
  },
  {
    component: 'CNavGroup',
    name: "To'lovlar",
    to: '/payments',
    icon: 'cilDollar',
    items: [
      {
        component: 'CNavItem',
        name: "Taminotchiga to'lov",
        to: '/payments/pay-supplier',
      },
      {
        component: 'CNavItem',
        name: "Ishchiga to'lov",
        to: '/payments/pay-worker',
      },
      {
        component: 'CNavItem',
        name: "Ofitsantga to'lov",
        to: '/payments/pay-waiter',
      },
      {
        component: 'CNavItem',
        name: "Oshpazga to'lov",
        to: '/payments/pay-chief',
      },
    ],
  },
  {
    component: 'CNavGroup',
    name: 'Hisobotlar Sverka',
    to: '/report-act',
    icon: 'cil-laptop',
    items: [
      {
        component: 'CNavItem',
        name: "Ta'minotchilar",
        to: '/report-act/supplier',
      },
      {
        component: 'CNavItem',
        name: 'Kassa',
        to: '/report-act/cash',
      },
      {
        component: 'CNavItem',
        name: 'Mahsulotlar',
        to: '/report-act/product',
      },
      {
        component: 'CNavItem',
        name: 'Sotilgan taomlar',
        to: '/report-act/sold-food',
      },
    ],
  },
  {
    component: 'CNavGroup',
    name: 'Hisobotlar',
    to: '/report',
    icon: 'cil-laptop',
    items: [
      {
        component: 'CNavItem',
        name: 'Restir kassa',
        to: '/report/restir-caisher',
      },
      {
        component: 'CNavItem',
        name: 'Bekor qilingan taomlar',
        to: '/report/refound-food',
      },
      {
        component: 'CNavItem',
        name: "Ta'minotchi",
        to: '/report/supplier',
      },
      {
        component: 'CNavItem',
        name: 'Offitsant',
        to: '/report/waiter',
      },
      {
        component: 'CNavItem',
        name: 'Foyda hisoboti',
        to: '/report/profit-food',
      },
    ],
  },
  {
    component: 'CNavItem',
    name: 'Savdo oynasi',
    to: '/selling-window-entry',
    icon: 'cil-speedometer',
  },
  {
    component: 'CNavTitle',
    name: 'Extras',
  },
  {
    component: 'CNavGroup',
    name: 'Pages',
    to: '/pages',
    icon: 'cil-star',
    items: [
      {
        component: 'CNavItem',
        name: 'Login',
        to: '/pages/login',
      },
      {
        component: 'CNavItem',
        name: 'Register',
        to: '/pages/register',
      },
      {
        component: 'CNavItem',
        name: 'Error 404',
        to: '/pages/404',
      },
      {
        component: 'CNavItem',
        name: 'Error 500',
        to: '/pages/500',
      },
    ],
  },

  // {
  //   component: 'CNavItem',
  //   name: 'Download CoreUI',
  //   href: 'http://coreui.io/vue/',
  //   icon: { name: 'cil-cloud-download', class: 'text-white' },
  //   _class: 'bg-success text-white',
  //   target: '_blank'
  // },
  // {
  //   component: 'CNavItem',
  //   name: 'Try CoreUI PRO',
  //   href: 'http://coreui.io/pro/vue/',
  //   icon: { name: 'cil-layers', class: 'text-white' },
  //   _class: 'bg-danger text-white',
  //   target: '_blank'
  // }
]
