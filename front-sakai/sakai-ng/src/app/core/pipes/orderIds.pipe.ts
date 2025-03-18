import { Pipe, PipeTransform } from '@angular/core';
import { Schedule } from '../models/models';

@Pipe({
  name: 'orderIds',
})
export class OrderIdsPipe implements PipeTransform {
  transform(schedule: Schedule): string {
    if (schedule?.orders) {
      return schedule.orders.map(order => order.orderNumber).join(', ');
    }
    return '';
  }
}