import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Chatting } from './schema/chattings.schema';
import { Socket as SocketModel } from './schema/sockets.schema';
import { Model } from 'mongoose';

// WebSocketGateway 데코레이터를 이용하여 소켓의 게이트웨이 생성
// namespace를 사용하여 어떤 소켓url로 받을지 정한다. 클라이언트와 같은 네임스페이스를 가져야한다.
@WebSocketGateway({ namespace: 'chattings' })
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private Logger = new Logger('chat');
  constructor(
    @InjectModel(Chatting.name) private readonly chattingModel: Model<Chatting>,
    @InjectModel(SocketModel.name)
    private readonly socketModel: Model<SocketModel>,
  ) {
    this.Logger.log('constructor 실행!');
  }

  // OnGatewayInit (게이트웨이 실행시)
  afterInit(server: any) {
    this.Logger.log('Init 실행!');
  }

  // OnGatewayConnection (소켓 연결시)
  handleConnection(@ConnectedSocket() socket: Socket) {
    this.Logger.log(`connect ${socket.nsp.name}, ${socket.id}`);
  }

  // OnGatewayDisconnect (소켓 연결이 끊어질때)
  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.Logger.log(`Disconnect ${socket.id}`);
    // 해당 유저가 나가면 DB에서 유저 정보를 지우고 남은 사람들에게 알린다.
    const del_user = await this.socketModel.findOne({ id: socket.id });
    if (del_user) {
      socket.broadcast.emit('disconnect_user', del_user.username);
      await del_user.deleteOne();
    }
  }

  // SubscribeMessage는 어떤 이벤트명으로 받는지 정할수있는 데코레이터 이다.
  @SubscribeMessage('new_user')
  async handleNewUser(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket, // 연결된 소켓을 받아와 다시 emit, on할수있게 한다.
  ) {
    // console.log(username, socket.id);
    // socket.emit('hello_user', username);

    // DB에 유저 정보 저장 만일 같은 이름이 있다면 추가값을 붙여서 저장
    const exist = await this.socketModel.exists({ username });
    if (exist) {
      username = `${username}_${Math.floor(Math.random() * 100)}`;
      await this.socketModel.create({
        id: socket.id,
        username: username,
      });
    } else {
      await this.socketModel.create({
        id: socket.id,
        username: username,
      });
    }

    // broadcast를 이용한 연결된 모든 접속자에게 데이터 전달
    socket.broadcast.emit('user_connected', username);
    return username;
  }

  @SubscribeMessage('submit_chat')
  async handleNewChat(
    @MessageBody() chat: string,
    @ConnectedSocket() socket: Socket,
  ) {
    // 채팅 기록 DB 저장
    const user_info = await this.socketModel.findOne({ id: socket.id });
    await this.chattingModel.create({
      user: user_info,
      chat: chat,
    });

    socket.broadcast.emit('new_chat', {
      chat: chat,
      username: user_info.username,
    });
  }
}

// 웹소켓을 사용하기 위해 라이브러리 설치 ( npm i --save @nestjs/websockets @nestjs/platform-socket.io )
// 게이트웨이를 이용하여 웹소켓을 사용한다. ( CLI를 사용하여 게이트웨이 생성 nest g ga <이름> )
// 케이트웨이는 공급자로 취급될수있다.
// 소켓은 새로고침시 연결이 끊어지게 된다. 세션이 종료되기 때문에
// 소켓에는 id가 있는데 해당 id로 연결하고 데이터를 주고 받고 한다.

// 소켓의 수명 주기 후크
// OnGatewayInit : afterInit(). 해당 게이트웨이가 실행될때 constructor다음으로 자동 실행된다.
// OnGatewayConnection : handleConnection(). 소켓이 연결이 되는 시점에서 실행된다.
// OnGatewayDisconnect	: handleDisconnect(). 소켓 연결이 끊어졌을 경우 실행된다.
