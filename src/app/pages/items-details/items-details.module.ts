import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ItemsDetailsPageRoutingModule } from './items-details-routing.module';

import { ItemsDetailsPage } from './items-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ItemsDetailsPageRoutingModule
  ],
  declarations: [ItemsDetailsPage]
})
export class ItemsDetailsPageModule {}
