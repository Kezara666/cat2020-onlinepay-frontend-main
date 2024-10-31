import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssesmentTaxTableComponent } from './assesment-tax-table.component';

describe('AssesmentTaxTableComponent', () => {
  let component: AssesmentTaxTableComponent;
  let fixture: ComponentFixture<AssesmentTaxTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssesmentTaxTableComponent]
    });
    fixture = TestBed.createComponent(AssesmentTaxTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
