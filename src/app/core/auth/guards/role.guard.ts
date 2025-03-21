// import { CanActivateFn } from '@angular/router';

// export const roleGuard: CanActivateFn = (route, state) => {
//   return true;
// };

// role.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const requiredRoles = route.data['roles'] as Array<string>;
    
    if (!requiredRoles || requiredRoles.length === 0) {
      // No role requirements, allow access
      return true;
    }
    
    // Check if user has any of the required roles
    const hasRole = requiredRoles.some(role => 
      this.authService.hasRole(role)
    );
    
    if (!hasRole) {
      // User doesn't have the required role, redirect to home
      this.router.navigate(['/']);
      return false;
    }
    
    return true;
  }
}