import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HanoiStartComponent } from './start/start.component';

const routes: Routes = [
  { path: '', redirectTo: 'start', pathMatch: 'full' },
  { path: 'start', component: HanoiStartComponent },
  { path: 'single', loadChildren: () => import('./single/single.module').then(m => m.SingleModule) },
  { path: 'online', loadChildren: () => import('./online/online.module').then(m => m.OnlineModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HanoiRoutingModule { }
