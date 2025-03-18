import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Page, User, commonFilter } from "../../../core/models/models";
import { Observable } from "rxjs";
import { HolderAPI } from "../../service/api-holder";
import { defaultCatchError } from "../../../core/auth/helper/default-catch-error";
import { MessageService } from "primeng/api";

@Injectable({
    providedIn: "root",
})
export class UserManagmentService {
    API_URL: any="http://localhost:8081";
    constructor(
        private http: HttpClient,
        private toast:MessageService
    ) {
    }

    save(payload: User): Observable<User> {
        return this.http
            .post<User>(`${this.API_URL}${HolderAPI.USER_CREATE}`, payload)
            .pipe(defaultCatchError(this.toast));

    }

    update(id:number,payload: any): Observable<User> {
        return this.http
            .put<User>(`${this.API_URL}${HolderAPI.USER_EDIT}`.replace("{id}", encodeURIComponent(id)), payload)
            .pipe(defaultCatchError(this.toast));

    }

    softDeleteUser(id: number): Observable<boolean> {
        return this.http
            .delete<boolean>(`${this.API_URL}${HolderAPI.USER_DELETE}`.replace("{id}", encodeURIComponent(id)))
            .pipe(defaultCatchError(this.toast));
    }

    getUsersPaginated(userFltr: commonFilter): Observable<Page<User>> {
        const params = this.generateParams(userFltr);
        return this.http.get<Page<User>>(`${this.API_URL}${HolderAPI.USER_FIND}`, { params })
        .pipe(defaultCatchError(this.toast));
        
    }

    private generateParams(userFltr :commonFilter):HttpParams{
        let params = new HttpParams();
        params = params
            .set("page", userFltr.page)
            .set("size", userFltr.size)
            .set("lifeCycle", "READY")
            return params;
    }
   

}