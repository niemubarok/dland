import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";

export default class ReportsController {
  public async kunjungan({ response }: HttpContextContract) {
    const currentDate = new Date();

    // Get the total number of visits
    const totalKunjungan = await Database.from("transaksi_penjualan")
      .countDistinct("id_transaksi as total")
      .then((result) => result[0].total);

    // Get the number of visits per day
    const kunjunganPerHari = await Database.from("transaksi_penjualan")
      .whereRaw("no_transaksi LIKE ?", [
        `${currentDate.toISOString().split("T")[0].replace(/-/g, "/")}/%`,
      ])
      .countDistinct("no_transaksi as total")
      .then((result) => result[0].total);

    // Get the number of visits per month
    const yearMonth = currentDate
      .toISOString()
      .split("T")[0]
      .slice(0, 7)
      .replace(/-/g, "/");
    const kunjunganPerBulan = await Database.from("transaksi_penjualan")
      .whereRaw("no_transaksi LIKE ?", [`${yearMonth}/%`])
      .countDistinct("no_transaksi as total")
      .then((result) => result[0].total);

    // Query to get the number of visits per wahana from detail_transaksi
    // const kunjunganPerWahana = await Database.from("detail_transaksi")
    //   .innerJoin(
    //     "master_wahana",
    //     "detail_transaksi.id_wahana",
    //     "master_wahana.id_wahana"
    //   )
    //   .groupBy("detail_transaksi.id_wahana", "master_wahana.nama")
    //   .countDistinct("detail_transaksi.no_transaksi as total")
    //   .select("master_wahana.nama")
    //   .then((results) => {
    //     return results.reduce((acc, row) => {
    //       acc[row.nama] = row.total;
    //       return acc;
    //     }, {});
    //   });

    response.status(200).json({
      totalKunjungan,
      kunjunganPerHari,
      kunjunganPerBulan,
      // kunjunganPerWahana,
    });
  }
  // public async index({ response }: HttpContextContract) {
  //   const currentDate = new Date();

  //   // Get the total number of visits
  //   const totalKunjungan = await Database.from("transaksi_penjualan")
  //     .countDistinct("id_transaksi as total")
  //     .then((result) => result[0].total);

  //   // Get the number of visits per day
  //   const kunjunganPerHari = await Database.from("transaksi_penjualan")
  //     .whereRaw("CAST(created_at AS DATE) = CAST(? AS DATE)", [currentDate])
  //     .countDistinct("id_transaksi as total")
  //     .then((result) => result[0].total);

  //   // Get the number of visits per month
  //   const kunjunganPerBulan = await Database.from("transaksi_penjualan")
  //     .whereRaw(
  //       "EXTRACT(YEAR FROM created_at) = ? AND EXTRACT(MONTH FROM created_at) = ?",
  //       [currentDate.getFullYear(), currentDate.getMonth() + 1]
  //     )
  //     .countDistinct("id_transaksi as total")
  //     .then((result) => result[0].total);

  //   response.status(200).json({
  //     totalKunjungan,
  //     kunjunganPerHari,
  //     kunjunganPerBulan,
  //   });
  // }

