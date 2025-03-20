import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Workspace, ApiResponse, Seat } from '../models';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  private apiUrl = 'http://localhost:8080/api/workspaces';

  constructor(private http: HttpClient) {}

  getAllWorkspacesForCoworkingSpace(coworkingSpaceId: number): Observable<Workspace[]> {
    return this.http.get<ApiResponse<Workspace[]>>(`${this.apiUrl}/coworking-space/${coworkingSpaceId}`).pipe(
      map(response => response.data)
    );
  }

  getAvailableWorkspaces(coworkingSpaceId: number): Observable<Workspace[]> {
    return this.http.get<ApiResponse<Workspace[]>>(`${this.apiUrl}/coworking-space/${coworkingSpaceId}/available`).pipe(
      map(response => response.data)
    );
  }

  getWorkspacesWithMinSeats(coworkingSpaceId: number, minSeats: number): Observable<Workspace[]> {
    return this.http.get<ApiResponse<Workspace[]>>(`${this.apiUrl}/coworking-space/${coworkingSpaceId}/available-seats?minSeats=${minSeats}`).pipe(
      map(response => response.data)
    );
  }

  getWorkspaceWithSeats(workspaceId: number): Observable<Workspace> {
    return this.http.get<ApiResponse<Workspace>>(`${this.apiUrl}/${workspaceId}/with-seats`).pipe(
      map(response => response.data)
    );
  }

  createWorkspace(coworkingSpaceId: number, workspace: Workspace): Observable<Workspace> {
    return this.http.post<ApiResponse<Workspace>>(`${this.apiUrl}/coworking-space/${coworkingSpaceId}`, workspace).pipe(
      map(response => response.data)
    );
  }

  updateWorkspace(workspaceId: number, workspace: Workspace): Observable<Workspace> {
    return this.http.put<ApiResponse<Workspace>>(`${this.apiUrl}/${workspaceId}`, workspace).pipe(
      map(response => response.data)
    );
  }

  deleteWorkspace(workspaceId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${workspaceId}`);
  }
}