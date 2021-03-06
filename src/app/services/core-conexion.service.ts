import { StorageService } from "src/app/services/storage.service";
import { UiComponentsService } from "./ui-components.service";
import { throwError as observableThrowError } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { CorePart, CoreVechicle } from "./temp.service";
import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";
import { Plugins } from "@capacitor/core";
import { Router } from "@angular/router";
import { ManualPagePage } from "../pages/manual-page/manual-page.page";
const { Device } = Plugins;

@Injectable({
  providedIn: "root",
})
export class CoreConexionService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private uiComponentsService: UiComponentsService,
    private storageService: StorageService
  ) {}
  async getMakers() {
    let loading = this.uiComponentsService.showLoading("Loading");
    return new Promise(async (value, reject) => {
      this.http
        .get<any[]>(
          (await this.storageService.get("url")).urlPrimary + "Makers"
        )
        .pipe(catchError(this.errorHandler))
        .subscribe(
          async (res) => {
            (await loading).dismiss();
            value(res);
          },
          async (err) => {
            (await loading).dismiss();
            reject(err);
          }
        );
    });
  }

  async getModels(id: string) {
    let loading = await this.uiComponentsService.showLoading("Loading");
    return new Promise(async (value, reject) => {
      this.http
        .get<any[]>(
          (await this.storageService.get("url")).urlPrimary +
            `Models?maker.id=${id}&_sort=name:asc`
        )
        .pipe(catchError(this.errorHandler))
        .subscribe(
          async (res) => {
            loading.dismiss();
            value(res);
          },
          async (err) => {
            loading.dismiss();
            reject(err);
          }
        );
    });
  }

  async search(vin: string): Promise<CoreVechicle> {
    let info = await Device.getInfo();
    let toast = this.uiComponentsService.showLoading();
    return new Promise(async (value) => {
      this.http
        .get<SearchAPI>(
          `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`
        )
        .pipe(catchError(this.errorHandler))
        .subscribe(
          async (res) => {
            value({
              Id: "0",
              Maker: res.Results[6].Value,
              Model: res.Results[8].Value,
              Year: parseInt(res.Results[9].Value),
              Trim: res.Results[12].Value, //aqui ingresar algoritmo para devolver un array delista
              Serie: res.Results[11].Value,
              Body: res.Results[21].Value,
              Cylinders: parseInt(res.Results[68].Value),
              Type: "", //res.Results[13].Value -> la api devuelve datos fuera de contexto
              Parts: null,
              Vin: vin,
              Device: info.uuid,
              Name: "",
            });
            (await toast).dismiss();
          },
          async (fail) => {
            console.error("Search: ", fail);
            (await toast).dismiss();
            value(null);
            this.uiComponentsService.showToast(
              "this service is temporarily out of service"
            );
          }
        );
    });
  }

  private errorHandler(error: HttpErrorResponse) {
    return observableThrowError(error.message);
  }

  async searchVehicle(id: string): Promise<CoreVechicle> {
    return new Promise(async (value) => {
      let toast = this.uiComponentsService.showLoading("Search vehicle...");
      let info = await Device.getInfo();
      this.http
        .get<any>(
          (await this.storageService.get("url")).urlPrimary + `Products/${id}`
        )
        .subscribe(
          async (res) => {
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
            (await toast).dismiss();
          },
          (fail) => {
            console.error("searchVehicle: ", fail);
          }
        );
    });
  }

  async findVehicles(): Promise<CoreVechicle[]> {
    let loading = this.uiComponentsService.showLoading("Find Vehicles");
    let uuid = await Device.getInfo();
    return new Promise(async (value) => {
      this.http
        .get<any[]>(
          (await this.storageService.get("url")).urlPrimary +
            `Products?device_eq=${uuid.uuid}`
        )
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
            (await loading).dismiss();
          },
          async (fail) => {
            console.error("findVehicle: ");
            value(null);
            (await loading).dismiss();
          }
        );
    });
  }

  async findArray(table: string, query?: string): Promise<any[]> {
    let loading = this.uiComponentsService.showLoading();
    return new Promise(async (value) => {
      this.http
        .get<any[]>(
          (await this.storageService.get("url")).urlPrimary +
            `${table}${query ? "/" + query : ""}`
        )
        .subscribe(
          async (res) => {
            (await loading).dismiss();
            value(res);
          },
          async (fail) => {
            (await loading).dismiss();
            console.error("findArray: ", fail);
            value(null);
          }
        );
    });
  }

  async findComponents(id: string): Promise<CorePart[]> {
    return new Promise(async (value) => {
      this.http
        .get<any[]>(
          (await this.storageService.get("url")).urlPrimary +
            `Components?product.id_eq=${id}`
        )
        .subscribe(
          (res) => {
            let c: CorePart[] = [];
            res.forEach(async (e) => {
              let a: CorePart = new CorePart();
              a.code = e.id;
              a.part = e.part.name;
              a.id = e.part.id;
              a.price = e.price;
              a.status = e.status;
              a.fit = e.fit;
              a.setCategory(e.part.category);
              a.setImagesFromURL(
                e.photos,
                (await this.storageService.get("url")).urlPrimary
              );
              c.push(a);
            });
            value(c);
          },
          (fail) => {
            value(null);
            console.error("findComponent: ", fail);
          }
        );
    });
  }

  async uploadPart(
    id: string,
    part: CorePart,
    param: number[]
  ): Promise<CorePart> {
    return new Promise(async (value) => {
      this.http
        .post<any>(
          `${(await this.storageService.get("url")).urlPrimary}Components/`,
          {
            part: part.id,
            price: part.price,
            photos: param,
            product: parseInt(id),
            status: part.status,
            category: part.categoryId,
            fit: part.fit
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .subscribe(
          async (res) => {
            console.log(res);
            let r: CorePart = new CorePart();
            r.code = res.id;
            r.part = res.part.name;
            r.price = res.price;
            r.status = res.status;
            r.setCategory(res.part.category);
            r.setImagesFromURL(
              res.photos,
              (await this.storageService.get("url")).urlPrimary
            );
            r.fit = res.fit;
            value(r);
          },
          (fail) => {
            console.error("uploadPart", fail);
            value(null);
          }
        );
    });
  }

  async genericUpload(table: string, param: any, id: string): Promise<any> {
    return new Promise(async (value) => {
      this.http
        .post<any>(
          `${(await this.storageService.get("url")).urlPrimary}${table}/`,
          {
            name: param,
            category: id,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .subscribe(
          (res) => {
            value({ id: res.id, name: res.name });
          },
          (fail) => {
            console.error("uploadGeneric", fail);
            value(false);
          }
        );
    });
  }

  async uploadVehicle(data: CoreVechicle): Promise<number> {
    return new Promise(async (value) => {
      let loading = this.uiComponentsService.showLoading("Sing in...");
      this.http
        .post<any>(
          (await this.storageService.get("url")).urlPrimary + "Products",
          {
            name: this.capitalizeAtWord(
              `${data.Year} ${data.Maker} ${data.Model}`,
              " "
            ),
            maker: this.capitalizeAtWord(data.Maker, "dasdasd"),
            model: this.capitalizeAtWord(data.Model, "dasdasdasd"),
            year: data.Year,
            cylinders: data.Cylinders,
            serie: data.Serie,
            trim: data.Trim,
            device: data.Device,
            type: data.Type,
            boddyClass: data.Body,
            vin: data.Vin,
          }
        )
        .subscribe(
          async (res) => {
            (await loading).dismiss();
            value(res.id);
          },
          async (fail) => {
            (await loading).dismiss();
            value(null);
            console.error("uploadVehicle: ", fail);
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
        let loading = this.uiComponentsService.showLoading(
          "Subiendo imagenes..."
        );
        this.http
          .post<any>(
            (await this.storageService.get("url")).urlPrimary + "upload",
            data
          )
          .subscribe(async (res) => {
            let r: number[] = [];
            res.forEach((element) => {
              r.push(element.id);
            });
            (await loading).dismiss();
            value(r);
          });
      }
    });
  }

  async uploadHeisler(data: FormData): Promise<any> {
    return new Promise(async (value) => {
      let loading = this.uiComponentsService.showLoading(
        "Upload server primary"
      );
      if (!data.has("files[]")) {
        value("No changes on heisler");
        (await loading).dismiss();
        return;
      }
      this.http.post<any>((await this.storageService.get("url")).urlHeisler, data).subscribe(
        async (res) => {
          (await loading).dismiss();
          value(res);
        },
        async (fail) => {
          (await loading).dismiss();
          console.error("upload heisler: ", fail);
          value(null);
        }
      );

    });
  }
  //UPDATES
  async updatePart(part: CorePart, param: number[]): Promise<boolean> {
    return new Promise(async (value) => {
      this.http
        .put(
          `${(await this.storageService.get("url")).urlPrimary}Components/${
            part.code
          }`,
          {
            part: part.id,
            price: part.price,
            photos: param,
            status: part.status,
            category: part.categoryId,
            fit: part.fit
          }
        )
        .subscribe((res) => {
          console.log(res);
          value(true);
        });
    });
  }
  async updateVehicle(vehicle: CoreVechicle): Promise<any> {
    return new Promise(async (value) => {
      this.http
        .put<any>(
          `${(await this.storageService.get("url")).urlPrimary}Products/${
            vehicle.Id
          }`,
          {
            cylinders: vehicle.Cylinders,
            serie: vehicle.Serie,
            trim: vehicle.Trim,
            type: vehicle.Type,
            boddyClass: vehicle.Body,
          }
        )
        .subscribe(
          (res) => {
            value({
              Trim: res.trim,
              Serie: res.serie,
              Body: res.boddyClass,
              Cylinders: parseInt(res.cylinders),
              Type: res.type,
              Name: res.name,
            });
          },
          (fail) => {
            value(null);
          }
        );
    });
  }
  //DELETES
  async delete(table: string, param?: string): Promise<boolean> {
    return new Promise(async (value) => {
      this.http
        .delete(
          (await this.storageService.get("url")).urlPrimary +
            table +
            `${param ? param : ""}`
        )
        .subscribe(
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

  //ERROR HANDLING
  heislerHandler(error: HttpErrorResponse) {}

  //UTILITIES
  capitalizeAtWord(message: string, split: string): string {
    if (message.split(split).length > 1) {
      let r: string[] = [];
      message
        .toLowerCase()
        .split(split)
        .forEach((element) => {
          if (
            element === null ||
            element === "null" ||
            element === undefined ||
            element === "undefined"
          ) {
            return;
          }
          r.push(
            element.charAt(0).toUpperCase() + element.substr(1).toLowerCase()
          );
        });
      return r.toString().replace(/\,/gi, " ");
    }
    return message.charAt(0).toUpperCase() + message.substr(1).toLowerCase();
  }

  removeWords(text: string, op?: string) {
    if (op) {
      return this.deleteWords(text);
    }
    let r: string[] = [];
    let trash = text;

    while (trash.indexOf("(") > -1 && trash.indexOf(")") > -1) {
      let w = trash.substr(
        trash.indexOf("(") + 1,
        trash.indexOf(")") - trash.indexOf("(") - 1
      );
      r.push(this.rectifier(w));
      trash = this.rectifier(trash.replace(`(${w})`, ""));
    }

    return r.toString().replace(/\,/gi, "/").toUpperCase();
  }
  private rectifier(text: string): string {
    if (text.charAt(0) === " ") {
      return text.substr(1).replace(/\  /gi, " ");
    }
    return text.replace(/\  /gi, " ");
  }
  private deleteWords(text: string): string {
    if (text.indexOf("(") > -1 && text.indexOf(")") > -1) {
      let del = text.substr(
        text.indexOf("("),
        text.indexOf(")") - text.indexOf("(") + 1
      );
      return this.deleteWords(this.rectifier(text.replace(del, "")));
    }
    return this.rectifier(text);
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

export interface ApiTypeVehicle {}
