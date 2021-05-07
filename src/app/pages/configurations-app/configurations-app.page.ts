import { UiComponentsService } from './../../services/ui-components.service';
import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-configurations-app',
  templateUrl: './configurations-app.page.html',
  styleUrls: ['./configurations-app.page.scss'],
})
export class ConfigurationsAppPage implements OnInit {

  public activateFilter: boolean;
  public urlPrimary:string
  public urlHeisler:string

  public templateItems:templateItems[]=[
    {title:'config1',icon:'cog'},
    {title:'config2',icon:'cog'},
    {title:'config3',icon:'cog'},
    {title:'config4',icon:'cog'}
  ]

  constructor(
    private storageService:StorageService,
    private uiComponentsService:UiComponentsService
    ) { 
    this.init()
  }

  async ngOnInit() {

  }

  private async init(){
    this.activateFilter= (await this.storageService.get('filter')).status
    this.urlPrimary = (await this.storageService.get("url")).urlPrimary
    this.urlHeisler = (await this.storageService.get('url')).urlHeisler
  }

  toogleEvent(e: CustomEvent){
    this.storageService.update('filter',{status:e.detail.checked})
  }
  
  async editUrl(value:string,value2:string){
    console.log(value)
    let alert = await this.uiComponentsService.showAlert({
      header:'Alert',
      message:'Insert new url',
      inputs:[{
        name:'urlPrimary',
        type: 'text',
        placeholder:'insert here the new url',
        attributes:{
          value:this.urlPrimary
        }
      },{
        name:'urlHeisler',
        type: 'text',
        placeholder:'insert here the new url 2',
        attributes:{
          value:this.urlHeisler
        }
      }],
      buttons:[{
        text:'Cancel',
        role:'cancel'
      },{
        text:'AGREE',
        role:'ok',
        handler:async (e)=>{
          this.urlPrimary = e.urlPrimary !== "" ? e.urlPrimary:this.urlPrimary;
          this.urlHeisler = e.urlHeisler !== "" ? e.urlHeisler:this.urlHeisler;
          this.storageService.update('url',{ urlPrimary:this.urlPrimary, urlHeisler: this.urlHeisler})
          this.uiComponentsService.showToast("Component address in the list")
          alert.dismiss()
        }
      }]
    })
  }
}

interface templateItems{
  title:string
  icon:string
}
