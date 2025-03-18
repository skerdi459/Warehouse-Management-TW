import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { Role } from '../../core/models/models';
import { TokenStorageService } from '../../core/auth/service/token-storage.service';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];
    constructor(private authService: TokenStorageService) {}

    private get userRoles(){
       return this.authService.getUser()?.roles
    }

    ngOnInit() {
        this.model = [
            {
                items: [{ label: 'User Management', icon: 'pi pi-user', routerLink: ['/users'], roles: [Role.SYSTEM_ADMIN] }]
            },
            {
                items: [{ label: 'Items', icon: 'pi pi-objects-column pi-objects-column', routerLink: ['/items'] , roles: [Role.SYSTEM_ADMIN,Role.WAREHOUSE_MANAGER]}]
            },
            {
                items: [{ label: 'Truck', icon: 'pi pi-truck pi-truck', routerLink: ['/trucks'], roles: [Role.SYSTEM_ADMIN,Role.WAREHOUSE_MANAGER]}]
            },
            {
                items: [{ label: 'Orders', icon: 'pi pi-box pi-box', routerLink: ['/orders'], roles: [Role.SYSTEM_ADMIN,Role.WAREHOUSE_MANAGER,Role.CLIENT] }]
            },
            {
                items: [{ label: 'Delivery', icon: 'pi pi-calendar-clock pi-calendar-clock', routerLink: ['/delivery'], roles: [Role.SYSTEM_ADMIN,Role.WAREHOUSE_MANAGER] }]
            }
           
        ];
        this.model = this.model.map(group => ({
            ...group, 
            items: group.items?.filter(item => 
                !item.roles || item.roles.some(role => this.userRoles?.includes(role))
            )
        }));
        

        console.log(this.model);
        
    }
}
