<template>
  <q-card>
    <q-card-section class="row">
      <div>
        <q-chip
          icon="bar_chart"
          label="Daftar Paket"
          class="text-weight-bolder"
        />
      </div>
      <q-space />
      <div :style="!$q.screen.gt.sm ? '' : 'margin-top:10px;'">
        <q-space v-if="$q.screen.lt.sm" />
      </div>
    </q-card-section>

    <q-virtual-scroll
      type="table"
      :style="$q.screen.gt.md ? 'height: 75vh' : 'height: 70vh'"
      :virtual-scroll-item-size="48"
      :virtual-scroll-sticky-size-start="48"
      :virtual-scroll-sticky-size-end="32"
      :items="wahanaStore().paket"
    >
      <template v-slot:before>
        <thead class="thead-sticky">
          <tr class="text-left bg-grey-8">
            <th
              class="text-h4 text-weight-bolder text-white"
              v-for="col in columns"
              :key="'1--' + col.name"
              :align="col.align"
            >
              {{ col.name }}
            </th>
          </tr>
        </thead>
      </template>

      <template v-if="!wahanaStore().paket.length" v-slot:after>
        <tr>
          <td align="center" colspan="7" class="text-grey-5">
            <h5>Tidak ada wahana</h5>
          </td>
        </tr>
      </template>
      <!-- class="glass-light" -->
      <template v-slot="{ item: row, index }">
        <tr :key="index" :class="index % 2 == 0 ? 'bg-white' : 'bg-grey-2'">
          <td>{{ index + 1 }}</td>
          <td align="left">
            <span class="text-subtitle2">{{ row.nama_paket }}</span>
          </td>
          <!-- <td align="center">
            <span class="text-center text-subtitle2">{{ row.harga_tiket }}</span>
          </td> -->
          <td align="center" width="140px">
            <div class="row justify-evenly">
              <span class="text-weight-bolder">Rp</span>
              <span class="text-subtitle2">
                {{
                  parseInt(row.harga_paket)
                    ?.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      currencyDisplay: "code",
                    })
                    .replace("IDR", "")
                    .trim()
                    .split(",")[0]
                }}</span
              >
            </div>
          </td>
          <td align="center" width="130px">
            <div class="row justify-between">
              <span class="text-weight-bolder">Rp</span>
              <span class="text-subtitle2">
                {{
                  parseInt(row.diskon)
                    ?.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      currencyDisplay: "code",
                    })
                    .replace("IDR", "")
                    .trim()
                    .split(",")[0]
                }}</span
              >
            </div>
          </td>
          <td align="center">
            <span class="text-subtitle2">
              {{ row.status ? "Aktif" : "Tidak Aktif" }}</span
            >
          </td>
          <td align="right">
            <!-- @click="reportStore().deleteTransaksiFromDB(row.no_transaksi)" -->
            <q-badge
              text-color="white"
              class="q-ml-md cursor-pointer bg-transparent"
            >
              <q-icon name="delete" color="red" />
            </q-badge>
          </td>
        </tr>
      </template>
    </q-virtual-scroll>

    <q-card-section>
      <!-- <div class="flex row justify-between q-px-sm glass-dark q-py-md">
        <span class="text-h6 text-white"> Total </span>
        <span
          class="text-weight-bolder text-h6 text-white q-mr-sm"
          :style="
            reportStore().diskon > 0 ? 'text-decoration:line-through' : ''
          "
          >{{
            reportStore()
              .totalPendapatanWahana?.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })
              .split(",")[0]
          }}</span
        >
      </div> -->
    </q-card-section>
  </q-card>
</template>

<script setup>
import { wahanaStore } from "src/stores/wahana-store";
import { transaksiStore } from "src/stores/transaksi-store";
import { onMounted, ref } from "vue";
import { date, useQuasar } from "quasar";

