<template>
  <q-page
    class="flex column flex-start card-gradient"
    style="overflow-y: auto"
    padding
  >
    <div class="full-width flex row flex-center">
      <template v-for="data in dataPenjualan" :key="data.caption">
        <CardNumber
          :caption="data.caption"
          :number="data.number"
          class="col-md col-xs-11 q-my-sm q-mx-sm"
          style="height: 20vh"
        />
      </template>
    </div>
    <div class="row">
      <!-- style="width: 60vw" -->
      <BarChart
        class="col q-ma-md"
        :chart-data="chartStore().kunjunganPerBulan"
      />
      <!-- style="width: 60vw" -->
      <BarChart
        class="col q-ma-md"
        :chart-data="chartStore().kunjunganPerMinggu"
      />
    </div>
  </q-page>
</template>

<script setup>
import { defineComponent } from "vue";
import GrowingNumber from "src/components/GrowingNumber.vue";
import CardNumber from "src/components/CardNumber.vue";
import BarChart from "src/components/BarChart.vue";
import { chartStore } from "src/stores/chart-store";

const dataPenjualan = [
  {
    caption: "Jumlah Wahana",
    number: 10,
    icon: "",
  },
  {
    caption: "Pengunjung / Hari",
    number: 1000,
    icon: "trending_up",
  },
  {
    caption: "Pengunjung / Bulan",
    number: 1000000,
    icon: "trending_up",
  },
  {
    caption: "Pendapatan / Hari ",
    number: 31000000,
    icon: "trending_up",
  },
  {
    caption: "Pendapatan / Bulan ",
    number: 5000000000,
    icon: "trending_up",
  },
];
</script>
