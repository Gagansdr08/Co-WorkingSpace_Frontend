import { Component, Input, OnInit } from '@angular/core';
import { Complaint, ComplaintService } from '../../../services/complaints.service';
import { finalize } from 'rxjs/operators';
import { NgClass, NgIf, SlicePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-complaint',
  imports: [NgIf,NgClass,ReactiveFormsModule,SlicePipe],
  templateUrl: './view-complaint.component.html',
  styleUrl: './view-complaint.component.css'
})
export class EmployeeComplaintsComponent implements OnInit {
  @Input() employeeId: number | null = null;
  
  complaints: Complaint[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  selectedComplaint: Complaint | null = null;
  
  constructor(private complaintService: ComplaintService) {}
  
  ngOnInit(): void {
    this.loadComplaints();
  }
  
  loadComplaints(): void {
    if (!this.employeeId) {
      this.errorMessage = 'No employee ID provided';
      return;
    }
    
    this.isLoading = true;
    
    this.complaintService.getComplaintsByEmployeeId(this.employeeId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (complaints) => {
          this.complaints = complaints;
          this.errorMessage = null;
        },
        error: (error) => {
          this.errorMessage = 'Failed to load complaints. Please try again.';
          console.error('Error loading complaints:', error);
        }
      });
  }
  
  viewComplaintDetails(complaint: Complaint): void {
    this.selectedComplaint = complaint;
  }
  
  closeComplaintDetails(): void {
    this.selectedComplaint = null;
  }
  
  getStatusClass(status: string | undefined): string {
    if (!status) return '';
    
    switch (status) {
      case 'OPEN':
        return 'status-open';
      case 'IN_PROGRESS':
        return 'status-in-progress';
      case 'RESOLVED':
        return 'status-resolved';
      case 'CLOSED':
        return 'status-closed';
      default:
        return '';
    }
  }
  
  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }
}
