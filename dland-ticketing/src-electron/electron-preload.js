import { contextBridge } from "electron";
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
  printer: "iware",
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
    autoPaging: true,
    plugins: [autoTable],
  });

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.text(nama_perusahaan, pdf.internal.pageSize.width / 2, 5, {
    align: "center",
  });
  pdf.text("Depok Fantasy Land", pdf.internal.pageSize.width / 2, 10, {
    align: "center",
  });

  pdf.line(5, 12, pdf.internal.pageSize.width - 5, 12); // Draw a line at y = 12 mm from the left margin to the right margin
  const headers = ["Wahana", "Qty", "Harga"];
  const rows = Object.values(JSON.parse(transaksi)).map((item) => [
    item.nama,
    item.qty,
    formatCurrency(item.total_bayar),
  ]);

  // console.log(transaksi);
  // return

  const autoTableOptions = {
    startY: 13,
    head: [headers],
    body: rows,
    tableWidth: "80",
    theme: "plain",
    columnStyles: {
      0: { halign: "left", cellWidth: "auto" },
      1: { halign: "center" },
      2: { halign: "right", cellWidth: "auto" },
    },
    styles: {
      fontSize: 7, // Set the font size to 6
      cellPadding: { top: 0, right: 0, bottom: 0, left: 0 },
      minCellHeight: 4,
      // fillColor: [255, 255, 255],
      // textColor: [0, 0, 0],
      // margin: { top: 0, left: -5, right: 20, bottom: 0 },
      // valign: "middle",
      // halign: "left",
      // marginLeft: 0,
      // marginRight: 10,
    },
    // headStyles: {
    //   fillColor: [0, 0, 0],
    //   textColor: [255, 255, 255],
    //   fontSize: 7,
    //   halign: "center",
    // },
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
  const pageWidth = pdf.internal.pageSize.width;

  pdf.setFont("helvetica");
  pdf.setFontSize(8);
  pdf.text(totalBayarText, 10, pdf.autoTable.previous.finalY + 5, {
    align: "left",
  });
  pdf.setFont("helvetica", "bold");
  pdf.text(
    totalBayarValue,
    pageWidth -
      pdf.getStringUnitWidth(totalBayarValue) * pdf.internal.getFontSize() +
      17,
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
  console.log(process.platform);
  getUnixDefaultPrinter().then((printer) => console.log(printer));
  return;
  const outputFilePath = path.resolve(
    __dirname,
    process.env.QUASAR_PUBLIC_FOLDER + "/struk/struk.pdf"
  );

  console.log(outputFilePath);
  try {
    await fs.promises.access(outputFilePath, fs.constants.F_OK);
    await print(outputFilePath, printerOption);
    console.log("Printing done");
  } catch (error) {
    console.error("Error during printing:", error);
  }
}

contextBridge.exposeInMainWorld("electron", {
  // serialport: createSerialPort,
  print: printStruk,
  createPDFStruk,
  // getSnapshot: getSnapshot,
  // detectLicensePlateArea: detectLicensePlateArea,
  // getSerialPortList: getSerialPortList,
});
