import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { ApiResponse, Workspace } from '../models';
@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  constructor(private apiService: ApiService) { }

  getAvailableWorkspaces(coworkingSpaceId: number): Observable<Workspace[]> {
    // This endpoint should return workspaces with available seats
    // The API documentation doesn't specify a direct endpoint for this
    // You might need to adjust based on your actual API
    return this.apiService.get<ApiResponse<Workspace[]>>(`/workspaces/coworking-space/${coworkingSpaceId}/available`)//here we have default put as 1 if in future we want to increase the coworking spcae then create a service for this.
      .pipe(map(response => response.data));
  }

  getWorkspaceById(id: number): Observable<Workspace> {
    return this.apiService.get<ApiResponse<Workspace>>(`/workspaces/${id}`)
      .pipe(map(response => response.data));
  }

  getWorkspaceWithSeats(id: number): Observable<Workspace> {
    return this.apiService.get<ApiResponse<Workspace>>(`/workspaces/${id}/with-seats`)
      .pipe(map(response => response.data));
  }
}