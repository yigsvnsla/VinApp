import { PipesModule } from "./../pipes/pipes.module";
import { IonicModule } from "@ionic/angular";
import { NgModule } from "@angular/core";
import { CommonModule, CurrencyPipe } from "@angular/common";
import { ListPartComponent } from "./list-part/list-part.component";
import { DinamicModalComponent } from "./dinamic-modal/dinamic-modal.component";
@NgModule({
  declarations: [
    DinamicModalComponent,
    ListPartComponent,
  ],
  exports: [DinamicModalComponent, ListPartComponent],
  imports: [CommonModule, IonicModule, PipesModule],
  providers:[CurrencyPipe]
})
export class ComponentModule {}
