import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatBulkAddComponent } from './seat-bulk-add.component';

describe('SeatBulkAddComponent', () => {
  let component: SeatBulkAddComponent;
  let fixture: ComponentFixture<SeatBulkAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeatBulkAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeatBulkAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
