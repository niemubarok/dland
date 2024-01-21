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
          :icon="data.icon"
          class="col-md col-xs-11 q-my-sm q-mx-sm"
          style="height: 20vh"
        />
      </template>
    </div>
    <div class="row">
      <BarChart
        class="col q-ma-md"
        :chart-data="chartStore().kunjunganPerBulan"
      />
      <BarChart
        class="col q-ma-md"
        :chart-data="chartStore().kunjunganPerMinggu"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import GrowingNumber from "src/components/GrowingNumber.vue";
import CardNumber from "src/components/CardNumber.vue";
import BarChart from "src/components/BarChart.vue";
import { chartStore } from "src/stores/chart-store";
import { reportStore } from "src/stores/report-store";

const totalPendapatan = ref(0);
const pendapatanPerHari = ref(0);
const pendapatanPerBulan = ref(0);

onMounted(async () => {
  const pendapatan = await reportStore().getPendapatan();

  totalPendapatan.value = pendapatan.totalPendapatan;
  pendapatanPerHari.value = pendapatan.pendapatanPerHari;
  pendapatanPerBulan.value = pendapatan.pendapatanPerBulan;
});

// Menggunakan komputasi dinamis untuk properti number
const dataPenjualan = ref([
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
    get number() {
      return pendapatanPerHari.value;
    },
    icon: "trending_up",
  },
  {
    caption: "Pendapatan / Bulan ",
    get number() {
      return pendapatanPerBulan.value;
    },
    icon: "trending_up",
  },
]);
</script>
