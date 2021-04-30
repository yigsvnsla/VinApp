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

  constructor(private storageService:StorageService) { 
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
  
  async editUrl(value:string){
    this.storageService.update('url',{})
  }
}

interface templateItems{
  title:string
  icon:string
}
