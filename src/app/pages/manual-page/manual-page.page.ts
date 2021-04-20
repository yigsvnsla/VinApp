import { Component, OnInit } from "@angular/core";
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
  private date = new Date();
  public makeId: any;
  Vehicle: CoreVechicle;

  public listBodyClass: string[];
  public listTypeVehicle: string[];
  public listTrim: string[];
  public listSeries: string[];

  constructor(
    private http: HttpService,
    private loading: LoadingController,
    private alert: AlertController,
    private modalController: ModalController,
    private main: TempService,
    private loc: Location,
    private platform: Platform
  ) {
    this.platform.backButton.subscribeWithPriority(9, () => {
      this.loc.back();
    });

    this.listTrim = [
      "TRIM 1",
      "TRIM 2",
      "TRIM 3",
      "TRIM 4",
    ]

    this.listSeries =[
      "SERIE 1",
      "SERIE 2",
      "SERIE 3",
      "SERIE 4",
    ]

    this.listBodyClass = [
      "SEDAN",
      "COUPE",
      "HATCHBACK",
      "CROSSOVER",
      "MINIVAN",
      "VAN",
      "PICKUP",
      "WAGON",
      "CONVERTIBLE",
      "SPORTS CAR",
      "MULTIPURPOSE VEHICLE (SUV)",
      "MULTIPURPOSE VEHICLE (MUV)",
      "Multi-Purpose Vehicle (MPV)",
      "Sport Utility Vehicle (SUV)",
    ];

    this.listTypeVehicle = [
      "Automobile",
      "All-Terrain Vehicle",
      "Boat Jet Ski",
      "Camper/Trailer/RV",
      "Commercial Truck",
      "Fire Truck",
      "Fleet Vehicle",
      "Golf Cart",
      "Mobile Home",
      "Moped",
      "Motorcycle",
    ];
    // instanciar un objeto tipo CarVehicle al iniciar la pagina manual
    // primero verifica que exista un objeto instanciado en el servicio TransferService
    // dado el caso que no exista, se debe instanciar uno vacio
    this.Vehicle = this.main.currentVehicle;
    this.maxYear = this.date.getFullYear();   
  }

  public filterSlash(str: string, arr: string[]): string[] | string {
    if(str == "" || str == null){
      return arr
    }
    if(str.split("/").length == 0){
      return str
    }
    if (str.split("/").length > 1) {
      return str.split("/");
    }else{
      return arr;
    } 

  }

  public tempBody: string;
  public tempClass:string;
  public tempTrim: string;
  public tempSerie:string;

  async ngOnInit() {
    this.tempTrim = this.filterSlash(this.Vehicle.Trim,this.listTrim)[0];
    this.tempBody = this.filterSlash(this.Vehicle.Body,this.listBodyClass)[0];
    this.tempClass= this.filterSlash(this.Vehicle.Type,this.listTypeVehicle)[0];
    this.tempSerie= this.filterSlash(this.Vehicle.Serie,this.listSeries)[0]
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

    this.presentModal(false, temp.reverse(), "Select Year").then((x) => {
      this.Vehicle.Year = x.id;
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
      this.presentModal(true, success, "Make")
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
      subHeader: "Select make first",
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
      this.http.getModels(this.makeId.toString())
        .subscribe((success) => {
          this.presentModal(false, success, "Models")
        .then((x) => {
          this.Vehicle.Model = x.name;
        });
      });
    }
  }

  getType(event: CustomEvent) {
    this.Vehicle.Type = event.detail.value.toLocaleUpperCase();
  }

  getBodyClass(event: CustomEvent) {
    this.Vehicle.Body = event.detail.value.toLocaleUpperCase();
    console.log(this.Vehicle.Body);
  }

  getCylinder(e: CustomEvent) {
    this.Vehicle.Cylinders = parseInt(e.detail.value);
  }

  getTrim(e: CustomEvent) {
    this.Vehicle.Trim = e.detail.value;
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
    this.Vehicle.Body=this.tempBody;
    this.Vehicle.Type=this.tempClass;
    this.Vehicle.Trim = this.tempTrim;
    this.Vehicle.Serie=this.tempSerie;
    
    if (this.main.currentVehicle.Id !== "0") {
      await this.main.updateVehicle();
      this.loc.back();
    } else {
      if (this.Vehicle.Maker == "" || this.Vehicle.Model == "") {
        this.main.showMessage("Please, select Make or Model!");
        return;
      }
      this.main.uploadVehicle();
    }
  }
}
