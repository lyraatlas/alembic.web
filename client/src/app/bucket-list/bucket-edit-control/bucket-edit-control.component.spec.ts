import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BucketEditControlComponent } from './bucket-edit-control.component';

describe('BucketEditControlComponent', () => {
  let component: BucketEditControlComponent;
  let fixture: ComponentFixture<BucketEditControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BucketEditControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BucketEditControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
