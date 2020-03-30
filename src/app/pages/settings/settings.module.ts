import { NgModule } from '@angular/core';
import { SharedModule } from '../../components/shared/shared.module';
import { SettingsPageRoutingModule } from './settings-routing.module';
import { SettingsPage } from './settings.page';




@NgModule({
  imports: [
    SharedModule,
    SettingsPageRoutingModule,
  ],
  declarations: [SettingsPage]
})
export class SettingsPageModule {}
