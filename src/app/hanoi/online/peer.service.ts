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

  // 新增消息处理器映射
  private messageHandlers = {
    'room-info': (data: RoomInfo) => {
      this.handleRoomInfo(data);
      this.selfStore.initStore(this.store.size());
      this.sendPlayData();
    },
    'play-data': (data: PlayData) => this.handlePlayData(data),
    'start-game': () => this.store.setState(GameState.PLAYING)
  };

  // 解耦后的连接处理方法
  private setupConnection(conn: DataConnection) {
    this.conn = conn;
    console.log('已建立连接，对方id:', conn.peer);

    this.peerStore.setId(conn.peer);
    this.store.setState(GameState.READY);

    // 统一数据处理器
    this.setupDataHandler(conn);
    this.setupConnectionEvents(conn);
  }

  // 统一的数据处理管道
  private setupDataHandler(conn: DataConnection) {
    conn.on('data', (data: any) => {
      console.log('收到消息：', data);
      try {
        const parsed = JSON.parse(data) as Message<any>;
        this.messageHandlers[parsed.type]?.(parsed.data);
      } catch (error) {
        console.error('消息处理失败', error);
      }
    });
  }

  // 连接事件处理
  private setupConnectionEvents(conn: DataConnection) {
    conn.on('open', () => {
      this.sendStart();
      this.sendRoomInfo();
      this.sendPlayData();
    });

    conn.on('error', (err) => {
      console.error('连接错误：', err);
      this.store.setState(GameState.ERROR);
    });
  }

  // 优化后的初始化方法
  private initPeerListeners(peer: Peer) {
    peer.on('connection', (conn) => this.setupConnection(conn));
    peer.on('error', (err) => {
      console.error('Peer 错误:', err);
      this.store.setState(GameState.ERROR);
    });
  }

  async initPeer(): Promise<Peer> {
    return new Promise((resolve, reject) => {
      this.peer = new Peer();
      this.initPeerListeners(this.peer);

      this.peer.on('open', (id: string) => {
        console.log('我的peer ID是：', id);
        this.selfStore.setId(id);
        this.selfStore.initStore(this.store.size());
        this.store.setState(GameState.WAITING);
        resolve(this.peer!);
      });
    });
  }

  async connectToPeer(peerId: string) {
    try {
      if (!this.peer) {
        this.peer = await this.initPeer();
      }

      this.conn = this.peer.connect(peerId);
      this.setupConnection(this.conn);

      this.conn.on('open', () => {
        this.peerStore.setId(peerId);
        console.log('连接成功');
      });

    } catch (error) {
      console.error('无法连接对方:', error);
      this.store.setState(GameState.ERROR);
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
