import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-acc-menu',
  templateUrl: './acc-menu.component.html',
  styleUrls: ['./acc-menu.component.scss'],
})
export class AccMenuComponent implements OnInit {

  constructor(public settingsService: SettingsService) { }

  ngOnInit() {}

}
