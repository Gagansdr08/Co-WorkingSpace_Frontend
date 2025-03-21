
import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../../services/employee.service';
import { BookingService } from '../../../services/booking.service';
import { Employee, Booking } from '../../../models';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { DashboardBaseComponent } from '../../dashboard-base/dashboard-base.component';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../core/auth/services/auth.service';

@Component({
  selector: 'app-upcoming-booking',
  imports: [NgIf,NgClass,NgForOf],
  templateUrl: './upcoming-booking.component.html',
  styleUrl: './upcoming-booking.component.css'
})
export class UpcomingBookingComponent extends DashboardBaseComponent {
  currentEmployee: Employee | null = null;
  upcomingBookings: Booking[] = [];
  loading = true;
  // error = '';
  success = '';
  companyId: number | null = null;
  employeeId: number | null = null;
  userid: number | null = null;

  constructor(
    private employeeService: EmployeeService,
    private bookingService: BookingService,
    protected override authService: AuthService,
    protected override router: Router,
  ) { super(authService,router) }

  // ngOnInit(): void {
  //   this.loadEmployeeData();
  // }

  override onUserLoaded(user: User): void {
      // Check if user has the EMPLOYEE role
      if (!user.roles.includes('EMPLOYEE')) {
        this.authService.logout();
        this.router.navigate(['/auth/login']);
        return;
      }
  
      // Set companyId from user data
      this.companyId = user.companyId || null;
  
      // In a real application, you might load employee details here
      // For now, we're just using a mock employeeId
      this.userid = user.id || null; // Normally would be fetched from API
      this.loadEmployeeData();
      // Listen for changes to the start time to update seat availability
      
    }

  loadEmployeeData(): void {
    this.loading = true;
    if(!this.userid) return 
    this.employeeService.getEmployeeById(this.userid).subscribe({

    // this.employeeService.getCurrentEmployee().subscribe({
      next: (employee) => {
        this.currentEmployee = employee;
        this.employeeId=this.currentEmployee.id;
        this.loadUpcomingBookings(employee.id);
      },
      error: (err) => {
        console.error('Error loading employee data', err);
        this.error = 'Failed to load employee data. Please try again later.';
        this.loading = false;
      }
    });
  }

  loadUpcomingBookings(employeeId: number): void {
    this.bookingService.getEmployeeUpcomingBookings(employeeId).subscribe({
      next: (bookings) => {
        this.upcomingBookings = bookings;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading upcoming bookings', err);
        this.error = 'Failed to load upcoming bookings. Please try again later.';
        this.loading = false;
      }
    });
  }

  checkIn(bookingId: number): void {
    this.loading = true;
    this.error = '';
    this.success = '';
    
    this.bookingService.checkIn(bookingId).subscribe({
      next: (booking) => {
        this.success = 'Successfully checked in!';
        this.updateBookingInList(booking);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error checking in', err);
        this.error = err.error?.message || 'Failed to check in. Please try again later.';
        this.loading = false;
      }
    });
  }

  checkOut(bookingId: number): void {
    this.loading = true;
    this.error = '';
    this.success = '';
    
    this.bookingService.checkOut(bookingId).subscribe({
      next: (booking) => {
        this.success = 'Successfully checked out!';
        this.updateBookingInList(booking);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error checking out', err);
        this.error = err.error?.message || 'Failed to check out. Please try again later.';
        this.loading = false;
      }
    });
  }

  cancelBooking(bookingId: number): void {
    if (!this.currentEmployee) return;
    
    this.loading = true;
    this.error = '';
    this.success = '';
    
    this.bookingService.cancelBooking(bookingId, this.currentEmployee.id).subscribe({
      next: (booking) => {
        this.success = 'Booking cancelled successfully!';
        this.updateBookingInList(booking);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cancelling booking', err);
        this.error = err.error?.message || 'Failed to cancel booking. Please try again later.';
        this.loading = false;
      }
    });
  }

  private updateBookingInList(updatedBooking: Booking): void {
    const index = this.upcomingBookings.findIndex(booking => booking.id === updatedBooking.id);
    if (index !== -1) {
      this.upcomingBookings[index] = updatedBooking;
    }
  }

  // Helper methods
  formatDateTime(dateTime: string): string {
    return new Date(dateTime).toLocaleString();
  }

  canCheckIn(booking: Booking): boolean {
    return booking.status === 'CONFIRMED';
  }

  canCheckOut(booking: Booking): boolean {
    return booking.status === 'CHECKED_IN';
  }

  canCancel(booking: Booking): boolean {
    return booking.status === 'CONFIRMED';
  }
}