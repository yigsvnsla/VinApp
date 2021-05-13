import { UiComponentsService } from 'src/app/services/ui-components.service';
import { ModalController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-part',
  templateUrl: './list-part.component.html',
  styleUrls: ['./list-part.component.scss'],
})
export class ListPartComponent implements OnInit {
  
  @Input() Items:any

  textSearch : string = ""

  constructor(
    private modalController:ModalController,
    private uiComponentsService:UiComponentsService
  ) { }

  async ngOnInit() {
    console.log(this.Items)
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
