import HID from "node-hid";
import { SerialPort } from "serialport";
import { promises as fs } from "fs";
import readline from "readline";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { config as dotenvConfig } from "dotenv";

// Load .env configurations
dotenvConfig();

// Paths and constants
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const deviceConfigPath = join(__dirname, "deviceConfig.json");
const API_URL = process.env.API_URL; // Get API URL from .env

// Tambahkan logika untuk membuat file deviceConfig.json jika belum ada
async function createDeviceConfigFileIfNotExists() {
  try {
    await fs.access(deviceConfigPath);
  } catch (error) {
    if (error.code === "ENOENT") {
      // File doesn't exist, create it
      const initialConfig = { HIDDevicePath: null, serialPath: null };
      await fs.writeFile(
        deviceConfigPath,
        JSON.stringify(initialConfig, null, 2)
      );
      console.log("Created deviceConfig.json file.");
    }
  }
}

// Panggil fungsi untuk membuat file jika belum ada sebelum mencoba membacanya
await createDeviceConfigFileIfNotExists();

const promptUser = (question) =>
  new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(question, (answer) => {
      rl.close();
      resolve(parseInt(answer, 10));
    });
  });

async function selectHIDDevice(forcePrompt = false) {
  let devices = HID.devices();
  let selectedDevice;

  try {
    const stats = await fs.stat(deviceConfigPath);
    if (!forcePrompt && stats.isFile()) {
      let savedConfig = JSON.parse(
        await fs.readFile(deviceConfigPath, "utf-8")
      );
      if (savedConfig.HIDDevicePath) {
        console.log(`Using saved HID device: ${savedConfig.HIDDevicePath}`);
        selectedDevice = devices.find(
          (device) => device.path === savedConfig.HIDDevicePath
        );
        if (!selectedDevice) {
          console.log(
            "Saved HID device not found, prompting for device selection..."
          );
        } else {
          return selectedDevice;
        }
      }
    }
  } catch (error) {
    console.error("Error checking device config:", error);
  }

  if (devices.length === 0) {
    console.log("No HID devices found.");
    return null;
  }

  console.log("Available HID devices:");
  devices.forEach((device, index) => {
    console.log(
      `${index + 1}. Path: ${device.path}, Manufacturer: ${
        device.manufacturer
      }, Product: ${device.product}`
    );
  });

  const selectedIndex = await promptUser(
    "Enter the number of the HID device you want to use: "
  );
  selectedDevice = devices[selectedIndex - 1];
  return selectedDevice;
}

async function selectSerialDevice(forcePrompt = false) {
  let serialDevices = await SerialPort.list();
  let selectedSerialPath = "";

  try {
    const stats = await fs.stat(deviceConfigPath);
    if (!forcePrompt && stats.isFile()) {
      let savedConfig = JSON.parse(
        await fs.readFile(deviceConfigPath, "utf-8")
      );
      if (savedConfig.serialPath) {
        console.log(`Using saved serial device: ${savedConfig.serialPath}`);
        selectedSerialPath = savedConfig.serialPath;
        return selectedSerialPath;
      }
    }
  } catch (error) {
    console.error("Error checking device config:", error);
  }

  if (serialDevices.length === 0) {
    console.log("No serial devices found.");
    return "";
  }

  console.log("Available serial devices:");
  serialDevices.forEach((device, index) => {
    console.log(`${index + 1}. ${device.path} ${device.pnpId || ""}`);
  });

  const selectedIndex = await promptUser(
    "Enter the number of the serial device you want to use: "
  );
  selectedSerialPath = serialDevices[selectedIndex - 1].path;
  return selectedSerialPath;
}

function listenToHIDDevice(deviceInfo) {
  const device = new HID.HID(deviceInfo.path);
  console.log(`Listening to HID device: ${deviceInfo.path}`);
  device.on("data", (data) => {
    console.log("Data received:", data);
  });
  device.on("error", (err) => {
    console.error("Device error:", err);
  });
}

async function saveDeviceConfig(hidDevicePath, serialPath) {
  try {
    let config = {
      HIDDevicePath: hidDevicePath,
      serialPath: serialPath,
    };
    await fs.writeFile(
      deviceConfigPath,
      JSON.stringify(config, null, 2),
      "utf-8"
    );
    console.log("Device configuration saved.");
  } catch (error) {
    console.error("Error saving device configuration:", error);
  }
}

async function main() {
  let forcePrompt = process.argv.includes("--reset");

  const selectedHIDDevice = await selectHIDDevice(forcePrompt);
  if (!selectedHIDDevice) {
    console.log("HID device selection failed or was cancelled.");
    return;
  }

  const serialPath = await selectSerialDevice(forcePrompt);
  if (!serialPath) {
    console.log("Serial device selection failed or was cancelled.");
    return;
  }

  // Simpan konfigurasi ke file
  await saveDeviceConfig(selectedHIDDevice.path, serialPath);

  listenToHIDDevice(selectedHIDDevice);
}

main().catch(console.error);
