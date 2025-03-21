import { Injectable } from '@angular/core';
import { CoworkingSpace } from '../entity/coworking-space';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoworkingSpaceService {
  private apiUrl = 'http://localhost:8080/api/coworking-spaces';

  // private mockCoworkingSpace: CoworkingSpace = {
  //   id: 1,
  //   name: 'Downtown Hub',
  //   address: '123 Main Street, City',
  //   contactEmail: 'contact@downtownhub.com',
  //   contactPhone: '555-1234',
  //   description: 'A modern coworking space in downtown with excellent amenities'
  // };
  
  constructor(private http: HttpClient) { }

  getCoworkingSpace(): Observable<CoworkingSpace> {
    // Return mock data for now
    // return of(this.mockCoworkingSpace);
    
    // When ready to connect to the API:
    return this.http.get<CoworkingSpace>(`${this.apiUrl}/1`);
  }
}
