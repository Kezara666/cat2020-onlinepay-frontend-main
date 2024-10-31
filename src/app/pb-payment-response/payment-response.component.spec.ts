import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PBPaymentResponseComponent } from './payment-response.component';

describe('PaymentResponseComponent', () => {
  let component: PBPaymentResponseComponent;
  let fixture: ComponentFixture<PBPaymentResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PBPaymentResponseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PBPaymentResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
