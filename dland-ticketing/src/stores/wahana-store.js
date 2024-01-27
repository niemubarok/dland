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
      // {
      //   idPaket: 1,
      //   namaPaket: "Paket Terusan",
      //   hargaPaket: 75000,
      //   diskon: 35000,
      //   status: true,
      //   idWahana: [0, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13],
      // },
      // {
      //   idPaket: 3,
      //   namaPaket: "Paket Anak A",
      //   hargaPaket: 65000,
      //   diskon: 0,
      //   status: true,
      //   idWahana: [5, 12, 8],
      // },
      // {
      //   idPaket: 4,
      //   namaPaket: "Paket Anak B",
      //   hargaPaket: 65000,
      //   diskon: 5000,
      //   status: true,
      //   idWahana: [13, 6, 10, 11],
      // },
    ]),
    detailPaket: ref([]),
    namaPaketTerpilih: ref(""),
  }),

  // getters: {
  //   doubleCount(state) {
  //     return state.counter * 2;
  //   },
  // },

  actions: {
    async getWahanaFromDB() {
      const res = await api.get("wahana");
      this.daftarWahana.splice(0, this.daftarWahana.length, ...res.data);

      console.log(res.data);
    },

    async getDetailPaketFromDB() {
      const res = await api.get("paket/detail");
      this.detailPaket.splice(0, this.paket.length, ...res.data);
      console.log(res.data);
    },
    pilihPaket(paket, daftarWahana) {
      // Mendapatkan array wahana yang sesuai dengan paket dari daftarWahana
      const wahanaTerpilih = daftarWahana.filter((wahana) =>
        paket.idWahana?.includes(wahana.id_wahana)
      );

      this.namaPaketTerpilih = paket.namaPaket;

      console.log("wahana terpilih", wahanaTerpilih);

      // Menghitung total harga tiket untuk paket
      const totalHarga = wahanaTerpilih.reduce(
        (total, wahana) => total + parseFloat(wahana.harga_tiket),
        0
      );

      // Menentukan diskon
      const diskon = paket.diskon;
      const totalAfterDiskon = parseInt(totalHarga) - parseInt(diskon);
      transaksiStore().totalBayar = totalHarga;
      transaksiStore().diskon = diskon;
      transaksiStore().totalAfterDiskon = totalAfterDiskon;

      // Menentukan status (misalnya, status selalu true)
      const status = true;

      // Membuat objek paket
      // const paketObj = {
      //   idPaket: 2,
      //   namaPaket: "Paket Terusan (WeekDay)",
      //   hargaPaket: totalHarga,
      //   diskon: diskon,
      //   status: status,
      //   idWahana: paket,
      // };

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

      // console.log("paket", pushWahana);
      // return;

      //  console.log(pushWahana)
      //  return

      transaksiStore().detailTransaksi.push(...pushWahana);
      console.log(transaksiStore().detailTransaksi);
      return;

      // return {
      //   paket: paket,
      //   detailTransaksi: detailTransaksi,
      // };
    },

    async getPaketFromDB() {
      const res = await api.get("paket/detail");
      this.paket.splice(0, this.paket.length, ...res.data);
      console.log(res.data);
    },
    async addMasterWahanaToDB(data) {
      try {
        const res = await api.post("wahana/add", data);
        console.log(res.data);
        if (res.status === 201) {
          this.daftarWahana.push(data);
          return true;
        } else {
          return false;
        }
      } catch (err) {
        return err;
      }
    },
    async editMasterWahanaOnDB(id, column, value) {
      try {
        const res = await api.post("wahana/edit", { id, column, value });

        if (res.status === 201) {
          const index = this.daftarWahana.findIndex(
            (wahana) => wahana.id_wahana === id
          );
          if (index !== -1) {
            Object.assign(this.daftarWahana[index], { [column]: value });
            console.log(
              `Wahana with ID ${id} updated:`,
              this.daftarWahana[index]
            );
          } else {
            console.log(`Wahana with ID ${id} not found.`);
          }
          return true;
        } else {
          return false;
        }
      } catch (err) {
        return err;
      }
    },
    async deleteMasterWahanaFromDB(id) {
      try {
        const res = await api.post("wahana/delete", { id });
        if (res.status === 201) {
          const index = this.daftarWahana.findIndex(
            (wahana) => wahana.id_wahana === id
          );
          if (index !== -1) {
            this.daftarWahana.splice(index, 1);
            console.log(`Wahana with ID ${id} deleted.`);
          } else {
            console.log(`Wahana with ID ${id} not found.`);
          }
          return true;
        } else {
          return false;
        }
      } catch (err) {
        return err;
      }
    },
  },
});
