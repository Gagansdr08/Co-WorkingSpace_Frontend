import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../core/auth/services/auth.service';


export interface Complaint {
  id?: number;
  title: string;
  description: string;
  status?: string; // OPEN, IN_PROGRESS, RESOLVED, CLOSED
  createdAt?: string;
  updatedAt?: string;
  workspaceId?: number;
  workspaceName?: string;
  employeeId: number;
  employeeName?: string;
  assignedUserId?: number;
  assignedUserName?: string;
}

export interface CreateComplaintRequest {
  title: string;
  description: string;
  workspaceId?: number;
}

export interface UpdateComplaintStatusRequest {
  status: string;
  assignedUserId?: number;
  resolutionComments?: string;
}

export interface ComplaintResponse {
  id: number;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  workspaceId: number;
  workspaceName: string;
  employeeId: number;
  employeeName: string;
  assignedUserId?: number;
  assignedUserName?: string;
  resolutionComments?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private baseUrl = 'http://localhost:8080/api/complaints';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Get all complaints
  getAllComplaints(): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(
      this.baseUrl,
      { headers: this.getAuthHeaders() }
    );
  }

  // Get complaint by ID
  getComplaintById(id: number): Observable<Complaint> {
    return this.http.get<Complaint>(
      `${this.baseUrl}/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Get complaints by employee ID
  getComplaintsByEmployeeId(employeeId: number): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(
      `${this.baseUrl}/employee/${employeeId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Get complaints by workspace ID
  getComplaintsByWorkspaceId(workspaceId: number): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(
      `${this.baseUrl}/workspace/${workspaceId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Get complaints by status
  getComplaintsByStatus(status: string): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(
      `${this.baseUrl}/status/${status}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Create a new complaint
  createComplaint(employeeId: number, complaint: CreateComplaintRequest): Observable<ComplaintResponse> {
    return this.http.post<ComplaintResponse>(
      `${this.baseUrl}/employee/${employeeId}`,
      complaint,
      { headers: this.getAuthHeaders() }
    );
  }

  // Update complaint status
  updateComplaintStatus(
    complaintId: number, 
    statusUpdate: UpdateComplaintStatusRequest,
    userId: number
  ): Observable<ComplaintResponse> {
    return this.http.put<ComplaintResponse>(
      `${this.baseUrl}/${complaintId}/status?userId=${userId}`,
      statusUpdate,
      { headers: this.getAuthHeaders() }
    );
  }

  // Get authorization headers from AuthService
  private getAuthHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }
}