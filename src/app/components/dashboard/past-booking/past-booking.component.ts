import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../../services/employee.service';
import { BookingService } from '../../../services/booking.service';
import { Employee, Booking } from '../../../models';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';


@Component({
  selector: 'app-past-booking',
  imports: [NgIf,NgFor,NgClass,DatePipe],
  templateUrl: './past-booking.component.html',
  styleUrl: './past-booking.component.css'
})
export class PastBookingComponent implements OnInit {
  currentEmployee: Employee | null = null;
  pastBookings: Booking[] = [];
  loading = true;
  error = '';

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
        this.loadPastBookings(employee.id);
      },
      error: (err) => {
        console.error('Error loading employee data', err);
        this.error = 'Failed to load employee data. Please try again later.';
        this.loading = false;
      }
    });
  }

  loadPastBookings(employeeId: number): void {
    this.bookingService.getEmployeePastBookings(employeeId).subscribe({
      next: (bookings) => {
        this.pastBookings = bookings;
        
        // Sort bookings by end time in descending order (most recent first)
        this.pastBookings.sort((a, b) => 
          new Date(b.endTime).getTime() - new Date(a.endTime).getTime()
        );
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading past bookings', err);
        this.error = 'Failed to load past bookings. Please try again later.';
        this.loading = false;
      }
    });
  }

  // Helper methods
  formatDateTime(dateTime: string): string {
    return new Date(dateTime).toLocaleString();
  }

  getDuration(startTime: string, endTime: string): string {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end.getTime() - start.getTime();
    
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  }
}