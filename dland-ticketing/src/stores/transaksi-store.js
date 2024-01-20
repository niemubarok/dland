import { defineStore } from "pinia";
import { ref } from "vue";
import { api } from "boot/axios";
// import { wahanaStore } from "./wahana-store";

export const transaksiStore = defineStore("transaksi", {
  state: () => ({
    counter: 0,
    detailTransaksi: ref([]),
    totalTransaksi: ref(0),
    qty: ref(1),
    bayar: ref(0),
    kembalian: ref(0),
    totalBayar: ref(0),
    no_whatsapp: ref(0),
    saldo: ref(),
    isShowPaymentDialog: ref(false),
  }),

  getters: {
    doubleCount(state) {
      return state.counter * 2;
    },
  },

  actions: {
    hitungKembalian() {
      this.kembalian = this.bayar - this.totalBayar;
      return this.kembalian;
    },
    incrementQty() {
      this.qty++;
    },
    qty(id) {
      if (this.detailTransaksi.length) {
        return (
          this.detailTransaksi.detailTransaksi.find(
            (data) => data.id_wahana === id
          ).qty || 0
        );
      }
    },
    decreaseQty(id) {
      const wahanaIndex = this.detailTransaksi.findIndex(
        (item) => item.id === id
      );
      if (wahanaIndex !== -1) {
        const wahana = this.detailTransaksi[wahanaIndex];
        if (wahana.qty > 1) {
          wahana.qty--;
          this.qty = wahana.qty;
          wahana.total_bayar = wahana.tarif * wahana.qty; // Assuming each wahana object has tarifPerQty indicating the price per single quantity
        } else {
          this.detailTransaksi.splice(wahanaIndex, 1);
        }
      }
    },

    addTransaksi(data) {
      const wahana = this.detailTransaksi.find(
        (item) => item.id_wahana === data.id_wahana
      );
      if (wahana) {
        wahana.qty++;
        this.qty = wahana.qty;
        wahana.total_bayar = data.tarif * wahana.qty;
      } else {
        this.detailTransaksi.push({ ...data, qty: 1, total_bayar: data.tarif });
        console.log(this.detailTransaksi);
      }
    },

    removeTransaksi(id) {
      const wahanaIndex = this.detailTransaksi.findIndex(
        (item) => item.id === id
      );
      if (wahanaIndex !== -1) {
        this.detailTransaksi.splice(wahanaIndex, 1);
      }
    },
    resetTransaksi() {
      this.detailTransaksi.splice(0);
    },
    async insertIntoDB() {
      const status = "1";
      const cara_bayar = "cash";
      const petugas = "Husni";

      if (this.detailTransaksi.length) {
        api
          .post("transaksi", {
            data: {
              cara_bayar,
              status,
              petugas,
              transaksi: this.detailTransaksi,
            },
          })
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            console.error("There was an error!", error);
          });
      }

      this.totalBayar = 0;
      this.detailTransaksi.splice(0);
    },
  },
});
