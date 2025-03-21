// import { HttpInterceptorFn } from '@angular/common/http';

// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   return next(req);
// };

import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Skip adding auth header for public endpoints
    if (request.url.includes('/api/auth/login') || 
        request.url.includes('/api/auth/register')) {
      return next.handle(request);
    }
    
    // Add authorization header if token exists
    const authToken = this.authService.getAuthToken();
    if (authToken) {
      request = this.addAuthHeader(request, authToken);
    }
    
    // Handle the request and catch potential errors
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 0) {
          // A client-side or network error occurred
          console.error('An error occurred:', error.error);
        } else if (error.status === 401) {
          // 401 Unauthorized - Authentication failed
          this.handleAuthError();
        } else if (error.status === 403) {
          // 403 Forbidden - User doesn't have required permissions
          this.router.navigate(['/']);
        } else if (error.status === 500) {
          // 500 Internal Server Error - could be due to authentication issues
          if (error.error && error.error.message && 
              error.error.message.includes('UserDetails.getUsername()')) {
            // Specific error case with UserDetails being null
            this.handleAuthError();
          }
        }
        
        return throwError(() => error);
      })
    );
  }
  
  private addAuthHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        'Authorization': `Basic ${token}`
      }
    });
  }
  
  private handleAuthError(): void {
    // Clear auth data and redirect to login
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {
  
//   constructor(
//     private authService: AuthService,
//     private router: Router
//   ) {}
  
//   intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
//     // Skip adding auth header for login and register endpoints
//     if (request.url.includes('/api/auth/login') || 
//         request.url.includes('/api/auth/register')) {
//       return next.handle(request);
//     }
    
//     const authToken = this.authService.getAuthToken();
    
//     if (authToken) {
//       // Clone the request and add the authorization header
//       const authReq = request.clone({
//         setHeaders: {
//           Authorization: `Basic ${authToken}`
//         }
//       });
      
//       // Handle the cloned request and catch potential auth errors
//       return next.handle(authReq).pipe(
//         catchError((error: HttpErrorResponse) => {
//           if (error.status === 401) {
//             // Unauthorized - Token expired or invalid
//             this.authService.logout();
//             this.router.navigate(['/auth/login']);
//           } else if (error.status === 403) {
//             // Forbidden - User doesn't have required permissions
//             this.router.navigate(['/']);
//           }
          
//           return throwError(() => error);
//         })
//       );
//     }
    
//     // If no token, just pass the original request
//     return next.handle(request);
//   }
// }