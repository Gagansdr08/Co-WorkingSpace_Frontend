import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeService } from '../../../services/employee.service';
import { SeatService } from '../../../services/seat.service';
import { BookingService } from '../../../services/booking.service';
import { Employee, Seat, Workspace, CreateBookingRequest } from '../../../models';
import { NgFor, NgIf } from '@angular/common';
import { SeatMapComponent } from '../seat-map/seat-map.component';
import { SeatDetailsComponent } from '../seat-details/seat-details.component';



@Component({
  selector: 'app-booking',
  imports: [NgIf,FormsModule,ReactiveFormsModule,SeatMapComponent,SeatDetailsComponent,NgFor],
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
    this.bookingForm = this.fb.group({
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadEmployeeData();
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
    this.loading = true;
    
    // Get seats allocated to employee's company
    if (this.currentEmployee) {
      this.seatService.getSeatsByCompany(this.currentEmployee.companyId).subscribe({
        next: (seats) => {
          // Filter seats belonging to selected workspace
          this.availableSeats = seats.filter(seat => seat.workspaceId === workspace.id);
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading available seats', err);
          this.error = 'Failed to load available seats. Please try again later.';
          this.loading = false;
        }
      });
    }
  }

  selectSeat(seat: Seat): void {
    this.selectedSeat = seat;
  }

  createBooking(): void {
    if (this.bookingForm.invalid || !this.selectedSeat || !this.currentEmployee) {
      return;
    }

    const formValues = this.bookingForm.value;
    
    const bookingRequest: CreateBookingRequest = {
      employeeId: this.currentEmployee.id,
      seatId: this.selectedSeat.id,
      startTime: formValues.startTime,
      endTime: formValues.endTime,
      notes: formValues.notes
    };

    this.loading = true;
    this.error = '';
    this.success = '';

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