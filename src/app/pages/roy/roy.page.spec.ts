import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RoyPage } from './roy.page';

describe('RoyPage', () => {
  let component: RoyPage;
  let fixture: ComponentFixture<RoyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoyPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RoyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
