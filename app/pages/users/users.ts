import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { UserService } from '../../providers/user-service/user-service-secure-storage';

@Component({
  templateUrl: 'build/pages/users/users.html',
})
export class UsersPage {

  users: Array<{id: string, baseurl: string, username: string, password: string}>;

  constructor(public navCtrl: NavController, public userService: UserService) {
    this.users = userService.getAllUsers();
  }

  login(){
    this.navCtrl.push(LoginPage, {});
  }

  changeCurrentUser(user){
    this.userService.setCurrentUser(user.id);
  }

  getCurrentUser(){
    this.userService.getCurrentUser();
  }
}
