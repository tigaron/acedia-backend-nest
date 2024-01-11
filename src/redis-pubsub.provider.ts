import { Provider } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';

export const REDIS_PUB_SUB = 'REDIS_PUB_SUB';

export const redisPubSubProvider: Provider = {
  provide: REDIS_PUB_SUB,
  useFactory: () => {
    return new RedisPubSub({
      connection: process.env.UPSTASH_REDIS_REST_IOREDIS,
    });
  },
};
