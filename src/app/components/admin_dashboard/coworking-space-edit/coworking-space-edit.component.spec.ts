import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoworkingSpaceEditComponent } from './coworking-space-edit.component';

describe('CoworkingSpaceEditComponent', () => {
  let component: CoworkingSpaceEditComponent;
  let fixture: ComponentFixture<CoworkingSpaceEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoworkingSpaceEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoworkingSpaceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
