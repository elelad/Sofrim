import { NgModule } from '@angular/core';
import { SharedModule } from '../../components/shared/shared.module';
import { AboutPageRoutingModule } from './about-routing.module';
import { AboutPage } from './about.page';




@NgModule({
  imports: [
    SharedModule,
    AboutPageRoutingModule,
  ],
  declarations: [AboutPage]
})
export class AboutPageModule {}
