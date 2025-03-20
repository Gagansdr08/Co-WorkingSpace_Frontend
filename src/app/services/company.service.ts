import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { ApiResponse, Company, Seat } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  constructor(private apiService: ApiService) { }

  getCompanyById(id: number): Observable<Company> {
    return this.apiService.get<ApiResponse<Company>>(`/companies/${id}`)
      .pipe(map(response => response.data));
  }

  getCompanyWithSeats(id: number, timestamp?: number): Observable<Company> {
    // Add a cache-busting parameter to ensure fresh data
    let url = `/companies/${id}/with-seats`;
    if (timestamp) {
      url += `?t=${timestamp}`; 
    } else {
      url += `?t=${new Date().getTime()}`;
    }
    
    console.log(`Fetching company with seats: ${url}`);
    
    return this.apiService.get<ApiResponse<Company>>(url)
      .pipe(
        map(response => {
          console.log('Company with seats response:', response);
          return response.data;
        })
      );
  }

  allocateSeats(companyId: number, workspaceId: number, numberOfSeats: number): Observable<Seat[]> {
    const payload = {
      workspaceId: workspaceId,
      numberOfSeats: numberOfSeats
    };
    
    console.log(`Allocating ${numberOfSeats} seats from workspace ${workspaceId} to company ${companyId}`);
    console.log('Payload:', payload);
    
    return this.apiService.post<ApiResponse<Seat[]>>(`/companies/${companyId}/allocate-seats`, payload)
      .pipe(
        map(response => {
          console.log('Allocation response:', response);
          return response.data;
        }),
        catchError(error => {
          console.error('Allocation error:', error);
          throw error;
        })
      );
  }

  releaseSeats(companyId: number, seatIds: number[]): Observable<Seat[]> {
    console.log(`Releasing seats from company ${companyId}:`, seatIds);
    
    return this.apiService.post<ApiResponse<Seat[]>>(`/companies/${companyId}/release-seats`, seatIds)
      .pipe(
        map(response => {
          console.log('Release seats response:', response);
          return response.data;
        }),
        catchError(error => {
          console.error('Release seats error:', error);
          throw error;
        })
      );
  }
}