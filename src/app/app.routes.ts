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

  // Default & Wildcard Routes
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];
