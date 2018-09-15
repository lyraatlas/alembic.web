import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BucketItemCardComponent } from './bucket-item-card.component';

describe('BucketItemCardComponent', () => {
  let component: BucketItemCardComponent;
  let fixture: ComponentFixture<BucketItemCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BucketItemCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BucketItemCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
