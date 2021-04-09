import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CameraUnitPageRoutingModule } from './camera-unit-routing.module';

import { CameraUnitPage } from './camera-unit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CameraUnitPageRoutingModule
  ],
  declarations: [CameraUnitPage],
  providers: [CurrencyPipe]
})
export class CameraUnitPageModule {}
