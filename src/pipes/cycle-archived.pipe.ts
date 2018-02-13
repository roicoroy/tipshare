import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'archivedItems'
})
export class CycleArchivedPipe implements PipeTransform {
  transform(items: Array<any>): Array<any> {
      if(items == null) {
        return [];
      }

      return _.filter(items, {archived: true});

  }
}
