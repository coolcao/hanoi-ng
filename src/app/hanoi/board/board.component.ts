import { Component, effect, inject, OnInit } from '@angular/core';
import { Disk } from '../hanoi.types';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { HanoiStore } from '../hanoi.store';
import { timer } from 'rxjs';

@Component({
  selector: 'hanoi-board',
  standalone: false,

  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class HanoiBoardComponent implements OnInit {

  readonly store = inject(HanoiStore);

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

  readonly stack1 = this.store.stack1;
  readonly stack2 = this.store.stack2;
  readonly stack3 = this.store.stack3;
  readonly steps = this.store.steps;
  readonly isCompleted = this.store.isCompleted;
  readonly size = this.store.size;

  showHelp = false;
  showSuccess = false;

  ngOnInit(): void {
    this.store.initBoard();
  }


  drop(event: CdkDragDrop<Disk[]>) {
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
      if (current.value > containerTop.value) {
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

    this.store.updateStack(this.stack1(), 'stack1');
    this.store.updateStack(this.stack2(), 'stack2');
    this.store.updateStack(this.stack3(), 'stack3');
  }

  changeSize(size: number) {
    this.store.setSize(size);
    this.store.initBoard();
  }

  restart() {
    this.store.initBoard();
  }


}
