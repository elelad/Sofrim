import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FullPage } from './full.page';

describe('FullPage', () => {
  let component: FullPage;
  let fixture: ComponentFixture<FullPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FullPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
