import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { AlertController } from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class HttpService {
  url = "http://backuppapa.sytes.net:1337/";

  constructor(private http: HttpClient, private alert: AlertController) {}

  getCategories() {
    return this.http.get<any[]>(this.url + "Categories");
  }
  getParts(id: number) {
    return this.http.get<any[]>(this.url + `Parts/?category.id=${id}`);
  }
  getComponentByUUID(uuid: string) {
    return this.http.get<any[]>(
      this.url + `Components?product.device_contains=${uuid}`
    );
  }
  getComponentByID(uuid: string) {
    return this.http.get<any[]>(
      this.url + `Components?product.id_contains=${uuid}`
    );
  }
  getOneComponent(id: string) {
    return this.http.get<any>(this.url + `components/${id}`);
  }
  ApiSearch(vin: string) {
    return this.http.get<any>(
      `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`
    );
  }

  uploadCar(options: {}) {
    return this.http.post(this.url + "Products", options, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  uploadComponent(id: number, options: {}) {
    return this.http.post(this.url + `Components`, options, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  uploadImage(data: FormData) {
    return this.http.post(this.url + "upload", data);
  }
  uploadHeisler(data: FormData){
    return this.http.post(`https://panel.mdautoparts.com/u`, data);
  }

  //Gestion de Modelos

  getMakers() {
    return this.http.get<any[]>(this.url + "Makers");
  }

  getModels(id: string) {
    return this.http.get<any[]>(this.url + `Models?maker.id=${id}`);
  }

  showCategories() {}

  async showAlert(data: any[], header?: string): Promise<any> {
    return new Promise(async (res) => {
      let alert = await this.alert.create({
        header: header || "Select one option",
        inputs: this.getInputs(data),
        buttons: [
          {
            text: "Confirm",
            handler: (value: any) => {
              let newValue: string = JSON.stringify(value);
              res({
                id: newValue.split("-")[1],
                name: newValue.split("-")[0],
              });
            },
          },
        ],
      });
      await alert.present();
    });
  }

  getInputs(data: any[]): any[] {
    let r: any[] = [];
    for (const item of data) {
      r.push({
        name: `radio-${item.name}`,
        label: item.name,
        value: `${item.name}-${item.id}`,
        checked: false,
        type: "radio",
      });
    }
    return r;
  }

  getProductsByUUID(uuid: string) {
    return this.http.get<any[]>(
      this.url + `Products?device_eq=${uuid}`
    );
  }
  getProductsByID(uuid: string) {
    return this.http.get<any>(this.url + `Products/${uuid}`);
  }
  getCategorybyID(id: any) {
    return this.http.get<any>(this.url + `Categories/${id}`);
  }

  putComponent(c: any) {
    console.log(c.id);
    return this.http.put(
      this.url + `Components/${c.internalID}`,
      c.AgetJSON(),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  deleteComponent(id: any) {
    return this.http.delete(this.url + `Components/${id}`);
  }
  deleteProduct(id:any){
    return this.http.delete(this.url + `Products/${id}`);
  }
}
