import { CoreConexionService } from 'src/app/services/core-conexion.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UiComponentsService } from 'src/app/services/ui-components.service';
import { ModalPage } from '../modal/modal.page';
import { ListComponent } from '../list/list.component';

@Component({
  selector: 'app-menu-home',
  templateUrl: './menu-home.component.html',
  styleUrls: ['./menu-home.component.scss'],
})
export class MenuHomeComponent implements OnInit {

  constructor(
    private uiComponentsService: UiComponentsService, 
    private router: Router,
    private coreConexionService:CoreConexionService
  ) { }


  ngOnInit() { }

  async modalList() {
    (await this.uiComponentsService.menuControl())
      .close("menu-home").then(() => {
        this.uiComponentsService.showModal({
          component: ModalPage,
          cssClass: "my-custom-class",
          swipeToClose: true,
        });
      })
  }

  goConfig() {
    this.router.navigateByUrl("/settings")
  }

  async listComponents() {    

    
  }

}
