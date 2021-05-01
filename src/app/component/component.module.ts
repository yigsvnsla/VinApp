import { ModalPage } from 'src/app/component/modal/modal.page';
import { ListComponent } from './list/list.component';
import { UiComponentsService } from './../services/ui-components.service';
import { PipesModule } from "./../pipes/pipes.module";
import { IonicModule } from "@ionic/angular";
import { NgModule } from "@angular/core";
import { CommonModule, CurrencyPipe } from "@angular/common";
import { DinamicModalComponent } from "./dinamic-modal/dinamic-modal.component";
import { MenuHomeComponent } from "./menu-home/menu-home.component";
@NgModule({
  declarations: [
    DinamicModalComponent,
    MenuHomeComponent,
    ListComponent,
    ModalPage
  ],
  exports: [
    DinamicModalComponent,
    MenuHomeComponent,
    ListComponent,
    ModalPage
  ],
  imports: [CommonModule, IonicModule, PipesModule],
  providers:[CurrencyPipe,UiComponentsService]
})
export class ComponentModule {}
