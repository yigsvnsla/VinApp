import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-configurations-app',
  templateUrl: './configurations-app.page.html',
  styleUrls: ['./configurations-app.page.scss'],
})
export class ConfigurationsAppPage implements OnInit {

  public activateFilter: boolean;

  public templateItems:templateItems[]=[
    {title:'config1',icon:'cog'},
    {title:'config2',icon:'cog'},
    {title:'config3',icon:'cog'},
    {title:'config4',icon:'cog'}
  ]

  constructor(private storageService:StorageService) { }

  ngOnInit() {
  }

  toogleEvent(e: CustomEvent){
    this.storageService.update('filter',{status:e.detail.checked})
  }

}

interface templateItems{
  title:string
  icon:string
}
