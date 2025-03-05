import { Injectable } from "@angular/core";
import { MoveEventData, StackList } from "./hanoi.types";

@Injectable({
  providedIn: "root",
})
export class HanoiService {

  validateMoveEvent(data: MoveEventData): boolean {
    const stacks = data.stacks;
    const from = data.from;
    const to = data.to;
    const disc = data.disc;

    // 验证是否是同一个堆栈
    if (from === to) {
      return false;
    }
    // 验证移动的碟片是否是fromStack的顶部碟片
    if (stacks[from][0] !== disc) {
      return false;
    }
    // 验证目标堆栈是否可以放置该碟片
    const targetTop = stacks[to][0];
    if (targetTop && disc > targetTop) {
      return false;
    }
    return true;
  }

  move(moveData: MoveEventData): StackList {
    if (!this.validateMoveEvent(moveData)) {
      return moveData.stacks;
    }

    const stacks = moveData.stacks;
    const from = moveData.from;
    const to = moveData.to;
    const fromStack = stacks[from];
    const toStack = stacks[to];
    // 执行移动
    const movedDisc = fromStack.shift();
    if (movedDisc) {
      toStack.unshift(movedDisc);
    }
    return stacks;
  }
}
