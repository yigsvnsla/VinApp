import { UiComponentsService } from "./ui-components.service";
import { throwError as observableThrowError } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { CorePart, CoreVechicle } from "./temp.service";
import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";
import { Plugins } from "@capacitor/core";
import { Router } from "@angular/router";
import { Storage } from "@ionic/storage";
const { Device } = Plugins;

@Injectable({
  providedIn: "root",
})
export class CoreConexionService {
  URL = "http://backup1.myvnc.com:1337/";
  PANEL = "https://panel.mdautoparts.com/form/storeMultipleFile";

  constructor(
    private http: HttpClient,
    private router: Router,
    private uiComponentsService: UiComponentsService,
    private storage: Storage
  ) {}

  public filterSlash(str: string): string[] {
    return str.split("/");
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
            this.router.navigateByUrl("/manual");
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
      this.http.get<any>(this.URL + `Products/${id}`).subscribe(
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
            console.error("findVehicle: ", fail);
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
            console.error("findArray: ", fail);
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
              a.id = element.part.id;
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
            console.error("uploadPart", fail);
            value(null);
          }
        );
    });
  }

  async uploadVehicle(data: CoreVechicle): Promise<number> {
    return new Promise(async (value) => {
      let loading = this.uiComponentsService.showLoading("Sing in...");
      this.http
        .post<any>(this.URL + "Products", {
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
        })
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
          .post<any>(this.URL + "upload", data)
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
      this.http.post<any>(this.PANEL, data).subscribe(
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
  async updateVehicle(vehicle: CoreVechicle): Promise<any> {
    return new Promise(async (value) => {
      this.http
        .put<any>(`${this.URL}Products/${vehicle.Id}`, {
          cylinders: vehicle.Cylinders,
          serie: vehicle.Serie,
          trim: vehicle.Trim,
          type: vehicle.Type,
          boddyClass: vehicle.Body,
        })
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
