import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ShareMenuComponent } from '../share-menu/share-menu.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { AccMenuComponent } from '../acc-menu/acc-menu.component';
import { FooterComponent } from '../footer/footer.component';
import { FabComponent } from '../fab/fab.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [ShareMenuComponent, NavbarComponent, AccMenuComponent, FooterComponent, FabComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonicModule.forRoot()
  ],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonicModule,
    ShareMenuComponent,
    NavbarComponent,
    AccMenuComponent,
    FooterComponent,
    FabComponent,
  ]
})
export class SharedModule { }
