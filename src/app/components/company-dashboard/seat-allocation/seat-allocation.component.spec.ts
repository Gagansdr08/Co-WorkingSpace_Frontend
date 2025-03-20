import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatAllocationComponent } from './seat-allocation.component';

describe('SeatAllocationComponent', () => {
  let component: SeatAllocationComponent;
  let fixture: ComponentFixture<SeatAllocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeatAllocationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeatAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
