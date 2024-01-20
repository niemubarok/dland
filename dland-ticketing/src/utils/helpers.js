export const formatCurrency = (amount) => {
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

export const removeDot = (number) => {
  return number.toString().replace(/\./g, "");
};
