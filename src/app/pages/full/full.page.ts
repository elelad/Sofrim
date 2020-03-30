import { Component, OnInit } from '@angular/core';
import { HebDateService } from '../../services/heb-date.service';
import { SettingsService } from '../../services/settings.service';
import { C } from '../../constants/constants';

@Component({
  selector: 'app-full',
  templateUrl: './full.page.html',
  styleUrls: ['./full.page.scss'],
})
export class FullPage implements OnInit {

  constructor(public hebDate: HebDateService, public settingsService: SettingsService) {
  }

  ngOnInit() {
    this.getToday();
  }

  getStartOmer() {
    let startOmer = '';
    switch (this.settingsService.nosach) {
      case 'as':
        startOmer = C.edothmizrachStart;
        break;
      case 'em':
        startOmer = C.edothmizrachStart;
        break;
    }
    return startOmer;
  }

  getEndOmer() {
    let endOmer = '';
    switch (this.settingsService.nosach) {
      case 'as':
        endOmer = C.edothmizrachEnd;
        break;
      case 'em':
        endOmer = C.edothmizrachEnd;
        break;
    }
    return endOmer;
  }

  getToday() {
    const now = new Date(Date.now());
    this.hebDate.getOmer(now.getTime());
  }

}
