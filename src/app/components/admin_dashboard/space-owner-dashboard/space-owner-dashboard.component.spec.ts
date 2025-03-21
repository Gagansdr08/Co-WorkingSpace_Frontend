import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceOwnerDashboardComponent } from './space-owner-dashboard.component';

describe('SpaceOwnerDashboardComponent', () => {
  let component: SpaceOwnerDashboardComponent;
  let fixture: ComponentFixture<SpaceOwnerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpaceOwnerDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpaceOwnerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
