import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpService } from "src/app/services/http.service";
import {
  AlertController,
  LoadingController,
  ModalController,
  Platform,
} from "@ionic/angular";

import { DinamicModalComponent } from "../../component/dinamic-modal/dinamic-modal.component";
import { CoreVechicle, TempService } from "src/app/services/temp.service";
import { Location } from "@angular/common";
@Component({
  selector: "app-manual-page",
  templateUrl: "./manual-page.page.html",
  styleUrls: ["./manual-page.page.scss"],
})
export class ManualPagePage implements OnInit {
  public maxYear: number;
  private date = new Date()
  public makeId: any;
  Vehicle: CoreVechicle;

  public listBodyClass: string[]
  public listTypeVehicle: string[]

  public subcribe
  constructor(
    private router: Router,
    private http: HttpService,
    private loading: LoadingController,
    private alert: AlertController,
    private modalController: ModalController,
    private main: TempService,
    private loc: Location,
    private platform : Platform
  ) {

    this.subcribe = this.platform.backButton.subscribeWithPriority(5,()=>{
      if(this.constructor.name == 'ManualPagePage '){
          this.router.navigateByUrl('/home');
      }
    })

    this.listBodyClass = ["SEDAN",
      "COUPE",
      "HATCHBACK",
      "CROSSOVER",
      "MINIVAN",
      "VAN",
      "PICKUP",
      "WAGON",
      "CONVERTIBLE",
      "SPORTS CAR",
      "MULTIPURPOSE  VEHICLE (SUV)",
      "MULTIPURPOSE  VEHICLE (MUV)",
      "MULTIPURPOSE PASSENGER VEHICLE (MPV)",]

    this.listTypeVehicle = [
      "Automobile",
      "All-Terrain Vehicle (ATV/Four-wheeler)",
      "Boat Jet Ski",
      "Camper/Trailer/RV",
      "Commercial Truck",
      "Fire Truck",
      "Fleet Vehicle",
      "Golf Cart",
      "Mobile Home",
      "Moped",
      "Motorcycle",]
  }

  bodyClassEvent(e) {
    this.Vehicle.Body = e.detail.value
  }

  typeVehicleEvent(e) {
    this.Vehicle.Type = e.detail.value
  }

  cylinderEvent(e) {
    this.Vehicle.Cylinders = parseInt(e.detail.value)
  }

  public filterSlash(str: string, arr: string[]): string[] {
    if (str.split("/").length > 1) {
      return str.split("/")
    } else {
      return arr
    }
  }

  tempType
  async ngOnInit() {
    // instanciar un objeto tipo CarVehicle al iniciar la pagina manual
    // primero verifica que exista un objeto instanciado en el servicio TransferService
    // dado el caso que no exista, se debe instanciar uno vacio

    this.maxYear = this.date.getFullYear();
    this.Vehicle = this.main.currentVehicle;

    this.tempType = this.Vehicle.Type

    console.log(this.filterSlash(this.Vehicle.Body, this.listBodyClass))
  }

  selectYear() {
    if (this.main.currentVehicle.Id !== "0") {
      return;
    }
    let temp: {}[] = [];
    for (let i = 1985; i < this.maxYear + 1; i++) {
      temp.push({
        id: i,
        name: i,
      });
    }
    temp.reverse()
    this.presentModal(false, temp, "Select Year").then(
      (x) => {
        this.Vehicle.Year = x.id
        console.log(this.Vehicle.Year)
      });
  }

  async getMakers() {
    if (this.main.currentVehicle.Id !== "0") {
      return;
    }
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
    if (this.main.currentVehicle.Id !== "0") {
      return;
    }
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

    if (this.makeId == undefined || this.makeId == 0) {
      await alerta.present();
    } else {
      this.http.getModels(this.makeId.toString()).subscribe((success) => {
        console.log(success.sort())
        this.presentModal(false, success, "Models").then((x) => {
          this.Vehicle.Model = x.name;
        });
      });
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
  async submit() {
    if (this.main.currentVehicle.Id !== "0") {
      console.log("Editando carro!");
      await this.main.updateVehicle();
      this.loc.back();
    } else {
      if (this.Vehicle.Maker == "" || this.Vehicle.Model == "") {
        this.main.showMessage("Falta maker o model!")
        return
      }
      console.log(this.Vehicle);
      this.main.uploadVehicle();
    }
  }
}
