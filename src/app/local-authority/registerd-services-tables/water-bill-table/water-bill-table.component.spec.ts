import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterBillTableComponent } from './water-bill-table.component';

describe('WaterBillTableComponent', () => {
  let component: WaterBillTableComponent;
  let fixture: ComponentFixture<WaterBillTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WaterBillTableComponent]
    });
    fixture = TestBed.createComponent(WaterBillTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
