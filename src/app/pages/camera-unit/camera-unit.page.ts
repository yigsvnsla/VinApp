import { ListPartComponent } from "./../../component/list-part/list-part.component";
import { ViewPhotoComponent } from "./../../component/view-photo/view-photo.component";
import { UiComponentsService } from "src/app/services/ui-components.service";
import { DomSanitizer } from "@angular/platform-browser";
import { Component, OnInit } from "@angular/core";
import { Platform } from "@ionic/angular";
import { Plugins } from "@capacitor/core";
import "@capacitor-community/camera-preview";
import "@capacitor-community/http";
const { CameraPreview, Keyboard } = Plugins;
import {
  CorePart,
  CoreVechicle,
  Image,
  TempService,
} from "src/app/services/temp.service";
import { CoreConexionService } from "src/app/services/core-conexion.service";
import { CurrencyPipe } from "@angular/common";
import { ListComponent } from "src/app/component/list/list.component";
import { StorageService } from "src/app/services/storage.service";

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
  public subcribe: any;
  maxFit: number;
  minFit: number;

  constructor(
    private sanitizer: DomSanitizer,
    private main: TempService,
    private platform: Platform,
    private currencyPipe: CurrencyPipe,
    private uiComponentsService: UiComponentsService,
    private coreConexionService: CoreConexionService,
    private core: CoreConexionService
  ) {
    this.subcribe = this.platform.backButton.subscribeWithPriority(10, () => {
      if (this.constructor.name == "CameraUnitPage") {
        this.stopCamera();
      }
    });
  }

  JsonData = {};

  async ngOnInit() {
    this.vehicle = this.main.currentVehicle;
    this.part = Object.create(this.main.getPart());
    //this.sliderOptions = this.sliderBoostrap();
    this.part.code !== 0 ? (this.editMode = true) : (this.editMode = false);
    if (this.part.status == "") {
      this.part.status = "Used (normal wear)";
      this.statusId = 4;
    } else {
      this.statusId = this.setStatus(this.part.status);
    }
    await this.checkFit();

  }

  async onSearch() {
    this.coreConexionService.findArray("Parts", "?_limit=-1&_sort=name:ASC").then((e) => {
      this.uiComponentsService
        .showModal({
          component: ListPartComponent,
          cssClass: "List-Part-Component",
          swipeToClose: true,
          componentProps: {
            Items: e,
          },
        })
        .then((e) => {
          this.part.category = e.category.name;
          this.part.categoryId = e.category.id;
          this.part.part = e.name;
          this.part.id = e.id;
        });
    });
  }

  async viewPhoto(data) {
    this.uiComponentsService.showModal({
      component: ViewPhotoComponent,
      cssClass: "View-Photo-Component",
      swipeToClose: true,
      componentProps: {
        Image: data,
      },
    });
  }

  eventPrice(e) {
    this.part.price = e.target.value;
    this.currencyPipe.transform(this.part.price, "$");
  }
  eventClear(e) {
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
    });
    this.cameraActive = true;
  }

  async stopCamera() {
    CameraPreview.stop();
    this.cameraActive = false;
    this.viewCam = false;
    this.nameIcon = "close";
  }

  /*async sendPost(blob: Blob) {
    let data: FormData = new FormData();
    data.append("files", blob, "testing");
    console.log(JSON.stringify(await this.core.imagesStrapi(data)));
  }*/

  async captureImage() {
    let element = document.getElementsByClassName("darwin")[0];
    element.classList.add("shadow");
    CameraPreview.capture({ quality: 90 }).then(res=>{
      this.part.images.push(
        new Image(
          res.value,
          `Testing ${this.count}`
        )
      );
      element.classList.remove("shadow");
    })
    
    /*
  Funciona con el plugin HTTP community de capacitor, siempre y cuando me acuerde de modificarlo.
  let data = (await CameraPreview.capture({quality: 80})).value; 
    console.log(data);
    const { Http } = Plugins;
    Http.request({
      method: 'POST',
      url: (await this.storageService.get("url")).urlPrimary+"upload",
      headers: {
        "Content-Type": "multipart/form-data"
      },
      data: {
        "files": [data, data, data],
        "ref":"2373",
        "refads": "23731",
        "titulo": "testing part by darwin",
        "refpart": "23732",
        "nombre": "testing",
        "descrip": "testing part by darwin",
        "precio":"10000",
        "condicion": "excelenete",
        "categoria": "categoria testing"
      }
    }).then((response) => {
      console.log("Subido con exito!!!");
      console.log(response);
    }, fail=>{
      console.log("Fallido con exito!!!");
      console.log(fail);
    });
      */

    this.count++;
    if (this.part.images.length > 0) this.nameIcon = "checkmark";
  }
  flipCamera() {
    //CameraPreview.flip();
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
    this.part.status = this.status(event.detail.value);
  }

  async getCategories() {
    this.uiComponentsService
      .showModal({
        component: ListComponent,
        cssClass: "my-modal-listComponent",
        swipeToClose: true,
        componentProps: {
          Items: await this.coreConexionService.findArray(
            "Categories",
            "?_sort=name:ASC"
          ),
        },
      })
      .then((e) => {
        if (e != undefined) {
          this.part.category = e.name;
          this.part.categoryId = e.id;
          this.part.part = "";
        }
      });
  }

  async getParts() {
    if (this.part.categoryId !== "") {
      this.uiComponentsService
        .showModal({
          component: ListComponent,
          cssClass: "my-modal-listComponent",
          swipeToClose: true,
          componentProps: {
            Items: await this.coreConexionService.findArray(
              "Parts",
              `?category.id_eq=${this.part.categoryId}?_sort=name:ASC`
            ),
            AddElements: true,
            id: this.part.categoryId,
            table: "Parts",
          },
        })
        .then((e) => {
          if (e != undefined) {
            this.part.part = e.name;
            this.part.id = e.id;
          }
        });
    } else {
      this.onSearch();
    }
  }

  async validation() {
    if (
      this.part.images.length == 0 ||
      this.part.price == 0 ||
      this.part.category == "" ||
      this.part.part == "" ) {
      this.uiComponentsService.showAlert({
        header: "Alert",
        message: `need add data in the form`,
        buttons: ["okay"],
      });
      return false;
    }
    return true;
  }

  async finish() {
    if ((await this.validation()) == true) {
      this.main.uploadPart(true, this.part);
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
      await this.main.uploadPart(false, this.part);
      this.part = new CorePart();
      this.main.setPart(this.part);
      if (this.part.status == "") {
        this.part.status = "Used (normal wear)";
        this.statusId = 4;
      } else {
        this.statusId = this.setStatus(this.part.status);
      }
      this.uiComponentsService.showToast("the inputs have been cleaned");
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

  DateList(): number[] {
    let min = new Date().getFullYear();
    let list: number[] = [];
    for (let index = min; index > 1984; index--) {
      list.push(index);
    }
    return list;
  }
  async minSelect(){
    this.maxFit = undefined;
    let min = new Date().getFullYear();
    let temp = await this.showYearList();
    this.minFit = temp;
    if(temp == min){
      this.maxFit = temp;
    }
  }
  async maxSelect(){
    if(this.minFit != undefined){
      this.maxFit= await this.showYearList(this.minFit);
      this.part.fit = this.generateFit().string;
    }else{
      this.main.showMessage("Select from year first!");
    }
  }
  
  generateFit(): {string: string, number: number[]}{
    let s: string = "";
    let n: number[] = [];
      for (let i = this.minFit; i <= this.maxFit; i++) {
        s = s + " " + i.toString();    
        n.push(i);
      }
      return{
        string: s.substr(1),
        number: n
      }
  }
  
  async checkFit(boo?: boolean){
    if(this.part.fit.includes(" ")){
      let arr: number[] = this.getArryFromString(this.part.fit.split(" "));
      this.maxFit = Math.max(... arr);
      this.minFit = Math.min(... arr);
      console.log(this.minFit + " " + this.maxFit);
    }else if(!boo){
      this.heredateFit();
    }  
  }

  async heredateFit(){
    if(this.vehicle.Parts.length > 0 && this.part.code == 0){
      let temp: number = 100000;
      let tempPart: CorePart;
      console.log(this.vehicle.Parts);
      this.vehicle.Parts.forEach(e => {
        if(e.code < temp){
          temp = e.code;
          tempPart = Object.create(e);
        }
      });
      this.part.fit = tempPart.fit;
      this.checkFit();
    }else{
      console.log("No tiene partes");
    }

  }

  getArryFromString(arr: string[]): number[]{
    let r: number[] = [];
    arr.forEach(e => {
      r.push(parseInt(e));
    });
    return r;
  }

  async showYearList(start?:number): Promise<number>{
    return new Promise(async value=>{
      let temp: {}[] = [];
      let s:number = start? start : 1985;
      for (let i = s; i < new Date().getFullYear() ; i++) {
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
        value(e.id)
      })
    })
    
  }
}
