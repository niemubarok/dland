import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";

export default class TransactionsController {
  public async index({ request, response }: HttpContextContract) {}

  public async create({ request, response }: HttpContextContract) {
    const data = request.body().data;
    // return data;
    const datePrefix = new Date()
      .toISOString()
      .split("T")[0]
      .replace(/-/g, "/");
    // Retrieve the last transaction number for today and increment it
    const lastTransaction = await Database.query()
      .from("transactions")
      .whereRaw("no_transaksi LIKE ?", [`${datePrefix}/%`])
      .orderBy("no_transaksi", "desc")
      .first();

    const transactionNumber = lastTransaction
      ? parseInt(lastTransaction.no_transaksi.split("/")[2]) + 1
      : 1;

    const no_transaksi = `${datePrefix}/${String(transactionNumber).padStart(
      5,
      "0"
    )}`;
    // return data;
    const { status, cara_bayar, petugas } = data;
    const transactionsData = data.transaksi.map((item) => ({
      no_transaksi,
      id_wahana: item.id_wahana,
      qty: item.qty,
      id_cara_bayar: cara_bayar,
      total_bayar: item.total_bayar,
      petugas,
      status,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    // return transactionsData;
    try {
      const transactions = await Database.table("transactions").multiInsert(
        transactionsData
      );
      // Handle the successful insertion
      response.status(201).json(transactions);
    } catch (error) {
      // Handle the error
      console.log(error);
    }
  }

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
