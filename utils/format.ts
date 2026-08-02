export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("en-IN", options ?? { day: "2-digit", month: "short", year: "numeric" }).format(
    new Date(date)
  );
}

export function formatPhoneNumber(value: string): string {
  return value.replace(/(\d{5})(\d{5})/, "$1 $2");
}
