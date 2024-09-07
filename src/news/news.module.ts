import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GnewsService } from '@app/gnews-service/gnews.service';

@Module({
  imports: [HttpModule],
  providers: [GnewsService],
})
export class NewsModule {}
