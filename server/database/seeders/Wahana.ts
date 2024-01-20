import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";

import Wahana from "App/Models/Wahana";

export default class extends BaseSeeder {
  public async run() {
    await Wahana.createMany([
      {
        idWahana: 3,
        nama: "Rainbow Slide (WEEKEND)",
        deskripsi: "-",
        hargaTiket: 20000,
      },
      {
        idWahana: 4,
        nama: "Rainbow Slide (WEEKDAY)",
        deskripsi: "-",
        hargaTiket: 15000,
      },
      {
        idWahana: 5,
        nama: "Bombom Car",
        deskripsi: "-",
        hargaTiket: 10000,
      },
      {
        idWahana: 6,
        nama: "Komedi Putar",
        deskripsi: "-",
        hargaTiket: 10000,
      },
      {
        idWahana: 7,
        nama: "Istana Balon",
        deskripsi: "-",
        hargaTiket: 15000,
      },
      {
        idWahana: 8,
        nama: "Bungee Jumping",
        deskripsi: "-",
        hargaTiket: 10000,
      },
      {
        idWahana: 9,
        nama: "Zampela Flying Boat",
        deskripsi: "-",
        hargaTiket: 15000,
      },
      {
        idWahana: 10,
        nama: "Balon Air",
        deskripsi: "-",
        hargaTiket: 10000,
      },
      {
        idWahana: 11,
        nama: "Hand Boat",
        deskripsi: "-",
        hargaTiket: 10000,
      },
      {
        idWahana: 12,
        nama: "Istana Balon",
        deskripsi: "-",
        hargaTiket: 15000,
      },
      {
        idWahana: 13,
        nama: "Mandi Bola",
        deskripsi: "-",
        hargaTiket: 10000,
      },
      {
        idWahana: 14,
        nama: "Game Coin",
        deskripsi: "-",
        hargaTiket: 5000,
      },
      // Add more wahana entries here
    ]);
  }
}
