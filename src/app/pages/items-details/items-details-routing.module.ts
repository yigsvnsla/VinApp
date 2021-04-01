import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemsDetailsPage } from './items-details.page';

const routes: Routes = [
  {
    path: '',
    component: ItemsDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItemsDetailsPageRoutingModule {}
