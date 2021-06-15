import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
const routes: Routes = [
  {
    path: "home",
    loadChildren: () =>
      import("./pages/home/home.module").then((m) => m.HomePageModule),
  },
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },  
  {
    path: "camera",
    loadChildren: () =>
      import("./pages/camera-unit/camera-unit.module").then(
        (m) => m.CameraUnitPageModule
      ),
  },
  {
    path: "item",
    loadChildren: () =>
      import("./pages/items-details/items-details.module").then(
        (m) => m.ItemsDetailsPageModule
      ),
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/configurations-app/configurations-app.module').then( m => m.ConfigurationsAppPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
