import { StorageService } from './../../services/storage.service';
import { UiComponentsService } from 'src/app/services/ui-components.service';
import { Router } from "@angular/router";
import { ToastController,IonSlides} from "@ionic/angular";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Plugins } from "@capacitor/core";
import { CorePart, CoreVechicle, TempService } from "src/app/services/temp.service";
import { CoreConexionService } from "src/app/services/core-conexion.service";
import { DomSanitizer } from "@angular/platform-browser";
import { ViewPhotoComponent } from 'src/app/component/view-photo/view-photo.component';

const { Clipboard } = Plugins;
@Component({
  selector: "app-items-details",
  templateUrl: "./items-details.page.html",
  styleUrls: ["./items-details.page.scss"],
})
export class ItemsDetailsPage implements OnInit {
  @ViewChild('mySlider') slides:IonSlides;

  public sliderFather : {} ={
    allowTouchMove: false
  }
  //Hacer swich en cada componente para fixear el id de las categorias.
  public components: CorePart[];
  public car: CoreVechicle;
  public carInfo:boolean = false;
  public toggleView:boolean = false;
  public string: string ="";
  constructor(
    private toastController: ToastController,
    private main: TempService,
    private core: CoreConexionService,
    private sanitizer: DomSanitizer,
    private route: Router,
    private uiComponentsService:UiComponentsService,
    private storageService:StorageService
  ) {}

  ngOnInit() {
    this.components = this.main.currentVehicle.Parts;
    this.car = this.main.currentVehicle;
  }
  
  async ionViewWillEnter(){
    this.components = this.main.currentVehicle.Parts;
    this.car = this.main.currentVehicle;
  }

  addComponent(){
    this.main.viewPart();
  }
  cNext(){
    this.slides.slideNext();
  }
  cPrevent(){
    this.slides.slidePrev();
  }
  change(event) {
    this.car.Year = parseInt(event.detail.value);
  }
  getSantizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);

  }

  async viewPhoto(data){
    this.uiComponentsService.showModal({
      component: ViewPhotoComponent,
      cssClass: "View-Photo-Component",
      swipeToClose: true,
      componentProps: { 
        Image:data
      },
    })
  }
  
  goComponent(com: any) {
   this.main.viewPart(com);
  }

  async deletePart(id: any, index: any) {
    //deleting
    var removeItemFromArr = (arr, item) => {
     return arr.filter((e) => e !== item);
   };
   //filter
   var filter = (item) => {
     if (this.components.indexOf(item) != -1) {
       return item;
     } else {
       console.log("item not found");
     }
   };
   this.uiComponentsService.showAlert({
    header:'Alert',
    message:'are you sure you want to remove this component?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
          console.log('Confirm Cancel');
        }
      }, {
        text: 'Okay',
        handler: async () => {
          console.log('Confirm Okay');
          if(await this.core.delete(`Components/${id}`)){
            this.components= removeItemFromArr(this.components, filter(this.components[index]))
          }
        }
      }
    ]
  })
 }
 async editVehicle(){
  this.route.navigateByUrl("/manual");
 }
 async showDetails(e){
  if(e.detail.checked){
    this.toggleView? this.toggleView = false: null;
  }
 }
 async toggleViewf(e){
  if(e.detail.checked){
    this.carInfo? this.carInfo = false : null;
  }
 }
 async search(e){
  this.string = e.detail.value;
 }

}
