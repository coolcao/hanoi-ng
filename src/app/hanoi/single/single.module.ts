import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';

import { SingleRoutingModule } from './single-routing.module';
import { HelpComponent } from './help/help.component';
import { ShareModule } from '../share/share.module';
import { HanoiBoardComponent } from './board/board.component';



@NgModule({
  declarations: [
    HelpComponent,
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
