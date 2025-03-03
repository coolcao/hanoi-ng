import { Component, computed, inject, OnInit } from '@angular/core';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { OnlineStore } from '../online.store';
import { PeerService } from '../peer.service';

@Component({
  selector: 'app-online-board',
  standalone: false,

  templateUrl: './online-board.component.html',
  styleUrl: './online-board.component.css'
})
export class HanoiOnlineBoardComponent implements OnInit {

  readonly onlineStore = inject(OnlineStore);
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

  constructor() { }

  ngOnInit(): void {
    if (this.peerService.isPeerInitialized()) {
      return;
    }
    this.peerService.initPeer();
  }

  drop(event: CdkDragDrop<number[]>) {
    if (event.previousContainer === event.container) {
      // same stack
      console.log('不能移动到同一个stack');
      return;
    }

    // 只能取到stack的最上面的disk
    if (event.previousIndex !== 0) {
      console.log('只能移动最上面的碟片');
      return;
    }
    // 只能放到stack的最上面，所以event.currentIndex只能为0
    const current = event.item.data;
    const containerTop = event.container.data[0];
    if (containerTop) {
      if (current > containerTop) {
        return;
      }
    }

    event.currentIndex = 0;
    // 根据itemData判断是否可以移动
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );

    this.onlineStore.updateStacks(this.stacks());

    this.peerService.sendPlayData();

  }

}
