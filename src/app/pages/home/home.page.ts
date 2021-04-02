import { ModalPage } from "./../../component/modal/modal.page";
import { Component, OnInit } from "@angular/core";
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { FormControl, Validators } from "@angular/forms";
import {
  AlertController,
  LoadingController,
  ModalController,
  ToastController,
} from "@ionic/angular";

import { Plugins, KeyboardInfo } from "@capacitor/core";
import { TempService } from "src/app/services/temp.service";
import { CoreConexionService } from "src/app/services/core-conexion.service";

const { Device, Keyboard } = Plugins;

try {
  //keyboard Show
  Keyboard.addListener("keyboardWillShow", (info: KeyboardInfo) => {
    document.getElementById("ionFooter").classList.toggle("hidden");
  });
  //keyboard Hide
  Keyboard.addListener("keyboardWillHide", () => {
    document.getElementById("ionFooter").classList.toggle("hidden");
  }).remove();
} catch (e) {
  console.error('WEB/PC Keyborad not load')
}

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
    private toastController: ToastController,
    private main: TempService,
    private core: CoreConexionService,
  ) { }

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

  result: string = "";

  async scan() {
    const _result = await this.barcode.scan({
      orientation: "portrait",
      disableSuccessBeep: true,
    });
    this.result = _result.text;
  }

  async searchVin() {

    // VIN 
    // xxx / primeros 3 digitos / WMI
    // xxxxxx / 6 digitos siguientes /  VDS
    // xxxxxxxx //  restante / VIS


    let alert = this.toastController.create({
      message: 'Insert vin code',
      cssClass: 'toast1',
      duration: 10000
    })
    let a = await this.core.search(this.result);
    a ? this.main.setVehicle(a) : (await alert).present();

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
