import { Controller, Get, Query } from '@nestjs/common';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  /**
   * GET /news/farming?location=Pune
   *
   * Returns up to 8 farming news items relevant to Maharashtra.
   * Results are cached for 1 hour server-side — safe to call on every
   * app launch without worrying about rate limits.
   */
  @Get('farming')
  async getFarmingNews(@Query('location') location?: string) {
    const items = await this.newsService.getNews(location);
    return {
      ok:         true,
      cacheAgeS:  this.newsService.getCacheAge(),
      location:   location ?? 'Maharashtra',
      items,
    };
  }
}
