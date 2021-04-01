import { ModalPage } from "./../../component/modal/modal.page";
import { Component, OnInit } from "@angular/core";
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { FormControl, Validators } from "@angular/forms";
import {
  AlertController,
  LoadingController,
  ModalController,
} from "@ionic/angular";

import { Plugins, KeyboardInfo } from "@capacitor/core";
import { TempService } from "src/app/services/temp.service";
import { CoreConexionService } from "src/app/services/core-conexion.service";

const { Device, Keyboard } = Plugins;

Keyboard.addListener("keyboardWillShow", (info: KeyboardInfo) => {
  console.log("keyboard will show with height", info.keyboardHeight);
  document.getElementById("ionFooter").classList.toggle("hidden");
});

Keyboard.addListener("keyboardWillHide", () => {
  console.log("keyboard will hide");
  document.getElementById("ionFooter").classList.toggle("hidden");
});

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {
  codeResult: string = "";
  vinInput = new FormControl(this.codeResult, [
    Validators.required,
    Validators.maxLength(17),
    Validators.minLength(17),
  ]);

  async ngOnInit() {
  }
  constructor(
    private barcode: BarcodeScanner,
    private loading: LoadingController,
    private modalController: ModalController,
    private alertController: AlertController,
    private main: TempService,
    private core: CoreConexionService,
  ) {}

  // public checked;
  // checkbox(event) {
  //   document.getElementById("ionFooter").classList.toggle("hidden");
  //   console.log(event);
  // }

  private filter: Function = async (string: string) => {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Alert",
      subHeader: "",
      message: "The vin code is invalidate",
      buttons: ["OK"],
    });

    if (string.length > 17 || string.length < 17) {
      console.log("el codigo introducido es invalido");
      await alert.present();
    } else {
      return string;
    }
    return;
  };

  result: string = "SALMH13446A220123";

  async scan() {
    const _result = await this.barcode.scan({
      orientation: "portrait",
      disableSuccessBeep: true,
    });
    this.result = _result.text;
  }

  async searchVin() {
    let a = await this.core.search(this.result);
    a? this.main.setVehicle(a) : console.log("error");
  }

  manualPage() {
    this.main.empty();
  }

  async modalList() {
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: "my-custom-class",
      swipeToClose: true,
    });

    await modal.present();

    // el formulario hijo al dispara el evento ondissmiss
    // returna un objeto global que es data
    // de este objeto data trae los datos del formulario hijo
    const { data } = await modal.onDidDismiss();
    if (data) {
      console.log(data);
    }
  }
}
