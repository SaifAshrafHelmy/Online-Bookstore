import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppModuleImportsArray } from './app_module_imports';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: AppModuleImportsArray,
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
