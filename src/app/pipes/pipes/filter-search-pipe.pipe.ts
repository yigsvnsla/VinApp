import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "filterSearchPipe",
})
export class FilterSearchPipe implements PipeTransform {
  transform(array: any[], text: string): any[] {
    //  console.log('pipe:',array);
    if (text === "") {
      return array;
    }
    text = text.toLowerCase();
    return array.filter((item) => {
      return item.name.toLowerCase().includes(text);
    });
  }
}
