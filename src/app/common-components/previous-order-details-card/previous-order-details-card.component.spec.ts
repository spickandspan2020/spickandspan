import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousOrderDetailsCardComponent } from './previous-order-details-card.component';

describe('PreviousOrderDetailsCardComponent', () => {
  let component: PreviousOrderDetailsCardComponent;
  let fixture: ComponentFixture<PreviousOrderDetailsCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviousOrderDetailsCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousOrderDetailsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
