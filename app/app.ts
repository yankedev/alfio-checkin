import { Component, ViewChild } from '@angular/core';
import { ionicBootstrap, Platform, Nav } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import { Page1 } from './pages/page1/page1';
import {UserService} from './providers/user-service/user-service';
import {UsersPage} from "./pages/users/users";
import {EventsPage} from "./pages/events/events";

@Component({
  templateUrl: 'build/app.html'
})
class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Page1;

  pages: Array<{title: string, component: any}>;


  constructor(public platform: Platform, public userService: UserService) {
    this.initializeApp();


    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Page1', component: Page1},
      { title: 'Events', component: EventsPage },
      { title: 'Manage Users', component: UsersPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  getCurrentUser(){
    return this.userService.getCurrentUser();
  }
}

ionicBootstrap(MyApp, [UserService]);
