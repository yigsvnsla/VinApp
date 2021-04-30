import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ItemsDetailsPageRoutingModule } from './items-details-routing.module';
import { ItemsDetailsPage } from './items-details.page';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ItemsDetailsPageRoutingModule,
    PipesModule
  ],
  declarations: [ItemsDetailsPage]
})
export class ItemsDetailsPageModule {}
