import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { NgModule } from "@angular/core";

import { AreaComponentsPageRoutingModule } from "./area-components-routing.module";
import { AreaComponentsPage } from "./area-components.page";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AreaComponentsPageRoutingModule,
  ],
  declarations: [AreaComponentsPage],
})
export class AreaComponentsPageModule {}
