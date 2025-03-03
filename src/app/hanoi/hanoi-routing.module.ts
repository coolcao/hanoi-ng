import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HanoiBoardComponent } from './board/board.component';
import { HanoiStartComponent } from './start/start.component';
import { HanoiOnlineBoardComponent } from './online-board/online-board.component';

const routes: Routes = [
  { path: '', redirectTo: 'start', pathMatch: 'full' },
  { path: 'start', component: HanoiStartComponent },
  { path: 'board', component: HanoiBoardComponent },
  { path: 'online', component: HanoiOnlineBoardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HanoiRoutingModule { }
