import { Module } from '@nestjs/common';

import { AppGateway } from './app.gateway';

@Module({
  imports: [AppGateway],
})
export class AppModule {}
