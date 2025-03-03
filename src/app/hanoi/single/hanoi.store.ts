import { computed, Injectable, signal } from "@angular/core";
import { Disk } from "./hanoi.types";

@Injectable({
  providedIn: 'root'
})
export class HanoiStore {
  // 碟片数量，数量范围在 3~8即可
  private _size = signal(3);

  private _stack1 = signal<Disk[]>([]);
  private _stack2 = signal<Disk[]>([]);
  private _stack3 = signal<Disk[]>([]);

  // 步数计数
  private _steps = signal(0);

  readonly size = this._size.asReadonly();
  readonly stack1 = this._stack1.asReadonly();
  readonly stack2 = this._stack2.asReadonly();
  readonly stack3 = this._stack3.asReadonly();
  readonly steps = this._steps.asReadonly();

  readonly isCompleted = computed(() => {
    return this.stack1().length == 0 &&
      (this.stack2().length == this.size() || this.stack3().length == this.size());
  });


  setSize(size: number) {
    this._size.set(size);
  }

  initBoard() {
    let stack = [];
    for (let i = 0; i < this.size(); i++) {
      stack.push({ value: i + 1 });
    }
    this._stack1.set(stack);
    this._stack2.set([]);
    this._stack3.set([]);
    this._steps.set(0);
  }

  // 增加步数
  addStep() {
    this._steps.update(steps => steps + 1);
  }

  updateStack(stack: Disk[], stackName: 'stack1' | 'stack2' | 'stack3') {
    if (stackName == 'stack1') {
      this._stack1.set([...stack]);
    } else if (stackName == 'stack2') {
      this._stack2.set([...stack]);
    } else if (stackName == 'stack3') {
      this._stack3.set([...stack]);
    }
  }
}
