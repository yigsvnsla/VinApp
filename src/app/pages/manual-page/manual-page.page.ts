import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpService } from "src/app/services/http.service";
import {
  AlertController,
  LoadingController,
  ModalController,
} from "@ionic/angular";

import { KeyboardInfo, Plugins } from "@capacitor/core";
const { Keyboard } = Plugins;
Keyboard.addListener("keyboardWillShow", (info: KeyboardInfo) => {
  console.log("keyboard will show with height", info.keyboardHeight);
  document.getElementById("ionFooter").classList.toggle("hidden");
});

Keyboard.addListener("keyboardWillHide", () => {
  console.log("keyboard will hide");
  document.getElementById("ionFooter").classList.toggle("hidden");
});
import { DinamicModalComponent } from "../../component/dinamic-modal/dinamic-modal.component";
import { CoreVechicle, TempService } from "src/app/services/temp.service";
@Component({
  selector: "app-manual-page",
  templateUrl: "./manual-page.page.html",
  styleUrls: ["./manual-page.page.scss"],
})
export class ManualPagePage implements OnInit {
  public maxYear: string;
  public makeId: any;

  constructor(
    private router: Router,
    private http: HttpService,
    private loading: LoadingController,
    private alert: AlertController,
    private modalController: ModalController,
    private main: TempService
  ) {}

  Vehicle: CoreVechicle;

  async ngOnInit() {
    // instanciar un objeto tipo CarVehicle al iniciar la pagina manual
    // primero verifica que exista un objeto instanciado en el servicio TransferService
    // dado el caso que no exista, se debe instanciar uno vacio
    this.maxYear = "2050";
    this.Vehicle = this.main.currentVehicle;
  }

  selectYear() {
    let temp: {}[] = [];
    for (let i = 1985; i < parseInt(this.maxYear); i++) {
      temp.push({
        id: i,
        name: i,
      });
    }
    this.presentModal(false, temp, "Select Year").then(
      (x) => (this.Vehicle.Year = x.id)
    );
  }

  async getMakers() {
    let loading = await this.loading.create({
      message: "Loading...",
    });
    await loading.present();
    this.http.getMakers().subscribe((success) => {
      loading.dismiss();
      this.presentModal(true, success, "Makers")
        .then((x) => {
          this.Vehicle.Maker = x.name;
          this.makeId = x.id;
        })
        .catch(async (e) => {
          console.log(e);
        });
    });
  }

  async getModels() {
    let loading = await this.loading.create({
      message: "Loading...",
    });
    if (this.makeId !== 0) {
      this.http.getModels(this.makeId.toString()).subscribe((success) => {
        this.presentModal(false, success, "Models").then((x) => {
          this.Vehicle.Model = x.name;
        });
      });
    } else {
      let alerta = await this.alert.create({
        header: "ERROR",
        subHeader: "Select maker first",
        buttons: [
          {
            text: "Ok",
            role: "Ok",
          },
        ],
      });
      await alerta.present();
    }
  }

  async presentModal(_tumbnail: boolean, _items?: any, _nameList?: string) {
    const modal = await this.modalController.create({
      component: DinamicModalComponent,
      cssClass: "my-modal-class",
      swipeToClose: true,
      componentProps: {
        Items: _items,
        Title: _nameList,
        _templateTumbnails: _tumbnail,
      },
    });
    await modal.present();

    let { data } = await modal.onDidDismiss();
    if (data) {
      return data;
    }
  }
  // Funcion que se encarga de verificar si todos los datos estan ingresados correctamente
  // En caso de de este todo bien, reedireccionara a el area de componentes
  // En caso contrario, mostrara un aviso de error.
  submit() {
   if(this.Vehicle.Maker == ""|| this.Vehicle.Model == ""){
     this.main.showMessage("Falta maker o model!")
     return 
   }
   console.log(this.Vehicle);
   this.main.uploadVehicle();
  }
}
