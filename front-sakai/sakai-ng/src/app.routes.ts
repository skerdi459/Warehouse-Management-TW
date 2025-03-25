import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { LoginComponent } from './app/core/login.component';
import { AuthGuard } from './app/core/auth/helper/AuthGuard.guard';
import { Role } from './app/core/models/models';


export const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: '',
        component: AppLayout,
        children: [
            {
                path: '',
                redirectTo: 'orders', 
                pathMatch: 'full'
            },
            {
                path: 'users',
                loadChildren: () => import('./app/pages/components/user-managment/user-managment.module').then(m => m.UserManagmentModule),
                canActivate: [AuthGuard], 
                data: { roles: [Role.SYSTEM_ADMIN,Role.WAREHOUSE_MANAGER] }

            },
            {
                path: 'items',
                loadChildren: () => import('./app/pages/components/items/item.module').then(m => m.ItemsModule),
                canActivate: [AuthGuard], 
                data: { roles: [Role.SYSTEM_ADMIN,Role.WAREHOUSE_MANAGER] }

            },
            {
                path: 'trucks',
                loadChildren: () => import('./app/pages/components/trucks/truck.module').then(m => m.TurcksModule),
                canActivate: [AuthGuard],
                data: { roles: [Role.SYSTEM_ADMIN,Role.WAREHOUSE_MANAGER] }
            },
            {
                path: 'orders',
                loadChildren: () => import('./app/pages/components/orders/order.module').then(m => m.OrdersModule),
                canActivate: [AuthGuard],
                data: { roles: [Role.SYSTEM_ADMIN,Role.WAREHOUSE_MANAGER,Role.CLIENT] }

            },
            {
                path: 'delivery',
                loadChildren: () => import('./app/pages/components/shcedule/schedule.module').then(m => m.ScheduleModule),
                canActivate: [AuthGuard],
                data: { roles: [Role.SYSTEM_ADMIN,Role.WAREHOUSE_MANAGER] }

            }
        ]
    },

    { path: '**', redirectTo: 'login' }
];
