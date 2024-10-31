import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAthorityTableComponent } from './local-athority-table.component';

describe('LocalAthorityTableComponent', () => {
  let component: LocalAthorityTableComponent;
  let fixture: ComponentFixture<LocalAthorityTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LocalAthorityTableComponent]
    });
    fixture = TestBed.createComponent(LocalAthorityTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
