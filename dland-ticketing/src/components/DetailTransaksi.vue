<template>
  <q-card class="col-md-4 glass-light q-ma-xs">
    <!-- style="height: 75vh;" -->
    <!-- <img src="https://cdn.quasar.dev/img/mountains.jpg" /> -->
    <!-- <q-card-section> -->
    <div class="text-h6 text-white glass-dark">Detail Transaksi</div>
    <q-separator dark />
    <!-- <div class="text-subtitle2">by John Doe</div> -->
    <!-- </q-card-section> -->
    <!-- <q-card-section style="overflow-y: auto"> -->
    <!-- :style="$q.screen.lt.sm ? 'height: 30vh' : 'height: 75vh;'" -->
    <!-- <template v-for="data in transaksiStore().detailTransaksi" :key="data"> -->

    <q-item class="glass-dark">
      <q-item-section>
        <div class="row no-wrap items-center text-white text-weight-bolder">
          <div class="col-5 text-left">Nama Wahana</div>
          <div class="col-1 text-center">Qty</div>
          <div class="col-5 text-center">Tarif</div>
          <div
            class="col-1 text-right cursor-pointer q-pr-xs"
            @click="transaksiStore().resetTransaksi()"
          >
            <q-icon name="delete" color="red" />
          </div>
        </div>
      </q-item-section>
    </q-item>

    <q-virtual-scroll
      type="table"
      style="height: 50vh"
      :virtual-scroll-item-size="48"
      :virtual-scroll-sticky-size-start="48"
      :virtual-scroll-sticky-size-end="32"
      :items="transaksiStore().detailTransaksi"
      class="glass-light"
    >
      <template v-slot="{ item: row, index }">
        <tr :key="index">
          <td align="left">
            <span class="text-subtitle2">{{ row.name }}</span>
          </td>
          <td align="left">
            <span class="text-center text-subtitle2">{{ row.qty }}</span>
          </td>
          <td align="right">
            <span class="text-subtitle2">
              {{
                row.totalTarif
                  .toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })
                  .split(",")[0]
              }}</span
            >
            <q-badge
              @click="transaksiStore().removeTransaksi(row.id)"
              text-color="white"
              class="q-ml-md cursor-pointer bg-transparent"
            >
              <q-icon name="delete" color="red" />
            </q-badge>
          </td>
        </tr>
      </template>
    </q-virtual-scroll>
    <div class="flex row justify-between q-px-sm glass-dark q-py-md">
      <span class="text-weight-bolder text-h6 text-white"> Total Bayar </span>
      <span class="text-weight-bolder text-h5 text-white q-mr-sm">{{
        totalBayar
          .toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
          })
          .split(",")[0]
      }}</span>
    </div>
    <!-- </q-card-section> -->
    <q-card-actions align="center">
      <q-btn
        size="lg"
        push
        :label="'QRIS'"
        class="col bg-brown-9 text-white text-weight-bolder q-mt-sm"
        @click="onClickBayar('qris')"
      />
      <q-btn
        size="lg"
        push
        :label="'CASH'"
        class="col bg-green-9 text-white text-weight-bolder q-mt-sm"
        @click="onClickBayar('cash')"
        @keydown.enter.prevent=""
      />
      <!-- <q-btn flat label="Action 2" /> -->
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { transaksiStore } from "src/stores/transaksi-store";
import { computed } from "vue";
import { useQuasar } from "quasar";
import PaymentDialog from "src/components/PaymentDialog.vue";

const $q = useQuasar();
const totalBayar = computed(() => {
  const total = transaksiStore().detailTransaksi.reduce(
    (a, b) => a + b.totalTarif,
    0
  );
  transaksiStore().totalBayar = total;
  return total;
});

const onClickBayar = (method) => {
  // transaksiStore().bayar();

  if (method == "cash") {
    const dialog = $q.dialog({
      component: PaymentDialog,
    });

    dialog.update();
  }
};
// const columns = ["Nama", "Qty", "Tarif"];
</script>

<style lang="sass" scoped>
.thead-sticky tr > *,
.tfoot-sticky tr > *
  position: sticky
  opacity: 1
  z-index: 1
  background: #FFFFFF
  color: #000000

.thead-sticky tr:last-child > *
  top: 0

.tfoot-sticky tr:first-child > *
  bottom: 0
</style>
