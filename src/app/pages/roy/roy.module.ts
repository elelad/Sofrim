import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoyPageRoutingModule } from './roy-routing.module';

import { RoyPage } from './roy.page';
import { SharedModule } from '../../components/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoyPageRoutingModule,
    SharedModule
  ],
  declarations: [RoyPage]
})
export class RoyPageModule {}
