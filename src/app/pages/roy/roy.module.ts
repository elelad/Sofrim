import { NgModule } from '@angular/core';
import { SharedModule } from '../../components/shared/shared.module';
import { RoyPageRoutingModule } from './roy-routing.module';
import { RoyPage } from './roy.page';




@NgModule({
  imports: [
    SharedModule,
    RoyPageRoutingModule,
  ],
  declarations: [RoyPage]
})
export class RoyPageModule {}
