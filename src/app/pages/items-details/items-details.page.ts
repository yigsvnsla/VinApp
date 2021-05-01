import { UiComponentsService } from 'src/app/services/ui-components.service';
import { Router } from "@angular/router";
import { ToastController,IonSlides} from "@ionic/angular";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Plugins } from "@capacitor/core";
import { CorePart, CoreVechicle, TempService } from "src/app/services/temp.service";
import { CoreConexionService } from "src/app/services/core-conexion.service";
import { DomSanitizer } from "@angular/platform-browser";

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
    private uiComponentsService:UiComponentsService
  ) {}

  ngOnInit() {
    this.components = this.main.currentVehicle.Parts;
    this.car = this.main.currentVehicle;
  }
  
  async ionViewWillEnter(){
    console.log(":v")
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
  public getSantizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(`${this.core.URL.substr(0,this.core.URL.lastIndexOf("/"))}${url}`);
  }
  async copyInfoVehicle() {
    const toast = await this.toastController.create({
      message: "Info vehicle copy into clipboard.",
      duration: 2000,
      position: "bottom",
    });
    toast.present();
    
    this.slides.getActiveIndex().then(x=>{
      let index : number = x 
      console.log(index)
       Clipboard.write({
      string: `${this.components[index].part} - ${this.car.Name}`,
    });
      return
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
