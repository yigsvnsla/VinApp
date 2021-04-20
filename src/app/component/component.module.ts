import { UiComponentsService } from './../services/ui-components.service';
import { PipesModule } from "./../pipes/pipes.module";
import { IonicModule } from "@ionic/angular";
import { NgModule } from "@angular/core";
import { CommonModule, CurrencyPipe } from "@angular/common";
import { ListPartComponent } from "./list-part/list-part.component";
import { DinamicModalComponent } from "./dinamic-modal/dinamic-modal.component";
import { MenuHomeComponent } from "./menu-home/menu-home.component";
@NgModule({
  declarations: [
    DinamicModalComponent,
    ListPartComponent,
    MenuHomeComponent
  ],
  exports: [DinamicModalComponent, ListPartComponent,MenuHomeComponent],
  imports: [CommonModule, IonicModule, PipesModule],
  providers:[CurrencyPipe,UiComponentsService]
})
export class ComponentModule {}
