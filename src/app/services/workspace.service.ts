import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Workspace, ApiResponse, Seat } from '../models';
import { AuthService } from '../core/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  private apiUrl = 'http://localhost:8080/api/workspaces';

  constructor(private http: HttpClient,private authService: AuthService) {}

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

  // deleteWorkspace(workspaceId: number): Observable<void> {
  //   // return this.http.delete<void>(`${this.apiUrl}/${workspaceId}`); 
  //   return this.http.delete<void>(`${this.apiUrl}/${workspaceId}`).pipe(
  //   catchError((error: HttpErrorResponse) => {
  //     // Pass the error message to the component
  //     return throwError(() => new Error(error.error.message || 'Failed to delete workspace.'));
  //   })
  // );
  // }

  // Delete a workspace
  deleteWorkspace(workspaceId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${workspaceId}`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Get authorization headers from AuthService
  private getAuthHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }
  
  // Centralized error handling
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
      
      // Handle specific status codes
      if (error.status === 401) {
        errorMessage = 'You are not authenticated. Please log in.';
      } else if (error.status === 403) {
        errorMessage = 'You do not have permission to perform this action.';
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}