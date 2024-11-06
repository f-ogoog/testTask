import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Cache } from '@nestjs/cache-manager';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  private memoryCache = new Map();
  private ongoingRequests = new Map();

  constructor(
    @Inject(CACHE_MANAGER) private readonly redisService: Cache,
    private readonly prismaService: PrismaService,
  ) {}

  async getFilm(title: string) {
    if (!title) throw new BadRequestException('Title should not be empty');

    const key = `film:${title}`

    const sameRequest = this.ongoingRequests.get(key);
    if (sameRequest) {
      await sameRequest;
    }

    if (this.memoryCache.has(key)) return this.memoryCache.get(key);

    const redisCache = await this.redisService.get(key);
    if (redisCache) return redisCache;
    
    const result = this.cacheFilm(title, key).finally(() => {
      this.ongoingRequests.delete(key)
    });

    this.ongoingRequests.set(key, result);
    return result;
  }

  async cacheFilm (title: string, key: string) {
    const film = await this.prismaService.film.findFirst({
      where: { title },
    });

    if (!film) throw new BadRequestException('Film with such title does not exist');

    this.memoryCache.set(key, film);
    setTimeout(() => {
      this.memoryCache.delete(key);
    }, 15000);

    await this.redisService.set(key, film,  30000);

    return film;
  }
}
