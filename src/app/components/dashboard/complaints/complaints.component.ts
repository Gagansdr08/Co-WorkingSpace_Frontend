// src/app/components/dashboard/complaints/complaints.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../../services/employee.service';
import { ComplaintService } from '../../../services/complaints.service';
import { Employee } from '../../../models';
import { Complaint,CreateComplaintRequest } from '../../../models';

@Component({
  selector: 'app-complaints',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './complaints.component.html',
  styleUrl: './complaints.component.css'
})
export class ComplaintsComponent implements OnInit {
  currentEmployee: Employee | null = null;
  complaints: Complaint[] = [];
  complaintForm: FormGroup;
  loading = false;
  error = '';
  success = '';
  showForm = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private complaintService: ComplaintService
  ) {
    this.complaintForm = this.fb.group({
      subject: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]]
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
        this.loadComplaints(employee.id);
      },
      error: (err) => {
        console.error('Error loading employee data', err);
        this.error = 'Failed to load employee data. Please try again later.';
        this.loading = false;
      }
    });
  }

  loadComplaints(employeeId: number): void {
    this.loading = true;
    this.complaintService.getEmployeeComplaints(employeeId).subscribe({
      next: (complaints) => {
        this.complaints = complaints;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading complaints', err);
        this.error = 'Failed to load complaints. Please try again later.';
        this.loading = false;
      }
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.complaintForm.reset();
    }
  }

  submitComplaint(): void {
    if (this.complaintForm.invalid || !this.currentEmployee) {
      return;
    }

    const formValues = this.complaintForm.value;
    
    const complaintRequest: CreateComplaintRequest = {
      employeeId: this.currentEmployee.id,
      subject: formValues.subject,
      description: formValues.description
    };

    this.loading = true;
    this.error = '';
    this.success = '';

    this.complaintService.createComplaint(complaintRequest).subscribe({
      next: (complaint) => {
        this.success = 'Complaint submitted successfully!';
        this.loading = false;
        this.complaintForm.reset();
        this.showForm = false;
        // Add the new complaint to the list
        this.complaints.unshift(complaint);
      },
      error: (err) => {
        console.error('Error submitting complaint', err);
        this.error = err.error?.message || 'Failed to submit complaint. Please try again later.';
        this.loading = false;
      }
    });
  }

  deleteComplaint(complaintId: number): void {
    if (confirm('Are you sure you want to delete this complaint?')) {
      this.loading = true;
      this.complaintService.deleteComplaint(complaintId).subscribe({
        next: (success) => {
          if (success) {
            this.success = 'Complaint deleted successfully!';
            // Remove the complaint from the list
            this.complaints = this.complaints.filter(complaint => complaint.id !== complaintId);
          } else {
            this.error = 'Failed to delete complaint.';
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error deleting complaint', err);
          this.error = err.error?.message || 'Failed to delete complaint. Please try again later.';
          this.loading = false;
        }
      });
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'NEW': return 'status-new';
      case 'IN_PROGRESS': return 'status-in-progress';
      case 'RESOLVED': return 'status-resolved';
      default: return '';
    }
  }
}