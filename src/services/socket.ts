import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

class SocketService {
  private socket: any;

  connect(userId: string) {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
        reconnection: true,
      });

      this.socket.on('connect', () => {
        console.log('Connected to BharatGig Real-time Cluster');
        this.socket.emit('join_chat', userId);
      });
    }
  }

  onNotification(callback: (notif: any) => void) {
    if (this.socket) {
      this.socket.on('new_notification', callback);
    }
  }

  onMessage(callback: (msg: any) => void) {
    if (this.socket) {
      this.socket.on('receive_msg', callback);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
