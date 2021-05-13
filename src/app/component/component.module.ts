import { ListPartComponent } from './list-part/list-part.component';
import { ViewPhotoComponent } from './view-photo/view-photo.component';
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
    ModalPage,
    ViewPhotoComponent,
    ListPartComponent
  ],
  exports: [
    DinamicModalComponent,
    MenuHomeComponent,
    ListComponent,
    ModalPage,
    ViewPhotoComponent,
    ListPartComponent
  ],
  imports: [CommonModule, IonicModule, PipesModule],
  providers:[CurrencyPipe,UiComponentsService]
})
export class ComponentModule {}
