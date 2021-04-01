import { ModalController } from "@ionic/angular";
import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-dinamic-modal",
  templateUrl: "./dinamic-modal.component.html",
  styleUrls: ["./dinamic-modal.component.scss"],
})
export class DinamicModalComponent implements OnInit {
  constructor(private modalController: ModalController) {}

  @Input() Title: string;
  @Input() Items: [];
  @Input() _templateTumbnails: boolean;

  textSearch: string = "";
  cache: any[] = [];

  imgCache: any;

  ngOnInit() {
    // console.log("modal Init: ", this.Items);
  }

  tumbnails() {
    if (!this._templateTumbnails) {
      return false;
    }
    return true;
  }

  returnSelect(_val: any) {
    if (_val) {
      this.modalController.dismiss({
        name: _val.name,
        id: _val.id,
      });
    } else {
      this.modalController.dismiss();
    }
  }

  backClick() {
    this.modalController.dismiss();
  }

  getImg(x: string) {
    if (x) {
      this.imgCache = `//logo.clearbit.com/${x}?size=56`;
      return this.imgCache;
    } else {
      return this.imgCache;
    }
  }

  search(event) {
    this.textSearch = event.detail.value;
  }
}
