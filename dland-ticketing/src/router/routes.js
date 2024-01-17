const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/IndexPage.vue"),
        meta: {
          requireHeader: true,
          requireSideNav: true,
        },
      },
      {
        path: "/ticketing",
        meta: {
          requireHeader: false,
          requireSideNav: false,
        },
        component: () => import("pages/TicketingPage.vue"),
      },
      {
        path: "/topup",
        meta: {
          requireHeader: false,
          requireSideNav: false,
        },
        component: () => import("pages/TopUpPage.vue"),
      },
      {
        path: "/qrcode",
        meta: {
          requireHeader: false,
          requireSideNav: false,
        },
        component: () => import("pages/QrScannerPage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
