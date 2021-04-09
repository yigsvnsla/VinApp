import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Plugins } from "@capacitor/core";
import { AlertController } from "@ionic/angular";
import { CoreConexionService } from "./core-conexion.service";
const { Device } = Plugins;

@Injectable({
  providedIn: "root",
})

export class TempService {
  currentVehicle: CoreVechicle;
  currentPart: CorePart;
  formStrapi: FormData;
  formHeisler: FormData;
  constructor(
    private router: Router,
    private core: CoreConexionService,
    private alert: AlertController
  ) { }

  setVehicle(vehicle: CoreVechicle) {
    this.currentVehicle = vehicle;
    this.router.navigateByUrl("/manual");
  }
  async viewVehicle(vehicle: CoreVechicle) {
    this.currentVehicle = await this.core.searchVehicle(vehicle.Id);
    await this.router.navigateByUrl("/item");
  }
  async viewPart(part?: CorePart) {
    this.currentPart = part ? part : new CorePart();
    this.router.navigateByUrl("/camera");
  }
  async empty() {
    let info = await Device.getInfo();
    this.currentVehicle = {
      Maker: "",
      Model: "",
      Year: null,
      Trim: "",
      Serie: "",
      Body: "",
      Cylinders: null,
      Parts: null,
      Vin: "",
      Id: "0",
      Type: "",
      Device: info.uuid,
      Name: "",
    };
    this.currentPart = null;
    this.router.navigateByUrl("/manual");
    return this.currentVehicle;
  }
  async uploadPart(boo: boolean) {
    if (this.currentPart.code === 0) {
      let tempPart: CorePart = await this.core.uploadPart(this.currentVehicle.Id, this.currentPart, await this.currentPart.getNumbers(
        await this.core.imagesStrapi(await this.form(true))
      ))
      this.currentVehicle.Parts.push(tempPart);
      boo ? this.viewVehicle(this.currentVehicle) : null;
      console.log(await this.core.uploadHeisler(await this.form(false, tempPart.code)));
      return;
    }
    if (this.core.updatePart(
      this.currentPart,
      await this.currentPart.getNumbers(
        await this.core.imagesStrapi(await this.form(true))
      )
    )) {
      boo ? this.viewVehicle(this.currentVehicle) : null;
    }
  }

  async form(boo?: boolean, id?: number): Promise<FormData> {
    return new Promise(async (value) => {
      let data: FormData = new FormData();
      if (boo) {
        this.currentPart.images.forEach((element) => {
          if (parseInt(element.id) === 0) {
            data.append(
              "files",
              element.blob,
              `${this.currentVehicle.Id}-${this.currentPart.id}.jpg`
            );
          }
        });
        value(data);
      } else {
        this.currentPart.images.forEach((element) => {
          if (parseInt(element.id) === 0) {
            data.append(
              "files[]",
              element.blob,
              `${this.currentVehicle.Id}-${this.currentPart.id}.jpg`
            );
          }
        });
        data.append("ref", this.currentVehicle.Id);
        data.append("refads",this.currentVehicle.Id);
        data.append("refpart", id.toString());
        data.append("nombre", this.currentPart.part);
        data.append("descrip", "Vacio");
        data.append("precio", this.currentPart.price.toString());
        data.append("condicion", this.currentPart.status);
        data.append("categoria", this.currentPart.category);
        value(data);
      }
    });
  }
  async uploadVehicle() {
    this.currentVehicle.Id = (
      await this.core.uploadVehicle(this.currentVehicle)
    ).toString();
    this.viewVehicle(this.currentVehicle);
  }
  async updateVehicle() {
    await this.core.updateVehicle(this.currentVehicle);
  }
  async showMessage(text: string) {
    let alert = await this.alert.create({
      header: "Alert",
      message: text,
      buttons: ["OK"],
    });
    await alert.present();

    return alert;
  }
}

export interface CoreVechicle {
  Model: string;
  Maker: string;
  Year: number;
  Trim: string;
  Serie: string;
  Body: string;
  Cylinders: number;
  Parts: CorePart[];
  Vin: string;
  Id: string;
  Type: string;
  Device: string;
  Name: String;
}

export class CorePart {
  code: number;
  id: string;
  part: string;
  status: string;
  category: string;
  categoryId: string;
  price: number;
  images: Image[];
  arrImage: number[];

  constructor() {
    this.id = "";
    this.code = 0;
    this.part = "";
    this.status = "";
    this.category = "";
    this.categoryId = "";
    this.price = 0;
    this.images = [];
  }

  setCategory(id: any) {
    this.categoryId = id;
    switch (id) {
      case 1:
        this.category = "EXTERIOR";
        break;
      case 2:
        this.category = "INTERIOR";
        break;
      case 3:
        this.category = "UNDERHOOD";
        break;
      case 4:
        this.category = "UNDERNEATH";
        break;
      case 5:
        this.category = "WHEEL";
        break;
      case 6:
        this.category = "BODY";
        break;
      case 7:
        this.category = "MECHANICAL";
        break;
    }
  }


  async getNumbers(param: any[]): Promise<number[]> {
    return new Promise(async (value) => {
      let newArr: number[] = [];
      this.images.forEach((e) => {
        if (parseInt(e.id) !== 0) {
          newArr.push(parseInt(e.id));
        }
      });
      value(newArr.concat(param));
    });
  }

  setImagesFromURL(param: any[]) {
    param.forEach((element) => {
      let a: Image = new Image();
      a.setURL(element.url);
      a.id = element.id;
      this.images.push(a);
    });
  }
}
export class Image {
  id: string;
  url: string;
  blob: Blob;
  b64: string;
  name: string;
  constructor(b64?: string, name?: string) {
    if (b64 && name) {
      this.id = "0";
      this.url = "";
      this.blob = this.b64toBlob(b64, "image/jpeg");
      this.name = name;
      this.b64 = b64;
    }
  }
  setURL(url: string) {
    this.url = `http://backuppapa.sytes.net:1337${url}`;
  }
  getImage(): string {
    return this.id === "0" ? "data:image/jpge;base64," + this.b64 : this.url;
  }

  b64toBlob(b64Data: any, contentType = "", sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
}
