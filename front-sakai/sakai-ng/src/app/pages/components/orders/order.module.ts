import { NgModule } from '@angular/core';
import { SharedCommonModule } from '../../../core/common/sharedModule.module';
import { OrdersComponent } from './orders.component';
import { OrdersRoutingModule } from './order-routing.module';

@NgModule({
    declarations: [OrdersComponent],
    imports: [
    OrdersRoutingModule,
    SharedCommonModule],
    providers: [],

    exports: [OrdersComponent] 
  })
  export class OrdersModule {}
