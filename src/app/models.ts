export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    errors?: any[];
  }
  
  // Employee interface
  export interface Employee {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    jobTitle: string;
    department: string;
    active: boolean;
    companyId: number;
    companyName: string;
    userId: number | null;
    createdAt: string;
  }
  
  // Seat interface
  export interface Seat {
    id: number;
    seatNumber: string;
    status: 'AVAILABLE' | 'COMPANY_ALLOCATED' | 'EMPLOYEE_BOOKED';
    type: string;
    features: string;
    workspaceId: number;
    workspaceName: string;
    companyId: number | null;
    companyName: string | null;
  }
  
  // Workspace interface
  export interface Workspace {
    id: number;
    name: string;
    type: string;
    capacity: number;
    location: string;
    pricePerSeatPerHour: number;
    available: boolean;
    coworkingSpaceName: string;
    coworkingSpaceId: number;
    totalSeats: number;
    availableSeats: number;
    companyAllocatedSeats: number;
    employeeBookedSeats: number;
    seats: Seat[] | null;
  }
  
  // Booking interface
  export interface Booking {
    id: number;
    employeeId: number;
    employeeName: string;
    seatId: number;
    seatNumber: string;
    workspaceId: number;
    workspaceName: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
    checkInTime: string | null;
    checkOutTime: string | null;
    status: 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED';
    notes: string;
    createdAt: string;
  }
  
  // Create Booking Request interface
  export interface CreateBookingRequest {
    employeeId: number;
    seatId: number;
    startTime: string;
    endTime: string;
    notes: string;
  }
// src/app/models/complaint.model.ts
export interface Complaint {
  id?: number;
  employeeId: number;
  employeeName?: string;
  subject: string;
  description: string;
  status?: 'NEW' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateComplaintRequest {
  employeeId: number;
  subject: string;
  description: string;
}
  