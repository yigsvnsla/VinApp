import { PipesModule } from "./pipes/pipes.module";
import { ReactiveFormsModule } from "@angular/forms";
import { RouteReuseStrategy } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

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
