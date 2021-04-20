import { ModalController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { ModalOptions } from '@ionic/core';
import { MenuController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UiComponentsService {

  constructor(private toastController: ToastController, private loadingController: LoadingController, private modalController: ModalController,private menuController:MenuController) { }

  async showToast(message: string): Promise<HTMLIonToastElement> {
    let toast: HTMLIonToastElement = await this.toastController.create({
      message: message,
      duration: 1000
    })
    toast.present();
    return new Promise(async (value) => {
      value(toast);
    })
  }

  async showLoading(message: string): Promise<HTMLIonLoadingElement> {
    let loading: HTMLIonLoadingElement = await this.loadingController.create({
      message: message,
    });
    loading.present();
    return new Promise(async (value) => {
      value(loading);
    });
  }

  async showModal(options: ModalOptions): Promise<HTMLIonModalElement> {
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
 