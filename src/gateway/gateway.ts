import { OnModuleInit } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class Gateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);
    });
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: any): void {
    console.log('Got data', data);
    this.server.emit('onMessage', {
      msg: 'New Message from server',
      content: data,
    });
  }
}
