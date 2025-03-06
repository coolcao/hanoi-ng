import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PeerService } from '../online/peer.service';
import { Store } from '../store/store';
import { SelfStore } from '../store/self.store';
import { PeerStore } from '../store/peer.store';
import { AlertService } from '../../share/alert/alert.service';

@Component({
  selector: 'hanoi-start',
  standalone: false,

  templateUrl: './start.component.html',
  styleUrl: './start.component.css'
})
export class HanoiStartComponent {
  private alert = inject(AlertService);
  private store = inject(Store);
  private peerService = inject(PeerService);
  private router = inject(Router);
  constructor() { }

  peerId = '';
  showJoin = false;

  showCreate = false;
  size = 3;

  joinRoom() {
    if (!this.peerId) {
      this.alert.error('请输入房间ID!');
      return;
    }

    this.store.setIsHost(false);
    this.showJoin = false;

    this.peerService.connectToPeer(this.peerId);

    this.router.navigate(['/', 'hanoi', 'online'], { state: { action: 'join' } });
  }

  createRoom() {
    this.store.setSize(this.size);
    this.store.setIsHost(true);

    this.showCreate = false;
    this.router.navigate(['/', 'hanoi', 'online'], { state: { action: 'create' } });
  }
}
