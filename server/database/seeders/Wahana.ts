import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";

import Wahana from "App/Models/Wahana";

export default class extends BaseSeeder {
  public async run() {
    await Wahana.createMany([
      {
        idWahana: 3,
        nama: "Haunted House",
        deskripsi: "Rumah hantu dengan berbagai teror di setiap sudutnya.",
        hargaTiket: 40000,
      },
      {
        idWahana: 4,
        nama: "Bumper Cars",
        deskripsi: "Bersenang-senang dengan mobil tumbuk dan adu strategi.",
        hargaTiket: 30000,
      },
      {
        idWahana: 5,
        nama: "Merry-Go-Round",
        deskripsi: "Kuda putar klasik yang cocok untuk segala usia.",
        hargaTiket: 25000,
      },
      {
        idWahana: 6,
        nama: "Water Slide",
        deskripsi: "Seluncuran air yang menyegarkan di hari yang panas.",
        hargaTiket: 45000,
      },
      {
        idWahana: 7,
        nama: "Sky Diver",
        deskripsi: "Nikmati sensasi terjun payung dari ketinggian.",
        hargaTiket: 55000,
      },
      {
        idWahana: 8,
        nama: "Pirate Ship",
        deskripsi: "Kapal bajak laut yang mengayun tinggi ke langit.",
        hargaTiket: 37500,
      },
      {
        idWahana: 9,
        nama: "Mini Train",
        deskripsi: "Kereta mini yang melewati seluruh taman hiburan.",
        hargaTiket: 20000,
      },
      {
        idWahana: 10,
        nama: "Space Shot",
        deskripsi: "Menembakkan Anda ke udara dengan kecepatan tinggi.",
        hargaTiket: 50000,
      },
      {
        idWahana: 11,
        nama: "Carousel",
        deskripsi: "Putaran klasik dengan hewan-hewan pahatan yang indah.",
        hargaTiket: 30000,
      },
      {
        idWahana: 12,
        nama: "Log Flume",
        deskripsi: "Pengalaman rafting yang mendebarkan dan membasahi.",
        hargaTiket: 35000,
      },
      // Add more wahana entries here
    ]);
  }
}
