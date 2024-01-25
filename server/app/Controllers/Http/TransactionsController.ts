import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";

export default class TransactionsController {
  public async index({ request, response }: HttpContextContract) {
    const { startDate: startDateParam, endDate: endDateParam } = request.body();
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    const startDate = startDateParam ? new Date(startDateParam) : today;
    const endDate = endDateParam ? new Date(endDateParam) : today;

    // return startDate;

    const formatStartDate = startDate
      .toISOString()
      .split("T")[0]
      .replace(/-/g, "/");
    const formatEndDate = endDate
      .toISOString()
      .split("T")[0]
      .replace(/-/g, "/");

    const transaksi = await Database.from("transaksi_penjualan")
      // .innerJoin(
      //   "transaksi_penjualan",
      //   "detail_transaksi.no_transaksi",
      //   "transaksi_penjualan.no_transaksi"
      // )
      // .innerJoin(
      //   "master_wahana",
      //   "detail_transaksi.id_wahana",
      //   "master_wahana.id_wahana"
      // )
      .whereBetween(
        Database.raw(
          "SUBSTRING(transaksi_penjualan.no_transaksi FROM 1 FOR 10)"
        ),
        [formatStartDate, formatEndDate]
      )
      // .groupBy("detail_transaksi.id_detail_transaksi", "master_wahana.nama")
      .select("*");

    response.status(200).json(transaksi);
  }

  public async create({ request, response }: HttpContextContract) {
    const data = request.body().data;
    // return data;
    // const datePrefix = "2024/01/20";
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    const datePrefix = today.toISOString().split("T")[0].replace(/-/g, "/");
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
        // updated_at: new Date(),
      })
    );

    // const dataDetailTransaksi = data.transaksi.map(item=>{
    //   no_transaksi,

    // })

    // return transactionsData;
    try {
      const currentDate = new Date();
      const transaksi_penjualan = await Database.rawQuery(
        `INSERT INTO transaksi_penjualan (no_transaksi, cara_bayar, total, diskon, total_bayar, petugas, status, created_at) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          no_transaksi,
          cara_bayar,
          total,
          diskon,
          totalAfterDiskon,
          petugas,
          status,
          currentDate.toISOString(),
          // currentDate.toISOString(),
        ]
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

  public async delete({ request, response }: HttpContextContract) {
    try {
      const { no_transaksi } = request.body();

      if (!no_transaksi) {
        response
          .status(400)
          .json({ message: "No transaction number provided" });
        return;
      }

      await Database.transaction(async (trx) => {
        // Delete detail transaksi first
        await trx
          .from("detail_transaksi")
          .where("no_transaksi", no_transaksi)
          .delete();

        // Then delete transaksi_penjualan
        const deletedRows = await trx
          .from("transaksi_penjualan")
          .where("no_transaksi", no_transaksi)
          .delete();

        if (Array.isArray(deletedRows) && deletedRows.length === 0) {
          response.status(404).json({ message: "Transaction not found" });
          return;
        }

        response.status(200).json({
          message: `Deleted ${deletedRows} rows from transaksi_penjualan and detail_transaksi`,
        });
      });
    } catch (error) {
      // If error occurs, the transaction is automatically rolled back
      response.status(500).json({ message: "Internal Server Error", error });
    }
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
