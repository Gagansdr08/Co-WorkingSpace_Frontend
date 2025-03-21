import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Company } from '../entity/company';
@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private apiUrl = 'http://localhost:8080/api/companies';
  
  // Mock data for our single company
  private mockCompany: Company = {
    id: 1,
    name: 'Tech Innovators Ltd',
    address: '456 Business Avenue, City',
    email: 'contact@techinnovators.com',
    phone: '555-5678',
    description: 'A software development company'
  };

  constructor(private http: HttpClient) { }

  getCompany(): Observable<any> {
    // return of(this.mockCompany);
    
    // API call would be:
    return this.http.get<Company>(`${this.apiUrl}/1`);
  }
}
