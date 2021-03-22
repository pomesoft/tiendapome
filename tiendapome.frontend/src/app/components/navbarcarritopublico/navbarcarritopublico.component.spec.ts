import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarcarritopublicoComponent } from './navbarcarritopublico.component';

describe('NavbarcarritopublicoComponent', () => {
  let component: NavbarcarritopublicoComponent;
  let fixture: ComponentFixture<NavbarcarritopublicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarcarritopublicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarcarritopublicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
