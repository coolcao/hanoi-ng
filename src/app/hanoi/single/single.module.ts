import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';

import { SingleRoutingModule } from './single-routing.module';
import { HanoiBoardComponent } from './board/board.component';
import { ShareModule } from '../../share/share.module';



@NgModule({
  declarations: [
    HanoiBoardComponent,
  ],
  imports: [
    CommonModule,
    SingleRoutingModule,
    ShareModule,
    DragDropModule,
    FormsModule,
  ],
})
export class SingleModule { }
