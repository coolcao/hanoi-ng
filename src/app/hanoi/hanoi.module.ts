import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDrag, CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';

import { HanoiRoutingModule } from './hanoi-routing.module';
import { HanoiStartComponent } from './start/start.component';


@NgModule({
  declarations: [
    HanoiStartComponent,
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
