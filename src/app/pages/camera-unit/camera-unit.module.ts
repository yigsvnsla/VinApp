import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CameraUnitPageRoutingModule } from './camera-unit-routing.module';

import { CameraUnitPage } from './camera-unit.page';
import { DragulaModule, DragulaService } from 'ng2-dragula';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CameraUnitPageRoutingModule,
    DragulaModule
  ],
  declarations: [CameraUnitPage],
  providers: [CurrencyPipe, DragulaService]
})
export class CameraUnitPageModule {}
