import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class OnlineStore {

  // 全局
  private _size = signal(5);
  private _roomName = signal('');


  // 已方
  private _myId = signal('');
  private _stack1 = signal<number[]>([]);
  private _stack2 = signal<number[]>([]);
  private _stack3 = signal<number[]>([]);
  private _steps = signal(0);

  // 对方
  private _peerId = signal('');
  private _peerStack1 = signal<number[]>([]);
  private _peerStack2 = signal<number[]>([]);
  private _peerStack3 = signal<number[]>([]);
  private _peerSteps = signal(0);

  // out
  readonly myId = this._myId.asReadonly();
  readonly peerId = this._peerId.asReadonly();
  readonly size = this._size.asReadonly();
  readonly roomName = this._roomName.asReadonly();
  readonly stack1 = this._stack1.asReadonly();
  readonly stack2 = this._stack2.asReadonly();
  readonly stack3 = this._stack3.asReadonly();
  readonly peerStack1 = this._peerStack1.asReadonly();
  readonly peerStack2 = this._peerStack2.asReadonly();
  readonly peerStack3 = this._peerStack3.asReadonly();
  readonly steps = this._steps.asReadonly();
  readonly peerSteps = this._peerSteps.asReadonly();


  setMyId(id: string) {
    this._myId.set(id);
  }

  updateStack(stack: number[], stackName: 'stack1' | 'stack2' | 'stack3') {
    if (stackName === 'stack1') {
      this._stack1.set(stack);
    } else if (stackName === 'stack2') {
      this._stack2.set(stack);
    } else {
      this._stack3.set(stack);
    }
  }

  setPeerId(id: string) {
    this._peerId.set(id);
  }

  setSize(size: number) {
    this._size.set(size);
  }

  setRoomName(name: string) {
    this._roomName.set(name);
  }

  setPeerSteps(steps: number) {
    this._peerSteps.set(steps);
  }
  setPeerStack1(stack: number[]) {
    this._peerStack1.set(stack);
  }
  setPeerStack2(stack: number[]) {
    this._peerStack2.set(stack);
  }
  setPeerStack3(stack: number[]) {
    this._peerStack3.set(stack);
  }


  init() {
    let stack = [];
    for (let i = 0; i < this.size(); i++) {
      stack.push(i + 1);
    }
    this._stack1.set(stack);
    this._stack2.set([]);
    this._stack3.set([]);
    this._steps.set(0);
  }

}
