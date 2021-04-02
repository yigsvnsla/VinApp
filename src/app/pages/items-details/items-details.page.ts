import { ActivatedRoute, Router } from "@angular/router";
import { HttpService } from "./../../services/http.service";
import { ModalController, ToastController,IonSlides, AlertController} from "@ionic/angular";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ModalPage } from "src/app/component/modal/modal.page";
import { Plugins } from "@capacitor/core";
import { CorePart, CoreVechicle, TempService } from "src/app/services/temp.service";

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
    private http: HttpService,
    private toastController: ToastController,
    private main: TempService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.components = this.main.currentVehicle.Parts;
    this.car = this.main.currentVehicle;
    this.maxYear = new Date().getFullYear().toString();
    console.log(this.components);
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
  }
  
  async cDelete(id: any) {

    let alert = await this.alertController.create({
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
          handler: () => {
            console.log('Confirm Okay');
            this.http.deleteComponent(id).subscribe((succes) => {
              console.log("DELETE" + id);
            });
          }
        }
      ]
    })
    alert.present()
  }
}
