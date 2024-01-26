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
    format: [80, 100],
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

  console.log();
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
    pdf.text("Tiket", pdf.internal.pageSize.width / 2, 8, {
      align: "center",
    });
  }

  pdf.setFontSize(6);
  const petugas = ls.get("petugas").nama;
  const waktu = new Date().toLocaleString("id-ID");
  pdf.text(`petugas:${petugas}`, 5, 11, { align: "left" });
  pdf.text(waktu, pageWidth - 5, 11, { align: "right" });

  pdf.line(5, 12, pdf.internal.pageSize.width - 5, 12); // Draw a line at y = 12 mm from the left margin to the right margin
  const headers = {
    wahana: "Wahana",
    qty: "Qty",
    harga: "Harga",
    ceklis: "Ceklis",
  };
  const rows = Object.values(JSON.parse(transaksi).transaksi).map((item) => [
    item.nama,
    item.qty,
    formatCurrency(item.total_bayar),
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

contextBridge.exposeInMainWorld("electron", {
  // serialport: createSerialPort,
  print: printStruk,
  createPDFStruk,
  getPrinters,
  // detectLicensePlateArea: detectLicensePlateArea,
  // getSerialPortList: getSerialPortList,
});
