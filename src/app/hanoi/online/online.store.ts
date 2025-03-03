import { inject, Injectable, signal } from "@angular/core";
import { Tools } from "../tools.service";
import { StackList } from "./online.type";

@Injectable({
  providedIn: 'root'
})
export class OnlineStore {
  readonly tools = inject(Tools);

  // 全局
  private _size = signal(5);
  private _roomName = signal('');


  // 已方
  private _myId = signal('');
  private _stacks = signal<StackList>({ stack1: [], stack2: [], stack3: [] });
  private _steps = signal(0);

  // 对方
  private _peerId = signal('');
  private _peerStacks = signal<StackList>({ stack1: [], stack2: [], stack3: [] });
  private _peerSteps = signal(0);

  // out
  readonly myId = this._myId.asReadonly();
  readonly peerId = this._peerId.asReadonly();
  readonly size = this._size.asReadonly();
  readonly roomName = this._roomName.asReadonly();
  readonly stacks = this._stacks.asReadonly();

  readonly peerStacks = this._peerStacks.asReadonly();
  readonly steps = this._steps.asReadonly();
  readonly peerSteps = this._peerSteps.asReadonly();


  setMyId(id: string) {
    this._myId.set(id);
  }

  updateStacks(stacks: StackList) {
    this._stacks.set(this.tools.deepClone(stacks));
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
  setPeerStacks(stacks: StackList) {
    this._peerStacks.set(this.tools.deepClone(stacks));
  }


  init() {
    let stack = [];
    for (let i = 0; i < this.size(); i++) {
      stack.push(i + 1);
    }
    this._stacks.set({ stack1: stack, stack2: [], stack3: [] });
    this._steps.set(0);
  }

}
