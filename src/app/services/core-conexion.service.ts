import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LoadingController } from "@ionic/angular";
import { CorePart, CoreVechicle } from "./temp.service";
import { Plugins } from "@capacitor/core";
const { Device } = Plugins;

@Injectable({
  providedIn: "root",
})
export class CoreConexionService {
  URL = "http://backuppapa.sytes.net:1337/";
  PANEL = "https://panel.mdautoparts.com/form/storeMultipleFile";

  constructor(private http: HttpClient, private loading: LoadingController) {}

  async showLoading(message: string): Promise<HTMLIonLoadingElement> {
    let r: HTMLIonLoadingElement;
    return new Promise(async (value) => {
      r = await this.loading.create({
        message: message,
      });
      await r.present();
      value(r);
    });
  }

  async search(vin: string): Promise<CoreVechicle> {
    let info = await Device.getInfo();
    return new Promise(async (value) => {
      let loading = await this.showLoading("Loading...");
      this.http
        .get<SearchAPI>(
          `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`
        )
        .subscribe(
          async (res) => {
            value({
              Id: "0",
              Maker: res.Results[6].Value,
              Model: res.Results[8].Value,
              Year: parseInt(res.Results[9].Value),
              Trim: res.Results[12].Value,
              Serie: res.Results[11].Value,
              Body: res.Results[22].Value,
              Cylinders: parseInt(res.Results[69].Value),
              Type: res.Results[13].Value,
              Parts: null,
              Vin: vin,
              Device: info.uuid,
              Name: "",
            });
            loading.dismiss();
          },
          (fail) => {
            loading.dismiss();
            value(null);
          }
        );
    });
  }

  async searchVehicle(id: string): Promise<CoreVechicle> {
    return new Promise(async (value) => {
      let loading = await this.showLoading("Search vehicle...");
      let info = await Device.getInfo();
      this.http.get<any>(this.URL + `Products/${id}`).subscribe(async (res) => {
        value({
          Maker: res.maker,
          Model: res.model,
          Year: parseInt(res.year),
          Trim: res.trim,
          Serie: res.serie,
          Body: res.boddyClass,
          Cylinders: parseInt(res.cylinders),
          Parts: await this.findComponents(id),
          Vin: res.vin,
          Id: res.id,
          Type: res.type,
          Device: info.uuid,
          Name: res.name,
        });
        await loading.dismiss();
      });
    });
  }

  async findVehicles(): Promise<CoreVechicle[]> {
    let uuid = await Device.getInfo();
    return new Promise(async (value) => {
      this.http
        .get<any[]>(this.URL + `Products?device_eq=${uuid.uuid}`)
        .subscribe(
          async (res) => {
            let v: CoreVechicle[] = [];
            res.forEach((element) => {
              v.push({
                Maker: element.maker,
                Model: element.model,
                Year: parseInt(element.year),
                Trim: element.trim,
                Serie: element.serie,
                Body: element.boddyClass,
                Cylinders: parseInt(element.cylinders),
                Parts: null,
                Vin: element.vin,
                Id: element.id,
                Type: element.type,
                Device: element.uuid,
                Name: element.name,
              });
              value(v);
            });
          },
          (fail) => {
            value(null);
          }
        );
    });
  }

  async findArray(table: string, query?: string): Promise<any[]> {
    return new Promise(async (value) => {
      this.http
        .get<any[]>(this.URL + `${table}${query ? "/" + query : ""}`)
        .subscribe(
          async (res) => {
            value(res);
          },
          (fail) => {
            value(null);
          }
        );
    });
  }

  async findComponents(id: string): Promise<CorePart[]> {
    return new Promise(async (value) => {
      this.http
        .get<any[]>(this.URL + `Components?product.id_eq=${id}`)
        .subscribe(
          (res) => {
            let c: CorePart[] = [];
            res.forEach((element) => {
              let a: CorePart = new CorePart();
              a.code = element.id;
              a.part = element.part.name;
              a.price = element.price;
              a.status = element.status;
              a.setCategory(element.part.category);
              a.setImagesFromURL(element.photos);
              c.push(a);
            });
            value(c);
          },
          (fail) => {
            value(null);
            console.log("Fail");
          }
        );
    });
  }

  async uploadPart(id: string, part: CorePart, param: number[]): Promise<CorePart> {
    return new Promise(async (value) => {
      this.http
        .post<any>(
          `${this.URL}Components/`,
          {
            part: part.id,
            price: part.price,
            photos: param,
            product: parseInt(id),
            status: part.status,
            category: part.categoryId,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .subscribe(
          (res) => {
            console.log(res);
            let r: CorePart = new CorePart();
            r.code = res.id;
            r.part = res.part.name;
            r.price = res.price;
            r.status = res.status;
            r.setCategory(res.part.category);
            r.setImagesFromURL(res.photos);
            value(r);
          },
          (fail) => {
            value(null);
          }
        );
    });
  }

  async uploadVehicle(data: CoreVechicle): Promise<number> {
    return new Promise(async (value) => {
      let loading = await this.showLoading("Sing in...");
      this.http
        .post<any>(this.URL + "Products", {
          name: `${data.Maker} ${data.Model} ${data.Year}`,
          maker: data.Maker,
          model: data.Model,
          year: data.Year,
          cylinders: data.Cylinders,
          serie: data.Serie,
          trim: data.Trim,
          device: data.Device,
          type: data.Type,
          boddyClass: data.Body,
          vin: data.Vin,
        })
        .subscribe(
          (res) => {
            loading.dismiss();
            value(res.id);
          },
          (fail) => {
            loading.dismiss();
            value(null);
          }
        );
    });
  }

  async imagesStrapi(data: FormData): Promise<number[]> {
    return new Promise(async (value) => {
      if (!data.has("files")) {
        value([]);
        return;
      } else {
        let loading = await this.showLoading("Subiendo imagenes...");
        this.http.post<any>(this.URL + "upload", data).subscribe((res) => {
          let r: number[] = [];
          res.forEach((element) => {
            r.push(element.id);
          });
          loading.dismiss();
          value(r);
        });
      }
    });
  }

  async uploadHeisler(data: FormData): Promise<any> {
    return new Promise(async (value) => {
      if (!data.has("files[]")) {
        value("No changes on heisler");
        return
      }
      this.http.post<any>(this.PANEL, data).subscribe((res) => {
        value(res);
      });
    });
  }
  //UPDATES
  async updatePart(part: CorePart, param: number[]): Promise<boolean> {
    return new Promise(async (value) => {
      this.http
        .put(`${this.URL}Components/${part.code}`, {
          part: part.id,
          price: part.price,
          photos: param,
          status: part.status,
          category: part.categoryId,
        })
        .subscribe((res) => {
          value(true);
        });
    });
  }
  //DELETES
  async delete(table: string, param?: string): Promise<boolean> {
    return new Promise(async (value) => {
      this.http.delete(this.URL + table + `${param ? param : ""}`).subscribe(
        (res) => {
          value(true);
        },
        (fail) => {
          value(false);
        }
      );
    });
  }

  async deleteAll(id: string): Promise<boolean> {
    return new Promise(async (value) => {
      let c: CorePart[] = await this.findComponents(id);
      for await (const i of c) {
        await this.delete("Components/", i.code.toString());
      }
      value(await this.delete("Products/", id));
    });
    
  }
}

export interface SearchAPI {
  Count: number;
  Message: string;
  SearchCriteria: string;
  Results: ApiValues[];
}

export interface ApiValues {
  Value: null | string;
  ValueId: null | string;
  Variable: string;
  VariableId: number;
}
