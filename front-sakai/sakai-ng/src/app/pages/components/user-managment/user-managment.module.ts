import { NgModule } from '@angular/core';
import { UserManagmentComponent } from './user-managment.component';
import { UserManagmentRoutingModule } from './user-managment-routing.module';
import { SharedCommonModule } from '../../../core/common/sharedModule.module';

@NgModule({
    declarations: [UserManagmentComponent],
    imports: [
    UserManagmentRoutingModule,
    SharedCommonModule
],
    providers: [],

    exports: [] 
  })
  export class UserManagmentModule {}
