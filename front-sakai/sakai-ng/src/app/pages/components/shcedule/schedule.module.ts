import { NgModule } from '@angular/core';
import { SharedCommonModule } from '../../../core/common/sharedModule.module';
import { ScheduleComponent } from './schedule.component';
import { ScheduleRoutingModule } from './schedule-routing.module';
import { OrdersComponent } from '../orders/orders.component';
import { OrderIdsPipe } from "../../../core/pipes/orderIds.pipe";

@NgModule({
    declarations: [ScheduleComponent],
    imports: [
    ScheduleRoutingModule,
    SharedCommonModule,
    OrderIdsPipe
],
    providers: [],

    exports: [] 
  })
  export class ScheduleModule {}
