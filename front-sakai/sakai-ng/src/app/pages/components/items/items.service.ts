import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Item, Page, User, commonFilter } from "../../../core/models/models";
import { Observable } from "rxjs";
import { HolderAPI } from "../../service/api-holder";
import { MessageService } from "primeng/api";
import { defaultCatchError } from "../../../core/auth/helper/default-catch-error";

@Injectable({
    providedIn: "root",
})
export class ItemsService {
    API_URL: any="http://localhost:8081";

    constructor(
        private http: HttpClient,
        private toast: MessageService,

    ) {
    }

    save(payload: Item): Observable<Item> {
        return this.http
            .post<Item>(`${this.API_URL}${HolderAPI.ITEM_CREATE}`, payload)
            .pipe(defaultCatchError(this.toast));

    }

    update(id:number,payload: Item): Observable<Item> {
        return this.http
            .put<Item>(`${this.API_URL}${HolderAPI.ITEM_EDIT}`.replace("{id}", encodeURIComponent(id)), payload)
            .pipe(defaultCatchError(this.toast));

    }

    softDelete(id: number): Observable<boolean> {
        return this.http
            .put<boolean>(`${this.API_URL}${HolderAPI.ITEM_DELETE}`.replace("{id}", encodeURIComponent(id)),{})
                        .pipe(defaultCatchError(this.toast));

    }

    getItemPaginated(userFltr: commonFilter): Observable<Page<Item>> {
        const params = this.generateParams(userFltr);
        return this.http.get<Page<Item>>(`${this.API_URL}${HolderAPI.ITEM_FIND}`, { params })
        .pipe(defaultCatchError(this.toast));
        
    }

    private generateParams(filters :commonFilter):HttpParams{
        let params = new HttpParams();
        params = params
            .set("page", 0)
            .set("size", filters.size)
            .set("lifeCycle", "READY")
            return params;
    }
   

}