import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoworkingSpaceDetailComponent } from './coworking-space-detail.component';

describe('CoworkingSpaceDetailComponent', () => {
  let component: CoworkingSpaceDetailComponent;
  let fixture: ComponentFixture<CoworkingSpaceDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoworkingSpaceDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoworkingSpaceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
