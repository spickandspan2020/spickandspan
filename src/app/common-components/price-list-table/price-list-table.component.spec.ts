import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceListTableComponent } from './price-list-table.component';

describe('PriceListTableComponent', () => {
  let component: PriceListTableComponent;
  let fixture: ComponentFixture<PriceListTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceListTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceListTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
