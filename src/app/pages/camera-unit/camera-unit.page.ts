import { UiComponentsService } from 'src/app/services/ui-components.service';
import { DomSanitizer } from "@angular/platform-browser";
import { Component, OnInit } from "@angular/core";
import { Platform} from "@ionic/angular";
import { Plugins,} from "@capacitor/core";
import "@capacitor-community/camera-preview";
const { CameraPreview, Keyboard } = Plugins;
import { CorePart,CoreVechicle,Image,TempService } from "src/app/services/temp.service";
import { CoreConexionService } from "src/app/services/core-conexion.service";
import { CurrencyPipe } from "@angular/common";
import { ListComponent } from 'src/app/component/list/list.component';

@Component({
  selector: "app-camera-unit",
  templateUrl: "./camera-unit.page.html",
  styleUrls: ["./camera-unit.page.scss"],
})
export class CameraUnitPage implements OnInit {
  public nameIcon: string = "close-circle";
  public viewCam: boolean = false;
  public vehicle: CoreVechicle;
  public part: CorePart;
  public statusId: number;
  public editMode: boolean;
  public subcribe:any
  
  constructor(
    private sanitizer: DomSanitizer,
    private main: TempService,
    private platform: Platform,
    private currencyPipe : CurrencyPipe,
    private uiComponentsService:UiComponentsService,
    private coreConexionService:CoreConexionService
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
    //this.sliderOptions = this.sliderBoostrap();
    this.part.code !== 0? this.editMode = true : this.editMode = false;
    if(this.part.status == ""){
      this.part.status = "Used (normal wear)"
      this.statusId = 4;
    }else{
      this.statusId = this.setStatus(this.part.status)
    }
  }

  eventPrice(e){
    this.part.price = e.target.value;
    this.currencyPipe.transform(this.part.price, '$')
  }
  eventClear(e){
    e.target.value = "";
  }

  //camera
  public cameraActive: boolean = false;
  torchActive = false;
  count: number = 0;
  openCamera() {
    CameraPreview.start({
      x: 0,
      y: 0,
      width: window.screen.width,
      height: window.screen.height,
      position: "rear",
      parent: "cameraPreview",
      className: "cameraPreview",
      toBack: true,
      rotateWhenOrientationChanged: true,
    })
    this.cameraActive = true;
  }

  async stopCamera() {
    CameraPreview.stop();
    this.cameraActive = false;
    this.viewCam = false;
    this.nameIcon= "close";
  }


  async captureImage() {
    this.part.images.push(new Image((await CameraPreview.capture({quality:90})).value, `Testing ${this.count}`));
    this.count++;
    if (this.part.images.length  > 0) this.nameIcon = "checkmark";
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

  async getCategories() {
    this.uiComponentsService.showModal({
      component: ListComponent,
      cssClass: "my-modal-listComponent",
      swipeToClose: true,
      componentProps: {
        Items:await this.coreConexionService.findArray("Categories")
      },
    }).then(e=>{
      this.part.category = e.name;
      this.part.categoryId = e.id;
      this.part.part = "";
    })
  }

  async getParts() {
    this.uiComponentsService.showModal({
      component: ListComponent,
      cssClass: "my-modal-listComponent",
      swipeToClose: true,
      componentProps: {
        Items:await this.coreConexionService.findArray("Parts",`?category.id_eq=${this.part.categoryId}`)
      },
    }).then((e=>{
      this.part.part =  e.name;
      this.part.id = e.id;
    }))
  }

  async validation() {
    if (  this.part.images.length == 0 ||  this.part.price == 0 ||  this.part.category == "" ||  this.part.part == "" ) {
      this.uiComponentsService.showAlert({
        header: "Alert",
        message: `need add data in the form`,
        buttons: ["okay"]
      })
    return false;
    }
    return true;
  }

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
    if ((await this.validation()) == true) {
      await this.main.uploadPart(false);
      this.part = new CorePart();
      this.main.currentPart = this.part;
      if(this.part.status == ""){
        this.part.status = "Used (normal wear)"
        this.statusId = 4;
      }else{
        this.statusId = this.setStatus(this.part.status)
      }
      this.uiComponentsService.showToast("the inputs have been cleaned")
    }
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
}
