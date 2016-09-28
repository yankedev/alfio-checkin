import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Events, LocalStorage, Storage } from 'ionic-angular';
import 'rxjs/add/operator/map';

/*
  Generated class for the UserService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UserService {

  currentIdentityId: string;
  storage = new Storage(LocalStorage);


  constructor(private http: Http) {
  }

  registerNewUser(baseUrl:string, username:string, password:string) : any{
    //how do we want to handle username duplication? (2 different servers may have the same user defined)
    let users:any[] = this.getAllUsers();
    let newUser = {
      id: Date.now(),
      baseUrl: baseUrl,
      username: username,
      password: password
    };
    users.push(newUser);
    this.storage.set('registeredUsers', users);
    return newUser;
  }

  getAllUsers():any{
     return this.storage.get('registeredUsers').then((res)=> {
       return res
     });
  }

  setCurrentUser(userId){
    //check user exist
    if (this.getAllUsers().filter((identity)=>identity.id === userId).length == 0){
      console.error("cannot find user with id: "+userId)
    }else{
      this.currentIdentityId = userId;
    }
  }
  getCurrentUser(){
    return this.getAllUsers().filter((identity)=>identity.id === this.currentIdentityId)[0];
  }


}

