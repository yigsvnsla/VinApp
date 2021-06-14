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
    if(text.split(" ").length > 1){
      let values = text.split(" ");
      return this.recursiveFilter(array, values);
    }else{
      return array.filter((item) => {
        return item.name.toLowerCase().includes(text);
      });
    }
  }

  recursiveFilter(arr: any[], text: any[]): any[]{
    let array = arr.filter((item)=>{
      return item.name.toLowerCase().includes(text[0]);
    })
    text.forEach(e => {
      array = array.filter((item)=>{
      return item.name.toLowerCase().includes(e);
      })
    });
    return array;
  }
}
