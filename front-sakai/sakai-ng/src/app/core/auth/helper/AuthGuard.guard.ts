import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenStorageService } from '../service/token-storage.service';
import { Role } from '../../models/models';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: TokenStorageService, private router: Router) {}


  canActivate(route: any): boolean {
    const user = this.authService.getUser();
    const expectedRoles = route.data.roles || [];
    const found =expectedRoles.some((r: Role)=> user?.roles.includes(r))
    if (user && found) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}