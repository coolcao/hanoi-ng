import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDrag, CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';

import { HanoiRoutingModule } from './hanoi-routing.module';
import { HanoiBoardComponent } from './board/board.component';


@NgModule({
  declarations: [
    HanoiBoardComponent,
  ],
  imports: [
    CommonModule,
    HanoiRoutingModule,
    DragDropModule,
    CdkDrag,
    CdkDropList,
    FormsModule,
  ]
})
export class HanoiModule { }
