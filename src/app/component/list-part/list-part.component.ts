import { UiComponentsService } from 'src/app/services/ui-components.service';
import { ModalController } from '@ionic/angular';
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-part',
  templateUrl: './list-part.component.html',
  styleUrls: ['./list-part.component.scss'],
})
export class ListPartComponent implements OnInit, AfterViewInit  {
  
  @Input() Items:any[]
  items: any [] = []

  textSearch : string = ""

  constructor(
    private modalController:ModalController,
    private uiComponentsService:UiComponentsService,
  ) { }

  async ngOnInit() {
    this.items = this.Items.slice(0,30);
    
  }
  ngAfterViewInit(){
    setTimeout(async ()=>{
    this.items = this.items.concat(await this.showLazy(31,60));
    for (let index = 60; index < this.Items.length-1; index = index + 30) {
      console.log(index+1 ,index+30)
      this.items = this.items.concat(await this.showLazy(index+1 ,index+30, 100));
    }
    }, 35)
  }

  async showLazy(number1: number, number2: number, timer?: number): Promise<any[]>{
    return new Promise(async value=>{
      if(timer){
        setTimeout(()=>{
          value(this.Items.slice(number1, number2));
      }, timer);
      }else{
        value(this.Items.slice(number1, number2));
      }
    });
  }

  onExit(){
    this.modalController.dismiss()
  }

  selectItem(item:any){
    this.modalController.dismiss(item)
  }
  onSearchChange(event){
    this.textSearch = event.detail.value
  }
}
