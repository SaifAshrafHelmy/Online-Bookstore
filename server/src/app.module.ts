import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppModuleImportsArray } from './app_module_imports';

@Module({
  imports: AppModuleImportsArray,
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
