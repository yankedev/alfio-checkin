import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';

import {UserService, User} from '../../providers/user-service/user-service';

@Component({
  templateUrl: 'build/pages/events/events.html',
})
export class EventsPage implements OnInit{

  currentUser: User;
  events = [];
  constructor(private navCtrl: NavController, private http: Http, private userService: UserService) {

  }

  ngOnInit(){
    this.currentUser = this.userService.getCurrentUser();

    this.http.get(this.currentUser.baseurl+"/admin/api/events", {headers: this.getAuthorizationHeaders()})
      .subscribe((res) => {
        this.events = res.json();
        console.log(res.json());
      });
  }

  loadUserEvents(){
    //'';
  }

  getAuthorizationHeaders(){
      let headers = new Headers();
      headers.append('Content-Type', 'text/plain');
      headers.append('Authorization', this.encode(this.currentUser.username, this.currentUser.password));

    return headers;
  }

  encode(username, password){
    let basicAuth = username + ":" + password;
    return "Basic "+ btoa(basicAuth);
  }
}
