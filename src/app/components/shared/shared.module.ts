import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ShareMenuComponent } from '../share-menu/share-menu.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { AccMenuComponent } from '../acc-menu/acc-menu.component';
import { FooterComponent } from '../footer/footer.component';
import { FabComponent } from '../fab/fab.component';



@NgModule({
  declarations: [ShareMenuComponent, NavbarComponent, AccMenuComponent, FooterComponent, FabComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [ShareMenuComponent, NavbarComponent, AccMenuComponent, FooterComponent, FabComponent],
})
export class SharedModule { }
