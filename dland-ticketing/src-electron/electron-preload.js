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
const printerOption = {
  printer: "POS-80C",
};

import jsPDF from "jspdf";
const QRCode = require("qrcode");
const autoTable = require("jspdf-autotable");
const fs = require("fs");
const path = require("path");

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
  formattedAmount = "Rp " + formattedAmount;

  return formattedAmount;
};

const createPDFStruk = async (nama_perusahaan, transaksi) => {
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
  pdf.setFontSize(8);
  pdf.text("Tiket", pdf.internal.pageSize.width / 2, 8, {
    align: "center",
  });

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
  const rows = Object.values(JSON.parse(transaksi)).map((item) => [
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
    overflow: "ellipsis",
    didParseCell: (hookData) => {
      if (hookData.section === "head") {
        if (hookData.column.dataKey === "qty") {
          hookData.cell.styles.halign = "center";
        }
      }
    },
    headStyles: { halign: "left", cellWidth: "auto", fontSize: 8 },
    columnStyles: {
      0: { halign: "left", cellWidth: "auto" },
      1: { halign: "center", cellWidth: "auto" },
      2: { halign: "left", cellWidth: "auto" },
      3: { halign: "left", cellWidth: "auto" },
    },
    styles: {
      fontSize: 10,
      cellPadding: { top: 0, right: 0, bottom: 0, left: 0 },
      minCellHeight: 4,
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
  const totalBayar = Object.values(JSON.parse(transaksi)).reduce(
    (total, item) => total + item.total_bayar,
    0
  );
  console.log(totalBayar);
  const totalBayarText = `Total Bayar `;
  const totalBayarValue = `${formatCurrency(totalBayar)}`;

  pdf.setFont("helvetica");
  pdf.setFontSize(10);
  pdf.text(totalBayarText, 5, pdf.autoTable.previous.finalY + 5, {
    align: "left",
  });
  pdf.setFont("helvetica", "bold");
  pdf.text(
    totalBayarValue,
    pageWidth -
      pdf.getStringUnitWidth(totalBayarValue) * pdf.internal.getFontSize() +
      20,
    pdf.autoTable.previous.finalY + 5,
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
    pdf.autoTable.previous.finalY + 15,
    { align: "center" }
  );

  const filePath = path.resolve(
    __dirname,
    process.env.QUASAR_PUBLIC_FOLDER + "/struk/struk.pdf"
  );

  fs.writeFile(filePath, pdf.output(), (err) => {
    if (err) {
      console.error("Error saving PDF:", err);
    } else {
      console.log("PDF saved successfully at:", filePath);
    }
  });
};
async function printStruk() {
  getWindowsPrinters().then(console.log);
  // return

  const outputFilePath = path.resolve(
    __dirname,
    process.env.QUASAR_PUBLIC_FOLDER + "/struk/struk.pdf"
  );

  console.log(process.platform);
  if (process.platform === "win32") {
    await fs.promises.access(outputFilePath, fs.constants.F_OK);
    await printWindows(outputFilePath, printerOption).then(console.log);
    // getWindowsDefaultPrinter().then((printer) => console.log(printer));
  } else {
    getUnixDefaultPrinter().then((printer) => console.log(printer));
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

contextBridge.exposeInMainWorld("electron", {
  // serialport: createSerialPort,
  print: printStruk,
  createPDFStruk,
  // getSnapshot: getSnapshot,
  // detectLicensePlateArea: detectLicensePlateArea,
  // getSerialPortList: getSerialPortList,
});
