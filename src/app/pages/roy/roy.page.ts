import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-roy',
  templateUrl: './roy.page.html',
  styleUrls: ['./roy.page.scss'],
})
export class RoyPage implements OnInit {

  constructor(public plt: Platform) { }

  ngOnInit() {
  }

}
