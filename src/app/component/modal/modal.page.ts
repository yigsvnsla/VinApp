import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-modal",
  templateUrl: "./modal.page.html",
  styleUrls: ["./modal.page.scss"],
})
export class ModalPage implements OnInit {
  constructor(public modalController: ModalController) {}

  ngOnInit() {}

  modalDismiss() {
    //dentro del objeto pasa los datos a el formulario padre de este
    this.modalController.dismiss();
  }

  cardClick() {}
}
