import { Module } from '@nestjs/common';

import { AppGateway } from './app.gateway';

@Module({
  controllers: [AppGateway],
})
export class AppModule {}
