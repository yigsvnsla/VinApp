import { StorageService } from './../../services/storage.service';
import { UiComponentsService } from 'src/app/services/ui-components.service';
import { Component, OnInit } from "@angular/core";
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { FormControl, Validators } from "@angular/forms";
import {
  AlertController,
  Platform,

} from "@ionic/angular";

import { Plugins, KeyboardInfo } from "@capacitor/core";
import { TempService } from "src/app/services/temp.service";
import { CoreConexionService } from "src/app/services/core-conexion.service";

const { Device, Keyboard } = Plugins;
  //keyboard Show
  Keyboard.addListener("keyboardWillShow", (_info: KeyboardInfo) => {
    document.getElementById("ionFooter").classList.toggle("hidden");
  });
  //keyboard Hide
  Keyboard.addListener("keyboardWillHide", () => {
    document.getElementById("ionFooter").classList.toggle("hidden");
  });


@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {
  public result: string = "";
  codeResult: string = "";
  vinInput = new FormControl(this.codeResult, [
    Validators.required,
    Validators.maxLength(17),
    Validators.minLength(17),
  ]);
  
  subcribe: any

  constructor(
    private barcode: BarcodeScanner,
    private alertController: AlertController,
    private main: TempService,
    private core: CoreConexionService,
    private platform: Platform,
    private uiComponentsService:UiComponentsService,
    private storageService:StorageService
    ) {
      this.subcribe = this.platform.backButton.subscribeWithPriority(10, () => {
        if (this.constructor.name == 'HomePage') {
          if (window.confirm("do you want to exit app")) {
            navigator['app'].exitApp()
          }
          return
        }
      })
      this.storageService.set('filter',{status:true})
    }
    
  async ngOnInit() { 

  }
  
  manualPage() {
    this.main.empty();
  }

  async ionViewWillEnter(){
    this.result = ""
  }



  private compareTable = [
    { "A": 1, "J": 1 },
    { "B": 2, "K": 2, "S": 2 },
    { "C": 3, "L": 3, "T": 3 },
    { "D": 4, "U": 4, "M": 4 },
    { "E": 5, "N": 5, "V": 5 },
    { "F": 6, "W": 6 },
    { "G": 7, "P": 7, "X": 7 },
    { "H": 8, "Y": 8 },
    { "R": 9, "Z": 9 }
  ];

  private async filter(vin: string) {
    // funcion que nos retorna un arreglo con datos modificados para calcularlos
    let replace = (str: string): Promise<string[]> => {
      return new Promise(async (res, _rej) => {
        res([...str.toUpperCase()].map((value, index) => {
          return comparator(value)
        }))
      })
    }

    let comparator = (char: string): string => {
      let res: string
      if ((/^[0-9]+$/).test(char)) {
        // 1) debemos remplazar los numeros por sus mismos valores
        //console.log("esto es un numero")
        return char
      } else {
        // 2) remplazar letras por numeros como indican su pocision en la tabla
        //console.log("esto es un caracter")
        this.compareTable.forEach(result => {
          for (var key in result) {
            if (key == char) {
              res = result[key];
              break;
            };
          };
        });
        return res.toString()
      }
    }

    // 3) se debe determinar el factor multiplicador del valor de cada dígito
    //  y para cada posición en el VIN excepto el que ocupa la novena (9) posición 
    // (dado que es la posición objeto de este cálculo, la posición que ocupa 
    // el dígito de verificación y es lo que se quiere calcular)
    //   S   A   L   M   H   1   3   4     7    6   A   2   2   0   1   2   3
    //  [1] [2] [3] [4] [5] [6] [7] [8]   [9]  [10][11][12][13][14][15][16][17]
    //  [x8][x7][x6][x5][x4][x3][x2][x10] [x0] [x9][x8][x7][x6][x5][x4][x3][x2]
    let calculator = (arr: string[]) => {
      let multipler: number = 2
      let res: number = 0
      arr.reverse();
      let result = arr.map((e, index) => {
        //* obtener el noveno digito leyendo esta ecuacion de izquierda a derecha
        // - en este caso invertimos el arreglo para un facil manejo de el calculo
        if (index < 8) {
          res = parseInt(e) * multipler
          multipler++
        }
        if (index == 8) {
          multipler = 0
          res = parseInt(e) * multipler
        }
        if (index == 9) {
          multipler = 10
          res = parseInt(e) * multipler
        }
        if (index > 9) {
          if (index > 9 && multipler == 10) {
            multipler = 2
            res = parseInt(e) * multipler
            multipler++
          } else {
            res = parseInt(e) * multipler
            multipler++
          }
        }
        return res
      })
      return total(result)
    }

    //4) se debe multiplicar los números y los valores numéricos de las letras por su factor asignado en la tabla anterior, 
    // y sumar todos los productos resultantes. A continuación, dividir la suma de los productos por 11. El resto es el dígito de verificación.
    // Si el resto resulta de valor 10, entonces el dígito de verificación es la letra X.
    // " vin%11 = resto "
    let total = (arr: number[]) => {
      let val: number = 0
      arr.forEach(element => {
        val = val + element
      });
      return val % 11
    }

    let verify = async () => {
      try {
        //validacion(las letras I, O y Q no se permiten junto a la longitud de la cadena)
        if (vin.length == 17) {
          if (!(/[IOQ]/g.test(vin))) {
            return calculator(await replace(vin))
          } else {
            this.uiComponentsService.showToast("this is invalid vin code")
          }
        } else {
          if (vin.length > 0) {
            this.uiComponentsService.showToast("this vin code is much short o much large")
          } else {
            this.manualPage();
          }
        }
      } catch (e) {
        console.error("VinFilter: ", e.message)
      }
    }

    let result = async () => {
      return parseInt(await replace(vin).then(e => e[8])) == await verify() ? true : false
    }
    return await result()
  };

  //"SALMH13446A220123"

  async searchVin() {
    switch (await this.storageService.get('filter')) {
      case true:
        if (await this.filter(this.result)) {
          await this.core.search(this.result)
            .then(async (e) => {
              this.main.setVehicle(e)
            })
        }
        break;
      case false:
        if (this.result.length == 17) {
          await this.core.search(this.result)
            .then(async (e) => {
              this.main.setVehicle(e)
            })
        }  else {
          if (this.result.length > 0) {
            this.uiComponentsService.showToast("this vin code is much short o much large")
          } else {
            this.manualPage();
          }
        }
        break;
    }
  }


  async scan() {
    const _result = await this.barcode.scan({
      orientation: "portrait",
      disableSuccessBeep: true,
    });
    this.result = _result.text;
  }

}
