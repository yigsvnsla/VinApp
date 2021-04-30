import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { NgModule } from "@angular/core";
import { ManualPagePageRoutingModule } from "./manual-page-routing.module";
import { ManualPagePage } from "./manual-page.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManualPagePageRoutingModule,
  ],
  declarations: [ManualPagePage],
})
export class ManualPagePageModule {}