const $q = useQuasar();
const todaySelected = ref(false);
const startDateSelected = ref(false);
const endDateSelected = ref(false);
const store = wahanaStore();
// const laporanWahana = ref([]);
const laporanPendapatan = ref([]);
const laporanKunjungan = ref([]);
const timeStamp = date.formatDate(Date.now(), "YYYY/MM/DD");
const datePicker = ref(timeStamp);
const proxyDate = ref(Date.now());
const isToday = ref(false);
const startDate = ref("");
const endDate = ref("");
const columns = [
  { name: "No", prop: "no", align: "left" },
  { name: "Nama Paket", prop: "nama_paket", align: "left" },
  { name: "Harga Paket", prop: "harga_paket", align: "center" },
  { name: "Diskon", prop: "jenis", align: "center" },
  { name: "Status", prop: "status", align: "center" },
  // { name: "TotalBayar", prop: "total_bayar", align: "right" },
  { name: "Hapus", prop: "hapus", align: "right" },
];

// const todayBtn = async () => {
//   isToday.value = !isToday.value;
//   startDateSelected.value = false;
//   endDateSelected.value = false;
//   // Ensure the time zone offset is accounted for so that startDate is set to today's date
//   const today = new Date();
//   today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
//   reportStore().startDate = today.toISOString().split("T")[0];
//   reportStore().endDate = today.toISOString().split("T")[0];
//   await store.getLaporanTransaksiFromDB();
// };

// const dayLabel = (dateValue) => {
//   const daysInIndonesian = {
//     Sunday: "Minggu",
//     Monday: "Senin",
//     Tuesday: "Selasa",
//     Wednesday: "Rabu",
//     Thursday: "Kamis",
//     Friday: "Jumat",
//     Saturday: "Sabtu",
//   };
//   const dayInEnglish = date.formatDate(dateValue, "dddd");
//   const dateInIndonesian = daysInIndonesian[dayInEnglish];

//   return dateValue
//     ? `${dateInIndonesian}, ${date.formatDate(dateValue, "DD-MM-YYYY")}`
//     : "PILIH TANGGAL";
// };

// const startDateLabel = () => dayLabel(startDate.value);
// const endDateLabel = () => dayLabel(endDate.value);

// const updateProxy = () => {
//   proxyDate.value = datePicker.value;
//   // chooseDateSelected.value = true;
// };
// const optionFn = (proxyDate) => {
//   // const aWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
//   return proxyDate <= timeStamp;
// };

// const save = async (type) => {
//   const isDateAfterToday = new Date(proxyDate.value).getTime() > Date.now();

//   if (isDateAfterToday) {
//     $q.notify({
//       color: "negative",
//       textColor: "white",
//       icon: "error",
//       message: "Tanggal tidak boleh lebih dari hari ini!",
//     });
//     return;
//   }
//   if (type === "start") {
//     startDateSelected.value = true;
//     startDate.value = proxyDate.value;
//     endDate.value = proxyDate.value;
//     reportStore().startDate = startDate.value;
//     if (new Date(proxyDate.value).getDate() == new Date(Date.now()).getDate()) {
//       isToday.value = true;
//       todaySelected.value = true;
//     } else {
//       isToday.value = false;
//       todaySelected.value = false;
//     }
//   } else if (type === "end") {
//     endDateSelected.value = true;
//     endDate.value = proxyDate.value;
//     console.log("endate", endDate.value);
//     reportStore().endDate = endDate.value;
//   }

//   await store.getLaporanTransaksiFromDB();
//   // await store.getLaporanPendapatan();
// };

onMounted(async () => {
  await wahanaStore().getPaketFromDB();
  // isToday.value = true;
});
</script>

<style lang="sass">
.thead-sticky tr > *,
.tfoot-sticky tr > *
  position: sticky
  opacity: 1
  z-index: 1

.thead-sticky tr:last-child > *
  top: 0

.tfoot-sticky tr:first-child > *
  bottom: 0
</style>
