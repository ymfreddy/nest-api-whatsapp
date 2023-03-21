import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { SolicitudMensajeDto } from './dtos/solicitud-mensaje';

@Controller('wap/api/v1')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/whatsapp/qr-client-connect')
  qrClientConnect(@Res() res: Response) {
    const path = this.appService.getQr();
    res.sendFile(path);
  }

  @Post('/whatsapp/send-message')
  sendMessage(@Body() solicitud: SolicitudMensajeDto): any {
    const response = this.appService.sendMessage(solicitud);
    return response;
  }
}
