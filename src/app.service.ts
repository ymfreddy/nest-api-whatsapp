import { Injectable, BadRequestException } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';
import { RespuestaDto } from './dtos/respuesta';
import { SolicitudMensajeDto } from './dtos/solicitud-mensaje';
import WsTransporter from './repositories/ws.external';

@Injectable()
export class AppService {
  constructor(private readonly WsTransporter: WsTransporter) {}

  getQr() {
    const path = join(__dirname, '../tmp/qr.svg');
    console.log(path);
    if (!existsSync(path))
      throw new BadRequestException(`No qr found`);

    return path;
  }

  async sendMessage(solicitud: SolicitudMensajeDto) {
    const responseExSave = await this.WsTransporter.sendMsg(solicitud);
    const respuesta: RespuestaDto = {
      success: responseExSave.id ? true : false,
      message: 'SOLICITUD PROCESADA',
      content: responseExSave,
    };
    return respuesta;
  }
}
