import { inject, Injectable } from '@angular/core';
import Peer, { DataConnection } from 'peerjs';  // 引入 PeerJS
import { GameState, MoveEventData, MoveOperation, PeerDataEvent, PeerEventType, PlayerState, RoomInfo } from '../hanoi.types';
import { Store } from '../store/store';
import { SelfStore } from '../store/self.store';
import { PeerStore } from '../store/peer.store';
import { HanoiService } from '../hanoi.service';

@Injectable({
  providedIn: 'root'
})
export class PeerService {

  private selfStore = inject(SelfStore);
  private peerStore = inject(PeerStore);
  readonly store = inject(Store);
  private hanoiService = inject(HanoiService);

  private peer: Peer | null = null;
  private conn: DataConnection | null = null;

  constructor() { }

  private peerDataEventHandlers = new Map<PeerEventType, (data: any) => void>(
    [
      [PeerEventType.ROOM_INFO, (data: RoomInfo) => this.handleRoomInfo(data)],
      [PeerEventType.MOVE, (data: MoveEventData) => this.handleMoveEvent(data)],
      [PeerEventType.READY, () => this.handleReady()],
    ]
  );


  sendReady() {
    const event: PeerDataEvent<null> = {
      event: PeerEventType.READY,
      data: null,
    }
    this.send(event);
  }
  sendRoomInfo() {
    // 发送房间信息
    const roomInfo: PeerDataEvent<RoomInfo> = {
      event: PeerEventType.ROOM_INFO,
      data: {
        size: this.store.size(),
      }
    }
    this.send(roomInfo);
  }

  sendMove(data: MoveEventData) {
    const event: PeerDataEvent<MoveEventData> = {
      data,
      event: PeerEventType.MOVE,
    }
    this.send(event);
  }


  private handleReady() {
    this.peerStore.setPlayerState(PlayerState.READY);
  }

  private handleMoveEvent(data: MoveEventData) {
    const moveOperation: MoveOperation = {
      stacks: this.peerStore.stacks(),
      from: data.from,
      to: data.to,
      disc: data.disc,
    }
    const stacks = this.hanoiService.move(moveOperation);
    this.peerStore.setStacks(stacks);
    this.peerStore.addSteps();
  }
  private handleRoomInfo(data: RoomInfo) {
    console.log('房间信息', data);

    this.store.setSize(data.size);
    this.peerStore.initStore(this.store.size());
    this.selfStore.initStore(this.store.size());
  }

  // 设置连接
  private setupConnection(conn: DataConnection) {
    this.conn = conn;

    // 设置监听data事件
    this.setupDataHandler(conn);
    // 设置监听conn事件
    this.setupConnectionEvents(conn);
  }

  // 统一的数据处理管道
  private setupDataHandler(conn: DataConnection) {
    conn.on('data', (data: any) => {
      try {
        const parsed = JSON.parse(data) as PeerDataEvent<any>;
        this.peerDataEventHandlers.get(parsed.event)?.(parsed.data);
      } catch (error) {
        console.error('消息处理失败', error);
      }
    });
  }

  // 连接事件处理
  private setupConnectionEvents(conn: DataConnection) {
    conn.on('open', () => {
      this.peerStore.setId(conn.peer);
    });

    conn.on('error', (err) => {
      console.error('连接错误：', err);
    });
  }

  // 优化后的初始化方法
  private initPeerListeners(peer: Peer) {
    peer.on('connection', (conn) => {
      this.setupConnection(conn);
      conn.on('open', () => {
        this.store.setGameState(GameState.PEER_CONNECTED);
        this.peerStore.initStore(this.store.size());
        this.sendRoomInfo();
      });
    });
    peer.on('error', (err) => {
      console.error('Peer 错误:', err);
    });
  }

  async initPeer(): Promise<Peer> {
    return new Promise((resolve, reject) => {
      this.peer = new Peer();
      this.initPeerListeners(this.peer);

      this.peer.on('open', (id: string) => {
        this.selfStore.setId(id);
        this.selfStore.initStore(this.store.size());
        this.store.setGameState(GameState.WAITING);
        resolve(this.peer!);
      });
    });
  }

  // 客户端连接到对方
  async connectToPeer(peerId: string) {
    try {
      if (!this.peer) {
        this.peer = await this.initPeer();
      }

      const conn = this.peer.connect(peerId);

      this.setupConnection(conn);

      conn.on('open', () => {
        this.store.setGameState(GameState.PEER_CONNECTED);
        console.log(`加入房间${peerId}成功`);
      });

    } catch (error) {
      console.error('无法连接对方:', error);
    }
  }

  async send<T>(data: PeerDataEvent<T>) {
    if (!this.conn) {
      console.log('连接不存在');

      return;
    }
    await this.conn.send(JSON.stringify(data));
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
