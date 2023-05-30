import { MongooseModule } from '@nestjs/mongoose';
import { ChatsGateway } from './chats.gateway';
import { Module } from '@nestjs/common';
import { Chatting, ChattingSchema } from './schema/chattings.schema';
import { Socket, SocketSchema } from './schema/sockets.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chatting.name, schema: ChattingSchema },
      { name: Socket.name, schema: SocketSchema },
    ]),
  ],
  providers: [ChatsGateway],
})
export class ChatsModule {}
