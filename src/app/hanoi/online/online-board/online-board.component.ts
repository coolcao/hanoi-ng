import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { PeerService } from '../peer.service';
import { GameState, MoveEventData, MoveOperation, PlayerState, StackKey } from '../../hanoi.types';
import { HanoiService } from '../../hanoi.service';
import { Store } from '../../store/store';
import { SelfStore } from '../../store/self.store';
import { PeerStore } from '../../store/peer.store';
import { AlertService } from '../../../share/alert/alert.service';


@Component({
  selector: 'app-online-board',
  standalone: false,

  templateUrl: './online-board.component.html',
  styleUrl: './online-board.component.css'
})
export class HanoiOnlineBoardComponent implements OnInit {

  PlayerState = PlayerState;
  GameState = GameState;

  readonly selfStore = inject(SelfStore);
  readonly peerStore = inject(PeerStore);
  readonly store = inject(Store);
  readonly hanoiService = inject(HanoiService);
  readonly peerService = inject(PeerService);
  readonly router = inject(Router);
  readonly alert = inject(AlertService);

  // store
  myId = this.selfStore.id;
  myName = this.selfStore.player;
  myState = this.selfStore.state;

  peerId = this.peerStore.id;
  peerName = this.peerStore.player;
  peerState = this.peerStore.state;

  stacks = this.selfStore.stacks;
  readonly stack1 = computed(() => this.stacks().stack1);
  readonly stack2 = computed(() => this.stacks().stack2);
  readonly stack3 = computed(() => this.stacks().stack3);
  mySteps = this.selfStore.steps;
  peerSteps = this.peerStore.steps;

  peerStacks = this.peerStore.stacks;
  readonly peerStack1 = computed(() => this.peerStacks().stack1);
  readonly peerStack2 = computed(() => this.peerStacks().stack2);
  readonly peerStack3 = computed(() => this.peerStacks().stack3);

  roomName = this.store.roomName;
  size = this.store.size;
  state = this.store.gameState;

  readonly winner = this.store.winner;

  // 创建房间loading
  loading = false;

  // 倒计时
  countdown = 5;
  countdownSub: Subscription | null = null;

  constructor() {
    effect(() => {
      const winner = this.winner();
      if (winner === 'all') {
        this.alert.info('双方都已完成，游戏结束');
      } else if (winner === this.myId()) {
        this.selfStore.setPlayerState(PlayerState.WIN);
        this.alert.success('恭喜，您已获胜');
      } else if (winner === this.peerId()) {
        this.peerStore.setPlayerState(PlayerState.WIN);
        this.alert.error('抱歉，对方已率先完成，您还可以继续挑战');
      }

      if (this.myState() === PlayerState.READY && this.peerState() === PlayerState.READY) {
        this.store.setGameState(GameState.READY);
        //
        this.countdownSub = timer(1000, 1000).subscribe(() => {
          if (this.countdown == 0) {
            this.store.setGameState(GameState.STARTED);
            this.selfStore.setPlayerState(PlayerState.PLAYING);
            this.peerStore.setPlayerState(PlayerState.PLAYING);
            //
            if (this.countdownSub) {
              this.countdownSub.unsubscribe();
              this.countdownSub = null;
            }
          }
          this.countdown--;
        });
      }

    });
  }

  async ngOnInit(): Promise<void> {

    // 初始化peer客户端
    this.loading = true;
    await this.peerService.initPeer();
    this.loading = false;

    // 从state中获取action
    const action = history.state.action;
    if (action == 'join') {
      this.loading = true;
      const peerId = this.peerStore.id();
      if (peerId) {
        await this.peerService.connectToPeer(peerId);
        this.loading = false;
      }
    }
  }

  drop(event: CdkDragDrop<number[]>) {

    const moveOperation: MoveOperation = {
      stacks: this.stacks(),
      from: event.previousContainer.id as StackKey,
      to: event.container.id as StackKey,
      disc: event.item.data,
    };

    // 本地计算移动操作
    const stacks = this.hanoiService.move(moveOperation);

    // 发送移动操作
    const moveEventData: MoveEventData = {
      from: event.previousContainer.id as StackKey,
      to: event.container.id as StackKey,
      disc: event.item.data,
    }

    this.peerService.sendMove(moveEventData);

    this.selfStore.setStacks(stacks);

  }

  copyToClipboard(id: string) {
    navigator.clipboard.writeText(id);
    this.alert.success('房间ID已复制到剪贴板');
    console.log('复制成功');

  }

  ready() {
    this.peerService.sendReady();
    this.selfStore.setPlayerState(PlayerState.READY);
  }

}
