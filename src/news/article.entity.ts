import { ApiProperty } from '@nestjs/swagger';

class Source {
  @ApiProperty()
  name: string;

  @ApiProperty()
  url: string;
}

export class ArticleEntity {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  publishedAt: string;

  @ApiProperty()
  source: Source;
}
