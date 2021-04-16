import { Pipe, PipeTransform } from '@angular/core';
import { CorePart } from '../services/temp.service';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {
  transform(array: CorePart[], text: string): any[] {
    if (text === "") {
      return array;
    }
    text = text.toLowerCase();
    return array.filter((item) => {
      return item.part.toLowerCase().includes(text) || item.category.toLowerCase().includes(text);
    });
  }

}
