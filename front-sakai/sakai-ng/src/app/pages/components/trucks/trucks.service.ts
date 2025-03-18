import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LifeCycle, Page, Truck, User, commonFilter } from "../../../core/models/models";
import { Observable } from "rxjs";
import { HolderAPI } from "../../service/api-holder";
import { defaultCatchError } from "../../../core/auth/helper/default-catch-error";
import { MessageService } from "primeng/api";

@Injectable({
    providedIn: "root",
})
export class TrucksService {
    API_URL: any="http://localhost:8081";

    constructor(
        private http: HttpClient,
        private toast: MessageService
    ) {
    }

    save(payload: Truck): Observable<Truck> {
        return this.http
            .post<Truck>(`${this.API_URL}${HolderAPI.TRUCK_CREATE}`, payload)
            .pipe(defaultCatchError(this.toast));
    }

    update(id:number,payload: Truck): Observable<Truck> {
        return this.http
            .put<Truck>(`${this.API_URL}${HolderAPI.TRUCK_EDIT}`.replace("{id}", encodeURIComponent(id)), payload)
            .pipe(defaultCatchError(this.toast));
        }

    softDelete(id: number): Observable<boolean> {
        return this.http
            .delete<boolean>(`${this.API_URL}${HolderAPI.TRUCK_DELETE}`.replace("{id}", encodeURIComponent(id)))
            .pipe(defaultCatchError(this.toast));

        }

    getItemPaginated(userFltr: commonFilter): Observable<Page<Truck>> {        
        const param = this.generateParams(userFltr);
        return this.http.post<Page<Truck>>(`${this.API_URL}${HolderAPI.TRUCK_FIND}`,  param )
            .pipe(defaultCatchError(this.toast));
    }

    private generateParams(filters: commonFilter): any {
        let objectFilter: any = {
            page: filters.page,
            size: filters.size || 10,
        };
    
        if (filters.filters.freeSpace) {
            objectFilter['freeSpace'] = filters.filters.freeSpace
        }
    
            objectFilter['lifeCycle'] = LifeCycle.READY
        
    
        return objectFilter;
    }
   

}