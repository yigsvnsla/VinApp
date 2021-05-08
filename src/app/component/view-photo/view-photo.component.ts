import { IonSlides } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { Component, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-view-photo',
  templateUrl: './view-photo.component.html',
  styleUrls: ['./view-photo.component.scss'],
})
export class ViewPhotoComponent implements OnInit {
  @Input() Image:any
  @ViewChild(IonSlides) slides:IonSlides
  public sliderOpts={
    zoom:true,
    toggle:true,
    initialSlide:0,
    centeredSlides:true,
    freeMode:false
  }

  constructor(private modalController:ModalController) { }

  ngOnInit() {}

  ionViewDidEnter(){
    this.slides.update()
  }

   async viewZoom(inner:boolean){
    let slider = await this.slides.getSwiper()
    let zoom = slider.zoom

    inner ? zoom.in():zoom.out()
  }

  viewClose(){
    this.modalController.dismiss()
  }
}
