import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDrag, CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';

import { HanoiRoutingModule } from './hanoi-routing.module';
import { HanoiBoardComponent } from './board/board.component';
import { ScatterFlowersComponent } from './scatter-flowers/scatter-flowers.component';
import { HelpComponent } from './help/help.component';
import { HanoiStartComponent } from './start/start.component';
import { HanoiOnlineBoardComponent } from './online-board/online-board.component';
import { OnlinePreviewComponent } from './online-preview/online-preview.component';


@NgModule({
  declarations: [
    HanoiBoardComponent,
    ScatterFlowersComponent,
    HelpComponent,
    HanoiStartComponent,
    HanoiOnlineBoardComponent,
    OnlinePreviewComponent,
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
