import QRCode from "qrcode";

export async function createQrDataUrl(value: string) {
  return QRCode.toDataURL(value, {
    margin: 1,
    width: 220,
    color: {
      dark: "#0f172a",
      light: "#ffffff"
    }
  });
}
