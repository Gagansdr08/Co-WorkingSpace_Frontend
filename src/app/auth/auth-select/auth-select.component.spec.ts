import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthSelectComponent } from './auth-select.component';

describe('AuthSelectComponent', () => {
  let component: AuthSelectComponent;
  let fixture: ComponentFixture<AuthSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
