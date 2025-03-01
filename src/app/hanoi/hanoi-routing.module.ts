import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HanoiBoardComponent } from './board/board.component';

const routes: Routes = [
  { path: '', component: HanoiBoardComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HanoiRoutingModule { }
