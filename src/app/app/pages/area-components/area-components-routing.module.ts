import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AreaComponentsPage } from './area-components.page';

const routes: Routes = [
  {
    path: '',
    component: AreaComponentsPage
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AreaComponentsPageRoutingModule {}
