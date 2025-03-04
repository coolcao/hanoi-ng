import { inject, Injectable } from '@angular/core';
import Peer, { DataConnection } from 'peerjs';  // 引入 PeerJS
import { GameState, Message, PlayData, RoomInfo } from '../hanoi.types';
import { Store } from '../store/store';
import { SelfStore } from '../store/self.store';
import { PeerStore } from '../store/peer.store';



@Injectable({
  providedIn: 'root'
})
export class PeerService {

  private selfStore = inject(SelfStore);
  private peerStore = inject(PeerStore);
  readonly store = inject(Store);

  private peer: Peer | null = null;
  private conn: DataConnection | null = null;

  constructor() { }

  sendStart() {
    const message: Message<''> = {
      type: 'start-game',
      data: ''
    }
    this.send(message);
  }
  sendRoomInfo() {
    // 发送房间信息
    const roomInfo: Message<RoomInfo> = {
      type: 'room-info',
      data: {
        roomName: this.store.roomName(),
        size: this.store.size(),
      }
    }
    this.send(roomInfo);
  }
  sendPlayData() {
    const message: Message<PlayData> = {
      type: 'play-data',
      data: {
        stacks: this.selfStore.stacks(),
        steps: this.selfStore.steps()
      }
    }
    this.send(message);
  }

  private handleRoomInfo(data: RoomInfo) {
    this.store.setRoomName(data.roomName);
    this.store.setSize(data.size);
  }
  private handlePlayData(data: PlayData) {
    this.peerStore.setStacks(data.stacks);
    this.peerStore.setSteps(data.steps);
  }

  private handleData(data: any) {
    try {
      const parsed = JSON.parse(data) as Message<any>;
      switch (parsed.type) {
        case 'room-info':
          // 更新房间信息
          const roomInfo = parsed.data as RoomInfo;
          this.handleRoomInfo(roomInfo);
          this.selfStore.initStore(this.store.size());
          this.sendPlayData();
          break;
        case 'play-data':
          const playData = parsed.data as PlayData;
          this.handlePlayData(playData);
          break;
        case 'start-game':
          this.store.setState(GameState.PLAYING);
          break;
        default:
          break;
      }

    } catch (error) {
      console.log('解析消息失败', error);

    }
  }

  async initPeer(): Promise<Peer> {
    return new Promise((resolve, reject) => {
      this.peer = new Peer();
      // 监听Peer连接成功
      this.peer.on('open', (id: string) => {
        console.log('我的peer ID是：', id);
        this.selfStore.setId(id);
        this.selfStore.initStore(this.store.size());
        this.store.setState(GameState.WAITING);
        resolve(this.peer!);
      });
      this.peer.on('error', (err) => {
        reject(err);
      });

      // 监听对方连接
      this.peer.on('connection', async (conn: DataConnection) => {
        this.conn = conn;
        console.log('已建立连接，对方id:', conn.peer);
        this.peerStore.setId(conn.peer);
        this.store.setState(GameState.READY);

        this.conn.on('open', () => {
          this.sendStart();
          this.sendRoomInfo();
          this.sendPlayData();
        });


        // 监听对方发送的消息
        this.conn.on('data', (data: any) => {
          console.log('收到消息：', data);
          this.handleData(data);
        });

        // 监听Peer连接错误
        this.conn.on('error', (err) => {
          console.error('连接错误：', err);
        })
      });
    });
  }

  async connectToPeer(peerId: string) {
    try {
      if (!this.peer) {
        this.peer = await this.initPeer();
      }

      this.conn = this.peer.connect(peerId);
      this.conn.on('open', () => {
        this.peerStore.setId(peerId);
        this.sendStart();
        console.log('连接成功');
      });

      // 监听消息
      this.conn.on('data', (data: any) => {
        console.log('收到消息：', data);
        this.handleData(data);
      });
    } catch (error) {
      console.error('无法连接对方:', error);
    }

  }

  async send<T>(message: Message<T>) {
    if (!this.conn) {
      console.log('连接不存在');

      return;
    }
    await this.conn.send(JSON.stringify(message));
  }

  disconnect() {
    if (this.conn) {
      this.conn.close();
    }
    if (this.peer) {
      this.peer.destroy();
    }
  }

  // 判断peer是否已实例化
  isPeerInitialized(): boolean {
    return !!this.peer;
  }

  // 判断是否已连接
  isConnected(): boolean {
    return !!this.conn;
  }
}
