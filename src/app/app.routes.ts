// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BookingComponent } from './components/dashboard/booking/booking.component';
import { UpcomingBookingComponent } from './components/dashboard/upcoming-booking/upcoming-booking.component';
import { PastBookingComponent } from './components/dashboard/past-booking/past-booking.component';
import { ComplaintsComponent } from './components/dashboard/complaints/complaints.component';

export const routes: Routes = [
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'booking', pathMatch: 'full' },
      { path: 'booking', component: BookingComponent },
      { path: 'upcoming', component: UpcomingBookingComponent },
      { path: 'past', component: PastBookingComponent },
      { path: 'complaints', component: ComplaintsComponent }
    ]
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];