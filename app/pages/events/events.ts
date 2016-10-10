import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { BarcodeScanner } from 'ionic-native';

import {UserService, User} from '../../providers/user-service/user-service';
import {RemoteService} from "../../providers/remote-service/remote-service";

@Component({
  templateUrl: 'build/pages/events/events.html',
})
export class EventsPage implements OnInit{

  currentUser: User;
  events = [];
  constructor(private navCtrl: NavController, private http: Http, private userService: UserService, private remoteService: RemoteService) {

  }

  ngOnInit(){
    this.currentUser = this.userService.getCurrentUser();
    this.loadUserEvents();
  }

  loadUserEvents(){
    this.remoteService.getEvents(this.currentUser.baseurl, this.currentUser.username, this.currentUser.password)
      .subscribe((res) => {
        this.events = res.json().map((e)=>{
          e.baseurl=this.currentUser.baseurl;
          return e;
        })});
  }

  scan(event){
    BarcodeScanner.scan().then((result) => {
      // Success!
      alert("We got a barcode\n" +
        "Result: " + result.text + "\n" +
        //"JSON: " + result.json() + "\n" +
        "Format: " + result.format + "\n" +
        "Cancelled: " + result.cancelled);
      this.remoteService.checkInTicket(this.currentUser.baseurl, this.currentUser.username, this.currentUser.password, result.text, event.key)
        .subscribe((res)=> {
            alert(res.json());
          },
          (error)=>{
            alert("Error: "+error);
          });
    }, (err) => {
      alert("Error: "+err);
    });
  }
}
