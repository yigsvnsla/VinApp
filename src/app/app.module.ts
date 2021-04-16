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

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    PipesModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ReactiveFormsModule,
    ComponentModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    NgxCurrencyModule
  ],
  exports: [],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    BarcodeScanner,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
