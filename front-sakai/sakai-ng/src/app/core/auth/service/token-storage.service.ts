import { Injectable } from '@angular/core';
import { Role, User } from '../../models/models';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
    providedIn: 'root'
})
export class TokenStorageService {

    constructor() { }

    public signOut(): void {
        window.sessionStorage.clear();
    }

    public saveToken(token: string): void {        
        window.sessionStorage.removeItem(TOKEN_KEY);
        window.sessionStorage.setItem(TOKEN_KEY, token);
    }

    public getToken(): string {
        return sessionStorage.getItem(TOKEN_KEY) || "null";

    }

    public saveUser(user: User): void {
        window.sessionStorage.removeItem(USER_KEY);
        window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    public getUser(): User | null {
        const userStr = window.sessionStorage.getItem(USER_KEY);
        if (userStr) {
            return JSON.parse(userStr) as User; 
        }
        return null; 
    }
    
    public hasRole(role: Role): boolean {
        const userStr =this.getUser()
        return !!userStr?.roles.includes(role);
      }
    

    public isLoggedIn(): boolean {
        return !!sessionStorage.getItem(TOKEN_KEY);  
      }
}