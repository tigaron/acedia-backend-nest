import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChannelModule } from './channel/channel.module';
import { ConversationModule } from './conversation/conversation.module';
import { MemberModule } from './member/member.module';
import { MessageModule } from './message/message.module';
import { ProfileModule } from './profile/profile.module';
import { ServerModule } from './server/server.module';
import { TokenModule } from './token/token.module';
import { TokenService } from './token/token.service';

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      imports: [TokenModule],
      inject: [TokenService],
      driver: ApolloDriver,
      useFactory: async (tokenService: TokenService) => {
        return {
          installSubscriptionHandlers: true,
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          sortSchema: true,
          subscriptions: {
            'subscriptions-transport-ws': {
              onConnect: async (connectionParams: {
                headers: { authorization: { token: string } };
              }) => {
                console.log('connectionParams', connectionParams ?? null);
                if (!connectionParams?.headers?.authorization?.token)
                  // throw new Error('Missing auth token!');
                  return { user: null };

                const user = await tokenService.validateToken(
                  connectionParams.headers.authorization.token,
                );

                return { user };
              },
            },
            'graphql-ws': {
              onConnect: async (context: {
                connectionParams: any;
                extra: any;
              }) => {
                console.log('context', context ?? null);
                const { connectionParams, extra } = context;

                if (!connectionParams?.headers?.authorization?.token)
                  // throw new Error('Missing auth token!');
                  return { user: null };

                const user = await tokenService.validateToken(
                  connectionParams.headers.authorization.token,
                );

                extra.user = user;
              },
            },
          },
          cors: {
            origin: true,
            credentials: true,
          },
        };
      },
    }),
    ServerModule,
    ProfileModule,
    MemberModule,
    ChannelModule,
    ConversationModule,
    MessageModule,
    TokenModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
