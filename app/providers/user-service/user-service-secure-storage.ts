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

  private registeredIdentities:User[] = [];
  private currentIdentityId: string;

  constructor(private http: Http) {
    //we should load registeredIdentites from a secure location on the device
  }

  registerNewUser(baseUrl:string, username:string, password:string, roles?: string[]): User{
    //how do we want to handle username duplication? (2 different servers may have the same user defined)
    let newUser: User = {
      id: Date.now(),
      baseurl: baseUrl,
      username: username,
      password: password,
      roles: roles
    };
    this.registeredIdentities.push(newUser);
    return newUser;
  }

  getAllUsers(){
    return this.registeredIdentities;
  }

  setCurrentUser(userId){
    //check user exist
    if (this.registeredIdentities.filter((identity)=>identity.id === userId).length == 0){
      console.error("cannot find user with id: "+userId)
    }else{
      this.currentIdentityId = userId;
    }
  }
  getCurrentUser():User{
    return this.registeredIdentities.filter((identity)=>identity.id === this.currentIdentityId)[0];
  }


  getUser(baseurl: string, username: string): User {
    let found = this.registeredIdentities.filter(
      (user)=>
        (user.baseurl === baseurl
          && user.username === username)
      );
    if (found)
      return found[0];
    else
      return undefined;
  }
}


export class User {
  id:any;
  baseurl:string;
  username:string;
  password:string;
  roles:string[];
}
