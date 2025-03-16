import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { ApiResponse, Booking, CreateBookingRequest } from '../models';


@Injectable({
  providedIn: 'root'
})
export class BookingService {
  constructor(private apiService: ApiService) { }

  // Create a new booking
  createBooking(bookingRequest: CreateBookingRequest): Observable<Booking> {
    return this.apiService.post<ApiResponse<Booking>>('/bookings', bookingRequest)
      .pipe(map(response => response.data));
  }

  // Get booking by ID
  getBookingById(id: number): Observable<Booking> {
    return this.apiService.get<ApiResponse<Booking>>(`/bookings/${id}`)
      .pipe(map(response => response.data));
  }

  // Get all bookings for an employee
  getEmployeeBookings(employeeId: number): Observable<Booking[]> {
    return this.apiService.get<ApiResponse<Booking[]>>(`/bookings/employee/${employeeId}`)
      .pipe(map(response => response.data));
  }

  // Get upcoming bookings for an employee
  getEmployeeUpcomingBookings(employeeId: number): Observable<Booking[]> {
    return this.apiService.get<ApiResponse<Booking[]>>(`/bookings/employee/${employeeId}/upcoming`)
      .pipe(map(response => response.data));
  }

  // Get past bookings for an employee (we'll need to filter the results)
  getEmployeePastBookings(employeeId: number): Observable<Booking[]> {
    return this.getEmployeeBookings(employeeId).pipe(
      map(bookings => {
        const now = new Date();
        return bookings.filter(booking => new Date(booking.endTime) < now);
      })
    );
  }

  // Check in for a booking
  checkIn(bookingId: number): Observable<Booking> {
    return this.apiService.put<ApiResponse<Booking>>(`/bookings/${bookingId}/check-in`)
      .pipe(map(response => response.data));
  }

  // Check out from a booking
  checkOut(bookingId: number): Observable<Booking> {
    return this.apiService.put<ApiResponse<Booking>>(`/bookings/${bookingId}/check-out`)
      .pipe(map(response => response.data));
  }

  // Cancel a booking
  cancelBooking(bookingId: number, employeeId: number): Observable<Booking> {
    return this.apiService.put<ApiResponse<Booking>>(`/bookings/${bookingId}/cancel?employeeId=${employeeId}`)
      .pipe(map(response => response.data));
  }
}