import { ActivatedRoute, Router } from "@angular/router";
import { HttpService } from "./../../services/http.service";
import { ModalController, ToastController,IonSlides} from "@ionic/angular";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ModalPage } from "src/app/component/modal/modal.page";
import { Plugins } from "@capacitor/core";
import { CorePart, CoreVechicle, TempService } from "src/app/services/temp.service";
import { CoreConexionService } from "src/app/services/core-conexion.service";

const { Clipboard } = Plugins;
@Component({
  selector: "app-items-details",
  templateUrl: "./items-details.page.html",
  styleUrls: ["./items-details.page.scss"],
})
export class ItemsDetailsPage implements OnInit {
  @ViewChild('mySlider') slides:IonSlides;
  public maxYear:string;
  public sliderFather : {} ={
    allowTouchMove: false
  }
  //Hacer swich en cada componente para fixear el id de las categorias.
  public components: CorePart[];
  public car: CoreVechicle;
  public carInfo:boolean = false;
  constructor(
    private modalController: ModalController,
    private toastController: ToastController,
    private main: TempService,
    private core: CoreConexionService
  ) {}

  ngOnInit() {
    this.car = this.main.currentVehicle;
    this.components = this.main.currentVehicle.Parts;
    this.maxYear = new Date().getFullYear().toString();
  }

  toogle(checked){
    console.log(checked, " - ", this.carInfo)
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

  exitClick() {
    this.modalList();
  }

  satinize(url: string) {
    return `http://backuppapa.sytes.net:1337${url}`;
  }

  async modalList() {
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: "my-custom-class",
      swipeToClose: true,
    });

    await modal.present();

    // el formulario hijo al dispara el evento ondissmiss
    // returna un objeto global que es data
    // de este objeto data trae los datos del formulario hijo
    const { data } = await modal.onDidDismiss();
    if (data) {
    }
  }
  goComponent(com: any) {
    //this.go.navigateByUrl("/camera");
    //this.transfer.component = com;
   //console.log(com.id);
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
    if(await this.core.delete(`Components/${id}`)){
      this.components= removeItemFromArr(this.components, filter(this.components[index]))
    }
  }
}
