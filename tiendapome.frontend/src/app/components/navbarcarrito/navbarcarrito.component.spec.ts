import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarcarritoComponent } from './navbarcarrito.component';

describe('NavbarcarritoComponent', () => {
  let component: NavbarcarritoComponent;
  let fixture: ComponentFixture<NavbarcarritoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarcarritoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarcarritoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
