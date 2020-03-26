import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FullPage } from './full.page';

const routes: Routes = [
  {
    path: '',
    component: FullPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FullPageRoutingModule {}
