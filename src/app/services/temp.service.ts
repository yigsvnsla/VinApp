import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Plugins } from "@capacitor/core";
import { AlertController } from "@ionic/angular";
import { CoreConexionService } from "./core-conexion.service";
import { StorageService } from "./storage.service";
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
    private alert: AlertController,
  ) { }

  setVehicle(vehicle: CoreVechicle) {
    this.currentVehicle = vehicle;

  }
  async viewVehicle(vehicle: CoreVechicle) {
    this.currentVehicle = await this.core.searchVehicle(vehicle.Id);
    this.router.navigateByUrl("/item");
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
      await this.core.uploadHeisler(await this.form(false, tempPart.code))
      this.currentVehicle.Parts.push(tempPart);
      boo ? this.viewVehicle(this.currentVehicle) : null;
      (console.log("Funciona"))
      return;
    }
    if (this.core.updatePart(
      this.currentPart,
      await this.currentPart.getNumbers(
        await this.core.imagesStrapi(await this.form(true))
      )
    )) {
      console.log(this.currentPart.code);
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
        data.append("refads", this.currentVehicle.Id);
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
    let temp = await this.core.updateVehicle(this.currentVehicle);
    this.currentVehicle.Cylinders = temp.Cylinders;
    this.currentVehicle.Trim = temp.Trim;
    this.currentVehicle.Type = temp.Type;
    this.currentVehicle.Body = temp.Body;
    this.currentVehicle.Serie = temp.Serie;
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
        this.category = "Axle";
        break;
      case 2:
        this.category = "Brakes";
        break;
      case 3:
        this.category = "Cooling And Heating";
        break;
      case 4:
        this.category = "Doors";
        break;
      case 5:
        this.category = "Electrical";
        break;
      case 6:
        this.category = "Air And Fuel";
        break;
      case 7:
        this.category = "Center Body";
        break;
      case 8:
        this.category = "Engine";
        break;
      case 9:
        this.category = "Engine Accesories";
        break;
      case 10:
        this.category = "Entertainment";
        break;
      case 11:
        this.category = "Front Body";
        break;
      case 12:
        this.category = "Glass And Mirror";
        break;
      case 13:
        this.category = "Interior";
        break;
      case 13:
        this.category = "Ligths";
        break;
      case 15:
        this.category = "Rear Body";
        break;
      case 16:
        this.category = "Safety";
        break;
      case 16:
        this.category = "Suspension Steering";
        break;
      case 18:
        this.category = "Transmission";
        break;
      case 19:
        this.category = "Wheels";
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

  setImagesFromURL(param: any[],  url:string) {
    param.forEach((element) => {
      let a: Image = new Image();
      a.setURL(url + element.url.substr(1));
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
    this.url = url;
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
