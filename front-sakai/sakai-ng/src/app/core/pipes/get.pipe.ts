import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { get } from 'lodash';

@Pipe({
    name: 'get',
    standalone:false
})

export class GetPipe implements PipeTransform {
    transform(object: Object, path: Array<string> | string): any {
        return get(object, path);
    }
}

@NgModule({
    declarations: [GetPipe],
    exports     : [GetPipe]
})
export class GetPipeModule {}
