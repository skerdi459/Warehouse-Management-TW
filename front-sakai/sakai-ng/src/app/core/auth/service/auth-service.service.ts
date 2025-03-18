import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "../../models/models";
import { TokenStorageService } from "./token-storage.service";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

const FLEET = 'http://localhost:8081/task/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,
    private token:TokenStorageService,
    private router:Router) { }

    login(credentials:any): Observable<any> {
        return this.http.post(FLEET + 'signIn', {
          username: credentials.username,
          password: credentials.password
        }, httpOptions);
      }
  }
