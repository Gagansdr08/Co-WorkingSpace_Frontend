import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AddEmployeeRequest, AuthService, EmployeeCredentials } from '../../../core/auth/services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { NgIf } from '@angular/common';
import { Employee,Company } from '../../../models';
import { EmployeeService } from '../../../services/employee.service';

@Component({
  selector: 'app-add-employee',
  imports: [NgIf,ReactiveFormsModule],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css'
})
export class AddEmployeeComponent implements OnInit {
  @Input() visible = false;
  @Input() companyId: number | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() employeeAdded = new EventEmitter<EmployeeCredentials>();
    loading = false;
    error = '';
    success = '';
  
  employeeForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  credentials: EmployeeCredentials | null = null;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    
  ) {
    this.employeeForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      jobTitle: [''],
      department: ['']
    });
  }
  
  ngOnInit(): void {
  }
  
  onSubmit(): void {
    if (this.employeeForm.invalid || !this.companyId) {
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;
    this.credentials = null;
    
    const formData: AddEmployeeRequest = this.employeeForm.value;
    
    this.authService.addEmployee(this.companyId, formData)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (credentials) => {
          this.credentials = credentials;
          this.successMessage = 'Employee added successfully';
          this.employeeAdded.emit(credentials);
          // Reset form
          this.employeeForm.reset();
        },
        error: (error) => {
          if (error.status === 409) {
            this.errorMessage = 'Employee email already in use';
          } else {
            this.errorMessage = error.message || 'Failed to add employee';
          }
        }
      });
  }
 
  closeModal(): void {
    this.close.emit();
    this.employeeForm.reset();
    this.errorMessage = null;
    this.successMessage = null;
    this.credentials = null;
  }
}
