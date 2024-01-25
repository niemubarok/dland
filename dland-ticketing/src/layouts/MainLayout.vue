<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-6">
    <q-header v-if="$route.meta.requireHeader" class="bg-brown">
      <q-toolbar>
        <q-btn
          v-if="$route.meta.requireSideNav"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          <q-img
            src="~/assets/logo-dland.png"
            :width="$q.platform.is.desktop ? '250px' : '100px'"
            spinner-color="primary"
            spinner-size="20px"
        /></q-toolbar-title>

        <div>v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="$route.meta.requireSideNav"
      v-model="leftDrawerOpen"
      :mini="componentStore().miniMode"
      bordered
      show-if-above
      class="bg-grey-4 relative"
    >
      <q-list class="bg-transparent">
        <q-item-label header class="flex justify-between">
          <div>Dashboard</div>
        </q-item-label>
        <!-- <q-btn
          v-if="componentStore().miniMode"
          flat
          dense
          icon="menu"
          aria-label="Menu"
          @click="componentStore().toggleMiniMode()"
          class="full-width"
        /> -->

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>

      <q-btn
        flat
        dense
        :icon="componentStore().miniMode ? 'chevron_right' : 'chevron_left'"
        aria-label="Menu"
        @click="componentStore().toggleMiniMode()"
        class="absolute-bottom-right"
      />
    </q-drawer>

    <q-page-container class="full-width">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { defineComponent, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { componentStore } from "src/stores/component-store";

const essentialLinks = [
  {
    title: "Ticketing",
    caption: "Penjualan Tiket",
    icon: "receipt",
    to: "/",
  },

  {
    title: "Laporan",
    // caption: "Top Up Saldo Tiket",
    icon: "bar_chart",
    link: "/laporan",
  },
  // {
  //   title: "QRCode Scanner",
  //   caption: "Scan QrCode Tiket ",
  //   icon: "qr_code",
  //   link: "/qrcode",
  // },
  {
    title: "Settings",
    caption: "Konfigurasi aplikasi",
    icon: "settings",
    link: "",
  },
  // {
  //   title: "Twitter",
  //   caption: "@quasarframework",
  //   icon: "rss_feed",
  //   link: "https://twitter.quasar.dev",
  // },
  // {
  //   title: "Facebook",
  //   caption: "@QuasarFramework",
  //   icon: "public",
  //   link: "https://facebook.quasar.dev",
  // },
  // {
  //   title: "Quasar Awesome",
  //   caption: "Community Quasar projects",
  //   icon: "favorite",
  //   link: "https://awesome.quasar.dev",
  // },
];
const leftDrawerOpen = ref(false);

// essentialLinks: linksList,
// leftDrawerOpen,
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const toggleMiniDrawer = () => {
  mini.value = !mini.value;
};
// };
</script>
