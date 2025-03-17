
import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../../services/employee.service';
import { BookingService } from '../../../services/booking.service';
import { Employee, Booking } from '../../../models';
import { NgClass, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-upcoming-booking',
  imports: [NgIf,NgClass,NgForOf],
  templateUrl: './upcoming-booking.component.html',
  styleUrl: './upcoming-booking.component.css'
})
export class UpcomingBookingComponent implements OnInit {
  currentEmployee: Employee | null = null;
  upcomingBookings: Booking[] = [];
  loading = true;
  error = '';
  success = '';

  constructor(
    private employeeService: EmployeeService,
    private bookingService: BookingService
  ) { }

  ngOnInit(): void {
    this.loadEmployeeData();
  }

  loadEmployeeData(): void {
    this.loading = true;
    this.employeeService.getCurrentEmployee().subscribe({
      next: (employee) => {
        this.currentEmployee = employee;
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