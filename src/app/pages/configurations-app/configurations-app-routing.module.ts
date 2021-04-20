import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfigurationsAppPage } from './configurations-app.page';

const routes: Routes = [
  {
    path: '',
    component: ConfigurationsAppPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigurationsAppPageRoutingModule {}
