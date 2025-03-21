import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../../services/employee.service';
import { BookingService } from '../../../services/booking.service';
import { Employee, Booking } from '../../../models';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { DashboardBaseComponent } from '../../dashboard-base/dashboard-base.component';
import { AuthService, User } from '../../../core/auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-past-booking',
  imports: [NgIf,NgFor,NgClass,DatePipe],
  templateUrl: './past-booking.component.html',
  styleUrl: './past-booking.component.css'
})
export class PastBookingComponent extends DashboardBaseComponent {
  currentEmployee: Employee | null = null;
  pastBookings: Booking[] = [];
  loading = true;
  // error = '';
  companyId: number | null = null;
  employeeId: number | null = null;
  userid: number | null = null;

  constructor(
    private employeeService: EmployeeService,
    private bookingService: BookingService,
    protected override authService: AuthService,
    protected override router: Router,
  ) {
    super(authService, router); }

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
    
  }
  loadEmployeeData(): void {
    this.loading = true;
    if(!this.userid) return 

    this.employeeService.getEmployeeById(this.userid).subscribe({
      next: (employee) => {
        this.currentEmployee = employee;
        // console.log(this.employeeId);
        this.employeeId=this.currentEmployee.id;
        this.loadPastBookings(employee.id)},
      // next: (employee) => {
      //   this.currentEmployee = employee;
      // },
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