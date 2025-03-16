import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { ApiResponse, Seat } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SeatService {
  constructor(private apiService: ApiService) { }

  // Get all seats in a workspace
  getSeatsInWorkspace(workspaceId: number): Observable<Seat[]> {
    return this.apiService.get<ApiResponse<Seat[]>>(`/seats/workspace/${workspaceId}`)
      .pipe(map(response => response.data));
  }

  // Get available seats in a workspace
  getAvailableSeatsInWorkspace(workspaceId: number): Observable<Seat[]> {
    return this.apiService.get<ApiResponse<Seat[]>>(`/seats/workspace/${workspaceId}/available`)
      .pipe(map(response => response.data));
  }

  // Get seats allocated to a company
  getSeatsByCompany(companyId: number): Observable<Seat[]> {
    return this.apiService.get<ApiResponse<Seat[]>>(`/seats/company/${companyId}`)
      .pipe(map(response => response.data));
  }

  // Get seat by ID
  getSeatById(seatId: number): Observable<Seat> {
    return this.apiService.get<ApiResponse<Seat>>(`/seats/${seatId}`)
      .pipe(map(response => response.data));
  }
}