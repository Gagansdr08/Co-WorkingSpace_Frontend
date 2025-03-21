import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService } from '../../../services/employee.service';
import { finalize } from 'rxjs/operators';
import { ComplaintService, CreateComplaintRequest } from '../../../services/complaints.service';
import { WorkspaceService } from '../../../services/workspace.service';
import { DashboardBaseComponent } from '../../dashboard-base/dashboard-base.component';
import { AuthService, User } from '../../../core/auth/services/auth.service';
import { Router } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import { Employee } from '../../../models';


@Component({
  selector: 'app-add-complaint',
  templateUrl: './add-complaint.component.html',
  styleUrls: ['./add-complaint.component.scss'],
  imports:[ReactiveFormsModule,NgIf,NgForOf]
})
export class AddComplaintComponent extends DashboardBaseComponent {
  complaintForm: FormGroup;
  // isLoading = false;
  isSubmitting = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  workspaces: any[] = [];
  employeeId: number | null = null;
  companyId: number | null = null;
  userid: number | null = null;
  currentEmployee: Employee | null = null;

  constructor(
    private fb: FormBuilder,
    private complaintService: ComplaintService,
    private workspaceService: WorkspaceService,
    protected override authService: AuthService,
    protected override router: Router,
    private employeeService: EmployeeService,
  ) {
    super(authService, router);
    this.complaintForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      workspaceId: [null]
    });
  }

  // ngOnInit(): void {
  //   // In a real app, get the employeeId from a service
  //   // For now, we'll use a hardcoded value
  //   this.employeeId = 1; // Replace with actual employee ID from user service or state

  //   this.loadWorkspaces();
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
      this.isLoading = true;
      if(!this.userid) return 
  
      this.employeeService.getEmployeeById(this.userid).subscribe({
        next: (employee) => {
          this.currentEmployee = employee;
          this.employeeId=this.currentEmployee.id;
          console.log(this.employeeId);
          this.loadWorkspaces();
          },
        // next: (employee) => {
        //   this.currentEmployee = employee;
        // },
        error: (err) => {
          console.error('Error loading employee data', err);
          this.error = 'Failed to load employee data. Please try again later.';
          this.isLoading = false;
        }
      });
    }
  

  loadWorkspaces(): void {
    this.isLoading = true;

    // Replace with appropriate method to get workspaces for the employee
    this.workspaceService.getAllWorkspacesForCoworkingSpace(1) // Replace with actual coworking space ID
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (workspaces: any[]) => {
          this.workspaces = workspaces;
        },
        error: (error: any) => {
          this.errorMessage = 'Failed to load workspaces. Please try again later.';
          console.error('Error loading workspaces:', error);
        }
      });
  }

  onSubmit(): void {
    if (this.complaintForm.invalid || !this.employeeId) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    const complaintData: CreateComplaintRequest = {
      title: this.complaintForm.value.title,
      description: this.complaintForm.value.description,
      workspaceId: this.complaintForm.value.workspaceId || undefined,
    };

    console.log(complaintData.workspaceId)


    this.complaintService.createComplaint(this.employeeId, complaintData)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe({
        next: (response: any) => {
          this.successMessage = 'Complaint submitted successfully!';
          this.complaintForm.reset();
        },
        error: (error: { message: string; }) => {
          this.errorMessage = error.message || 'Failed to submit complaint. Please try again.';
          console.error('Error submitting complaint:', error);
        }
      });
  }
}