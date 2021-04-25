import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})

export class StorageService {

  constructor() { }

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
    //sawait Storage.remove(key);
  }
  // //To clear all items:
  // public async clear() {
  //   return await this._storage.clear();
  // }
  // //To get all keys stored:
  // public async getKeys() {
  //   return await this._storage.keys()
  // }
  // //To get the quantity of key/value pairs stored:
  // public async length() {
  //   return await this._storage.length()
  // }
  // //To enumerate the stored key/value pairs:
  // public async enumerate() {
  //   return await this._storage.forEach((key, value, index) => {
  //     return { key: key, value: value, index: index }
  //   })
  // };
  // //To enable encryption when using the Ionic Secure Storage driver:

  // public encryption(databaseName: string) {
  //   this._storage.setEncryptionKey(databaseName)
  // };

}
