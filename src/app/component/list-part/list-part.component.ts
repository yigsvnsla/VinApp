import { UiComponentsService } from './../../services/ui-components.service';
import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  ModalController,
} from "@ionic/angular";
import { CoreConexionService } from "src/app/services/core-conexion.service";
import { CoreVechicle, TempService } from "src/app/services/temp.service";

@Component({
  selector: "app-list-part",
  templateUrl: "./list-part.component.html",
  styleUrls: ["./list-part.component.scss"],
})
export class ListPartComponent implements OnInit {
  Vehicles: CoreVechicle[];
  constructor(
    private modalController: ModalController,
    private core: CoreConexionService,
    private main: TempService,
    private uiComponentsService:UiComponentsService
  ) {}

  async ngOnInit() {
    this.Vehicles = await this.core.findVehicles();
  }

  async cardClick(index: CoreVechicle) {
    this.modalController.dismiss();
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

    this.uiComponentsService.showAlert({
      header: "Alert",
      message:"you are about to delete this vehicle and its internal components",
      buttons: [
        {
          text: "Continue",
          role: "success",
          handler: async () => {
            if (await this.core.deleteAll(y)) {
              this.Vehicles= removeItemFromArr(this.Vehicles, filter(this.Vehicles[x]));
              this.uiComponentsService.showToast("vehicle delete successfully")
            } else {
              this.uiComponentsService.showToast("Error deleting vehicle")
            }
          },
        },
        {
          text: "Cancel",
          role: "cancel",
        },
      ],
    })
  }
}
