export interface PasswordOptions {
  minLength?: number;
  lowercase?: boolean;
  uppercase?: boolean;
  digits?: boolean;
  special?: boolean;
}

export function isStrongPassword(
  str: string,
  options: PasswordOptions = {},
): boolean {
  const {
    minLength = 8,
    lowercase = true,
    uppercase = true,
    digits = true,
    special = true,
  } = options;

  if (str.length < minLength) {
    return false;
  }

  if (lowercase && !/[a-z]/.test(str)) {
    return false;
  }

  if (uppercase && !/[A-Z]/.test(str)) {
    return false;
  }

  if (digits && !/\d/.test(str)) {
    return false;
  }

  if (special && !/[^a-zA-Z0-9]/.test(str)) {
    return false;
  }

  return true;
}
