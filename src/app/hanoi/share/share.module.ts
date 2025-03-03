import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShareRoutingModule } from './share-routing.module';
import { ScatterFlowersComponent } from './scatter-flowers/scatter-flowers.component';


@NgModule({
  declarations: [
    ScatterFlowersComponent,
  ],
  imports: [
    CommonModule,
    ShareRoutingModule
  ],
  exports: [
    ScatterFlowersComponent,
  ]
})
export class ShareModule { }
