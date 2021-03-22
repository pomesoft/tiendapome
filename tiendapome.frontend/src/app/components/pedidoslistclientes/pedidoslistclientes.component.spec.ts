import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoslistclientesComponent } from './pedidoslistclientes.component';

describe('PedidoslistclientesComponent', () => {
  let component: PedidoslistclientesComponent;
  let fixture: ComponentFixture<PedidoslistclientesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidoslistclientesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoslistclientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
