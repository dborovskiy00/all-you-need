export function isINN(str: string): boolean {
  if (!/^\d{10}$|^\d{12}$/.test(str)) {
    return false;
  }

  const digits = str.split("").map(Number);

  if (digits.length === 10) {
    const weights = [2, 4, 10, 3, 5, 9, 4, 6, 8];
    const sum = weights.reduce((acc, w, i) => acc + w * digits[i], 0);

    return (sum % 11) % 10 === digits[9];
  }

  const weights11 = [7, 2, 4, 10, 3, 5, 9, 4, 6, 8];
  const weights12 = [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8];

  const sum11 = weights11.reduce((acc, w, i) => acc + w * digits[i], 0);
  const sum12 = weights12.reduce((acc, w, i) => acc + w * digits[i], 0);

  return (
    (sum11 % 11) % 10 === digits[10] && (sum12 % 11) % 10 === digits[11]
  );
}
