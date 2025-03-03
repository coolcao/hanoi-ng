import { Injectable } from "@angular/core";
import { MoveOperation } from "./hanoi.types";

@Injectable({
  providedIn: "root",
})
export class HanoiService {
  validateMove(operation: MoveOperation): boolean {
    // 验证是否是同一个堆栈
    if (operation.fromId === operation.toId) {
      console.log('不能移动到同一个stack');
      return false;
    }

    // 验证移动的碟片是否是fromStack的顶部碟片
    if (operation.fromStack[0] !== operation.disc) {
      return false;
    }

    // 验证目标堆栈是否可以放置该碟片
    const targetTop = operation.toStack[0];
    if (targetTop && operation.disc > targetTop) {
      return false;
    }

    return true;
  }

  moveDisc(operation: MoveOperation): boolean {
    if (!this.validateMove(operation)) {
      return false;
    }

    // 执行移动
    const disc = operation.fromStack.shift();
    if (disc) {
      operation.toStack.unshift(disc);
      return true;
    }
    return false;
  }
}
