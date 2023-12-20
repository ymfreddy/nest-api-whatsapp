import { Client, LocalAuth, MessageMedia } from "whatsapp-web.js";
import { image as imageQr } from "qr-image";
import { Injectable } from "@nestjs/common";
import { SolicitudMensajeDto, SolicitudMensajeMediaDto } from "src/dtos/solicitud-mensaje";

@Injectable()
class WsTransporter extends Client {
  private status = false;

  constructor() {
    super({
      authStrategy: new LocalAuth(),
      puppeteer: {
        args: ['--no-sandbox'],
      }
    });

    console.log("Iniciando....");

    this.initialize();

    this.on("ready", () => {
      this.status = true;
      console.log("LOGIN_SUCCESS!!!");
    });

    this.on("auth_failure", () => {
      this.status = false;
      console.log("LOGIN_FAIL");
    });

    this.on("qr", (qr) => {
      console.log('Escanea el codigo QR que esta en la carpeta tmp')
      this.generateImage(qr)
    });

    this.on('message', message => {
      console.log(message.body);
      if(message.body === 'ping') {
        this.sendMessage(message.from, 'pong');
      }
    });
  }

  async sendMsg(solicitud: SolicitudMensajeDto): Promise<any> {
    try {
      if (!this.status) return Promise.resolve({ error: "WAIT_LOGIN" });
      const response = await this.sendMessage(`${solicitud.phone}@c.us`, solicitud.message);
      return { id: response.id.id };
      //return { response};
    } catch (e: any) {
      return Promise.resolve({ error: e.message });
    }
  }

    /**
   * Enviar mensaje de WS
   * @param lead
   * @returns
   */
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
    let qr_png = imageQr(base64, { type: "png", margin: 4 });
    qr_png.pipe(require("fs").createWriteStream(`${path}/qr.png`));
    console.log(`⚡ Recuerda que el QR se actualiza cada minuto ⚡'`);
    console.log(`⚡ Actualiza F5 el navegador para mantener el mejor QR⚡`);
  };
}

export default WsTransporter;
