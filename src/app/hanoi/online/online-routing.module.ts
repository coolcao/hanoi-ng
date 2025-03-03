import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HanoiOnlineBoardComponent } from './online-board/online-board.component';

const routes: Routes = [
  { path: '', redirectTo: 'board', pathMatch: 'full' },
  { path: 'board', component: HanoiOnlineBoardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnlineRoutingModule { }
