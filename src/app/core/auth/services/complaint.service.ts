import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export enum ComplaintStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export interface EmployeeBasicInfo {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface WorkspaceBasicInfo {
  id: number;
  name: string;
  location: string;
  type: string;
}

export interface ComplaintResponseDTO {
  id: number;
  title: string;
  description: string;
  status: ComplaintStatus;
  submittedBy: EmployeeBasicInfo;
  workspace: WorkspaceBasicInfo;
  createdAt: Date|undefined;
  updatedAt: Date|undefined;
  resolutionNotes?: string;
}

export interface ComplaintRequest {
  title: string;
  description: string;
  employeeId: number;
  workspaceId: number;
}

export interface UpdateComplaintStatusRequest {
  status: ComplaintStatus;
  resolutionNotes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private baseUrl = `${environment.apiUrl}/api/complaints`;

  constructor(private http: HttpClient) { }

  // Get all complaints
  getAllComplaints(): Observable<ComplaintResponseDTO[]> {
    return this.http.get<ComplaintResponseDTO[]>(this.baseUrl).pipe(
      map(complaints => this.convertDateFields(complaints))
    );
  }

  // Get complaint by ID
  getComplaintById(id: number): Observable<ComplaintResponseDTO> {
    return this.http.get<ComplaintResponseDTO>(`${this.baseUrl}/${id}`).pipe(
      map(complaint => this.convertDateField(complaint))
    );
  }

  // Get complaints by employee ID
  getComplaintsByEmployeeId(employeeId: number): Observable<ComplaintResponseDTO[]> {
    return this.http.get<ComplaintResponseDTO[]>(`${this.baseUrl}/employee/${employeeId}`).pipe(
      map(complaints => this.convertDateFields(complaints))
    );
  }

  // Get complaints by workspace ID
  getComplaintsByWorkspace(workspaceId: number): Observable<ComplaintResponseDTO[]> {
    return this.http.get<ComplaintResponseDTO[]>(`${this.baseUrl}/workspace/${workspaceId}`).pipe(
      map(complaints => this.convertDateFields(complaints))
    );
  }

  // Get complaints by status
  getComplaintsByStatus(status: ComplaintStatus): Observable<ComplaintResponseDTO[]> {
    return this.http.get<ComplaintResponseDTO[]>(`${this.baseUrl}/status/${status}`).pipe(
      map(complaints => this.convertDateFields(complaints))
    );
  }

  // Create a new complaint
  createComplaint(employeeId: number, request: ComplaintRequest): Observable<ComplaintResponseDTO> {
    return this.http.post<ComplaintResponseDTO>(`${this.baseUrl}/employee/${employeeId}`, request).pipe(
      map(complaint => this.convertDateField(complaint))
    );
  }

  // Update complaint status
  updateComplaintStatus(
    id: number, 
    request: UpdateComplaintStatusRequest, 
    userId: number
  ): Observable<ComplaintResponseDTO> {
    return this.http.put<ComplaintResponseDTO>(
      `${this.baseUrl}/${id}/status?userId=${userId}`, 
      request
    ).pipe(
      map(complaint => this.convertDateField(complaint))
    );
  }

  // Helper methods to convert string dates to Date objects
  private convertDateFields(complaints: ComplaintResponseDTO[]): ComplaintResponseDTO[] {
    return complaints.map(complaint => this.convertDateField(complaint));
  }

  private convertDateField(complaint: ComplaintResponseDTO): ComplaintResponseDTO {
    return {
      ...complaint,
      createdAt: complaint.createdAt ? new Date(complaint.createdAt) : undefined,
      updatedAt: complaint.updatedAt ? new Date(complaint.updatedAt) : undefined
    };
  }
}
