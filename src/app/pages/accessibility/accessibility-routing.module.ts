import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccessibilityPage } from './accessibility.page';

const routes: Routes = [
  {
    path: '',
    component: AccessibilityPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccessibilityPageRoutingModule {}
