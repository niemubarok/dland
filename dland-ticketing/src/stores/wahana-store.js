import { defineStore } from "pinia";

export const wahanaStore = defineStore("wahana", {
  state: () => ({
    daftarWahana: [
      {
        id: 1,
        name: "Ticket Masuk",
        tarif: 0,
      },
      {
        id: 2,
        name: "Rainbow Slide",
        tarif: 15000,
      },
      {
        id: 3,
        name: "Kora Kora",
        tarif: 20000,
      },
      {
        id: 4,
        name: "Kincir Angin",
        tarif: 10000,
      },
      {
        id: 5,
        name: "Ontang Anting",
        tarif: 10000,
      },
      {
        id: 6,
        name: "Kuda Putar",
        tarif: 10000,
      },
      {
        id: 7,
        name: "Bom Bom Car",
        tarif: 10000,
      },
      {
        id: 8,
        name: "Wahana 8",
        tarif: 10000,
      },
      {
        id: 9,
        name: "Wahana 9",
        tarif: 10000,
      },
      {
        id: 10,
        name: "Wahana 10",
        tarif: 10000,
      },
      {
        id: 11,
        name: "Wahana 11",
        tarif: 10000,
      },
      {
        id: 12,
        name: "Wahana 12",
        tarif: 10000,
      },
      {
        id: 13,
        name: "Wahana 13",
        tarif: 10000,
      },
    ],
  }),

  getters: {
    doubleCount(state) {
      return state.counter * 2;
    },
  },

  actions: {
    increment() {
      this.counter++;
    },
  },
});
