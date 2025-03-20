import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoworkingSpaceCreateComponent } from './coworking-space-create.component';

describe('CoworkingSpaceCreateComponent', () => {
  let component: CoworkingSpaceCreateComponent;
  let fixture: ComponentFixture<CoworkingSpaceCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoworkingSpaceCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoworkingSpaceCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
