import { UiComponentsService } from 'src/app/services/ui-components.service';
import { CoreConexionService } from 'src/app/services/core-conexion.service';
import { ModalController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  textSearch: string = ""
  @Input() AddElements?:boolean = false
  @Input() Items:any[]=[]
  @Input() id?: string
  @Input() table?: string

  constructor(
    private modalController:ModalController,
    private uiComponentsService:UiComponentsService,
    private coreConexionService: CoreConexionService
  ) { }

  async ngOnInit() {
    
  }

  backClick() {
    this.modalController.dismiss();
  }

  search(event) {
    this.textSearch = event.detail.value;
  }

  addComponent(){
    this.uiComponentsService.showAlert({
      header:'Alert',
      subHeader:'Gracias por apoyarnos en seguir creciendo...',
      message:'esta opcion es temporal aqui puedes agregar un componente en caso que no existan en nuestra base de datos :)',
      inputs:[{
        name:'alertValue',
        type: 'text',
        placeholder:'insert here the component',
        attributes:{
          required:true,
          minLength:3,
          autoCapitalize:true
        }
      }],
      buttons:[{
        text:'Cancel',
        role:'cancel'
      },{
        text:'AGREE',
        role:'ok',
        handler:async (e)=>{
          if(this.id && this.table){
            this.Items.push(await this.coreConexionService.genericUpload(this.table, e.alertValue, this.id))
            this.uiComponentsService.showToast("Component address in the list")
          }
        }
      }]
    })
  }

  returnSelect(_val: any) {
    if (_val) {
    this.modalController.dismiss(_val)
    } 
  }
}

export interface ListItemInterface {
  title:string
}
