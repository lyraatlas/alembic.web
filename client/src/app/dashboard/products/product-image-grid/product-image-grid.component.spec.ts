import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductImageGridComponent } from './product-image-grid.component';

describe('ProductImageGridComponent', () => {
  let component: ProductImageGridComponent;
  let fixture: ComponentFixture<ProductImageGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductImageGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductImageGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    //expect(component).toBeTruthy();
  });
});
