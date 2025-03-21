import { Injectable } from '@angular/core';
import { Company } from '../entity/company';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Seat } from '../entity/seat';
@Injectable({
  providedIn: 'root'
})
export class SeatService {

  private apiUrl = 'http://localhost:8080/api/seats';
  
  // Mock data for seats
  private mockSeats: Seat[] = [
    { id: 1, seatNumber: 'A001', type: 'Standard Desk', features: 'Ergonomic chair, power outlets', workspaceId: 1, available: false, companyId: 1 },
    { id: 2, seatNumber: 'A002', type: 'Standard Desk', features: 'Ergonomic chair, power outlets', workspaceId: 1, available: false, companyId: 1 },
    { id: 3, seatNumber: 'A003', type: 'Standard Desk', features: 'Ergonomic chair, power outlets', workspaceId: 1, available: true },
    { id: 4, seatNumber: 'A004', type: 'Standard Desk', features: 'Ergonomic chair, power outlets', workspaceId: 1, available: true },
    { id: 5, seatNumber: 'A005', type: 'Standard Desk', features: 'Ergonomic chair, power outlets', workspaceId: 1, available: true }
  ];

  // BehaviorSubjects for state management
  private seatsSubject = new BehaviorSubject<Seat[]>(this.mockSeats);
  seats$ = this.seatsSubject.asObservable();

  constructor(private http: HttpClient) { }

  getAllSeats(): Observable<any> {
    // return of(this.mockSeats);
    
    // API call would be:
    return this.http.get<Seat[]>(`${this.apiUrl}/workspace/1`);
  }

  getAvailableSeats(): Observable<any> {
    // const availableSeats = this.mockSeats.filter(seat => seat.available);
    // return of(availableSeats);
    
    // API call would be:
    return this.http.get<Seat[]>(`${this.apiUrl}/workspace/1/available`);
  }

  getSeatsByCompanyId(companyId: number): Observable<any> {
    // const companySeats = this.mockSeats.filter(seat => seat.companyId === companyId);
    // return of(companySeats);
    
    // API call would be:
    return this.http.get<Seat[]>(`${this.apiUrl}/company/${companyId}`);
  }

  addSeat(seat: Seat): Observable<Seat> {
    // Mock implementation - adds a new seat to our mock data
    // const newSeat = { ...seat, id: this.mockSeats.length + 1 };
    // this.mockSeats.push(newSeat);
    // this.seatsSubject.next([...this.mockSeats]);
    // return of(newSeat);
    
    // API call would be:
    return this.http.post<Seat>(`${this.apiUrl}/workspace/1`, seat);
  }

  allocateSeatToCompany(seatId: number, companyId: number = 1): Observable<Seat> {
    // Find and update the seat in our mock data
    // const seatIndex = this.mockSeats.findIndex(s => s.id === seatId);
    // if (seatIndex !== -1) {
    //   this.mockSeats[seatIndex] = {
    //     ...this.mockSeats[seatIndex],
    //     available: false,
    //     companyId: companyId
    //   };
    //   this.seatsSubject.next([...this.mockSeats]);
    //   return of(this.mockSeats[seatIndex]);
    // }
    
    // API call would be:
    return this.http.post<Seat>(`${this.apiUrl}/companies/${companyId}/allocate-seats`, { workspaceId: 1, seatIds: [seatId] });
    
    // return of({} as Seat); // Return empty seat if not found
  }

  releaseSeatFromCompany(seatId: number, companyId: number = 1): Observable<Seat> {
    // Find and update the seat in our mock data
    // const seatIndex = this.mockSeats.findIndex(s => s.id === seatId);
    // if (seatIndex !== -1) {
    //   this.mockSeats[seatIndex] = {
    //     ...this.mockSeats[seatIndex],
    //     available: true,
    //     companyId: undefined
    //   };
    //   this.seatsSubject.next([...this.mockSeats]);
    //   return of(this.mockSeats[seatIndex]);
    // }
    
    // API call would be:
    return this.http.post<Seat>(`${this.apiUrl}/companies/${companyId}/release-seats`, [seatId]);
    
    // return of({} as Seat); // Return empty seat if not found
  }
}
