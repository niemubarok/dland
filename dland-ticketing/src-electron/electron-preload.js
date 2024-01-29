import { contextBridge } from "electron";
import ls from "localstorage-slim";
import {
  print as printUnix,
  getPrinters as getUnixPrinters,
  getDefaultPrinter as getUnixDefaultPrinter,
} from "unix-print";
import { print as printWindows } from "pdf-to-printer"; // Replace 'windows-print' with the actual package for Windows printing

import {
  getPrinters as getWindowsPrinters,
  getDefaultPrinter as getWindowsDefaultPrinter,
} from "pdf-to-printer";

const print = process.platform === "win32" ? printWindows : printUnix;

import jsPDF from "jspdf";
import { log } from "console";
import { platform } from "os";
const QRCode = require("qrcode");
const autoTable = require("jspdf-autotable");
const fs = require("fs");
const path = require("path");
const os = require("os");
const directoryPath = path.join(os.homedir(), "struk");
if (!fs.existsSync(directoryPath)) {
  fs.mkdirSync(directoryPath, { recursive: true });
}
const filePath = path.join(directoryPath, "struk.pdf");
const formatCurrency = (amount) => {
  // Pemisah ribuan
  const separator = ".";

  // Konversi ke bilangan bulat
  const integerPart = Math.round(amount);

  // Format angka sebagai string
  let formattedAmount = integerPart
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, separator);

  // Tambahkan simbol mata uang dan hapus desimal
  formattedAmount = formattedAmount;

  return formattedAmount;
};

