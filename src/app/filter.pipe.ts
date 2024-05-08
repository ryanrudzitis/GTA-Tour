import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], excluded: any): any[] {
    if (!items) return [];
    if (!excluded) return items;
    return items.filter(item => item.id !== excluded);
  }

}
