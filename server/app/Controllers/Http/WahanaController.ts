import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";

export default class WahanaController {
  public async index({ response }: HttpContextContract) {
    const wahana = await Database.query()
      .from("master_wahana")
      .orderBy("id_wahana", "asc")
      .select("*");
    response.status(200).json(wahana);
  }

  // public async paket({ response }: HttpContextContract) {
  //   const paketWithWahana = await Database.query()
  //     .from("paket_tiket")
  //     .innerJoin(
  //       "detail_paket_wahana",
  //       "paket_tiket.id",
  //       "detail_paket_wahana.id_paket"
  //     )
  //     .whereIn(
  //       "paket_tiket.id",
  //       Database.from("detail_paket_wahana").select("paket_id")
  //     )
  //     .groupBy("paket_tiket.id")
  //     .select(
  //       "paket_tiket.id as idPaket",
  //       "paket_tiket.nama_paket as namaPaket",
  //       "paket_tiket.harga_paket as hargaPaket",
  //       "paket_tiket.status"
  //     )
  //     .select(
  //       Database.raw("GROUP_CONCAT(detail_paket_wahana.id_wahana) as idWahana")
  //     );
  //   // .select(
  //   //   Database.raw(
  //   //     "(paket_tiket.harga_paket - IFNULL(paket_tiket.diskon, 0)) as diskon"
  //   //   )
  //   // );

  //   const result = paketWithWahana.map((paket) => ({
  //     ...paket,
  //     diskon: paket.hargaPaket - paket.diskon,
  //     idWahana: paket.idWahana.split(",").map(Number),
  //     status: paket.status === 1 ? true : false,
  //   }));

  //   response.status(200).json(result);
  // }

  public async create({ request, response }: HttpContextContract) {
    const req = request.body();
    const idTerakhirWahana = await Database.from('master_wahana').orderBy('id_wahana', 'desc').first();
    const lastSaleId = idTerakhirWahana?.id_wahana + 1 || 0;
    console.log(lastSaleId);
    
        const data = {
          id_wahana:lastSaleId,
      nama: req.nama,
      deskripsi: req.deskripsi,
      jenis: req.jenis,
      harga_tiket: req.harga_tiket,
    };

    const store = await Database.rawQuery(
      "INSERT INTO master_wahana (id_wahana,nama, deskripsi, harga_tiket, jenis) VALUES (?, ?, ?, ?,?)",
      [data.id_wahana, data.nama, data.deskripsi, data.harga_tiket, data.jenis]
    );

    if (store) {
      response.status(201).json(store);
    }
  }

  public async show({}: HttpContextContract) {}

  public async edit({ request, response }: HttpContextContract) {
    const { id, column, value } = request.body();

    try {
      await Database.from("master_wahana")
        .where("id_wahana", id)
        .update({ [column]: value });

      response.status(201).json({
        message: "Update berhasil",
      });
    } catch (error) {
      console.log(error);

      response.status(400).json({
        message: "Update gagal",
        error: error.message,
      });
    }
  }

  public async delete({ request, response }: HttpContextContract) {
    const { id } = request.body();

    try {
      const query = await Database.rawQuery(
        `DELETE FROM master_wahana WHERE id_wahana = ${id}`
      );

      response.status(201).json(query);
    } catch (error) {
      response.status(400).json({
        message: "Delete gagal",
        error: error.message,
      });
    }
  }

  public async destroy({}: HttpContextContract) {}
}
