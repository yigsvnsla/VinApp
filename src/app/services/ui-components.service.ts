import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { ModalOptions } from '@ionic/core';
import { MenuController } from '@ionic/angular';
import { AlertOptions } from '@ionic/core';

@Injectable({
  providedIn: 'root'
})
export class UiComponentsService {

  constructor(
    private toastController: ToastController,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private menuController:MenuController,
    private alertController:AlertController
    ) { }

  async showAlert(alertOptions:AlertOptions):Promise<HTMLIonAlertElement>{
    let alert: HTMLIonAlertElement = await this.alertController.create(alertOptions)
      alert.present()
    return new Promise(async (value)=>{
      value(alert)
    })
  }

  async showToast(message: string) : Promise<HTMLIonToastElement> {
    let toast: HTMLIonToastElement = await this.toastController.create({
      message: message,
      duration: 1000
    })
    toast.present();
    return new Promise(async (value) => {
      value(toast);
    })
  }

  async showLoading(message: string="Loading"): Promise<HTMLIonLoadingElement> {
    let loading: HTMLIonLoadingElement = await this.loadingController.create({
      message: message,
    });
    loading.present();
    return new Promise(async (value) => {
      value(loading);
    });
  }

  async showModal(options: ModalOptions): Promise<any> {
    let modal: HTMLIonModalElement = await this.modalController.create(options);
    modal.present()
    return new Promise(async (value) => {
        value((await modal.onDidDismiss()).data)
    })
  }

  async menuControl():Promise<MenuController>{
    return this.menuController;
  }
}
 