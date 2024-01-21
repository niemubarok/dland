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
          <q-btn flat icon="dashboard" @click="$router.push('/dashboard')" />
          Depok Fantasy Land
        </div>
        <div class="text-body text-weight-bolder text-white text-start q-px-md">
          {{ ls.get("petugas")?.nama }}
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
              :id="wahana.id_wahana.toString()"
              :nama="wahana.nama"
              :tarif="parseInt(wahana.harga_tiket)"
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

          <template v-for="paket in wahanaStore().paket" :key="paket.idPaket">
            <q-btn
              push
              color="brown-9"
              :label="paket.namaPaket"
              class="q-mx-xs"
              @click="pilihPaket(paket)"
            />
          </template>
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
import { ref, onMounted, onBeforeMount } from "vue";
import { useQuasar } from "quasar";
import ls from "localstorage-slim";
import LoginDialog from "src/components/LoginDialog.vue";

const $q = useQuasar();
const qtyDialog = ref(false);
const qty = ref();

const selectAllWahana = () => {
  wahanaStore().daftarWahana.forEach((wahana) => {
    const data = ref({
      id_wahana: "",
      nama: "",
      qty: qty.value,
      tarif: "",
      total_bayar: "",
    });
    data.value.id_wahana = wahana.id_wahana?.toString();
    data.value.nama = wahana.nama;
    data.value.tarif = wahana.harga_tiket;
    data.value.total_bayar = wahana.harga_tiket * qty.value;

    console.log("test", data.value);
    transaksiStore().detailTransaksi.push(data.value);
    qtyDialog.value = false;
  });
  // console.log(data.value);
  // transaksiStore().addTransaksi(data.value);
};

const pilihPaket = async (paket) => {
  wahanaStore().pilihPaket(paket, wahanaStore().daftarWahana);
  const store = await transaksiStore().insertIntoDB();

  const data = {
    transaksi: transaksiStore().detailTransaksi,
    diskon: transaksiStore().diskon,
    totalAfterDiskon: transaksiStore().totalAfterDiskon,
    totalBayar: transaksiStore().totalBayar,
    namaPaket: wahanaStore().namaPaketTerpilih,
  };
  // console.log("store", store);
  if (store) {
    window.electron.createPDFStruk("Depok Fantasy Land", JSON.stringify(data));
    window.electron.print();
    $q.notify({
      message: "Berhasil",
      color: "green",
      position: "top",
    });

    // dialogRef.value.hide();
  } else {
    const existingTransaksiGagal = ls.get("transaksi_gagal", []);
    const newTransaksiGagal = transaksiStore().detailTransaksi;
    const combinedTransaksiGagal = [
      ...existingTransaksiGagal,
      ...newTransaksiGagal,
    ];
    ls.set("transaksi_gagal", combinedTransaksiGagal);
    $q.notify({
      message: "Gagal",
      color: "nagative",
      position: "top",
    });
  }
};

// const onClickCash = () => {
//   const dialog = $q.dialog({
//     component: PaymentDialog,

//   })

//   dialog.update()
//   // transaksiStore().addTransaksi();
// };

onBeforeMount(() => {});

onMounted(async () => {
  if (!ls.get("petugas")) {
    const _loginDialog = $q.dialog({
      component: LoginDialog,
      persistent: true,
      props: {
        type: "login",
      },
    });
    _loginDialog.update();
  }
  await wahanaStore().getWahanaFromDB();
  const handleKeyDown = async (event) => {
    if (event.key === "Enter" && !qtyDialog.value) {
      // await onSaveSettings();
    }
  };
  window.addEventListener("keydown", handleKeyDown);
});
</script>
<style></style>
