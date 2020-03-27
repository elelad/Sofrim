import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-fab',
  templateUrl: './fab.component.html',
  styleUrls: ['./fab.component.scss'],
})
export class FabComponent implements OnInit {

  @Input() showFab = true;

  constructor() { }

  ngOnInit() {}

}
