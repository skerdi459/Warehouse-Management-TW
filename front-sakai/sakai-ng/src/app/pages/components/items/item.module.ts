import { NgModule } from '@angular/core';
import { SharedCommonModule } from '../../../core/common/sharedModule.module';
import { ItemsRoutingModule } from './item-routing.module';
import { ItemsComponent } from './item.component';

@NgModule({
    declarations: [ItemsComponent],
    imports: [
    ItemsRoutingModule,
    SharedCommonModule
],
    providers: [],

    exports: [] 
  })
  export class ItemsModule {}
