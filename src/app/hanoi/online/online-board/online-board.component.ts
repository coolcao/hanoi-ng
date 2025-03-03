import { Component, inject, OnInit } from '@angular/core';
import { OnlineStore } from '../online.store';
import { PeerService } from '../peer.service';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';

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
  stack1 = this.onlineStore.stack1;
  stack2 = this.onlineStore.stack2;
  stack3 = this.onlineStore.stack3;
  steps = this.onlineStore.steps;
  peerSteps = this.onlineStore.peerSteps;

  peerStack1 = this.onlineStore.peerStack1;
  peerStack2 = this.onlineStore.peerStack2;
  peerStack3 = this.onlineStore.peerStack3;

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

    this.onlineStore.updateStack(this.stack1(), 'stack1');
    this.onlineStore.updateStack(this.stack2(), 'stack2');
    this.onlineStore.updateStack(this.stack3(), 'stack3');

    this.peerService.sendPlayData();

  }

}
