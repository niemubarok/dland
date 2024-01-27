const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/dashboard",
        component: () => import("pages/dashboardPage.vue"),
        meta: {
          requireHeader: true,
          requireSideNav: true,
        },
      },
      {
        path: "",
        meta: {
          requireHeader: false,
          requireSideNav: false,
        },
        component: () => import("pages/TicketingPage.vue"),
      },
      {
        path: "/laporan/transaksi",
        meta: {
          requireHeader: true,
          requireSideNav: true,
        },
        component: () => import("pages/LaporanTransaksiPage.vue"),
      },
      {
        path: "/qrcode",
        meta: {
          requireHeader: false,
          requireSideNav: false,
        },
        component: () => import("pages/QrScannerPage.vue"),
      },
      {
        path: "/print",
        meta: {
          requireHeader: false,
          requireSideNav: false,
        },
        component: () => import("pages/PrintPage.vue"),
      },
      {
        path: "/settings",
        meta: {
          requireHeader: true,
          requireSideNav: true,
        },
        component: () => import("pages/SettingsPage.vue"),
      },
      {
        path: "/wahana",
        meta: {
          requireHeader: true,
          requireSideNav: true,
        },
        component: () => import("pages/MasterWahanaPage.vue"),
      },
      {
        path: "/paket",
        meta: {
          requireHeader: true,
          requireSideNav: true,
        },
        component: () => import("pages/DaftarPaketPage.vue"),
      },
      {
        path: "/laporan/kunjungan-per-wahana",
        meta: {
          requireHeader: true,
          requireSideNav: true,
        },
        component: () => import("pages/LaporanKunjunganPerWahanaPage.vue"),
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
