import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { NgModule } from "@angular/core";

import { ManualPagePageRoutingModule } from "./manual-page-routing.module";
import { ModalPageModule } from "../../component/modal/modal.module";
import { ManualPagePage } from "./manual-page.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManualPagePageRoutingModule,
    ModalPageModule,
  ],
  declarations: [ManualPagePage],
  entryComponents: [ModalPageModule],
})
export class ManualPagePageModule {}
