import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PeerService } from '../online/peer.service';
import { Store } from '../store/store';
import { SelfStore } from '../store/self.store';
import { PeerStore } from '../store/peer.store';

@Component({
  selector: 'hanoi-start',
  standalone: false,

  templateUrl: './start.component.html',
  styleUrl: './start.component.css'
})
export class HanoiStartComponent {
  private selfStore = inject(SelfStore);
  private peerStore = inject(PeerStore);
  private store = inject(Store);
  private peerService = inject(PeerService);
  private router = inject(Router);
  constructor() { }

  peerId = '';
  showJoin = false;

  showCreate = false;
  roomName = '';
  playerName = '';
  size = 3;

  async joinRoom() {
    if (!this.peerId) {
      console.log('请输入对方的房间ID');
      return;
    }
    if (!this.playerName) {
      console.log('请输入你的名字');
      return;
    }
    this.selfStore.setPlayer(this.playerName);
    this.peerStore.setId(this.peerId);
    this.showJoin = false;
    this.router.navigate(['/', 'hanoi', 'online'], { state: { action: 'join' } });
  }

  async createRoom() {
    if (!this.roomName) {
      console.log('请输入房间名');
      alert('请输入房间名');
      return;
    }
    if (!this.playerName) {
      console.log('请输入你的名字');
      alert('请输入你的名字');
      return;
    }

    this.selfStore.setPlayer(this.playerName);
    this.store.setRoomName(this.roomName);
    this.store.setSize(this.size);

    this.showCreate = false;
    this.router.navigate(['/', 'hanoi', 'online'], { state: { action: 'create' } });
  }
}
