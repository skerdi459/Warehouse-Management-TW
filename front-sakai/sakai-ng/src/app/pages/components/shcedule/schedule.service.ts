import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Item, Page, Schedule, ScheduleRequest, Truck, User, commonFilter } from "../../../core/models/models";
import { Observable } from "rxjs";
import { HolderAPI } from "../../service/api-holder";
import { MessageService } from "primeng/api";
import { defaultCatchError } from "../../../core/auth/helper/default-catch-error";

@Injectable({
    providedIn: "root",
})
export class ScheduleService {
    API_URL: any="http://localhost:8081";

    constructor(
        private http: HttpClient,
        private toast:MessageService
    ) {
    }

    save(payload: ScheduleRequest): Observable<Schedule> {
        return this.http
            .post<Schedule>(`${this.API_URL}${HolderAPI.SCHEDULE_CREATE}`, payload)
            .pipe(defaultCatchError(this.toast));

    }

    search(userFltr: commonFilter): Observable<Page<Schedule>> {
        const params = this.generateParams(userFltr);
        return this.http.get<Page<Schedule>>(`${this.API_URL}${HolderAPI.SCHEDULE_FIND}`, { params })
        .pipe(defaultCatchError(this.toast));

    }


    private generateParams(filters :commonFilter):HttpParams{
        let params = new HttpParams();
        params = params
            .set("page", filters.page)
            .set("size", filters.size)
            return params;
    }
}