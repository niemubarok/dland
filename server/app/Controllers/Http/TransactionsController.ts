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
      .from("transaksi_penjualan")
      .whereRaw("no_transaksi LIKE ?", [`${datePrefix}/%`])
      .orderBy("no_transaksi", "desc")
      .first();

    let transactionNumber: number;

    if (lastTransaction) {
      const lastNumberStr = lastTransaction.no_transaksi.split("/").pop();
      const lastNumber = lastNumberStr ? parseInt(lastNumberStr) : NaN;

      if (!isNaN(lastNumber)) {
        transactionNumber = lastNumber + 1;
      } else {
        throw new Error("Failed to parse the last transaction number.");
      }
    } else {
      transactionNumber = 1;
    }

    const no_transaksi = `${datePrefix}/${String(transactionNumber).padStart(
      5,
      "0"
    )}`;
    // console.log(transactionNumber);

    // return no_transaksi;
    const { status, cara_bayar, petugas, diskon, totalAfterDiskon, total } =
      data;
    const transactionsData = data.transaksi.map(
      (item: { id_wahana: any; qty: any; total_bayar: any }) => ({
        no_transaksi,
        id_wahana: item.id_wahana,
        qty: item.qty,
        // id_cara_bayar: cara_bayar,
        // total: item.total_bayar,
        // status,
        // diskon,
        // total_bayar: totalAfterDiskon,
        // petugas,
        created_at: new Date(),
        updated_at: new Date(),
      })
    );

    // const dataDetailTransaksi = data.transaksi.map(item=>{
    //   no_transaksi,

    // })

    // return transactionsData;
    try {
      const transaksi_penjualan = await Database.rawQuery(
        `INSERT INTO transaksi_penjualan (no_transaksi, cara_bayar, total, diskon, total_bayar, petugas,status) VALUES ('${no_transaksi}', '${cara_bayar}','${total}','${diskon}', '${totalAfterDiskon}', '${petugas}', '${status}')`
      );

      const detail_transaksi = await Database.table(
        "detail_transaksi"
      ).multiInsert(transactionsData);
      // Handle the successful insertion
      response.status(201).json({
        message: "Transaction created successfully",
        transaksi_penjualan,
        detail_transaksi,
      });
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
