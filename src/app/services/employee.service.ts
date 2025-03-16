import { Injectable } from '@angular/core';


import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { ApiResponse, Employee, Seat, Workspace } from '../models';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private apiService: ApiService) { }

  // Get current employee
  getCurrentEmployee(): Observable<Employee> {
    return this.apiService.get<ApiResponse<Employee>>('/employees/1')//this should be /me , changed for convience
      .pipe(map(response => response.data));
  }

  // Get employee by ID
  getEmployeeById(id: number): Observable<Employee> {
    return this.apiService.get<ApiResponse<Employee>>(`/employees/${id}`)
      .pipe(map(response => response.data));
  }

  // Get available seats for an employee
  getAvailableSeats(employeeId: number): Observable<Seat[]> {
    return this.apiService.get<ApiResponse<Seat[]>>(`/employees/${employeeId}/available-seats`)
      .pipe(map(response => response.data));
  }

  // Get available workspaces for an employee
  getAvailableWorkspaces(employeeId: number): Observable<Workspace[]> {
    return this.apiService.get<ApiResponse<Workspace[]>>(`/employees/${employeeId}/available-workspaces`)
      .pipe(map(response => response.data));
  }

  // Update employee details
  updateEmployee(id: number, employee: Partial<Employee>): Observable<Employee> {
    return this.apiService.put<ApiResponse<Employee>>(`/employees/${id}`, employee)
      .pipe(map(response => response.data));
  }
}
