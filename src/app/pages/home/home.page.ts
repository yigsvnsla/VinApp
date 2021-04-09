import { ModalPage } from "./../../component/modal/modal.page";
import { Component, OnInit } from "@angular/core";
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { FormControl, Validators } from "@angular/forms";
import {
  AlertController,
  LoadingController,
  ModalController,
  Platform,
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
  private modalState:boolean
  subcribe:any
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
    private platform: Platform
  ) {
    this.subcribe = this.platform.backButton.subscribeWithPriority(10,()=>{
      if(this.modalState == false){
        if(this.constructor.name == 'HomePage'){
          if(window.confirm("do you want to exit app")){
            navigator['app'].exitApp()
          }
        }
      }
    })
   }


  

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

    let popup = await this.alertController.create({
      message:'make sure you have entered a valid Vin',
      buttons:['ok'],
    })

    if(this.result.length == 17 ){
      this.main.setVehicle(await this.core.search(this.result)) 
    }else{
      if( this.result == '' ){
        this.manualPage();
      }else{
        if(this.result.length < 17 || this.result.length > 17){
          popup.present()
        }
      }

      
    }
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

    await modal.present().then(()=>{
      this.modalState=true;
    });
      
    // el formulario hijo al dispara el evento ondissmiss
    // returna un objeto global que es data
    // de este objeto data trae los datos del formulario hijo
    const { data } = await modal.onDidDismiss();
    if (data) {
      console.log(data);
    }
    this.modalState=false
  }
}
