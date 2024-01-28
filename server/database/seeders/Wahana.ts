import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";

import Wahana from "App/Models/Wahana";

export default class extends BaseSeeder {
  public async run() {
    await Wahana.createMany([
      {
        idWahana: 1,
        nama: "Tiket Dewasa A",
        deskripsi: "-",
        hargaTiket: 20000,
        jenis: "weekday",
      },
      {
        idWahana: 2,
        nama: "Tiket Dewasa B",
        deskripsi: "-",
        hargaTiket: 20000,
        jenis: "weekday",
      },
      {
        idWahana: 3,
        nama: "Rainbow Slide 2x Main",
        deskripsi: "-",
        hargaTiket: 20000,
        jenis: "weekday",
      },
      {
        idWahana: 5,
        nama: "Bombom Car",
        deskripsi: "-",
        hargaTiket: 10000,
        jenis: "weekday",
      },
      {
        idWahana: 6,
        nama: "Kuda Kencana",
        deskripsi: "-",
        hargaTiket: 10000,
        jenis: "weekday",
      },
      {
        idWahana: 8,
        nama: "Trampolin",
        deskripsi: "-",
        hargaTiket: 10000,
        jenis: "weekday",
      },
      {
        idWahana: 9,
        nama: "Kora - Kora",
        deskripsi: "-",
        hargaTiket: 15000,
        jenis: "weekday",
      },
      {
        idWahana: 10,
        nama: "Balon Air",
        deskripsi: "-",
        hargaTiket: 10000,
        jenis: "weekday",
      },
      {
        idWahana: 11,
        nama: "Hand Boat",
        deskripsi: "-",
        hargaTiket: 10000,
        jenis: "weekday",
      },
      {
        idWahana: 12,
        nama: "Istana Balon",
        deskripsi: "-",
        hargaTiket: 15000,
        jenis: "weekday",
      },
      {
        idWahana: 13,
        nama: "Mandi Bola",
        deskripsi: "-",
        hargaTiket: 10000,
        jenis: "weekday",
      },
      {
        idWahana: 14,
        nama: "Wisata Berkuda",
        deskripsi: "-",
        hargaTiket: 15000,
        jenis: "weekday",
      },
      {
        idWahana: 16,
        nama: "Keranjang Sultan ",
        deskripsi: "-",
        hargaTiket: 20000,
        jenis: "weekday",
      },
      // Add more wahana entries here
    ]);
  }
}
