import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CompanyService } from '../../../services/company.service';
import { WorkspaceService } from '../../../services/workspace.service';
import { Company, Workspace, Seat } from '../../../models';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-seat-allocation',
  imports: [NgIf, FormsModule, ReactiveFormsModule, NgFor],
  templateUrl: './seat-allocation.component.html',
  styleUrl: './seat-allocation.component.css'
})
export class SeatAllocationComponent implements OnInit {
  @Input() company: Company | null = null;
  @Input() coworkingSpaceId: number = 1; // Default value with Input decorator
  
  allocateForm: FormGroup;
  workspaces: Workspace[] = [];
  allocatedSeats: Seat[] = [];
  companyAllocatedSeats: Seat[] = [];
  employeeBookedSeats: Seat[] = [];
  selectedWorkspace: Workspace | null = null;
  loading = false;
  error = '';
  success = '';
  
  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private workspaceService: WorkspaceService
  ) {
    this.allocateForm = this.fb.group({
      workspaceId: ['', Validators.required],
      numberOfSeats: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadWorkspaces();
    this.loadAllocatedSeats();
  }

  loadWorkspaces(): void {
    this.loading = true;
    console.log('Fetching workspaces for coworking space ID:', this.coworkingSpaceId);
    
    this.workspaceService.getAvailableWorkspaces(this.coworkingSpaceId).subscribe({
      next: (workspaces) => {
        console.log('Available workspaces:', workspaces);
        this.workspaces = workspaces;
        this.loading = false;
        
        if (workspaces.length === 0) {
          this.error = 'No available workspaces found. Please contact the administrator.';
        }
      },
      error: (err) => {
        console.error('Error loading workspaces:', err);
        this.error = 'Failed to load available workspaces. Please try again later.';
        this.loading = false;
      }
    });
  }

  loadAllocatedSeats(): void {
    if (!this.company) return;
    
    this.loading = true;
    console.log(`Loading allocated seats for company ${this.company.id}`);
    
    // Force a fresh fetch by adding a timestamp parameter to avoid caching
    const timestamp = new Date().getTime();
    this.companyService.getCompanyWithSeats(this.company.id, timestamp).subscribe({
      next: (company) => {
        console.log('Company with seats response:', company);
        
        const allSeats = company.allocatedSeats || [];
        console.log(`Total allocated seats: ${allSeats.length}`);
        
        // Separate seats by status
        this.companyAllocatedSeats = allSeats.filter(seat => seat.status === 'COMPANY_ALLOCATED');
        this.employeeBookedSeats = allSeats.filter(seat => 
          seat.status === 'EMPLOYEE_BOOKED');
        
        console.log(`Company allocated seats: ${this.companyAllocatedSeats.length}`);
        console.log(`Employee booked seats: ${this.employeeBookedSeats.length}`);
        
        // Combine both types for the display
        this.allocatedSeats = [...this.companyAllocatedSeats, ...this.employeeBookedSeats];
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading allocated seats:', err);
        this.error = 'Failed to load allocated seats. Please try again later.';
        this.loading = false;
      }
    });
  }

  canReleaseSeat(seat: Seat): boolean {
    return seat.status === 'COMPANY_ALLOCATED';
  }
  
  getSeatStatusLabel(status: string): string {
    switch (status) {
      case 'COMPANY_ALLOCATED':
        return 'Available for Booking';
      case 'BOOKED':
      case 'EMPLOYEE_BOOKED':
        return 'Booked by Employee';
      default:
        return status;
    }
  }
  
  getBookingInfo(seat: Seat): string {
    if ( seat.status === 'EMPLOYEE_BOOKED') {
      return 'Currently booked by an employee';
    }
    return '';
  }

  onWorkspaceChange(): void {
    const workspaceId = this.allocateForm.get('workspaceId')?.value;
    this.selectedWorkspace = this.workspaces.find(w => w.id === parseInt(workspaceId)) || null;
    
    // Reset number of seats if workspace changed
    if (this.selectedWorkspace) {
      const maxSeats = this.selectedWorkspace.availableSeats || 0;
      this.allocateForm.get('numberOfSeats')?.setValidators([
        Validators.required, 
        Validators.min(1), 
        Validators.max(maxSeats)
      ]);
      this.allocateForm.get('numberOfSeats')?.updateValueAndValidity();
    }
  }

  allocateSeats(): void {
    if (this.allocateForm.invalid || !this.company || !this.selectedWorkspace) {
      return;
    }
    
    this.loading = true;
    this.error = '';
    this.success = '';
    
    const formValues = this.allocateForm.value;
    const numberOfSeats = formValues.numberOfSeats;
    const workspaceId = parseInt(formValues.workspaceId);
    
    console.log(`Allocating ${numberOfSeats} seats from workspace ${workspaceId}`);
    
    this.companyService.allocateSeats(
      this.company.id, 
      workspaceId, 
      numberOfSeats
    ).subscribe({
      next: (allocatedSeats) => {
        console.log('API response:', allocatedSeats);
      
        // Check if we got the expected number of seats
        const receivedSeatCount = Array.isArray(allocatedSeats) ? allocatedSeats.length : 0;
        
        if (receivedSeatCount === numberOfSeats) {
          this.success = `Successfully allocated ${numberOfSeats} seats from ${this.selectedWorkspace?.name}.`;
        } else {
          this.success = `Requested ${numberOfSeats} seats, but ${receivedSeatCount} were allocated from ${this.selectedWorkspace?.name}.`;
        }
        
        // Reset the form first
        this.allocateForm.reset({
          workspaceId: '',
          numberOfSeats: 1
        });
        this.selectedWorkspace = null;
        
        // Then refresh the data to show updated seat counts
        this.loadAllocatedSeats();
        this.loadWorkspaces();
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Error allocating seats:', err);
        
        // Provide more detailed error information
        if (err.error && err.error.message) {
          this.error = err.error.message;
        } else {
          this.error = `Failed to allocate seats: ${err.message || 'Unknown error'}`;
        }
        
        this.loading = false;
      }
    });
  }

  releaseSeats(seatIds: number[]): void {
    if (!this.company || seatIds.length === 0) {
      return;
    }
    
    // Filter to only include company-allocated seat IDs
    const companyAllocatedSeatIds = this.companyAllocatedSeats
      .map(seat => seat.id || 0)
      .filter(id => id > 0);
    
    // Find the intersection of requested seat IDs and actually allocated seat IDs
    const validSeatIds = seatIds.filter(id => companyAllocatedSeatIds.includes(id));
    
    if (validSeatIds.length === 0) {
      this.error = 'No valid company-allocated seats to release.';
      return;
    }
    
    if (!confirm(`Are you sure you want to release ${validSeatIds.length} seats?`)) {
      return;
    }
    
    this.loading = true;
    this.error = '';
    this.success = '';
    
    this.companyService.releaseSeats(this.company.id, validSeatIds).subscribe({
      next: (releasedSeats) => {
        this.success = `Successfully released ${validSeatIds.length} seats.`;
        this.loadAllocatedSeats(); // Refresh the allocated seats list
        this.loadWorkspaces(); // Refresh workspaces to update available seats
        this.loading = false;
      },
      error: (err) => {
        console.error('Error releasing seats', err);
        this.error = err.error?.message || 'Failed to release seats. Please try again later.';
        this.loading = false;
      }
    });
  }

  releaseSeat(seatId: number): void {
    this.releaseSeats([seatId]);
  }

  getAllSeatIds(): number[] {
    return this.companyAllocatedSeats
      .map(seat => seat.id || 0)
      .filter(id => id !== 0);
  }

  releaseAllSeats(): void {
    const allSeatIds = this.getAllSeatIds();
    
    if (allSeatIds.length === 0) {
      this.error = 'No company-allocated seats to release.';
      return;
    }
    
    this.releaseSeats(allSeatIds);
  }

  getSeatsAllocatedInWorkspace(workspaceId: number): number {
    return this.companyAllocatedSeats.filter(seat => seat.workspaceId === workspaceId).length;
  }
}