const createPDFStruk = async (nama_perusahaan, transaksi) => {
  log(transaksi.totalAfterDiskon);
  const pdf = new jsPDF({
    unit: "mm",
    format: [80, 150],
    // autoPaging: true,
    plugins: [autoTable],
  });

  const pageWidth = pdf.internal.pageSize.width;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.text(nama_perusahaan, pdf.internal.pageSize.width / 2, 3, {
    align: "center",
  });

  pdf.setFont("helvetica");
  pdf.setFontSize(13);

  if (JSON.parse(transaksi).namaPaket) {
    pdf.text(
      JSON.parse(transaksi).namaPaket,
      pdf.internal.pageSize.width / 2,
      8,
      {
        align: "center",
      }
    );
  } else {
    pdf.text(
      JSON.parse(transaksi).transaksi[0].jenis,
      pdf.internal.pageSize.width / 2,
      8,
      {
        align: "center",
      }
    );
  }

  pdf.setFontSize(5);

  const petugas = ls.get("petugas").nama;
  const waktu = new Date().toLocaleString("id-ID");
  const no_transaksi = JSON.parse(transaksi).no_transaksi;

  pdf.text(`${waktu}`, 5, 8, { align: "left" });

  pdf.text(`petugas: ${petugas}`, 5, 11, { align: "left" });
  pdf.text(no_transaksi, pageWidth - 5, 11, { align: "right" });

  pdf.line(5, 12, pdf.internal.pageSize.width - 5, 12); // Draw a line at y = 12 mm from the left margin to the right margin
  const headers = {
    wahana: "Wahana",
    qty: "Qty",
    harga: "Harga",
    ceklis: "Ceklis",
  };

  console.log("JSON.parse(transaksi)", JSON.parse(transaksi));

  const rows = Object.values(JSON.parse(transaksi).transaksi).map((item) => [
    `${
      item.jenis?.toLowerCase() === "tiket wahana" || item.jenis === undefined
        ? item.nama
        : item.nama + " - " + item.deskripsi
    }`, // Ganti dengan data sesuai kebutuhan, contoh: item.nama,
    item.jenis?.toLowerCase() === "tiket wahana" || item.jenis === undefined
      ? item.qty
      : "",
    item.jenis?.toLowerCase() === "tiket wahana" || item.jenis === undefined
      ? formatCurrency(item.total_bayar)
      : "",
    ".............", // Ganti dengan data sesuai kebutuhan
  ]);

  const autoTableOptions = {
    startY: 13,
    head: [headers],
    body: rows,
    showFoot: "never",
    tableWidth: pdf.internal.pageSize.getWidth() - 5,
    margin: { left: 5, right: 10 },
    theme: "plain",

    didParseCell: (hookData) => {
      if (hookData.section === "head") {
        if (hookData.column.dataKey === "qty") {
          hookData.cell.styles.halign = "center";
        }
      }
    },
    headStyles: { halign: "left", cellWidth: "auto", fontSize: 8 },
    columnStyles: {
      0: { halign: "left", cellWidth: 30 },
      1: { halign: "center", cellWidth: "auto" },
      2: { halign: "left", cellWidth: "auto" },
      3: { halign: "left", cellWidth: "auto" },
    },
    styles: {
      fontSize: 12,
      cellPadding: { top: 0, right: 0, bottom: 0, left: 0 },
      minCellHeight: 4,
      overflow: "linebreak",
    },
  };

  pdf.autoTable(autoTableOptions);

  // console.log(Object.values(JSON.parse(transaksi)));
  pdf.line(
    5,
    pdf.autoTable.previous.finalY + 2,
    pdf.internal.pageSize.width - 5,
    pdf.autoTable.previous.finalY + 2
  );

  // pdf.setFontSize(8);
  // const totalBayar = Object.values(JSON.parse(transaksi)).reduce(
  //   (total, item) => total + item.total_bayar,
  //   0
  // );
  // console.log(totalBayar);
  const totalText = `Total`;
  const totalValue = `${formatCurrency(JSON.parse(transaksi).totalBayar)}`;
  const diskonText = "Diskon";
  const diskonTextValue = `${formatCurrency(JSON.parse(transaksi).diskon)}`;
  const totalBayarText = "Total Bayar";
  const totalBayarValue = `${formatCurrency(
    JSON.parse(transaksi).totalAfterDiskon
  )}`;

  pdf.setFont("helvetica");
  pdf.setFontSize(8);
  pdf.text(totalText, 5, pdf.autoTable.previous.finalY + 5, {
    align: "left",
  });
  pdf.text(diskonText, 5, pdf.autoTable.previous.finalY + 9, {
    align: "left",
  });
  pdf.text(totalBayarText, 5, pdf.autoTable.previous.finalY + 14, {
    align: "left",
  });

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);

  //RP
  pdf.text("Rp", pageWidth - 40, pdf.autoTable.previous.finalY + 5, {
    align: "right",
    styles: { "text-decoration": "line-through" },
  });
  pdf.text("Rp", pageWidth - 40, pdf.autoTable.previous.finalY + 9, {
    align: "right",
  });
  pdf.setFontSize(10);
  pdf.text("Rp", pageWidth - 40, pdf.autoTable.previous.finalY + 14, {
    align: "right",
  });

  //value
  pdf.text(totalValue, pageWidth - 25, pdf.autoTable.previous.finalY + 5, {
    align: "right",
  });

  if (JSON.parse(transaksi).diskon > 0) {
    pdf.setDrawColor(0);
    pdf.setLineWidth(0.3);
    pdf.line(
      pageWidth - 25,
      pdf.autoTable.previous.finalY + 4,
      pageWidth - 45,
      pdf.autoTable.previous.finalY + 4
    ); // Draw line through text
  }
  pdf.text(diskonTextValue, pageWidth - 25, pdf.autoTable.previous.finalY + 9, {
    align: "right",
  });
  pdf.setFontSize(10);
  pdf.text(
    totalBayarValue,
    pageWidth - 25,
    pdf.autoTable.previous.finalY + 14,
    {
      align: "right",
    }
  );

  // const qrCodeData = "09876797";
  // const qrCodeOptions = {
  //   type: "png",
  //   margin: 1,
  //   color: {
  //     dark: "#000000",
  //     light: "#FFFFFF",
  //   },
  // };

  // const qrCodePDFPath = path.resolve(
  //   __dirname,
  //   process.env.QUASAR_PUBLIC_FOLDER + "/struk/qrcode.png"
  // );

  // await QRCode.toFile(qrCodePDFPath, qrCodeData, qrCodeOptions);

  // pdf.text(
  //   "QR Code",
  //   pdf.internal.pageSize.width / 2,
  //   pdf.autoTable.previous.finalY + 15,
  //   {
  //     align: "center",
  //   }
  // );

  // const qrCodeImageBuffer = fs.readFileSync(qrCodePDFPath);
  // // const pageWidth = pdf.internal.pageSize.getWidth();
  // const qrCodePosX = (pageWidth - 40) / 2; // Center the QR code horizontally
  // const qrCodePosY = pdf.autoTable.previous.finalY + 20; // Position after the table

  // pdf.addImage(qrCodeImageBuffer, "PNG", qrCodePosX, qrCodePosY, 40, 40);

  pdf.setFontSize(7);
  pdf.text(
    "Terimakasih atas kunjungan anda",
    pdf.internal.pageSize.width / 2,
    pdf.autoTable.previous.finalY + 18,
    { align: "center" }
  );

  console.log(filePath);

  fs.writeFile(filePath, pdf.output(), (err) => {
    if (err) {
      console.error("Error saving PDF:", err);
    } else {
      console.log("PDF saved successfully at:", filePath);
    }
  });
};
async function printStruk(namaPrinter) {
  // getWindowsPrinters().then(console.log);
  // return
  console.log("print", namaPrinter);
  const printerOption = {
    printer: namaPrinter,
  };

  // const outputFilePath = path.resolve(
  //   __dirname,
  //   process.env.QUASAR_PUBLIC_FOLDER + "/struk/struk.pdf"
  // );

  try {
    await fs.promises.access(filePath, fs.constants.F_OK);

    const printResult =
      process.platform === "win32"
        ? await printWindows(filePath, printerOption.printer)
        : await printUnix(filePath, printerOption.printer);

    console.log(printResult);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(`Error during printing: ${errorMessage}`);
  }
  // return;

  // console.log(outputFilePath);
  // try {
  //   await fs.promises.access(outputFilePath, fs.constants.F_OK);
  //   await print(outputFilePath, printerOption);
  //   console.log("Printing done");
  // } catch (error) {
  //   console.error("Error during printing:", error);
  // }
}

