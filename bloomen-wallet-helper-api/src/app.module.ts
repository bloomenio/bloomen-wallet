import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelperController } from './helper/helper.controller';
import { HelperService } from './helper/helper.service';

@Module({
  imports: [],
  controllers: [AppController, HelperController],
  providers: [AppService, HelperService],
})
export class AppModule {}
