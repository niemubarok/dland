<template>
  <!-- <q-page class="fixed-center full-width"> -->
  <div
    class="full-width"
    style="overflow-y: hidden"
    :class="{
      'q-mt-md': $q.platform.is.mobile,
      '': $q.platform.is.desktop,
    }"
  >
    <div class="full-width">
      <q-card class="glass-dark flex items-center justify-between">
        <div
          class="text-subtitle2 text-weight-bolder text-white text-start q-px-md"
        >
          Depok Fantasy Land
        </div>
        <div class="text-body text-weight-bolder text-white text-start q-px-md">
          Administrator | Shift 1 |
          <Clock />
        </div>
      </q-card>
    </div>
    <!-- 'q-mt-sm': $q.platform.desktop, -->
    <!-- <div
      class="text-subtitle1 text-weight-bolder text-white text-center glass-dark q-mt-xs"
    >
      DEPOK FANTASY LAND TICKETING SYSTEM
    </div> -->
    <!-- <q-header class="glass-dark q-mt-lg">
      <q-card class="col-md-3 glass-light q-ma-xs">
        <div class="text-subtitle1 q-ma-xs q-ml-md">Detail Pesanan Tiket</div>
        <q-separator inset dark />
        <q-card-section>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </q-card-section>
        <q-card-section>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </q-card-section>
        <q-card-section>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </q-card-section>
      </q-card>
    </q-header> -->
    <div class="flex row full-width text-center q-mt-md">
      <DetailTransaksi v-if="$q.screen.gt.sm" />
      <q-card flat class="col q-ma-xs q-pa-sm glass-light" style="height: 89vh">
        <!-- <div class="text-weight-bolder text-body text-white q-mb-md">
          Daftar Wahana
        </div>
        <q-separator spaced inset dark /> -->

        <DetailTransaksi v-if="$q.screen.lt.sm" />
        <div
          class="flex row q-gutter-md flex-center q-mt-md"
          style="overflow-y: auto"
          :style="$q.screen.lt.sm ? { height: '40vh' } : { height: '76vh' }"
        >
          <div
            v-for="(wahana, index) in wahanaStore().daftarWahana"
            :key="wahana"
          >
            <WahanaCard
              :id="wahana.id.toString()"
              :name="wahana.name"
              :tarif="wahana.tarif"
            />
            <!-- <TicketCard /> -->
          </div>
        </div>
        <div class="full-width flex row flex-center q-mt-md gap-sm">
          <span class="text-dark"> Paket : </span>
          <q-btn
            push
            color="brown-9"
            label="Semua"
            @click="qtyDialog = true"
            class="q-mx-xs"
          />
          <q-btn push color="brown-9" label="Paket 1" class="q-mx-xs" />
          <q-btn push color="brown-9" label="Paket 2" class="q-mx-xs" />
          <!-- class="rounded-10" -->
        </div>
      </q-card>
    </div>

    <!-- </q-page> -->
  </div>

  <q-dialog v-model="qtyDialog">
    <q-card class="glass-light q-pa-lg relative">
      <q-card-section class="row items-center">
        <q-input
          autofocus
          v-model="qty"
          color="yellow"
          type="number"
          label="Masukkan Jumlah tiket"
        />
        <!-- @keydown.enter.prevent="selectAllWahana" -->
      </q-card-section>
      <q-card-actions align="right">
        <div>
          <q-avatar
            size="20px"
            class="cursor-pointer z-top absolute-top-right q-ma-sm"
            text-color="grey-7"
            color="grey-5"
            icon="close"
            v-close-popup
          />
        </div>
        <!-- label="ENTER" -->
        <q-btn
          push
          icon="check"
          color="brown-9"
          v-close-popup
          @click="selectAllWahana"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { wahanaStore } from "src/stores/wahana-store";
import Clock from "src/components/Clock.vue";
import DetailTransaksi from "src/components/DetailTransaksi.vue";
import WahanaCard from "src/components/WahanaCard.vue";
import TicketCard from "src/components/TicketCard.vue";
import PaymentDialog from "src/components/PaymentDialog.vue";
import { transaksiStore } from "src/stores/transaksi-store";
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";

const $q = useQuasar();
const qtyDialog = ref(false);
const qty = ref();

const selectAllWahana = () => {
  wahanaStore().daftarWahana.forEach((wahana) => {
    const data = ref({
      id: "",
      name: "",
      qty: qty.value,
      tarif: "",
      totalTarif: "",
    });
    data.value.id = wahana.id?.toString();
    data.value.name = wahana.name;
    data.value.tarif = wahana.tarif;
    data.value.totalTarif = wahana.tarif * qty.value;

    transaksiStore().detailTransaksi.push(data.value);
    qtyDialog.value = false;
  });
  // console.log(data.value);
  // transaksiStore().addTransaksi(data.value);
};

// const onClickCash = () => {
//   const dialog = $q.dialog({
//     component: PaymentDialog,

//   })

//   dialog.update()
//   // transaksiStore().addTransaksi();
// };

onMounted(async () => {
  const handleKeyDown = async (event) => {
    if (event.key === "Enter" && !qtyDialog.value) {
      // await onSaveSettings();
    }
  };
  window.addEventListener("keydown", handleKeyDown);
});
</script>
<style></style>
