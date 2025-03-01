import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'hanoi', pathMatch: 'full' },
  { path: 'hanoi', loadChildren: () => import('./hanoi/hanoi.module').then(m => m.HanoiModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
