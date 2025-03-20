import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { ApiResponse, CoworkingSpace } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CoworkingSpaceService {
  constructor(private apiService: ApiService) { }

  // Create a coworking space
  createSpace(spaceData: CoworkingSpace): Observable<CoworkingSpace> {
    return this.apiService.post<ApiResponse<CoworkingSpace>>('/coworking-spaces', spaceData)
      .pipe(map(response => response.data));
  }

  // Get all coworking spaces
  getAllSpaces(): Observable<CoworkingSpace[]> {
    return this.apiService.get<ApiResponse<CoworkingSpace[]>>('/coworking-spaces')
      .pipe(map(response => response.data));
  }

  // Get coworking space by ID
  getSpaceById(id: number): Observable<CoworkingSpace> {
    return this.apiService.get<ApiResponse<CoworkingSpace>>(`/coworking-spaces/${id}`)
      .pipe(map(response => response.data));
  }

  // Get coworking space with workspaces
  getSpaceWithWorkspaces(id: number): Observable<CoworkingSpace> {
    return this.apiService.get<ApiResponse<CoworkingSpace>>(`/coworking-spaces/${id}/with-workspaces`)
      .pipe(map(response => response.data));
  }

  // Update a coworking space
  updateSpace(id: number, spaceData: CoworkingSpace): Observable<CoworkingSpace> {
    return this.apiService.put<ApiResponse<CoworkingSpace>>(`/coworking-spaces/${id}`, spaceData)
      .pipe(map(response => response.data));
  }

  // Delete a coworking space
  deleteSpace(id: number): Observable<void> {
    return this.apiService.delete<void>(`/coworking-spaces/${id}`);
  }
}