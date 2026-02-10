const PHONE_RE = /^\+?[0-9\s\-().]{7,20}$/;

export function isPhone(str: string): boolean {
  const digits = str.replace(/\D/g, "");

  return PHONE_RE.test(str) && digits.length >= 7 && digits.length <= 15;
}
