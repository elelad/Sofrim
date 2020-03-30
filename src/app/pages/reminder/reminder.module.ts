import { NgModule } from '@angular/core';
import { SharedModule } from '../../components/shared/shared.module';
import { ReminderPageRoutingModule } from './reminder-routing.module';
import { ReminderPage } from './reminder.page';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';




@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    ReminderPageRoutingModule,
    HttpClientModule
  ],
  declarations: [ReminderPage]
})
export class ReminderPageModule {}
