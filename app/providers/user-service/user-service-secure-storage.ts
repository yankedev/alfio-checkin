import { Injectable } from '@angular/core';
import {Platform} from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { SecureStorage } from 'ionic-native';

/*
  Generated class for the UserService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
const ALFIO_USERS_KEY = "ALFIO_USERS";
const ALFIO_APP_KEY = "ALFIO_APP";

@Injectable()
export class UserService {

  private registeredIdentities:User[] = [];
  private currentIdentityId: string;
  secureStorage: SecureStorage = new SecureStorage();

  constructor(private http: Http, platform: Platform) {
    console.warn('Creating UserService!');

    platform.ready().then(() => {
      
      this.secureStorage.create(ALFIO_APP_KEY).then(
        () => {
          console.log('Storage is ready!');

          this.secureStorage.get(ALFIO_USERS_KEY)
          .then(
            data => {
              console.log('data was '+data);
              this.registeredIdentities = JSON.parse(data);
            },
            error => {
              // do nothing - it just means it doesn't exist
            }
          );
        },
        error => console.log(error)
      );

    });
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
    console.log(this.registeredIdentities);
    this.secureStorage.set(ALFIO_USERS_KEY, JSON.stringify(this.registeredIdentities))
      .then(
        data => console.log("New user registered"),
        error => console.warn(error)
      );
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
