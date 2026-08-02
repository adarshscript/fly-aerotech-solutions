export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const PHONE_PATTERN = /^\+?[0-9][0-9\s\-()]{7,17}$/;

export const IMAGE_URL_PATTERN = /^(https?:\/\/|\/)/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value);
}

export function isValidPhone(value: string): boolean {
  return PHONE_PATTERN.test(value);
}

export function isValidImageUrl(value: string): boolean {
  return IMAGE_URL_PATTERN.test(value);
}
