import { NgModule } from '@angular/core';
import { SharedModule } from '../../components/shared/shared.module';
import { PrivacyPageRoutingModule } from './privacy-routing.module';
import { PrivacyPage } from './privacy.page';




@NgModule({
  imports: [
    SharedModule,
    PrivacyPageRoutingModule,
  ],
  declarations: [PrivacyPage]
})
export class PrivacyPageModule {}
