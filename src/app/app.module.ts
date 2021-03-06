import { StorageService } from "./services/storage.service";
import { UiComponentsService } from "src/app/services/ui-components.service";
import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { ReactiveFormsModule } from "@angular/forms";
import { RouteReuseStrategy } from "@angular/router";
import { NgxCurrencyModule } from "ngx-currency";
import { HttpClientModule } from "@angular/common/http";
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { BrowserModule } from "@angular/platform-browser";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { CommonModule } from "@angular/common";
import { PipesModule } from "./pipes/pipes.module";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { NgModule } from "@angular/core";

//Imports.
import { AppRoutingModule } from "./app-routing.module";
import { ComponentModule } from "./component/component.module";
import { AppComponent } from "./app.component";

import "@capacitor-community/camera-preview";
import { IonicStorageModule } from "@ionic/storage-angular";
import { ManualPagePageModule } from "./pages/manual-page/manual-page.module";
import { DragulaModule, DragulaService } from "ng2-dragula";
import { ImagePicker } from "@ionic-native/image-picker/ngx";
import { ImageResizer } from "@ionic-native/image-resizer/ngx";

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ReactiveFormsModule,
    ComponentModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    NgxCurrencyModule,
    PipesModule,
    ManualPagePageModule,
    IonicStorageModule.forRoot(),
    DragulaModule.forRoot(),
  ],
  exports: [],
  providers: [
    StorageService,
    UiComponentsService,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    BarcodeScanner,
    DragulaService,
    ImagePicker,
    ImageResizer
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
