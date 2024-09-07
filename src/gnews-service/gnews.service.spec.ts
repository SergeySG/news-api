import { Test, TestingModule } from '@nestjs/testing';
import { GnewsService } from '@app/gnews-service/gnews.service';

describe('GnewsServiceService', () => {
  let service: GnewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GnewsService],
    }).compile();

    service = module.get<GnewsService>(GnewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
