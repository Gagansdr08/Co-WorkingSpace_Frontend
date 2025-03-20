import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatAddComponent } from './seat-add.component';

describe('SeatAddComponent', () => {
  let component: SeatAddComponent;
  let fixture: ComponentFixture<SeatAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeatAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeatAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
