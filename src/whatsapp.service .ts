import { Client, LocalAuth, MessageMedia } from "whatsapp-web.js";
import { image as imageQr } from "qr-image";
import { Injectable } from "@nestjs/common";
import { SolicitudMensajeDto, SolicitudMensajeMediaDto } from "./dtos/solicitud-mensaje";

@Injectable()
export class WhatsappService extends Client {
  private status = false;

  constructor() {
    super({
      authStrategy: new LocalAuth(),
      puppeteer: { headless: true },
    });

    console.log("Iniciando....");
   
    this.initialize();

    this.on("ready", () => {
      this.status = true;
      console.log("LOGIN_SUCCESS");
    });

    this.on("auth_failure", () => {
      this.status = false;
      console.log("LOGIN_FAIL");
    });

    this.on("qr", (qr) => {
      console.log('Escanea el codigo QR que esta en la carepta tmp')
      this.generateImage(qr)
    });


     
  }

  async sendMsg(solicitud: SolicitudMensajeDto): Promise<any> {
    try {
      if (!this.status) return Promise.resolve({ error: "WAIT_LOGIN" });
      const { message, phone } = solicitud;
      const response = await this.sendMessage(`${phone}@c.us`, message);
      return { id: response.id.id };
      //return { response};
    } catch (e: any) {
      return Promise.resolve({ error: e.message });
    }
  }

  async sendMsgMedia(solicitud: SolicitudMensajeMediaDto): Promise<any> {
    try {
      if (!this.status) return Promise.resolve({ error: "WAIT_LOGIN" });

      var mediaFile = new MessageMedia(solicitud.mimeType, solicitud.data, solicitud.fileName, null);
      const response = await this.sendMessage(`${solicitud.phone}@c.us`, mediaFile);

      return { id: response.id.id };
      //return { response};
    } catch (e: any) {
      return Promise.resolve({ error: e.message });
    }
  }

  getStatus(): boolean {
    return this.status;
  }

  private generateImage = (base64: string) => {
    const path = `${process.cwd()}/tmp`;
    let qr_svg = imageQr(base64, { type: "svg", margin: 4 });
    qr_svg.pipe(require("fs").createWriteStream(`${path}/qr.svg`));
    console.log(`⚡ Recuerda que el QR se actualiza cada minuto ⚡'`);
    console.log(`⚡ Actualiza F5 el navegador para mantener el mejor QR⚡`);
  };
}
