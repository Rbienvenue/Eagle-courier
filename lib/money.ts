export function formatMoney(value: number | string | { toString(): string }) {
  return new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency: "RWF",
    maximumFractionDigits: 0
  }).format(Number(value));
}
