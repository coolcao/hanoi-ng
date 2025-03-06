import { computed, inject, Injectable, signal } from "@angular/core";
import { SelfStore } from "./self.store";
import { PeerStore } from "./peer.store";
import { GameState } from "../hanoi.types";

@Injectable({
  providedIn: 'root'
})
export class Store {
  readonly selfStore = inject(SelfStore);
  readonly peerStore = inject(PeerStore);
  // 通用
  private _size = signal(3);
  private _isHost = signal<boolean|null>(null);

  // 联网模式独有的状态
  private _gameState = signal(GameState.INITIAL);

  readonly size = this._size.asReadonly();
  readonly gameState = this._gameState.asReadonly();
  readonly isHost = this._isHost.asReadonly();

  // 最后胜利者
  // none表示游戏未结束，all表示双方都已完成（考虑到后面的玩家会在对方结束后会继续玩）
  // 返回的id即为胜者的id
  readonly winner = computed(() => {
    const isCompleted = this.selfStore.stacks().stack1.length == 0 &&
      (this.selfStore.stacks().stack2.length == this.size() || this.selfStore.stacks().stack3.length == this.size());
    const peerCompleted = this.peerStore.stacks().stack1.length == 0 &&
      (this.peerStore.stacks().stack2.length == this.size() || this.peerStore.stacks().stack3.length == this.size());

    if (isCompleted && peerCompleted) {
      return 'all';
    }
    if (isCompleted) {
      return this.selfStore.id();
    }
    if (peerCompleted) {
      return this.peerStore.id();
    }
    return 'none';

  });

  setSize(size: number) {
    this._size.set(size);
  }

  setGameState(state: GameState) {
    this._gameState.set(state);
  }
  setIsHost(isHost: boolean) {
    this._isHost.set(isHost);
  }
}
