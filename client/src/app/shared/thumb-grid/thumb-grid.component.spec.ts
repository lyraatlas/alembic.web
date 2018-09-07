import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThumbGridComponent } from './thumb-grid.component';

describe('ThumbGridComponent', () => {
  let component: ThumbGridComponent;
  let fixture: ComponentFixture<ThumbGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThumbGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThumbGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
