import { CoreConexionService } from 'src/app/services/core-conexion.service';
import { ListComponent } from './../../component/list/list.component';
import { UiComponentsService } from 'src/app/services/ui-components.service';
import { Component, OnInit } from "@angular/core";
import { Platform } from "@ionic/angular";
import { CoreVechicle, TempService } from "src/app/services/temp.service";
import { Location } from "@angular/common";

@Component({
  selector: "app-manual-page",
  templateUrl: "./manual-page.page.html",
  styleUrls: ["./manual-page.page.scss"],
})
export class ManualPagePage implements OnInit {
  public makeId: any;
  public Vehicle: CoreVechicle;
  public listBodyClass: string[];
  public listTypeVehicle: string[];
  public listTrim: string[];
  public listSeries: string[];

  constructor(
    private main: TempService,
    private loc: Location,
    private platform: Platform,
    private uiComponentsService:UiComponentsService,
    private coreConexionService:CoreConexionService
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
    this.tempSerie= this.filterSlash(this.Vehicle.Serie,this.listSeries)[0];

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

  async getModels() {
    if (this.main.currentVehicle.Id !== "0") {
      return;
    }
    if (this.makeId == undefined || this.makeId == 0) {
      this.uiComponentsService.showToast("Select make first")
    } else {
      this.uiComponentsService.showModal({
        component: ListComponent,
        cssClass: "my-modal-listComponent",
        swipeToClose: true,
        componentProps: {
          Items: await this.coreConexionService.getModels(this.makeId.toString())
        },
      }).then((e)=>{
        this.Vehicle.Model = e.name;
      });
    }
  }

  async getListMakers(){
    if (this.main.currentVehicle.Id !== "0") {
      return;
    }else{
      this.uiComponentsService.showModal({
        component: ListComponent,
        cssClass: "my-modal-listComponent",
        swipeToClose: true,
        componentProps: {
          Items:await this.coreConexionService.getMakers()
        },
      }).then(e=>{
        this.Vehicle.Maker = e.name;
        this.makeId = e.id;
      })
    }
  }

  getListYear() {
    if (this.main.currentVehicle.Id !== "0") {
      return;
    }else{
      let temp: {}[] = [];
      for (let i = 1985; i < new Date().getFullYear()+2 ; i++) {
        temp.push({
          id: i,
          name: i,
        });
      }
      this.uiComponentsService.showModal({
        component: ListComponent,
        cssClass: "my-modal-listComponent",
        swipeToClose: true,
        componentProps: {
          Items:temp.reverse()
        },
      }).then(e=>{
        this.Vehicle.Year=e.id
      })
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

