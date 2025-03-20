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
// Workspace Components
import { WorkspaceCreateComponent } from '../app/components/admin_dashboard/workspace-create/workspace-create.component';
import { WorkspaceDetailComponent } from '../app/components/admin_dashboard/workspace-detail/workspace-detail.component';
import { WorkspaceEditComponent } from '../app/components/admin_dashboard/workspace-edit/workspace-edit.component';
// Seat Components
import { SeatAddComponent } from '../app/components/admin_dashboard/seat-add/seat-add.component';
import { SeatBulkAddComponent } from '../app/components/admin_dashboard/seat-bulk-add/seat-bulk-add.component';

import { CompanyDashboardComponent } from './components/company-dashboard/company-dashboard.component';

export const routes: Routes = [
  // Dashboard & Bookings Routes
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'booking', pathMatch: 'full' },
      { path: 'booking', component: BookingComponent },
      { path: 'upcoming', component: UpcomingBookingComponent },
      { path: 'past', component: PastBookingComponent }
    ]
  },
  // Coworking Spaces Routes
  { path: 'coworking-spaces', component: CoworkingSpaceListComponent },
  { path: 'coworking-spaces/create', component: CoworkingSpaceCreateComponent },
  { path: 'coworking-spaces/:id', component: CoworkingSpaceDetailComponent },
  { path: 'coworking-spaces/:id/edit', component: CoworkingSpaceEditComponent },
 
  // Workspace Routes
  { path: 'coworking-spaces/:id/workspaces/create', component: WorkspaceCreateComponent },
  { path: 'coworking-spaces/:id/workspaces/:workspaceId', component: WorkspaceDetailComponent },
  { path: 'coworking-spaces/:id/workspaces/:workspaceId/edit', component: WorkspaceEditComponent },
  
  // Seat Routes
  { path: 'coworking-spaces/:id/workspaces/:workspaceId/seats/add', component: SeatAddComponent },
  { path: 'coworking-spaces/:id/workspaces/:workspaceId/seats/bulk-add', component: SeatBulkAddComponent },
  
  // Default & Wildcard Routes
  {path:'company-dashboard',component:CompanyDashboardComponent}
];