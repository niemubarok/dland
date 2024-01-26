import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";

export default class PaketController {
  public async index({ response }: HttpContextContract) {
    const paket = await Database.query().from("paket_tiket").select("*");
    response.status(200).json(paket);
  }

  public async create({ request, response }: HttpContextContract) {
    const req = request.body().data;

    const paket = await Database.table("paket_tiket").insert({
      id_paket: req.id_paket,
      nama_paket: req.nama_paket,
      harga_paket: req.harga_paket,
      diskon: req.diskon,
      status: req.status,
    });
    response.status(200).json(paket);
  }

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
