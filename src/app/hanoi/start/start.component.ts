import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { OnlineStore } from '../online/online.store';
import { PeerService } from '../online/peer.service';

@Component({
  selector: 'hanoi-start',
  standalone: false,

  templateUrl: './start.component.html',
  styleUrl: './start.component.css'
})
export class HanoiStartComponent {
  private onlineStore = inject(OnlineStore);
  private peerService = inject(PeerService);
  private router = inject(Router);
  constructor() { }

  peerId = '';
  showJoin = false;

  showCreate = false;
  roomName = '';
  size = 3;

  async joinRoom() {
    if (!this.peerId) {
      console.log('请输入对方的房间ID');
      return;
    }
    // 存入OnlineStore
    this.onlineStore.setPeerId(this.peerId);
    this.showJoin = false;
    this.router.navigate(['/', 'hanoi', 'online'], { state: { action: 'join' } });
  }

  async createRoom() {
    if (!this.roomName) {
      console.log('请输入房间名');
      alert('请输入房间名');
      return;
    }

    // 存入OnlineStore
    this.onlineStore.setRoomName(this.roomName);
    this.onlineStore.setSize(this.size);

    this.showCreate = false;
    this.router.navigate(['/', 'hanoi', 'online'], { state: { action: 'create' } });
  }
}
