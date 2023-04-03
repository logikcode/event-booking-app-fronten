import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'removeUnderscores'
})
export class RemoveUnderscoresPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value ? value.replace(/_/g, ' ') : value;
  }

}
