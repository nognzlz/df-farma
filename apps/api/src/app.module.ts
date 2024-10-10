import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ProductModule } from './product/product.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'client', 'dist'),
    }),
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
