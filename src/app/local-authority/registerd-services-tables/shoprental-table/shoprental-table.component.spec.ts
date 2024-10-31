import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoprentalTableComponent } from './shoprental-table.component';

describe('ShoprentalTableComponent', () => {
  let component: ShoprentalTableComponent;
  let fixture: ComponentFixture<ShoprentalTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShoprentalTableComponent]
    });
    fixture = TestBed.createComponent(ShoprentalTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
