import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, Observable } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { GNews } from '@app/types/g-news.type.js';
import { Article } from '@app/types/article.type';
import { Category } from '@app/types/category.enum';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class GnewsService {
  private readonly logger = new Logger('News');
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private baseurl = 'https://gnews.io/api/v4/';

  async getData(
    endpoint: string,
    url: string,
    lang?: string,
  ): Promise<AxiosResponse<GNews>> {
    const response = await firstValueFrom(
      this.httpService
        .get<GNews>(
          this.baseurl +
            endpoint +
            '?apikey=' +
            process.env.GNEWS_API_KEY +
            `&lang=${lang ?? 'en'}` +
            url,
        )
        .pipe(
          catchError((error: AxiosError): Observable<AxiosResponse<GNews>> => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );
    if (response.data.totalArticles === 0) {
      throw new HttpException('There is any article', HttpStatus.NO_CONTENT);
    }

    return response;
  }

  async findAll(lang?: string): Promise<Article[]> {
    const cacheValue = await this.cacheManager.get<Article[]>('last_news');
    if (!cacheValue) {
      const { data } = await this.getData('search', '&q=example', lang);

      await this.cacheManager.set('last_news', data.articles);
      return data.articles;
    }
    return cacheValue;
  }

  async findByCategory(category: Category, search?: string, lang?: string) {
    const cacheValue = await this.cacheManager.get<Article[]>(category);
    if (!cacheValue) {
      if (!Object.values(Category).includes(category)) {
        throw new HttpException('Wrong category', HttpStatus.BAD_REQUEST);
      }
      const s = search ? `&q="${search}"` : '';
      const { data } = await this.getData(
        'top-headlines',
        `${s}&category=${category}`,
        lang,
      );
      await this.cacheManager.set(category, data.articles);
      return data.articles;
    }
    return cacheValue;
  }

  async findArticles(search: string, lang?: string) {
    const cacheValue = await this.cacheManager.get<Article[]>('searched_news');
    if (!cacheValue) {
      const { data } = await this.getData(
        'top-headlines',
        `&q="${search}"`,
        lang,
      );

      await this.cacheManager.set('searched_news', data.articles);
      return data.articles;
    }

    return cacheValue;
  }
}
