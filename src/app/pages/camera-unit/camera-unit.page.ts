import { DomSanitizer } from "@angular/platform-browser";
import { Component, Input, OnInit } from "@angular/core";
import {
  AlertController,
  LoadingController,
  ModalController,
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
  constructor(
    private sanitizer: DomSanitizer,
    public modalController: ModalController,
    public alertController:AlertController,
    private main: TempService,
    private core: CoreConexionService
  ) {}

  ngOnInit() {
    document.getElementById("ionFooter").classList.toggle("hidden");
    this.vehicle = this.main.currentVehicle;
    this.part = this.main.currentPart;
    this.sliderOptions = this.sliderBoostrap();
    this.part.status = 'Reconditioned'
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
    CameraPreview.start(cameraPreviewOptions).then(() => {
    });
  }
  async stopCamera() {
    document.getElementById("ionFooter").classList.toggle("hidden");
    await CameraPreview.stop().then(() => {
      
    });
    this.cameraActive = false;
    this.viewCam = false;
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
    return this.sanitizer.bypassSecurityTrustUrl(
      `data:image/jpge;base64,${url}`
    );
    // `data:image/jpge;base64,${url}`
  }
  // Ion-Range
  rangeChange(event) {
    console.log(event)
    this.part.status = this.status(event.detail.value);
  }
  status(id: any){
    switch(id){
      case 0:
        return "New"
      case 1:
        return "Reconditioned";
      case 2:
        return "Open box"
      case 3:
        return "Used";
    }
  }

  async getCategories() {
    this.presentModal(false, await this.core.findArray('Categories'), "Categories").then((x) => {
      this.part.category = x.name;
      this.part.categoryId = x.id;
      this.part.part = ""
    });
  }

  async getParts() {
    this.presentModal(false, await this.core.findArray('Parts', `?category.id_eq=${this.part.categoryId}`), "Parts").then((x) => {
      this.part.part = x.name;
      this.part.id = x.id;
    });
  }

  async validation(){
    let alert = await this.alertController.create({
      header:'Alert',
      message:`need to add data`,
      buttons:[
        {
          text:'okay'
        }
      ]
    })
    if ( this.part.images.length == 0 || this.part.price == 0 || this.part.category == "" || this.part.part == ""){
      alert.present()
      return false
    }
    return true
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
    if(await this.validation() == true ) {
      this.main.uploadPart()
    }
  }

  async verify(): Promise<Image[]>{
    return new Promise(async value=>{
      let r: Image[] = []
      this.part.images.forEach(element => {
        if(!element.url && !element.id){
          r.push(element);
        }
      });
      value(r)
    })
  }
}
