import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterdServicesTablesComponent } from './registerd-services-tables.component';

describe('RegisterdServicesTablesComponent', () => {
  let component: RegisterdServicesTablesComponent;
  let fixture: ComponentFixture<RegisterdServicesTablesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterdServicesTablesComponent]
    });
    fixture = TestBed.createComponent(RegisterdServicesTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
