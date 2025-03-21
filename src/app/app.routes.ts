import { Routes } from '@angular/router';

// Dashboard Components
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BookingComponent } from './components/dashboard/booking/booking.component';
import { UpcomingBookingComponent } from './components/dashboard/upcoming-booking/upcoming-booking.component';
import { PastBookingComponent } from './components/dashboard/past-booking/past-booking.component';

// Coworking Space Components
import { CoworkingSpaceListComponent } from '../app/components/admin_dashboard/coworking-space-list/coworking-space-list.component';
import { CoworkingSpaceDetailComponent } from '../app/components/admin_dashboard/coworking-space-detail/coworking-space-detail.component';
import { CoworkingSpaceCreateComponent } from '../app/components/admin_dashboard/coworking-space-create/coworking-space-create.component';
import { CoworkingSpaceEditComponent } from '../app/components/admin_dashboard/coworking-space-edit/coworking-space-edit.component';
import { CompanyDashboardComponent } from './components/company-dashboard/company-dashboard.component';
import { LandingComponent } from './components/landing/landing/landing.component';
import { AuthSelectComponent } from './auth/auth-select/auth-select.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterSpaceOwnerComponent } from './auth/register-owner/register-owner.component';
import { RegisterCompanyComponent } from './auth/register/register.component';
import { WorkspaceCreateComponent } from './components/admin_dashboard/workspace-create/workspace-create.component';
import { WorkspaceDetailComponent } from './components/admin_dashboard/workspace-detail/workspace-detail.component';
import { WorkspaceEditComponent } from './components/admin_dashboard/workspace-edit/workspace-edit.component';
import { SeatAddComponent } from './components/admin_dashboard/seat-add/seat-add.component';
import { SeatBulkAddComponent } from './components/admin_dashboard/seat-bulk-add/seat-bulk-add.component';
import { SpaceOwnerDashboardComponent } from './components/admin_dashboard/space-owner-dashboard/space-owner-dashboard.component';
import { AuthGuard } from './core/auth/guards/auth.guard';
import { RoleGuard } from './core/auth/guards/role.guard';
import { AddComplaintComponent } from './components/dashboard/add-complaint/add-complaint.component';
import { EmployeeComplaintsComponent } from './components/company-dashboard/view-complaint/view-complaint.component';

export const routes: Routes = [
  // Dashboard & Bookings Routes
  {
    path: '',
    component: LandingComponent
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['EMPLOYEE'] },
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'booking', pathMatch: 'full' },
      { path: 'booking', component: BookingComponent },
      { path: 'upcoming', component: UpcomingBookingComponent },
      { path: 'past', component: PastBookingComponent },
      { path: 'complaint', component: AddComplaintComponent },
    ]
  },

  {
    path: 'auth',
    children: [
      { path: 'select', component: AuthSelectComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register-space-owner', component: RegisterSpaceOwnerComponent },
      { path: 'register-company', component: RegisterCompanyComponent }
    ]
  },

  // // Coworking Spaces Routes
  // { path: 'coworking-spaces', component: CoworkingSpaceListComponent },
  // { path: 'coworking-spaces/create', component: CoworkingSpaceCreateComponent },
  // { path: 'coworking-spaces/:id', component: CoworkingSpaceDetailComponent },
  // { path: 'coworking-spaces/:id/edit', component: CoworkingSpaceEditComponent },

  {
    path: 'coworking-spaces',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['SPACE_OWNER'] },
    children: [
      { path: '', component: SpaceOwnerDashboardComponent },
      // { path: 'create', component: CoworkingSpaceCreateComponent },
      // { path: ':id', component: CoworkingSpaceDetailComponent },
      { path: ':id/edit', component: CoworkingSpaceEditComponent },
      { path: ':id/workspaces/create', component: WorkspaceCreateComponent },
      { path: ':id/workspaces/:workspaceId', component: WorkspaceDetailComponent },
      { path: ':id/workspaces/:workspaceId/edit', component: WorkspaceEditComponent },

      // Seat Routes
      { path: ':id/workspaces/:workspaceId/seats/add', component: SeatAddComponent },
      { path: ':id/workspaces/:workspaceId/seats/bulk-add', component: SeatBulkAddComponent },

    ]
  },

  // Default & Wildcard Routes
  {
    path: 'company-dashboard',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['COMPANY_ADMIN'] },
    component: CompanyDashboardComponent,
    children: [
      { path: 'view-complaint', component: EmployeeComplaintsComponent },
    ]
  },
  { path: '**', redirectTo: 'dashboard' }

  
];
