// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  active: boolean;
  companyId?: number;
  coworkingSpaceId?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// export interface RegisterSpaceOwnerRequest {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
// }

export interface RegisterSpaceOwnerRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  spaceName: string;
  spaceAddress: string;
  spaceContactEmail: string;
  spaceContactPhone: string;
  spaceDescription: string;
}

export interface RegisterCompanyRequest {
  companyName: string;
  address: string;
  email: string;
  phone: string;
  description: string;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  password: string;
}

export interface AddEmployeeRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  department: string;
}

export interface EmployeeCredentials {
  username: string;
  email:string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private authTokenKey = 'auth_token';
  private userDataKey = 'user_data';
  private credentialsKey = 'credentials';
  
  // Check if running in browser environment
  private get isBrowser(): boolean {
    return typeof window !== 'undefined';
  }
  
  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }
  
  // Get current authenticated user
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
  
  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getCurrentUser() && !!this.getAuthToken();
  }
  
  // Check if user has specific role
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return !!user && user.roles.includes(role);
  }
  
  // Login user
  login(email: string, password: string): Observable<User> {
    // Store credentials for future API calls
    const credentials = { email, password };
    this.setCredentials(credentials);
    
    // Create auth token
    const authToken = btoa(`${email}:${password}`);
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authToken}`
      })
    };
    
    // First authenticate using credentials
    return this.http.post<ApiResponse<User>>(`${this.baseUrl}/auth/login`, { email, password }, httpOptions)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            // Store auth token and user data
            this.setAuthToken(authToken);
            this.setUserData(response.data);
            this.currentUserSubject.next(response.data);
            return response.data;
          } else {
            throw new Error(response.message || 'Login failed');
          }
        }),
        catchError(error => {
          this.clearAuthData();
          return throwError(() => error);
        })
      );
  }
  
  // Register space owner
  registerSpaceOwner(data: RegisterSpaceOwnerRequest): Observable<User> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/auth/register/space-owner`, data)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          } else {
            throw new Error(response.message || 'Registration failed');
          }
        }),
        catchError(error => throwError(() => error))
      );
  }
  
  // Register company
  registerCompany(data: RegisterCompanyRequest): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/auth/register/company`, data)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          } else {
            throw new Error(response.message || 'Registration failed');
          }
        }),
        catchError(error => throwError(() => error))
      );
  }
  
  // Add employee (requires company admin authentication)
  addEmployee(companyId: number, data: AddEmployeeRequest): Observable<EmployeeCredentials> {
    return this.http.post<ApiResponse<EmployeeCredentials>>(
      `${this.baseUrl}/auth/company/${companyId}/add-employee`, 
      data, 
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        } else {
          throw new Error(response.message || 'Failed to add employee');
        }
      }),
      catchError(error => throwError(() => error))
    );
  }
  
  // Get current user details
  getCurrentUserDetails(): Observable<User> {
    return this.http.get<ApiResponse<User>>(
      `${this.baseUrl}/auth/current-user`, 
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => {
        if (response.success && response.data) {
          // Update local user data
          this.setUserData(response.data);
          this.currentUserSubject.next(response.data);
          return response.data;
        } else {
          throw new Error(response.message || 'Failed to get user details');
        }
      }),
      catchError(error => {
        // If authentication error, try re-authenticating with stored credentials
        if (error.status === 401 || error.status === 403) {
          const credentials = this.getCredentials();
          if (credentials) {
            return this.refreshAuthentication(credentials.email, credentials.password)
              .pipe(
                map(() => this.getCurrentUser()!)
              );
          }
        }
        return throwError(() => error);
      })
    );
  }
  
  // Refresh authentication using stored credentials
  private refreshAuthentication(email: string, password: string): Observable<User> {
    // Create new auth token
    const authToken = btoa(`${email}:${password}`);
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authToken}`
      })
    };
    
    return this.http.post<ApiResponse<User>>(`${this.baseUrl}/api/auth/login`, { email, password }, httpOptions)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            // Store auth token and user data
            this.setAuthToken(authToken);
            this.setUserData(response.data);
            this.currentUserSubject.next(response.data);
            return response.data;
          } else {
            throw new Error(response.message || 'Authentication refresh failed');
          }
        }),
        catchError(error => {
          this.clearAuthData();
          this.router.navigate(['/auth/login']);
          return throwError(() => error);
        })
      );
  }
  
  // Logout user
  logout(): void {
    this.clearAuthData();
    this.router.navigate(['/']);
  }
  
  // Get HTTP headers with authorization
  getAuthHeaders(): HttpHeaders {
    const token = this.getAuthToken();
    if (token) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Basic ${token}`
      });
    }
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }
  
  // Set auth token in localStorage
  private setAuthToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem(this.authTokenKey, token);
    }
  }
  
  // Get auth token from localStorage
  getAuthToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(this.authTokenKey);
    }
    return null;
  }
  
  // Set user data in localStorage
  private setUserData(user: User): void {
    if (this.isBrowser) {
      localStorage.setItem(this.userDataKey, JSON.stringify(user));
    }
  }
  
  // Set credentials in localStorage (for refreshing auth)
  private setCredentials(credentials: { email: string, password: string }): void {
    if (this.isBrowser) {
      localStorage.setItem(this.credentialsKey, JSON.stringify(credentials));
    }
  }
  
  // Get credentials from localStorage
  private getCredentials(): { email: string, password: string } | null {
    if (this.isBrowser) {
      const credentialsString = localStorage.getItem(this.credentialsKey);
      if (credentialsString) {
        try {
          return JSON.parse(credentialsString);
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  }
  
  // Load user from localStorage
  private loadUserFromStorage(): void {
    if (this.isBrowser) {
      try {
        const userData = localStorage.getItem(this.userDataKey);
        if (userData) {
          const user = JSON.parse(userData) as User;
          this.currentUserSubject.next(user);
        }
      } catch (error) {
        console.error('Failed to load user data from localStorage', error);
        this.clearAuthData();
      }
    }
  }
  
  // Clear auth data from localStorage
  private clearAuthData(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.authTokenKey);
      localStorage.removeItem(this.userDataKey);
      localStorage.removeItem(this.credentialsKey);
    }
    this.currentUserSubject.next(null);
  }
}

// export interface User {
//   id: number;
//   firstName: string;
//   lastName: string;
//   email: string;
//   roles: string[];
//   active: boolean;
//   companyId?: number;
// }

// export interface ApiResponse<T> {
//   success: boolean;
//   message: string;
//   data: T;
// }

// export interface LoginRequest {
//   email: string;
//   password: string;
// }

// export interface RegisterSpaceOwnerRequest {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
// }

// export interface RegisterCompanyRequest {
//   companyName: string;
//   address: string;
//   email: string;
//   phone: string;
//   description: string;
//   adminFirstName: string;
//   adminLastName: string;
//   adminEmail: string;
//   password: string;
// }

// export interface AddEmployeeRequest {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string;
//   jobTitle: string;
//   department: string;
// }

// export interface EmployeeCredentials {
//   username: string;
//   password: string;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private baseUrl = environment.apiUrl;
//   private currentUserSubject = new BehaviorSubject<User | null>(null);
//   public currentUser$ = this.currentUserSubject.asObservable();
  
//   private authTokenKey = 'auth_token';
//   private userDataKey = 'user_data';
  
//   // Check if running in browser environment
//   private get isBrowser(): boolean {
//     return typeof window !== 'undefined';
//   }
  
//   constructor(
//     private http: HttpClient,
//     private router: Router
//   ) {
//     this.loadUserFromStorage();
//   }
  
//   // Get current authenticated user
//   getCurrentUser(): User | null {
//     return this.currentUserSubject.value;
//   }
  
//   // Check if user is authenticated
//   isAuthenticated(): boolean {
//     return !!this.getCurrentUser() && !!this.getAuthToken();
//   }
  
//   // Check if user has specific role
//   hasRole(role: string): boolean {
//     const user = this.getCurrentUser();
//     return !!user && user.roles.includes(role);
//   }
  
//   // Login user
//   login(email: string, password: string): Observable<User> {
//     // Create auth token
//     const authToken = btoa(`${email}:${password}`);
    
//     const httpOptions = {
//       headers: new HttpHeaders({
//         'Content-Type': 'application/json',
//         'Authorization': `Basic ${authToken}`
//       })
//     };
    
//     return this.http.post<ApiResponse<User>>(`${this.baseUrl}/api/auth/login`, { email, password }, httpOptions)
//       .pipe(
//         map(response => {
//           if (response.success && response.data) {
//             // Store auth token and user data
//             this.setAuthToken(authToken);
//             this.setUserData(response.data);
//             this.currentUserSubject.next(response.data);
//             return response.data;
//           } else {
//             throw new Error(response.message || 'Login failed');
//           }
//         }),
//         catchError(error => {
//           this.clearAuthData();
//           return throwError(() => error);
//         })
//       );
//   }
  
//   // Register space owner
//   registerSpaceOwner(data: RegisterSpaceOwnerRequest): Observable<User> {
//     return this.http.post<ApiResponse<User>>(`${this.baseUrl}/api/auth/register/space-owner`, data)
//       .pipe(
//         map(response => {
//           if (response.success && response.data) {
//             return response.data;
//           } else {
//             throw new Error(response.message || 'Registration failed');
//           }
//         }),
//         catchError(error => throwError(() => error))
//       );
//   }
  
//   // Register company
//   registerCompany(data: RegisterCompanyRequest): Observable<any> {
//     return this.http.post<ApiResponse<any>>(`${this.baseUrl}/api/auth/register/company`, data)
//       .pipe(
//         map(response => {
//           if (response.success && response.data) {
//             return response.data;
//           } else {
//             throw new Error(response.message || 'Registration failed');
//           }
//         }),
//         catchError(error => throwError(() => error))
//       );
//   }
  
//   // Add employee (requires company admin authentication)
//   addEmployee(companyId: number, data: AddEmployeeRequest): Observable<EmployeeCredentials> {
//     const httpOptions = {
//       headers: new HttpHeaders({
//         'Content-Type': 'application/json',
//         'Authorization': `Basic ${this.getAuthToken()}`
//       })
//     };
    
//     return this.http.post<ApiResponse<EmployeeCredentials>>(
//       `${this.baseUrl}/api/auth/company/${companyId}/add-employee`, 
//       data, 
//       httpOptions
//     ).pipe(
//       map(response => {
//         if (response.success && response.data) {
//           return response.data;
//         } else {
//           throw new Error(response.message || 'Failed to add employee');
//         }
//       }),
//       catchError(error => throwError(() => error))
//     );
//   }
  
//   // Get current user details
//   getCurrentUserDetails(): Observable<User> {
//     const httpOptions = {
//       headers: new HttpHeaders({
//         'Authorization': `Basic ${this.getAuthToken()}`
//       })
//     };
    
//     return this.http.get<ApiResponse<User>>(`${this.baseUrl}/api/auth/current-user`, httpOptions)
//       .pipe(
//         map(response => {
//           if (response.success && response.data) {
//             // Update local user data
//             this.setUserData(response.data);
//             this.currentUserSubject.next(response.data);
//             return response.data;
//           } else {
//             throw new Error(response.message || 'Failed to get user details');
//           }
//         }),
//         catchError(error => throwError(() => error))
//       );
//   }
  
//   // Logout user
//   logout(): void {
//     // Call logout endpoint if needed
//     // this.http.get(`${this.baseUrl}/api/auth/logout`);
    
//     this.clearAuthData();
//     this.router.navigate(['/']);
//   }
  
//   // Get HTTP headers with authorization
//   getAuthHeaders(): HttpHeaders {
//     const token = this.getAuthToken();
//     if (token) {
//       return new HttpHeaders({
//         'Content-Type': 'application/json',
//         'Authorization': `Basic ${token}`
//       });
//     }
//     return new HttpHeaders({
//       'Content-Type': 'application/json'
//     });
//   }
  
//   // Set auth token in localStorage
//   private setAuthToken(token: string): void {
//     if (this.isBrowser) {
//       localStorage.setItem(this.authTokenKey, token);
//     }
//   }
  
//   // Get auth token from localStorage
//   getAuthToken(): string | null {
//     if (this.isBrowser) {
//       return localStorage.getItem(this.authTokenKey);
//     }
//     return null;
//   }
  
//   // Set user data in localStorage
//   private setUserData(user: User): void {
//     if (this.isBrowser) {
//       localStorage.setItem(this.userDataKey, JSON.stringify(user));
//     }
//   }
  
//   // Load user from localStorage
//   private loadUserFromStorage(): void {
//     if (this.isBrowser) {
//       try {
//         const userData = localStorage.getItem(this.userDataKey);
//         if (userData) {
//           const user = JSON.parse(userData) as User;
//           this.currentUserSubject.next(user);
//         }
//       } catch (error) {
//         console.error('Failed to load user data from localStorage', error);
//         this.clearAuthData();
//       }
//     }
//   }
  
//   // Clear auth data from localStorage
//   private clearAuthData(): void {
//     if (this.isBrowser) {
//       localStorage.removeItem(this.authTokenKey);
//       localStorage.removeItem(this.userDataKey);
//     }
//     this.currentUserSubject.next(null);
//   }
// }



