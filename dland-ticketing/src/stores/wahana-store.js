import { defineStore } from "pinia";
import { api } from "boot/axios";
import { ref } from "vue";
import { transaksiStore } from "./transaksi-store";

export const wahanaStore = defineStore("wahana", {
  state: () => ({
    // daftarWahana: [
    //   {
    //     id: 1,
    //     name: "Ticket Masuk",
    //     tarif: 0,
    //   },
    //   {
    //     id: 2,
    //     name: "Rainbow Slide",
    //     tarif: 15000,
    //   },
    //   {
    //     id: 3,
    //     name: "Kora Kora",
    //     tarif: 20000,
    //   },
    //   {
    //     id: 4,
    //     name: "Kincir Angin",
    //     tarif: 10000,
    //   },
    //   {
    //     id: 5,
    //     name: "Ontang Anting",
    //     tarif: 10000,
    //   },
    //   {
    //     id: 6,
    //     name: "Kuda Putar",
    //     tarif: 10000,
    //   },
    //   {
    //     id: 7,
    //     name: "Bom Bom Car",
    //     tarif: 10000,
    //   },
    //   {
    //     id: 8,
    //     name: "Wahana 8",
    //     tarif: 10000,
    //   },
    //   {
    //     id: 9,
    //     name: "Wahana 9",
    //     tarif: 10000,
    //   },
    //   {
    //     id: 10,
    //     name: "Wahana 10",
    //     tarif: 10000,
    //   },
    //   {
    //     id: 11,
    //     name: "Wahana 11",
    //     tarif: 10000,
    //   },
    //   {
    //     id: 12,
    //     name: "Wahana 12",
    //     tarif: 10000,
    //   },
    //   {
    //     id: 13,
    //     name: "Wahana 13",
    //     tarif: 10000,
    //   },
    // ],

    daftarWahana: ref([]),
    paket: ref([
      {
        idPaket: 1,
        namaPaket: "Paket Terusan",
        hargaPaket: 75000,
        diskon: 35000,
        status: true,
        idWahana: [0, 3, 5, 6, 7, 8, 9, 10, 11,12, 13],
      },
      // {
      //   idPaket: 2,
      //   namaPaket: "Paket Terusan (WeekDay)",
      //   hargaPaket: 75000,
      //   diskon: 30000,
      //   status: true,
      //   idWahana: [0,4, 5, 6, 7, 8, 9, 10, 11, 13],
      // },
      {
        idPaket: 3,
        namaPaket: "Paket Anak",
        hargaPaket: 65000,
        diskon: 15000,
        status: true,
        idWahana: [ 6, 8, 10, 11, 7, 12, 13],
      },
      {
        idPaket: 4,
        namaPaket: "Paket Dewasa",
        hargaPaket: 30000,
        diskon: 5000,
        status: true,
        idWahana: [ 3, 9],
      },
    ]),
    namaPaketTerpilih:ref("")
  }),

  getters: {
    doubleCount(state) {
      return state.counter * 2;
    },
  },

  actions: {
    async getWahanaFromDB() {
      const res = await api.get("wahana");
      this.daftarWahana.splice(0, ...res.data);
      console.log(res.data);
    },
    pilihPaket(paket, daftarWahana) {
      console.log("paket", paket);
      // Mendapatkan array wahana yang sesuai dengan paket dari daftarWahana
      const wahanaTerpilih = daftarWahana.filter((wahana) =>
        paket.idWahana.includes(wahana.id_wahana)
      );

      this.namaPaketTerpilih = paket.namaPaket

      console.log("wahana terpilih", wahanaTerpilih);

      // Menghitung total harga tiket untuk paket
      const totalHarga = wahanaTerpilih.reduce(
        (total, wahana) => total + parseFloat(wahana.harga_tiket),
        0
      );

      // Menentukan diskon
      const diskon = paket.diskon;
      transaksiStore().diskon = diskon;

      // Menentukan status (misalnya, status selalu true)
      const status = true;

      // Membuat objek paket
      const paketObj = {
        idPaket: 2,
        namaPaket: "Paket Terusan (WeekDay)",
        hargaPaket: totalHarga,
        diskon: diskon,
        status: status,
        idWahana: paket,
      };

      // Membuat array detail transaksi berdasarkan wahana terpilih
      const pushWahana = wahanaTerpilih.map((wahana) => {
        return {
          id_wahana: wahana.id_wahana.toString(),
          nama: wahana.nama,
          tarif: parseFloat(wahana.harga_tiket),
          total_bayar: parseFloat(wahana.harga_tiket),
          qty: 1,
        };
      });

      transaksiStore().detailTransaksi.push(...pushWahana);

      // return {
      //   paket: paket,
      //   detailTransaksi: detailTransaksi,
      // };
    },
  },
});
