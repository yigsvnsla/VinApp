import { NgModule } from "@angular/core";
import { FilterSearchPipe } from "./pipes/filter-search-pipe.pipe";
import { SearchPipe } from './search.pipe';

@NgModule({
  declarations: [FilterSearchPipe, SearchPipe],
  exports: [FilterSearchPipe, SearchPipe],
})
export class PipesModule {}
