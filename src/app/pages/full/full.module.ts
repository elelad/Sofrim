import { NgModule } from '@angular/core';
import { SharedModule } from '../../components/shared/shared.module';
import { FullPageRoutingModule } from './full-routing.module';
import { FullPage } from './full.page';




@NgModule({
  imports: [
    SharedModule,
    FullPageRoutingModule,
  ],
  declarations: [FullPage]
})
export class FullPageModule {}
