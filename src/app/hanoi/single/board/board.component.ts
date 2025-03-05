import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { timer } from 'rxjs';
import { HanoiService } from '../../hanoi.service';
import { StackKey } from '../../hanoi.types';
import { SelfStore } from '../../store/self.store';
import { Store } from '../../store/store';

@Component({
  selector: 'hanoi-board',
  standalone: false,

  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class HanoiBoardComponent implements OnInit {

  readonly selfStore = inject(SelfStore);
  readonly store = inject(Store);
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

  readonly stacks = this.selfStore.stacks;
  readonly stack1 = computed(() => this.stacks().stack1);
  readonly stack2 = computed(() => this.stacks().stack2);
  readonly stack3 = computed(() => this.stacks().stack3);

  readonly steps = this.selfStore.steps;
  readonly isCompleted = this.selfStore.isCompleted;
  readonly size = this.store.size;

  showHelp = false;
  showSuccess = false;
  showValue = true;

  ngOnInit(): void {
    this.selfStore.initStore(this.store.size());
  }


  drop(event: CdkDragDrop<number[]>) {
    const stacks = this.hanoiService.move({
      stacks: this.stacks(),
      from: event.previousContainer.id as StackKey,
      to: event.container.id as StackKey,
      disc: event.item.data,
    });
    this.selfStore.setSteps(this.steps() + 1);
    this.selfStore.setStacks(stacks);
  }

  changeSize(size: number) {
    this.store.setSize(size);
    this.selfStore.initStore(size);
  }

  restart() {
    this.selfStore.initStore(this.store.size());
  }


}
