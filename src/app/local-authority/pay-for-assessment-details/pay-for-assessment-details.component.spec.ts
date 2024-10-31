import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayForAssessmentDetailsComponent } from './pay-for-assessment-details.component';

describe('PayForAssessmentDetailsComponent', () => {
  let component: PayForAssessmentDetailsComponent;
  let fixture: ComponentFixture<PayForAssessmentDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayForAssessmentDetailsComponent]
    });
    fixture = TestBed.createComponent(PayForAssessmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
