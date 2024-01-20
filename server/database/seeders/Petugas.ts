import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
// import Hash from '@ioc:Adonis/Core/Hash'
import Petugas from "App/Models/Petugas";

export default class PetugasSeeder extends BaseSeeder {
  public async run() {
    await Petugas.createMany([
      {
        namaLengkap: "Administrator",
        noHp: "081234567890",
        username: "admin",
        password: "admin",
      },
      {
        namaLengkap: "Kasir",
        noHp: "089876543210",
        username: "kasir",
        password: "kasir",
      },
      // add more seed data as needed
    ]);
  }
}
