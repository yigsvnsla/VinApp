import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { CoreConexionService } from "src/app/services/core-conexion.service";
import { CoreVechicle, TempService } from "src/app/services/temp.service";
import { UiComponentsService } from "src/app/services/ui-components.service";

@Component({
  selector: "app-modal",
  templateUrl: "./modal.page.html",
  styleUrls: ["./modal.page.scss"],
})
export class ModalPage implements OnInit {
  Vehicles: CoreVechicle[];
  constructor(
    private modalController: ModalController,
    private core: CoreConexionService,
    private main: TempService,
    private uiComponentsService:UiComponentsService) {}

  modalDismiss() {
    //dentro del objeto pasa los datos a el formulario padre de este
    this.modalController.dismiss();
  }


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
