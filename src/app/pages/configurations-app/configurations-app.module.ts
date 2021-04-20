import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfigurationsAppPageRoutingModule } from './configurations-app-routing.module';

import { ConfigurationsAppPage } from './configurations-app.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfigurationsAppPageRoutingModule
  ],
  declarations: [ConfigurationsAppPage]
})
export class ConfigurationsAppPageModule {}
