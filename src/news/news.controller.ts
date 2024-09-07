import { Controller, Get, Param, Query } from '@nestjs/common';
import { GnewsService } from '@app/gnews-service/gnews.service';
import {
  ApiQuery,
  ApiResponse,
  ApiResponseOptions,
  ApiTags,
} from '@nestjs/swagger';
import { Article } from '@app/types/article.type';
import { Category } from '@app/types/category.enum';
import { ApiQueryOptions } from '@nestjs/swagger/dist/decorators/api-query.decorator';
import { LangEnum } from '@app/types/lang.enum';
import { ArticleEntity } from '@app/news/article.entity';

const languageQueryOpt: ApiQueryOptions = {
  name: 'lang',
  type: String,
  description: 'News response language',
  required: false,
  enum: LangEnum,
  example: LangEnum.ENGLISH,
};

const apiOkResponseOpt: ApiResponseOptions = {
  status: 200,
  type: [ArticleEntity],
};
@Controller('news/')
export class NewsController {
  constructor(private readonly gNews: GnewsService) {}

  @ApiTags('News')
  @Get()
  @ApiResponse(apiOkResponseOpt)
  @ApiQuery(languageQueryOpt)
  findAll(@Query('lang') lang?: string): Promise<Article[]> {
    return this.gNews.findAll(lang);
  }

  @ApiQuery(languageQueryOpt)
  @ApiTags('News')
  @Get('category/:category')
  @ApiQuery({
    name: 'category',
    type: String,
    description: 'News Category',
    required: true,
    enum: Category,
    example: Category.SPORTS,
  })
  @ApiResponse(apiOkResponseOpt)
  findCategory(
    @Param('category') category: Category,
    @Param('lang') lang?: string,
  ): Promise<Article[]> {
    return this.gNews.findByCategory(category, lang);
  }

  @ApiTags('News')
  @Get('search')
  @ApiQuery(languageQueryOpt)
  @ApiQuery({
    name: 's',
    type: String,
    description: 'search string',
    required: true,
    example: 'Champion League results',
  })
  @ApiResponse(apiOkResponseOpt)
  @ApiResponse({ status: 204, example: 'There is any article' })
  searchArticles(
    @Query('s') search: string,
    @Query('lang') lang?: string,
  ): Promise<Article[]> {
    return this.gNews.findArticles(search, lang);
  }
}
