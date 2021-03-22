import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingcotizacionesComponent } from './settingcotizaciones.component';

describe('SettingcotizacionesComponent', () => {
  let component: SettingcotizacionesComponent;
  let fixture: ComponentFixture<SettingcotizacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingcotizacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingcotizacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
