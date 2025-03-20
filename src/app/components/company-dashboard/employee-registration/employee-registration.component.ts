import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService } from '../../../services/employee.service';
import { Employee, Company } from '../../../models';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-employee-registration',
  imports: [NgIf,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './employee-registration.component.html',
  styleUrl: './employee-registration.component.css'
})
export class EmployeeRegistrationComponent implements OnInit {
  @Input() company: Company | null = null;
  
  employeeForm: FormGroup;
  employees: Employee[] = [];
  loading = false;
  error = '';
  success = '';
  
  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService
  ) {
    this.employeeForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      jobTitle: ['', Validators.required],
      department: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    if (!this.company) return;
    
    this.loading = true;
    this.employeeService.getEmployeesByCompany(this.company.id).subscribe({
      next: (employees) => {
        this.employees = employees;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading employees', err);
        this.error = 'Failed to load employees. Please try again later.';
        this.loading = false;
      }
    });
  }

  registerEmployee(): void {
    if (this.employeeForm.invalid || !this.company) {
      return;
    }
    
    this.loading = true;
    this.error = '';
    this.success = '';
    
    const employeeData = this.employeeForm.value;
    
    this.employeeService.createEmployee(this.company.id, employeeData).subscribe({
      next: (employee) => {
        this.success = `Employee ${employee.firstName} ${employee.lastName} registered successfully! Username and password have been generated.`;
        this.employeeForm.reset();
        this.loadEmployees(); // Refresh the employee list
      },
      error: (err) => {
        console.error('Error registering employee', err);
        this.error = err.error?.message || 'Failed to register employee. Please try again later.';
        this.loading = false;
      }
    });
  }
}
