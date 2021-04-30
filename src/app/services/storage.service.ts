import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})

export class StorageService {

  private urlPrimary:string = "http://backup1.myvnc.com:1337/"
  private urlHeisler:string = "https://panel.mdautoparts.com/form/storeMultipleFile"
  constructor() { 
    this.init()
  }
  
  private async init(){
    this.set('url',{ urlPrimary:this.urlPrimary,  urlHeisler:this.urlHeisler })
    this.set('filter',{status:true})
  }

    //  To set an item, use set(key, value):
  public async set(key:string,value:{}) {
    if (await this.get(key) == null) {
      await Storage.set({  key,  value:JSON.stringify(value)  });
    }// else { this element exist }
  }
    //To get the item back, use get(name):
  public async get(key: string) {
    return JSON.parse((await Storage.get({ key: key })).value);
  }
    // to update element insert
  public async update(key:string,value:{}){
    if (await this.get(key) != null) {
      await Storage.set({  key,  value:JSON.stringify(value)  });
    }// else { this element not exist }
  }
    //To remove an item:
  public async remove(key: string) {
    await Storage.remove({key:key});
  }
     //To clear all items:
  public async clear() {
    await Storage.clear();
  }
     //To get all keys stored:
  public async getKeys() {
    return await Storage.keys()
  }

}
