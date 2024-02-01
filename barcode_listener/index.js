const HID = require("node-hid");
const axios = require("axios");

const keyMap = {
  4: "a",
  5: "b",
  6: "c",
  7: "d",
  8: "e",
  9: "f",
  10: "g",
  11: "h",
  12: "i",
  13: "j",
  14: "k",
  15: "l",
  16: "m",
  17: "n",
  18: "o",
  19: "p",
  20: "q",
  21: "r",
  22: "s",
  23: "t",
  24: "u",
  25: "v",
  26: "w",
  27: "x",
  28: "y",
  29: "z",
  30: "1",
  31: "2",
  32: "3",
  33: "4",
  34: "5",
  35: "6",
  36: "7",
  37: "8",
  38: "9",
  39: "0",
  40: "Enter",
  41: "Escape",
  42: "Backspace",
  43: "Tab",
  44: "Space",
  45: "-",
  46: "=",
  47: "[",
  48: "]",
  49: "\\",
  51: ";",
  52: "'",
  53: "`",
  54: ",",
  55: ".",
  56: "/",
  // Tambahkan lebih banyak sesuai kebutuhan
};

async function selectDevice() {
  const devices = HID.devices();

  if (devices.length === 0) {
    console.log("No HID devices found.");
    return;
  }

  console.log("Available HID devices:");
  devices.forEach((device, index) => {
    console.log(
      `${index + 1}. Path: ${device.path}, Manufacturer: ${
        device.manufacturer
      }, Product: ${device.product}`
    );
  });

  const selectedDeviceIndex = await promptUser(
    "Enter the number of the device you want to use: "
  );

  if (selectedDeviceIndex >= 1 && selectedDeviceIndex <= devices.length) {
    const selectedDevice = devices[selectedDeviceIndex - 1];
    if (selectedDevice) {
      listenToDevice(selectedDevice);
    }
  } else {
    console.log("Invalid selection.");
  }
}

async function promptUser(question) {
  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    readline.question(question, (answer) => {
      readline.close();
      resolve(parseInt(answer));
    });
  });
}

function listenToDevice(deviceInfo) {
  const device = new HID.HID(deviceInfo.path);
  let dataBarcode = [];
  device.on("data", (data) => {
    const keyCode = data[2];
    const key = getKeyFromCode(keyCode);
    if (!key) return;

    // console.log("Key pressed:", key);

    if (dataBarcode.length > 0 && key === "Enter") {
      // Make API request when Enter key is pressed
      makeAPIRequest(dataBarcode.join(""));
      dataBarcode = []; // Reset the barcode data after making the request
    } else {
      // Collect scanned characters into a barcode array
      dataBarcode.push(key);
      console.log("dataBarcode:", dataBarcode.join(""));
    }
  });

  device.on("error", (err) => {
    console.error("Device error:", err);
  });
}

function getKeyFromCode(code) {
  return keyMap[code] || null;
}

async function makeAPIRequest(dataBarcode) {
  console.log("Barcode:", dataBarcode);
  try {
    //   Ganti URL dengan endpoint API yang sesuai2233445767676

    const response = await axios.post(
      "http://127.0.0.1:3333/api/ingate/barcode",
      {
        // barcode: "2024/01/29/00002",
        barcode: dataBarcode,
      }
    );
    console.log("Data from API:", response.data);
  } catch (error) {
    console.error("Error fetching data from API:", error);
  }
}

async function openGate() {
  try {
  } catch (error) {
    console.log(error);
  }
}

selectDevice();
