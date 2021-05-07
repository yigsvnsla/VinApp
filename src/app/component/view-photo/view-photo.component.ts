import { ModalController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-photo',
  templateUrl: './view-photo.component.html',
  styleUrls: ['./view-photo.component.scss'],
})
export class ViewPhotoComponent implements OnInit {
  @Input() Image:any
  constructor(private modalController:ModalController) { }

  ngOnInit() {}

  exitView(){
    this.modalController.dismiss()
  }
}
