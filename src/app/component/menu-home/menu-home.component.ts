import { Component, OnInit } from '@angular/core';
import { UiComponentsService } from 'src/app/services/ui-components.service';
import { ModalPage } from '../modal/modal.page';

@Component({
  selector: 'app-menu-home',
  templateUrl: './menu-home.component.html',
  styleUrls: ['./menu-home.component.scss'],
})
export class MenuHomeComponent implements OnInit {

  constructor(private uiComponentsService:UiComponentsService) { }


  ngOnInit() {}

  async modalList(){
    (await this.uiComponentsService.menuControl())
      .close("menu-home").then(()=>{
      this.uiComponentsService.showModal({
        component: ModalPage,
        cssClass: "my-custom-class",
        swipeToClose: true,
      })
    })


  }

  listComponents(){
    
  }
  
}
