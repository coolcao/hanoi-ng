import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShareRoutingModule } from './share-routing.module';
import { ScatterFlowersComponent } from './scatter-flowers/scatter-flowers.component';
import { AlertComponent } from './alert/alert.component';


@NgModule({
  declarations: [
    ScatterFlowersComponent,
    AlertComponent,
  ],
  imports: [
    CommonModule,
    ShareRoutingModule,
  ],
  exports: [
    ScatterFlowersComponent,
    AlertComponent,
  ]
})
export class ShareModule { }
