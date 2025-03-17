import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CoworkingSpace } from '../models';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class CoworkingSpaceService {
  private apiUrl = 'http://localhost:8080/api/coworking-spaces';

  constructor(private http: HttpClient) {}

  getAllSpaces(): Observable<CoworkingSpace[]> {
    return this.http.get<ApiResponse<CoworkingSpace[]>>(this.apiUrl).pipe(
      map(response => response.data) // ✅ Extracting only the data array
    );
  }

  getSpaceById(id: number): Observable<CoworkingSpace> {
    return this.http.get<ApiResponse<CoworkingSpace>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data) // ✅ Extracting data
    );
  }

  createSpace(space: CoworkingSpace): Observable<CoworkingSpace> {
    return this.http.post<ApiResponse<CoworkingSpace>>(this.apiUrl, space).pipe(
      map(response => response.data) // ✅ Extracting the created space
    );
  }
  
  updateSpace(id: number, updatedSpace: CoworkingSpace): Observable<CoworkingSpace> {
    return this.http.put<ApiResponse<CoworkingSpace>>(`${this.apiUrl}/${id}`, updatedSpace).pipe(
      map(response => response.data) // ✅ Extract updated space
    );
  }
  
  deleteSpace(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
}
