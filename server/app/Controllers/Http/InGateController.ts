import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";

export default class InGateController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({ request, response }: HttpContextContract) {
    const { no_transaksi } = request.body();

    const transaksi = await Database.rawQuery(
      `SELECT no_transaksi FROM transaksi_penjualan 
   WHERE no_transaksi = '${no_transaksi}' `
    );
    console.log(transaksi.rows);

    //  GROUP BY detail_transaksi.id_detail_transaksi, detail_transaksi.no_transaksi, detail_transaksi.id_wahana, detail_transaksi.qty, detail_transaksi.harga, master_wahana.nama`
    if (transaksi.rows?.length) {
      response.status(200).json(transaksi.rows);
    } else {
      response.abort({
        message: "gagal",
      });
    }
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
