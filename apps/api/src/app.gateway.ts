import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Client, LocalAuth } from 'whatsapp-web.js';

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
  async handleInitClient(client: Socket) {
    console.log('initializing client...');
    this.wapclient.onQRCode((qr) => client.emit('newqr', qr));
    this.wapclient.onDeviceConnected((deviceInfo) => {
      client.emit('deviceConnected', deviceInfo);
    });
    await this.wapclient.start();
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
    this.client = new Client({
      authStrategy: new LocalAuth({
        dataPath: 'farmafolder',
      }),
    });
  }

  getClient() {
    return this.client;
  }

  async start() {
    await this.client.initialize();
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
      console.log('device ready...');

      callback({
        phone: clientInfo.wid.user,
        name: clientInfo.pushname,
        platform: clientInfo.platform,
      });
    });
  }
}
