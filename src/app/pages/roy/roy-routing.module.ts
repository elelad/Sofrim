import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoyPage } from './roy.page';

const routes: Routes = [
  {
    path: '',
    component: RoyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoyPageRoutingModule {}
