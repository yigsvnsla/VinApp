import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CameraUnitPage } from './camera-unit.page';

describe('CameraUnitPage', () => {
  let component: CameraUnitPage;
  let fixture: ComponentFixture<CameraUnitPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CameraUnitPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CameraUnitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
