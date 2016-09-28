import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import {UserService, User} from '../../providers/user-service/user-service';

@Component({
  templateUrl: 'build/pages/page1/page1.html'
})
export class Page1 {

  currentUser: User;

  constructor(public navCtrl: NavController, public userService: UserService) {
    this.currentUser = this.userService.getCurrentUser();
  }
}
