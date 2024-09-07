import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsController } from './news/news.controller';
import { GnewsService } from './gnews-service/gnews.service';
import { NewsModule } from './news/news.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({
      ttl: 10000, // 10 seconds
      isGlobal: true,
    }),
    NewsModule,
    HttpModule,
  ],
  controllers: [AppController, NewsController],
  providers: [AppService, GnewsService],
})
export class AppModule {}
