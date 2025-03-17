import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { EmployeeService } from '../../../services/employee.service';
import { SeatService } from '../../../services/seat.service';
import { BookingService } from '../../../services/booking.service';
import { Employee, Seat, Workspace, CreateBookingRequest } from '../../../models';
import { NgFor, NgIf } from '@angular/common';
import { SeatMapComponent } from '../seat-map/seat-map.component';
import { SeatDetailsComponent } from '../seat-details/seat-details.component';
import { Observable, of, switchMap, map } from 'rxjs';

@Component({
  selector: 'app-booking',
  imports: [NgIf, FormsModule, ReactiveFormsModule, SeatMapComponent, SeatDetailsComponent, NgFor],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent implements OnInit {
  currentEmployee: Employee | null = null;
  availableWorkspaces: Workspace[] = [];
  selectedWorkspace: Workspace | null = null;
  availableSeats: Seat[] = [];
  selectedSeat: Seat | null = null;
  bookingForm: FormGroup;
  loading = false;
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private seatService: SeatService,
    private bookingService: BookingService
  ) {
    // Calculate tomorrow's date (minimum allowed booking date)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // Set to start of day
    
    this.bookingForm = this.fb.group({
      startTime: ['', [Validators.required, this.dateValidator(tomorrow)]],
      endTime: ['', [Validators.required, this.dateValidator(tomorrow)]],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadEmployeeData();
    
    // Listen for changes to the start time to update seat availability
    this.bookingForm.get('startTime')?.valueChanges.subscribe(value => {
      if (this.selectedWorkspace && value) {
        this.loadSeats(this.selectedWorkspace.id);
      }
    });
  }

  // Custom validator to ensure booking date is at least one day in the future
  dateValidator(minDate: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Let required validator handle empty values
      }
      
      const inputDate = new Date(control.value);
      if (inputDate < minDate) {
        return { dateInvalid: { message: 'Date must be at least one day in the future' } };
      }
      
      return null;
    };
  }

  loadEmployeeData(): void {
    this.loading = true;
    this.employeeService.getCurrentEmployee().subscribe({
      next: (employee) => {
        this.currentEmployee = employee;
        this.loadAvailableWorkspaces(employee.id);
      },
      error: (err) => {
        console.error('Error loading employee data', err);
        this.error = 'Failed to load employee data. Please try again later.';
        this.loading = false;
      }
    });
  }

  loadAvailableWorkspaces(employeeId: number): void {
    this.employeeService.getAvailableWorkspaces(employeeId).subscribe({
      next: (workspaces) => {
        this.availableWorkspaces = workspaces;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading available workspaces', err);
        this.error = 'Failed to load available workspaces. Please try again later.';
        this.loading = false;
      }
    });
  }

  selectWorkspace(workspace: Workspace): void {
    this.selectedWorkspace = workspace;
    this.selectedSeat = null;
    
    // Load seats, considering the current booking date if set
    this.loadSeats(workspace.id);
  }

  loadSeats(workspaceId: number): void {
    if (!this.currentEmployee) return;
    
    this.loading = true;
    
    // Get form values to check booking date
    const startTimeValue = this.bookingForm.get('startTime')?.value;
    const startDate = startTimeValue ? new Date(startTimeValue) : null;
    
    // Get all seats for the workspace first
    this.seatService.getSeatsByCompany(this.currentEmployee.companyId).subscribe({
      next: (seats) => {
        // Filter seats belonging to selected workspace
        let filteredSeats = seats.filter(seat => seat.workspaceId === workspaceId);
        
        // If no booking date is selected yet, show all company-allocated seats
        if (!startDate) {
          this.availableSeats = filteredSeats;
          this.loading = false;
          return;
        }
        
        // Otherwise, also filter out seats that are already booked for that date
        this.getBookingsForDate(startDate).subscribe({
          next: (bookings) => {
            // Extract all seat IDs that are booked for the selected date
            const bookedSeatIds = bookings
              .filter(b => b.status !== 'CANCELLED')
              .map(b => b.seatId);
            
            // Filter available seats
            this.availableSeats = filteredSeats.filter(seat => 
              !bookedSeatIds.includes(seat.id)
            );
            this.loading = false;
          },
          error: (err) => {
            console.error('Error loading bookings for date', err);
            this.error = 'Failed to load available seats. Please try again later.';
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error loading seats', err);
        this.error = 'Failed to load seats. Please try again later.';
        this.loading = false;
      }
    });
  }

  // Get bookings for a specific date
  getBookingsForDate(date: Date): Observable<any[]> {
    // Format date to ISO string (YYYY-MM-DD)
    const dateStr = date.toISOString().split('T')[0];
    return this.bookingService.getBookingsForDate(dateStr);
  }
    // Format date to a string (YYYY-MM-DD)
    formatDateToString(date: Date): string {
      return date.toISOString().split('T')[0];
    }

  // Check if the employee already has a booking for the selected date
  checkForExistingBooking(date: Date): Observable<boolean> {
    if (!this.currentEmployee) {
      return of(false);
    }
    
    const dateString = this.formatDateToString(date);
    console.log(`Checking for existing bookings on ${dateString} for employee ${this.currentEmployee.id}`);
    
    return this.bookingService.getEmployeeUpcomingBookings(this.currentEmployee.id).pipe(
      map(bookings => {
        console.log('Employee upcoming bookings:', bookings);
        
        // Check if any booking is on the same day
        const hasBookingOnDate = bookings.some(booking => {
          const bookingDateStr = this.formatDateToString(new Date(booking.startTime));
          const isOnSameDay = bookingDateStr === dateString;
          const isActive = booking.status !== 'CANCELLED';
          
          console.log(`Booking ${booking.id}: date=${bookingDateStr}, targetDate=${dateString}, sameDay=${isOnSameDay}, active=${isActive}`);
          
          return isOnSameDay && isActive;
        });
        
        console.log(`Employee has existing booking on ${dateString}: ${hasBookingOnDate}`);
        return hasBookingOnDate;
      })
    );
  }

  selectSeat(seat: Seat): void {
    this.selectedSeat = seat;
  }

  createBooking(): void {
    if (this.bookingForm.invalid || !this.selectedSeat || !this.currentEmployee) {
      return;
    }

    const formValues = this.bookingForm.value;
    const startDate = new Date(formValues.startTime);
    
    // First check if user already has a booking on this day
    this.loading = true;
    this.error = '';
    this.success = '';
    
    this.checkForExistingBooking(startDate).subscribe({
      next: (hasExistingBooking) => {
        if (hasExistingBooking) {
          this.error = 'You already have a booking for this date. Only one booking per day is allowed.';
          this.loading = false;
          return;
        }
        
        // No existing booking, proceed with creating a new one
        const bookingRequest: CreateBookingRequest = {
          employeeId: this.currentEmployee!.id,
          seatId: this.selectedSeat!.id,
          startTime: formValues.startTime,
          endTime: formValues.endTime,
          notes: formValues.notes
        };
        
        this.bookingService.createBooking(bookingRequest).subscribe({
          next: (booking) => {
            this.success = 'Booking created successfully!';
            this.loading = false;
            this.resetForm();
          },
          error: (err) => {
            console.error('Error creating booking', err);
            this.error = err.error?.message || 'Failed to create booking. Please try again later.';
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error checking existing bookings', err);
        this.error = 'Failed to verify booking eligibility. Please try again later.';
        this.loading = false;
      }
    });
  }

  resetForm(): void {
    this.bookingForm.reset();
    this.selectedWorkspace = null;
    this.selectedSeat = null;
  }

  // Helper methods
  getSeatStatusLabel(status: string): string {
    switch (status) {
      case 'AVAILABLE':
        return 'Available';
      case 'COMPANY_ALLOCATED':
        return 'Allocated to Your Company';
      case 'EMPLOYEE_BOOKED':
        return 'Booked';
      default:
        return status;
    }
  }

  isSeatAvailable(seat: Seat): boolean {
    return seat.status === 'COMPANY_ALLOCATED' || seat.status === 'AVAILABLE';
  }
}