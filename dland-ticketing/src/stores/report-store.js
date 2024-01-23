import { defineStore } from "pinia";
import { ref } from "vue";
import { api } from "boot/axios";

export const reportStore = defineStore("report", {
  state: () => ({
    totalPendapatan: ref(0),
    pendapatanPerHari: ref(0),
    pendapatanPerBulan: ref(0),
    kunjunganWahanaPerHari: ref(0),
    kunjunganWahanaPerBulan: ref(0),
    totalKunjunganWahana: ref(0),
    totalKunjungan: ref(0),
    kunjunganPerHari: ref(0),
    kunjunganPerBulan: ref(0),
  }),

  getters: {
    doubleCount(state) {
      return state.counter * 2;
    },
  },

  actions: {
    async getPendapatan() {
      try {
        const res = await api.get("reports/pendapatan");
        const pendapatan = res.data;
        // console.log(pendapatan);
        // return pendapatan;
        this.totalPendapatan = pendapatan.totalPendapatan;
        this.pendapatanPerHari = pendapatan.pendapatanPerHari;
        this.pendapatanPerBulan = pendapatan.pendapatanPerBulan;
      } catch (err) {
        console.log(err);
      }
    },
    async getKunjungan() {
      try {
        const res = await api.get("reports/kunjungan");
        this.totalKunjungan = res.data.totalKunjungan;
        this.kunjunganPerHari = res.data.kunjunganPerHari;
        this.kunjunganPerBulan = res.data.kunjunganPerBulan;
      } catch (err) {
        console.log(err);
      }
    },
  },
});
