import { Client } from "whatsapp-web.js";

export class WapClient {
  constructor() {
    this.client = new Client();
  }

  async start() {
    await this.client.initialize();
  }

  onQRCode(callback) {
    this.client.on("qr", (qr) => {
      console.log("QR RECEIVED", qr);
      callback(qr);
    });
  }

  onDeviceConnected(callback) {
    this.client.once("ready", () => {
      callback();
    });
  }
}
