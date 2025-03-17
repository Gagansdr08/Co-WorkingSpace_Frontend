import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoworkingSpaceListComponent } from './coworking-space-list.component';

describe('CoworkingSpaceListComponent', () => {
  let component: CoworkingSpaceListComponent;
  let fixture: ComponentFixture<CoworkingSpaceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoworkingSpaceListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoworkingSpaceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
