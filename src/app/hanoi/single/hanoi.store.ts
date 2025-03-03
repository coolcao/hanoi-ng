import { computed, inject, Injectable, signal } from "@angular/core";
import { StackList } from "./hanoi.types";
import { Tools } from "../tools.service";

@Injectable({
  providedIn: 'root'
})
export class SingleStore {

  readonly tools = inject(Tools);

  // 碟片数量，数量范围在 3~8即可
  private _size = signal(3);

  private _stacks = signal<StackList>({ stack1: [], stack2: [], stack3: [] });


  // 步数计数
  private _steps = signal(0);

  readonly size = this._size.asReadonly();
  readonly stackList = this._stacks.asReadonly();
  readonly steps = this._steps.asReadonly();

  readonly isCompleted = computed(() => {
    return this.stackList().stack1.length == 0 &&
      (this.stackList().stack2.length == this.size() || this.stackList().stack3.length == this.size());
  });


  setSize(size: number) {
    this._size.set(size);
  }

  initBoard() {
    let stack = [];
    for (let i = 0; i < this.size(); i++) {
      stack.push(i + 1);
    }
    const stackList = {
      stack1: stack,
      stack2: [],
      stack3: []
    };
    this._stacks.set(stackList);

    this._steps.set(0);
  }

  // 增加步数
  addStep() {
    this._steps.update(steps => steps + 1);
  }

  updateStackList(stacks: StackList) {
    this._stacks.set(this.tools.deepClone(stacks));
  }

}
