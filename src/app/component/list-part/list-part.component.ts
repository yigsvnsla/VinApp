import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  AlertController,
  ModalController,
  ToastController,
} from "@ionic/angular";
import { CoreConexionService } from "src/app/services/core-conexion.service";
import { HttpService } from "src/app/services/http.service";
import { CoreVechicle, TempService } from "src/app/services/temp.service";

@Component({
  selector: "app-list-part",
  templateUrl: "./list-part.component.html",
  styleUrls: ["./list-part.component.scss"],
})
export class ListPartComponent implements OnInit {
  URL = "http://backuppapa.sytes.net:1337";
  Vehicles: CoreVechicle[];
  constructor(
    private http: HttpService,
    private router: Router,
    private modalController: ModalController,
    private core: CoreConexionService,
    private main: TempService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    this.Vehicles = await this.core.findVehicles();
  }

  async cardClick(index: CoreVechicle) {
    this.modalController.dismiss();
    console.log(index)
    this.main.viewVehicle(index);
  }

  async delete(x, y) {
    //deleting
    var removeItemFromArr = (arr, item) => {
      return arr.filter((e) => e !== item);
    };
    //filter
    var filter = (item) => {
      if (this.Vehicles.indexOf(item) != -1) {
        return item;
      } else {
        console.log("item not found");
      }
    };
    //action

    let msg: string;
    let toat = await this.toastController.create({
      header: "Delete",
      duration: 3000,
      message: msg,
    });
    let alert = await this.alertController.create({
      header: "Alert",
      subHeader:
        "you are about to delete this vehicle and its internal components",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Continue",
          role: "success",
          handler: async () => {
            if (await this.core.deleteAll(y)) {
              this.Vehicles= removeItemFromArr(this.Vehicles, filter(this.Vehicles[x]));
              msg = "vehicle delete successfully";
              toat.present();
              msg;
            } else {
              msg = "Error deleting vehicle";
              toat.present();
            }
          },
        },
      ],
    });

    alert.present();
  }
}
