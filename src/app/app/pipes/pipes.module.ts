import { NgModule } from "@angular/core";
import { FilterSearchPipe } from "./pipes/filter-search-pipe.pipe";

@NgModule({
  declarations: [FilterSearchPipe],
  exports: [FilterSearchPipe],
})
export class PipesModule {}
