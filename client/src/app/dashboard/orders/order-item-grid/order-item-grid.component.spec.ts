import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderItemGridComponent } from './order-item-grid.component';

describe('ProductImageGridComponent', () => {
  let component: OrderItemGridComponent;
  let fixture: ComponentFixture<OrderItemGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderItemGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderItemGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    //expect(component).toBeTruthy();
  });
});
