import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { timer } from 'rxjs';
import { SingleStore } from '../hanoi.store';
import { HanoiService } from '../../hanoi.service';
import { MoveOperation } from '../../hanoi.types';

@Component({
  selector: 'hanoi-board',
  standalone: false,

  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class HanoiBoardComponent implements OnInit {

  readonly store = inject(SingleStore);
  readonly hanoiService = inject(HanoiService);

  constructor() {
    effect(() => {
      if (this.isCompleted()) {
        this.showSuccess = true;
        timer(3000).subscribe(() => {
          this.showSuccess = false;
        });
      }
    });
  }

  readonly stackList = this.store.stackList;
  readonly stack1 = computed(() => this.stackList().stack1);
  readonly stack2 = computed(() => this.stackList().stack2);
  readonly stack3 = computed(() => this.stackList().stack3);

  readonly steps = this.store.steps;
  readonly isCompleted = this.store.isCompleted;
  readonly size = this.store.size;

  showHelp = false;
  showSuccess = false;
  showValue = true;

  ngOnInit(): void {
    this.store.initBoard();
  }


  drop(event: CdkDragDrop<number[]>) {

    const moveOperation: MoveOperation = {
      fromStack: event.previousContainer.data,
      fromId: event.previousContainer.id,
      toStack: event.container.data,
      toId: event.container.id,
      disc: event.item.data,
    };
    if (this.hanoiService.moveDisc(moveOperation)) {
      this.store.addStep();
      this.store.updateStackList({ stack1: this.stack1(), stack2: this.stack2(), stack3: this.stack3() });
    }

  }

  changeSize(size: number) {
    this.store.setSize(size);
    this.store.initBoard();
  }

  restart() {
    this.store.initBoard();
  }


}
