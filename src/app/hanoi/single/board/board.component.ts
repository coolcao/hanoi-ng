import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { timer } from 'rxjs';
import { SingleStore } from '../hanoi.store';

@Component({
  selector: 'hanoi-board',
  standalone: false,

  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class HanoiBoardComponent implements OnInit {

  readonly store = inject(SingleStore);

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
    // const fromStackId = event.previousContainer.id;
    // const toStackId = event.container.id;

    if (event.previousContainer === event.container) {
      // same stack
      console.log('不能移动到同一个stack');
      return;
    }

    // 只能取到stack的最上面的disk
    if (event.previousIndex !== 0) {
      console.log('只能移动最上面的碟片');
      return;
    }
    // 只能放到stack的最上面，所以event.currentIndex只能为0
    const current = event.item.data;
    const containerTop = event.container.data[0];
    if (containerTop) {
      if (current > containerTop) {
        return;
      }
    }

    event.currentIndex = 0;
    // 根据itemData判断是否可以移动
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );

    this.store.addStep();

    this.store.updateStackList({ stack1: this.stack1(), stack2: this.stack2(), stack3: this.stack3() });

  }

  changeSize(size: number) {
    this.store.setSize(size);
    this.store.initBoard();
  }

  restart() {
    this.store.initBoard();
  }


}
