import { NgModule } from '@angular/core';
import { SharedCommonModule } from '../../../core/common/sharedModule.module';
import { TruckRoutingModule } from './truck-routing.module';
import { TrucksComponent } from './truck.component';

@NgModule({
    declarations: [TrucksComponent],
    imports: [
    TruckRoutingModule,
    SharedCommonModule
],
    providers: [],

    exports: [TrucksComponent] 
  })
  export class TurcksModule {}
