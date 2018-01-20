import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductImageDetailComponent } from './product-image-detail.component';

describe('ProductImageDetailComponent', () => {
  let component: ProductImageDetailComponent;
  let fixture: ComponentFixture<ProductImageDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductImageDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductImageDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
