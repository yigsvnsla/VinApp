import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CameraUnitPage } from './camera-unit.page';

const routes: Routes = [
  {
    path: '',
    component: CameraUnitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CameraUnitPageRoutingModule {}
