import { inject, Injectable } from '@angular/core';
import Peer, { DataConnection } from 'peerjs';  // 引入 PeerJS
import { GameState, MoveEventData, MoveOperation, PeerDataEvent, PeerEventType, PlayerState, SyncState } from '../hanoi.types';
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

  constructor() {
    this.initPeer();
  }

  private connectionHandlers = {
    handleOpen: (conn: DataConnection) => {
      conn.on('open', () => {
        const peerId = conn.peer;
        this.peerStore.setId(peerId);
        this.selfStore.initStore(this.store.size());
        this.peerStore.initStore(this.store.size());
        this.store.setGameState(GameState.PEER_CONNECTED);
        if (this.store.isHost()) {
          console.log(`对方[${peerId}]已加入`);
          this.sendSyncState();
        } else {
          console.log(`已加入房间[${peerId}]`);
        }
      });
    },
    handleError: (conn: DataConnection) => {
      conn.on('error', (err) => {
        console.error('连接错误：', err);
      });
    },
    handleData: (conn: DataConnection) => {
      conn.on('data', (data: any) => {
        try {
          const parsed = JSON.parse(data) as PeerDataEvent<any>;
          const handler = this.peerDataEventHandlers[parsed.event];
          handler?.(parsed.data);
        } catch (error) {
          console.error('消息处理失败', error);
        }
      });
    },
  };
  private peerHandlers = {
    handleConnection: (peer: Peer) => {
      peer.on('connection', (conn: DataConnection) => {
        this.conn = conn;
        this.connectionHandlers.handleOpen(conn);
        this.connectionHandlers.handleData(conn);
        this.connectionHandlers.handleError(conn);
      });
    },
    handleOpen: (peer: Peer) => {
      peer.on('open', (id: string) => {
        console.log('peer 客户端已实例化，我的PeerId:' + id);
        this.selfStore.setId(id);
        this.store.setGameState(GameState.WAITING);
      });
    },
    handleError: (peer: Peer) => {
      peer.on('error', (err) => {
        console.error('Peer实例化错误', err);
      });
    },
  };

  private peerDataEventHandlers = {
    [PeerEventType.SYNC_STATE]: (data: SyncState) => this.handleSyncState(data),
    [PeerEventType.MOVE]: (data: MoveEventData) => this.handleMoveEvent(data),
    [PeerEventType.READY]: () => this.handleReady(),
  };

  sendReady() {
    const event: PeerDataEvent<null> = {
      event: PeerEventType.READY,
      data: null,
    }
    this.send(event);
  }
  sendSyncState() {
    // 发送房间信息
    const roomInfo: PeerDataEvent<SyncState> = {
      event: PeerEventType.SYNC_STATE,
      data: {
        size: this.store.size(),
        stacks: this.selfStore.stacks(),
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
  private handleSyncState(data: SyncState) {
    const { size, stacks } = data;
    this.store.setSize(data.size);
    if (!this.store.isHost()) {
      this.selfStore.setStacks(stacks);
      this.peerStore.setStacks(stacks);
    }
  }

  initPeer() {
    const peer = new Peer();
    this.peer = peer;

    this.peerHandlers.handleOpen(this.peer);
    this.peerHandlers.handleConnection(this.peer);
    this.peerHandlers.handleError(this.peer);

    return peer;
  }

  // 客户端连接到对方
  connectToPeer(peerId: string) {
    try {
      if (!this.peer) {
        this.peer = this.initPeer();
      }

      const conn = this.peer.connect(peerId);

      this.conn = conn;

      this.connectionHandlers.handleOpen(conn);
      this.connectionHandlers.handleData(conn);
      this.connectionHandlers.handleError(conn);

    } catch (error) {
      console.error('无法连接对方:', error);
    }
  }

  send<T>(data: PeerDataEvent<T>) {
    if (!this.conn) {
      console.log('连接不存在');

      return;
    }
    this.conn.send(JSON.stringify(data));
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
