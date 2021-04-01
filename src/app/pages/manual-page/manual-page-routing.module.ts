import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManualPagePage } from './manual-page.page';

const routes: Routes = [
  {
    path: '',
    component: ManualPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManualPagePageRoutingModule {}
