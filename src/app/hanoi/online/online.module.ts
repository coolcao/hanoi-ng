import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';

import { OnlineRoutingModule } from './online-routing.module';
import { HanoiOnlineBoardComponent } from './online-board/online-board.component';
import { HanoiOnlinePreviewComponent } from './online-preview/online-preview.component';



@NgModule({
  declarations: [
    HanoiOnlineBoardComponent,
    HanoiOnlinePreviewComponent,
    HanoiOnlinePreviewComponent,
  ],
  imports: [
    CommonModule,
    OnlineRoutingModule,
    DragDropModule,
    FormsModule,
  ]
})
export class OnlineModule { }
