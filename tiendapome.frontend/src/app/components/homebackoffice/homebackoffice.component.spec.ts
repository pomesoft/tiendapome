import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomebackofficeComponent } from './homebackoffice.component';

describe('HomebackofficeComponent', () => {
  let component: HomebackofficeComponent;
  let fixture: ComponentFixture<HomebackofficeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomebackofficeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomebackofficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
