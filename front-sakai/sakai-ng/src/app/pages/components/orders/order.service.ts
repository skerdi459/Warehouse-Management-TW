import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Item, Order, Page, User, commonFilter } from "../../../core/models/models";
import { Observable } from "rxjs";
import { HolderAPI } from "../../service/api-holder";
import { defaultCatchError } from "../../../core/auth/helper/default-catch-error";
import { MessageService } from "primeng/api";

@Injectable({
    providedIn: "root",
})
export class OrderService {
    API_URL: any="http://localhost:8081";

    constructor(
        private http: HttpClient,
        private toast:MessageService
    ) {
    }

    save(payload: Order): Observable<Order> {
        return this.http
            .post<Order>(`${this.API_URL}${HolderAPI.ORDER_CREATE}`, payload)
            .pipe(defaultCatchError(this.toast));

    }

    update(payload: Order): Observable<Order> {
        return this.http
        .put<Order>(`${this.API_URL}${HolderAPI.ORDER_EDIT}`, payload)
        .pipe(defaultCatchError(this.toast));

    }

    softDelete(id: number): Observable<boolean> {
        return this.http
            .delete<boolean>(`${this.API_URL}${HolderAPI.ITEM_DELETE}`.replace("{id}", encodeURIComponent(id)))
            .pipe(defaultCatchError(this.toast));

    }

    submitOrder(id: number): Observable<Order> {
        return this.http
            .put<Order>(`${this.API_URL}${HolderAPI.ORDER_SUBMIT}`.replace("{orderNumber}", encodeURIComponent(id)),{})
            .pipe(defaultCatchError(this.toast));

    }

    approveOrder(id: number): Observable<Order> {
        return this.http
            .put<Order>(`${this.API_URL}${HolderAPI.ORDER_APPROVE}`.replace("{orderNumber}", encodeURIComponent(id)),{})
            .pipe(defaultCatchError(this.toast));

    }

    cancelOrder(id: number): Observable<Order> {
        return this.http
            .put<Order>(`${this.API_URL}${HolderAPI.ORDER_CANCEL}`.replace("{orderNumber}", encodeURIComponent(id)),{})
            .pipe(defaultCatchError(this.toast));

    }

    declineOrder(id: number, message: string): Observable<Order> {
        const url = `${this.API_URL}${HolderAPI.ORDER_DECLINE}`.replace("{orderNumber}", encodeURIComponent(id));
        return this.http.put<Order>(url, message )
        .pipe(defaultCatchError(this.toast));
        
    }

    getItemPaginated(userFltr: commonFilter): Observable<Page<Order>> {
        const params = this.generateParams(userFltr);
        return this.http.get<Page<Order>>(`${this.API_URL}${HolderAPI.ORDER_FIND}`, { params })
        .pipe(defaultCatchError(this.toast));
        
    }

    findAllItems():Observable<Item[]>{
        return this.http.get<Item[]>(`${this.API_URL}${HolderAPI.ITEM_FINDALL}`)
        .pipe(defaultCatchError(this.toast));
        ;
    }

    findAllOrderByStatusAndDate(date: string): Observable<Order[]> {
        return this.http
            .get<Order[]>(`${this.API_URL}${HolderAPI.ORDER_FINDBY_DATE_STATUS}`.replace("{date}", encodeURIComponent(date)))
            .pipe(defaultCatchError(this.toast));

    }  
  

    private generateParams(filters: commonFilter): any {
        let objectFilter: any = {
            page: filters.page,
            size: filters.size || 10,
        };
    
        if (filters.filters.status) {
            objectFilter['orderStatus'] = filters.filters.status
        }
    
        if (filters.filters.date) {
            objectFilter['date'] = filters.filters.date
        }
    
        if (filters.filters.user) {
            objectFilter['user'] = filters.filters.user;
        }
    
        return objectFilter;
    }
   

}