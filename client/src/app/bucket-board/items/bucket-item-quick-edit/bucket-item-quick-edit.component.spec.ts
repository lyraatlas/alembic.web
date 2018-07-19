import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BucketItemQuickEditComponent } from './bucket-item-quick-edit.component';

describe('BucketItemQuickEditComponent', () => {
  let component: BucketItemQuickEditComponent;
  let fixture: ComponentFixture<BucketItemQuickEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BucketItemQuickEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BucketItemQuickEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
