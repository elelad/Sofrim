import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccessibilityPageRoutingModule } from './accessibility-routing.module';

import { AccessibilityPage } from './accessibility.page';
import { SharedModule } from '../../components/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccessibilityPageRoutingModule,
    SharedModule
  ],
  declarations: [AccessibilityPage]
})
export class AccessibilityPageModule {}
