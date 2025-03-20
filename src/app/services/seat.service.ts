import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Seat, ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SeatService {
  private apiUrl = 'http://localhost:8080/api/seats';

  constructor(private http: HttpClient) {}

  // Add a single seat to a workspace
  addSeat(workspaceId: number, seat: { seatNumber: string, type: string, features: string }): Observable<Seat> {
    return this.http.post<ApiResponse<Seat>>(`${this.apiUrl}/workspace/${workspaceId}`, seat).pipe(
      map(response => response.data)
    );
  }

  // Add multiple seats in bulk
  addBulkSeats(workspaceId: number, bulkSeatRequest: {
    startingNumber: number,
    numberOfSeats: number,
    type: string,
    features: string,
    prefix: string
  }): Observable<Seat[]> {
    return this.http.post<ApiResponse<Seat[]>>(`${this.apiUrl}/workspace/${workspaceId}/bulk`, bulkSeatRequest).pipe(
      map(response => response.data)
    );
  }

  // Get all seats in a workspace
  getAllSeatsInWorkspace(workspaceId: number): Observable<Seat[]> {
    return this.http.get<ApiResponse<Seat[]>>(`${this.apiUrl}/workspace/${workspaceId}`).pipe(
      map(response => response.data)
    );
  }

  // Get only available seats in a workspace
  getAvailableSeatsInWorkspace(workspaceId: number): Observable<Seat[]> {
    return this.http.get<ApiResponse<Seat[]>>(`${this.apiUrl}/workspace/${workspaceId}/available`).pipe(
      map(response => response.data)
    );
  }

  // Get seats allocated to a specific company
  getSeatsByCompany(companyId: number): Observable<Seat[]> {
    return this.http.get<ApiResponse<Seat[]>>(`${this.apiUrl}/company/${companyId}`).pipe(
      map(response => response.data)
    );
  }

  // Delete seat
  deleteSeat(seatId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${seatId}`);
  }
}