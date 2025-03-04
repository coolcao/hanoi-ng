import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { OnlineStore } from '../online.store';
import { PeerService } from '../peer.service';
import { MoveOperation } from '../../hanoi.types';
import { HanoiService } from '../../hanoi.service';
import { GameState } from '../online.state';
import { timer } from 'rxjs';

@Component({
  selector: 'app-online-board',
  standalone: false,

  templateUrl: './online-board.component.html',
  styleUrl: './online-board.component.css'
})
export class HanoiOnlineBoardComponent implements OnInit {

  GameState = GameState;

  readonly onlineStore = inject(OnlineStore);
  readonly hanoiService = inject(HanoiService);
  readonly peerService = inject(PeerService);

  // store
  myId = this.onlineStore.myId;
  peerId = this.onlineStore.peerId;
  stacks = this.onlineStore.stacks;
  readonly stack1 = computed(() => this.stacks().stack1);
  readonly stack2 = computed(() => this.stacks().stack2);
  readonly stack3 = computed(() => this.stacks().stack3);
  steps = this.onlineStore.steps;
  peerSteps = this.onlineStore.peerSteps;

  peerStacks = this.onlineStore.peerStacks;
  readonly peerStack1 = computed(() => this.peerStacks().stack1);
  readonly peerStack2 = computed(() => this.peerStacks().stack2);
  readonly peerStack3 = computed(() => this.peerStacks().stack3);

  roomName = this.onlineStore.roomName;
  size = this.onlineStore.size;
  state = this.onlineStore.state;

  readonly winner = this.onlineStore.winner;

  // 创建房间loading
  loading = false;

  constructor() {
    effect(() => {
      const winner = this.winner();
      if (winner !== 'none') {
        this.onlineStore.setState(GameState.FINISHED);
      }
    });
  }

  async ngOnInit(): Promise<void> {

    // 初始化peer客户端
    this.loading = true;
    await this.peerService.initPeer();
    this.loading = false;

    // 设置状态
    this.onlineStore.setState(GameState.WAITING);

    // 从state中获取action
    const action = history.state.action;
    if (action == 'join') {
      this.loading = true;
      const peerId = this.onlineStore.peerId();
      if (peerId) {
        await this.peerService.connectToPeer(peerId);
        this.loading = false;
        this.onlineStore.setState(GameState.READY);
      }
    }
  }

  drop(event: CdkDragDrop<number[]>) {
    const moveOperation: MoveOperation = {
      fromId: event.previousContainer.id,
      toId: event.container.id,
      fromStack: event.previousContainer.data,
      toStack: event.container.data,
      disc: event.item.data,
    };
    if (this.hanoiService.moveDisc(moveOperation)) {
      this.onlineStore.updateStacks(this.stacks());
      this.peerService.sendPlayData();
    }
  }

  copyToClipboard(id: string) {
    navigator.clipboard.writeText(id);
    alert('房间ID已复制到剪贴板');
  }

}
