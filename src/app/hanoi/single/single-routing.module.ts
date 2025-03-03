import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HanoiBoardComponent } from './board/board.component';

const routes: Routes = [
  { path: '', redirectTo: 'board', pathMatch: 'full' },
  { path: 'board', component: HanoiBoardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SingleRoutingModule { }