async function printDirectlyToPrinter(printerName) {
  // Membuat teks dengan format yang sesuai tata letak yang diinginkan

  const { Printer, InMemory } = require("escpos-buffer");

  const connection = new InMemory();
  console.log(connection);
  return;
  const printer = await Printer.CONNECT(printerName, connection);

  const data = {
    nama_perusahaan: "Nama Perusahaan Anda",
    nama_paket: "Paket A",
    petugas: "Nama Petugas",
    waktu: new Date().toLocaleString("id-ID"),
    transaksi: {
      transaksi: [
        { nama: "Wahana 1", qty: 2, harga: 50000 },
        { nama: "Wahana 2", qty: 1, harga: 75000 },
      ],
      totalBayar: 175000,
      diskon: 25000,
      totalAfterDiskon: 150000,
    },
  };

  await printer.setColumns(56);
  await printer.write("Nama Perusahaan: " + data.nama_perusahaan);
  await printer.writeln("Nama Paket: " + data.nama_paket);
  await printer.barcode(data.nama_paket, "CODE39", { width: 2, height: 100 });
  await printer.writeln("Petugas: " + data.petugas);
  await printer.writeln("Waktu: " + data.waktu);
  await printer.writeln("---------------------------------------------");
  await printer.writeln("Wahana    Qty    Harga    Ceklis");
  await printer.writeln("---------------------------------------------");

  data.transaksi.transaksi.forEach((item) => {
    printer.writeln(
      `${item.nama}    ${item.qty}    ${item.harga}    .............`
    );
  });

  await printer.writeln("---------------------------------------------");
  await printer.writeln(`Total: ${data.transaksi.totalBayar}`);
  await printer.writeln(`Diskon: ${data.transaksi.diskon}`);
  await printer.writeln(`Total Bayar: ${data.transaksi.totalAfterDiskon}`);
  await printer.writeln("Terimakasih atas kunjungan Anda");
  await printer.feed(6);
  await printer.buzzer();
  await printer.cutter();
  await printer.drawer(Drawer.First);

  // For buffered connection (output to stdout)
  process.stdout.write(connection.buffer());
}

async function getPrinters() {
  // let namaPrinter = ""
  if (process.platform === "win32") {
    return getWindowsPrinters().then((printers) => {
      return printers.map((each) => each.printer);
    });
  } else {
    return getUnixPrinters().then((printers) => {
      return printers.map((each) => each.printer);
    });
  }
}

const HID = require("node-hid");

async function getHIDDevices() {
  return await HID.devicesAsync();
}

async function readDataFromHID(vid, pid) {
  const device = await HID.HIDAsync.open(vid, pid);

  return new Promise((resolve, reject) => {
    device.on("data", function (data) {
      console.log(data);
    });
    device.on("error", function (error) {
      console.log(error);
    });
  });
}

console.log(readDataFromHID(1133, 50498));

contextBridge.exposeInMainWorld("electron", {
  // serialport: createSerialPort,
  print: printStruk,
  createPDFStruk,
  getPrinters,
  printDirectlyToPrinter,
  getHIDDevices,
  readDataFromHID,
  // detectLicensePlateArea: detectLicensePlateArea,
  // getSerialPortList: getSerialPortList,
});
