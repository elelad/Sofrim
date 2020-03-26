import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AccessibilityPage } from './accessibility.page';

describe('AccessibilityPage', () => {
  let component: AccessibilityPage;
  let fixture: ComponentFixture<AccessibilityPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessibilityPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AccessibilityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
