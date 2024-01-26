import Database from "@ioc:Adonis/Lucid/Database";
import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";

export default class extends BaseSeeder {
  public async run() {
    await Database.rawQuery(`
    INSERT INTO paket_tiket (id_paket, nama_paket, harga_paket, diskon, status) VALUES
      (1, 'Paket Terusan', 75000, 35000, true),
      (2, 'Paket Anak A', 65000, 0, true),
      (3, 'Paket Anak B', 65000, 5000, true)
  `);
  }
}
