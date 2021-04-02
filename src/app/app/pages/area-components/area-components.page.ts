import { AlertController } from "@ionic/angular";
import { Component, OnInit } from "@angular/core";
import { HttpService } from "src/app/services/http.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-area-components",
  templateUrl: "./area-components.page.html",
  styleUrls: ["./area-components.page.scss"],
})
export class AreaComponentsPage implements OnInit {
  constructor(
    private router: Router,
    private http: HttpService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    //this.car = this.transferService.getCar();
    // console.log(this.car.components);
  }

  async presentModal(component?: any) {
    if (component) {
      //this.transferService.tempComponent = component;
    }
    this.router.navigate(["/camera"]);
  }

  async submit() {
    let alert = await this.alertController.create({
      header: "Alert",
      subHeader: "Your information have send to server",
      message: "press ok to go back to the beginning",
      buttons: [
        {
          text: "Continue",
          handler: () => {
            this.router.navigate(["/home"]);
          },
        },
      ],
    });
   // for (let item of this.car.components) {
   //   //item.parentId = this.car.id;
   //   this.http.uploadComponent(this.car.id, item.getJSON()).subscribe((s) => {
   //     // Aqui finaliza la app
   //     console.log(s);
    //  });
   // }
  // await alert.present();
  }
}
