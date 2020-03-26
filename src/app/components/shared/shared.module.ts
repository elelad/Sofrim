import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ShareMenuComponent } from '../share-menu/share-menu.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { AccMenuComponent } from '../acc-menu/acc-menu.component';
import { FooterComponent } from '../footer/footer.component';



@NgModule({
  declarations: [ShareMenuComponent, NavbarComponent, AccMenuComponent, FooterComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [ShareMenuComponent, NavbarComponent, AccMenuComponent, FooterComponent],
})
export class SharedModule { }
