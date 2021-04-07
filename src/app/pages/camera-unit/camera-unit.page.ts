import { DomSanitizer } from "@angular/platform-browser";
import { Component, Input, OnInit } from "@angular/core";
import {
  AlertController,
  LoadingController,
  ModalController,
  Platform,
  ToastController,
} from "@ionic/angular";
import { Plugins, KeyboardInfo } from "@capacitor/core";
import "@capacitor-community/camera-preview";
const { CameraPreview, Keyboard } = Plugins;
import {
  CameraPreviewOptions,
  CameraPreviewPictureOptions,
} from "@capacitor-community/camera-preview";

import { DinamicModalComponent } from "src/app/component/dinamic-modal/dinamic-modal.component";
import {
  CorePart,
  CoreVechicle,
  Image,
  TempService,
} from "src/app/services/temp.service";
import { CoreConexionService } from "src/app/services/core-conexion.service";

@Component({
  selector: "app-camera-unit",
  templateUrl: "./camera-unit.page.html",
  styleUrls: ["./camera-unit.page.scss"],
})
export class CameraUnitPage implements OnInit {
  nameIcon: string = "close-circle";
  public viewCam: boolean = false;
  vehicle: CoreVechicle;
  part: CorePart;
  statusId: number;
  editMode: boolean;
  subcribe:any
  constructor(
    private sanitizer: DomSanitizer,
    public modalController: ModalController,
    public alertController: AlertController,
    private main: TempService,
    private core: CoreConexionService,
    private toastcontroller: ToastController,
    private platform: Platform
  ) {
    this.subcribe = this.platform.backButton.subscribeWithPriority(10,()=>{
      if(this.constructor.name == 'CameraUnitPage'){
        this.stopCamera()
      }
    })
  }

  ngOnInit() {
    this.vehicle = this.main.currentVehicle;
    this.part = this.main.currentPart;
    this.sliderOptions = this.sliderBoostrap();
    this.part.code !== 0? this.editMode = true : this.editMode = false;
    if(this.part.status == ""){
      this.part.status = "Used (normal wear)"
      this.statusId = 4;
    }else{
      this.statusId = this.setStatus(this.part.status)
    }
  }
  //camera
  public cameraActive: boolean = false;
  torchActive = false;
  openCamera() {
    const cameraPreviewOptions: CameraPreviewOptions = {
      position: "rear",
      parent: "cameraPreview",
      className: "cameraPreview",
      toBack: true,
      rotateWhenOrientationChanged: false,
      disableExifHeaderStripping: false,
    };
    this.cameraActive = true;
    CameraPreview.start(cameraPreviewOptions).then(() => {});
  }
  async stopCamera() {
    document.getElementById("ionFooter").classList.toggle("hidden");
    await CameraPreview.stop().then(() => {});
    this.cameraActive = false;
    this.viewCam = false;
    this.nameIcon= "close";
  }
  count: number = 0;
  async captureImage() {
    const cameraPreviewPictureOptions: CameraPreviewPictureOptions = {
      quality: 85,
    };
    const result = await CameraPreview.capture(cameraPreviewPictureOptions);
    this.part.images.push(new Image(result.value, `Testing ${this.count}`));
    this.count++;
    if (this.count > 0) this.nameIcon = "checkmark";
  }
  flipCamera() {
    CameraPreview.flip();
  }
  iAdd() {
    this.viewCam = true;
    this.openCamera();
  }
  //Delete photos
  iDelete(x: Image) {
    //deleting
    var removeItemFromArr = (arr, item) => {
      return arr.filter((e) => e !== item);
    };
    //filter
    var filter = (arr, item) => {
      if (arr.indexOf(item) != -1) {
        return item;
      } else {
        console.log("item not found");
      }
    };
    this.part.images = removeItemFromArr(
      this.part.images,
      filter(this.part.images, x)
    );
    console.log(this.part.images);
  }
  //Sliders
  public sliderOptions: any;
  sliderBoostrap() {
    if (this.part.images.length > 0) {
      if (screen.width < 425) {
        return {
          direction: "horizontal",
          spaceBetween: 0,
          initialSlide: 0,
          slidesPerView: 2.8,
        };
      }
      if (screen.width > 425) {
        return {
          direction: "horizontal",
          spaceBetween: 0,
          initialSlide: 0,
          slidesPerView: 4.8,
        };
      }
    }
  }
  public getSantizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(`${url}`);
  }
  // Ion-Range
  rangeChange(event) {
    console.log(event);
    this.part.status = this.status(event.detail.value);
  }
  status(id: any) {
    switch (id) {
      case 1:
        return "damage";
      case 2:
        return "Moderate";
      case 3:
        return "Reconditioned";
      case 4:
        return "Used";
      case 5:
        return "No damage";
      case 6:
        return "New";
    }
  }
  
  setStatus(text: string) {
    switch (text) {
      case "damage":
        return 1;
      case "Moderate":
        return 2;
      case "Reconditioned":
        return 3;
      case "Used":
        return 4;
      case "No damage":
        return 5;
      case "New":
        return 6;
    }
  }

  async getCategories() {
    this.presentModal(
      false,
      await this.core.findArray("Categories"),
      "Categories"
    ).then((x) => {
      this.part.category = x.name;
      this.part.categoryId = x.id;
      this.part.part = "";
    });
  }

  async getParts() {
    this.presentModal(
      false,
      await this.core.findArray(
        "Parts",
        `?category.id_eq=${this.part.categoryId}`
      ),
      "Parts"
    ).then((x) => {
      this.part.part = x.name;
      this.part.id = x.id;
    });
  }

  async validation() {
    let alert = await this.alertController.create({
      header: "Alert",
      message: `need to add data`,
      buttons: [
        {
          text: "okay",
        },
      ],
    });
    if (
      this.part.images.length == 0 ||
      this.part.price == 0 ||
      this.part.category == "" ||
      this.part.part == ""
    ) {
      alert.present();
      return false;
    }
    return true;
  }

  // Modal Template
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
  //Funcion que se encarga de agregar y modificar partes a un vehiculo dentro del modal.
  async finish() {
    if ((await this.validation()) == true) {
      this.main.uploadPart(true);
    }
  }

  async verify(): Promise<Image[]> {
    return new Promise(async (value) => {
      let r: Image[] = [];
      this.part.images.forEach((element) => {
        if (!element.url && !element.id) {
          r.push(element);
        }
      });
      value(r);
    });
  }

  async cleanForm() {
    let toast = await this.toastcontroller.create({
      duration: 1000,
      message: "the inputs have been cleaned",
    });
    if ((await this.validation()) == true) {
      this.main.uploadPart(false);
      this.part = new CorePart();
      this.main.currentPart = this.part;
      if(this.part.status == ""){
        this.part.status = "Used (normal wear)"
        this.statusId = 4;
      }else{
        this.statusId = this.setStatus(this.part.status)
      }
      toast.present();
    }
  }
}
