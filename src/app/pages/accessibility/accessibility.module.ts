import { NgModule } from '@angular/core';
import { SharedModule } from '../../components/shared/shared.module';
import { AccessibilityPageRoutingModule } from './accessibility-routing.module';
import { AccessibilityPage } from './accessibility.page';




@NgModule({
  imports: [
    SharedModule,
    AccessibilityPageRoutingModule,
  ],
  declarations: [AccessibilityPage]
})
export class AccessibilityPageModule {}
