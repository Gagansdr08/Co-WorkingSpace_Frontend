// src/app/services/complaint.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Complaint,CreateComplaintRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  // Mock data for complaints
  private mockComplaints: Complaint[] = [
    {
      id: 1,
      employeeId: 1,
      employeeName: 'John Doe',
      subject: 'Air Conditioning Issue',
      description: 'The AC in workspace A is not working properly.',
      status: 'NEW',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Get all complaints for an employee
  getEmployeeComplaints(employeeId: number): Observable<Complaint[]> {
    const filteredComplaints = this.mockComplaints.filter(
      complaint => complaint.employeeId === employeeId
    );
    return of(filteredComplaints);
  }

  // Create a new complaint
  createComplaint(complaintRequest: CreateComplaintRequest): Observable<Complaint> {
    const newComplaint: Complaint = {
      id: this.mockComplaints.length + 1,
      employeeId: complaintRequest.employeeId,
      employeeName: 'John Doe', // Hard-coded for mock
      subject: complaintRequest.subject,
      description: complaintRequest.description,
      status: 'NEW',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.mockComplaints.push(newComplaint);
    return of(newComplaint);
  }

  // Update complaint (e.g., change status)
  updateComplaint(complaintId: number, updates: Partial<Complaint>): Observable<Complaint> {
    const index = this.mockComplaints.findIndex(c => c.id === complaintId);
    if (index !== -1) {
      const updatedComplaint = {
        ...this.mockComplaints[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.mockComplaints[index] = updatedComplaint;
      return of(updatedComplaint);
    }
    return of({} as Complaint); // Return empty complaint if not found
  }

  // Delete a complaint
  deleteComplaint(complaintId: number): Observable<boolean> {
    const index = this.mockComplaints.findIndex(c => c.id === complaintId);
    if (index !== -1) {
      this.mockComplaints.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
}