import { inject, Injectable, signal } from "@angular/core";
import { StackList } from "../hanoi.types";
import { Tools } from "../tools.service";


@Injectable({
  providedIn: 'root'
})
export class PeerStore {

  private readonly tools = inject(Tools);

  private _id = signal('');
  private _stacks = signal<StackList>({ stack1: [], stack2: [], stack3: [] });
  private _steps = signal(0);
  private _size = signal(0);

  readonly id = this._id.asReadonly();
  readonly stacks = this._stacks.asReadonly();
  readonly steps = this._steps.asReadonly();

  setId(id: string) {
    this._id.set(id);
  }

  setStacks(stacks: StackList) {
    this._stacks.set(this.tools.deepClone(stacks));
  }

  setSteps(steps: number) {
    this._steps.set(steps);
  }

  initStore(size: number) {
    this._size.set(size);
    let stack = [];
    for (let i = 0; i < size; i++) {
      stack.push(size - i);
    }
    this._stacks.set({ stack1: stack, stack2: [], stack3: [] });
    this._steps.set(0);
  }
}
