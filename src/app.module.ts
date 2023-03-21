import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import WsTransporter from './repositories/ws.external';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, WsTransporter],
})
export class AppModule {}
