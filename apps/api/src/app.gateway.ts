import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Client } from 'whatsapp-web.js';

@WebSocketGateway()
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  server: Server;
  wapclient: WapClient;

  constructor() {
    this.wapclient = new WapClient();
  }

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('init-client')
  handleInitClient(client: Socket) {
    console.log('initializing client...');
    this.wapclient.onQRCode((qr) => client.emit('newqr', qr));
    this.wapclient.onDeviceConnected((deviceInfo) => {
      client.emit('deviceConnected', deviceInfo);
    });
    this.wapclient.start();
  }

  @SubscribeMessage('stop-client')
  handleStopClient(client: Socket) {
    console.log('stopping client...');
    this.wapclient.stop();
    client.emit('deviceDisconnected');
  }
}

class WapClient {
  private client: Client;

  constructor() {
    this.client = new Client({});
  }

  start() {
    this.client.initialize();
  }

  stop() {
    this.client.destroy();
  }

  onQRCode(callback) {
    this.client.on('qr', (qr) => {
      console.log('QR RECEIVED', qr);
      callback(qr);
    });
  }

  onDeviceConnected(callback) {
    this.client.once('ready', () => {
      const clientInfo = this.client.info;
      callback({
        phone: clientInfo.wid.user,
        name: clientInfo.pushname,
        platform: clientInfo.platform,
      });
    });
  }
}
