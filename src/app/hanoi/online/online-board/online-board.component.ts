import { Component, computed, inject, OnInit } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { OnlineStore } from '../online.store';
import { PeerService } from '../peer.service';
import { MoveOperation } from '../../hanoi.types';
import { HanoiService } from '../../hanoi.service';

@Component({
  selector: 'app-online-board',
  standalone: false,

  templateUrl: './online-board.component.html',
  styleUrl: './online-board.component.css'
})
export class HanoiOnlineBoardComponent implements OnInit {

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

  readonly winner = this.onlineStore.winner;

  constructor() { }

  ngOnInit(): void {
    if (this.peerService.isPeerInitialized()) {
      return;
    }
    this.peerService.initPeer();
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