  public async pendapatan({ response }: HttpContextContract) {
    const currentDate = new Date();
    const yearMonthDay = currentDate.toISOString().split("T")[0];
    const yearMonth = yearMonthDay.slice(0, 7);

    // Get the total revenue
    const totalPendapatan = await Database.from("transaksi_penjualan")
      .sum("total_bayar as total")
      .then((result) => result[0].total || 0);

    // Get the revenue per day
    const pendapatanPerHari = await Database.from("transaksi_penjualan")
      .whereRaw(
        "EXTRACT(YEAR FROM CAST(substr(no_transaksi, 1, 10) AS DATE)) = ? AND EXTRACT(MONTH FROM CAST(substr(no_transaksi, 1, 10) AS DATE)) = ? AND EXTRACT(DAY FROM CAST(substr(no_transaksi, 1, 10) AS DATE)) = ?",
        [
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          currentDate.getDate(),
        ]
      )
      .sum("total_bayar as total")
      .then((result) => result[0].total || 0);

    // Refactor to use query builder instead of raw query for better readability and maintainability
    const pendapatanPerBulan = await Database.from("transaksi_penjualan")
      .whereRaw(
        "EXTRACT(YEAR FROM CAST(substr(no_transaksi, 1, 10) AS DATE)) = ? AND EXTRACT(MONTH FROM CAST(substr(no_transaksi, 1, 10) AS DATE)) = ?",
        [currentDate.getFullYear(), currentDate.getMonth() + 1]
      )
      .sum("total_bayar as total")
      .then((result) => result[0].total || 0);

    response.status(200).json({
      totalPendapatan,
      pendapatanPerHari,
      pendapatanPerBulan,
    });
  }
  public async wahana({ response }: HttpContextContract) {
    const currentDate = new Date();
    const yearMonthDay = currentDate.toISOString().split("T")[0];
    const yearMonth = yearMonthDay.slice(0, 7);

    const formatForDay = yearMonthDay.replace(/-/g, "/");
    const formatForMonth = yearMonth.replace(/-/g, "/");

    const kunjunganWahana = await Promise.all([
      Database.from("detail_transaksi")
        .innerJoin(
          "master_wahana",
          "detail_transaksi.id_wahana",
          "master_wahana.id_wahana"
        )
        .whereRaw("SUBSTRING(detail_transaksi.no_transaksi, 1, 10) = ?", [
          formatForDay,
        ])
        .groupBy("master_wahana.nama")
        .countDistinct("detail_transaksi.no_transaksi as total")
        .select("master_wahana.nama"),
      Database.from("detail_transaksi")
        .innerJoin(
          "master_wahana",
          "detail_transaksi.id_wahana",
          "master_wahana.id_wahana"
        )
        .whereRaw("SUBSTRING(detail_transaksi.no_transaksi, 1, 7) = ?", [
          formatForMonth,
        ])
        .groupBy("master_wahana.nama")
        .countDistinct("detail_transaksi.no_transaksi as total")
        .select("master_wahana.nama"),
    ]);

    const kunjunganWahanaPerHari = kunjunganWahana[0].reduce((acc, row) => {
      acc[row.nama] = row.total;
      return acc;
    }, {});

    const kunjunganWahanaPerBulan = kunjunganWahana[1].reduce((acc, row) => {
      acc[row.nama] = row.total;
      return acc;
    }, {});

    const totalKunjunganWahana = await Database.from("detail_transaksi")
      .innerJoin(
        "master_wahana",
        "detail_transaksi.id_wahana",
        "master_wahana.id_wahana"
      )
      .groupBy("master_wahana.nama")
      .countDistinct("detail_transaksi.no_transaksi as total")
      .select("master_wahana.nama")
      .then((results) =>
        results.reduce((acc, row) => {
          acc[row.nama] = row.total;
          return acc;
        }, {})
      );

    response.status(200).json({
      kunjunganWahanaPerHari,
      kunjunganWahanaPerBulan,
      totalKunjunganWahana,
    });
  }

  public async fix({ response }: HttpContextContract) {
    const currentDate = "2024-01-22"; 
    const totalHargaTiketRows = await Database.rawQuery(
      `
        SELECT 
            dt.no_transaksi,
            SUM(mw.harga_tiket * dt.qty) AS total_harga
        FROM 
            detail_transaksi dt
        JOIN 
            master_wahana mw ON dt.id_wahana = mw.id_wahana
        WHERE 
            TO_DATE(SUBSTRING(dt.no_transaksi FROM 1 FOR 10), 'YYYY/MM/DD') = ?
        GROUP BY 
            dt.no_transaksi
    `,
      [currentDate]
    );

    for (const row of totalHargaTiketRows.rows) {
      const noTransaksi = row.no_transaksi;
      const totalHarga = parseFloat(row.total_harga);

      // Ambil nilai diskon dari tabel transaksi_penjualan
      const diskonResult = await Database.rawQuery(
        `
            SELECT diskon
            FROM transaksi_penjualan
            WHERE no_transaksi = ?
        `,
        [noTransaksi]
      );

      if (diskonResult.rows.length > 0) {
        const diskon = parseFloat(diskonResult.rows[0].diskon);

        // Hitung total_bayar (total_harga - diskon)
        const totalBayar = totalHarga - diskon;

        // Update tabel transaksi_penjualan
        await Database.rawQuery(
          `
                UPDATE transaksi_penjualan
                SET total = ?, total_bayar = ?
                WHERE no_transaksi = ?
            `,
          [totalHarga, totalBayar, noTransaksi]
        );
      }
    }
  }
  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
