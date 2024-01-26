import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";

export default class WahanaController {
  public async index({ response }: HttpContextContract) {
    const wahana = await Database.query() // 👈 gives an instance of select query builder
      .from("master_wahana")
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
    const req = request.body().data;

    const data = {
      nama: req.nama,
      deskripsi: req.deskripsi,
      hargaTiket: req.hargaTiket,
      jenis: req.jenis,
    };

    const store = await Database.table("wahanas").insert(data);

    if (store) {
      response.status(201).json(store);
    }
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
