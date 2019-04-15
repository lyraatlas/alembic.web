import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BucketCardButtonsComponent } from './bucket-card-buttons.component';

describe('BucketCardButtonsComponent', () => {
  let component: BucketCardButtonsComponent;
  let fixture: ComponentFixture<BucketCardButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BucketCardButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BucketCardButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
