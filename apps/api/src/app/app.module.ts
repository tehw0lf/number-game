import { Module } from '@nestjs/common';

import { AppGateway } from './app.gateway';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppGateway],
  providers: [AppService],
})
export class AppModule {}
