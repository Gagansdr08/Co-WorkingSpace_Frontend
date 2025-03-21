import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CoworkingSpace } from '../entity/coworking-space';
import { Observable, of } from 'rxjs';
import { Workspace } from '../entity/workspace';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  private apiUrl = 'http://localhost:8080/api/workspaces';
  
  // Mock data for our single workspace
  private mockWorkspace: Workspace = {
    id: 1,
    name: 'Open Space A',
    type: 'open space',
    capacity: 30,
    location: 'Ground Floor',
    pricePerSeatPerHour: 15.00,
    available: true,
    coworkingSpaceId: 1
  };

  constructor(private http: HttpClient) { }

  // For our simplified approach, we return the mock data
  getWorkspace(): Observable<Workspace> {
    // return of(this.mockWorkspace);
    
    // When ready for API:
    return this.http.get<Workspace>(`${this.apiUrl}/coworking-space/1`);
  }
  
  getWorkspaceWithSeats(): Observable<Workspace> {
    // This would include the seats, but for now we return the same data
    // return of(this.mockWorkspace);
    
    // API call would be:
    return this.http.get<Workspace>(`${this.apiUrl}/coworking-space/1/with-seats`);
    
  }
}
