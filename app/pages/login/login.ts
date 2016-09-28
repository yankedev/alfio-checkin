import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { NavController, ToastController } from 'ionic-angular';
import { BarcodeScanner } from 'ionic-native';

import {UserService} from '../../providers/user-service/user-service';

@Component({
  templateUrl: 'build/pages/login/login.html'
})
export class LoginPage implements OnInit {

  baseUrl: string
  username:string;
  password:string;
  result: string;
  public newUserMethod: String;

  constructor(public navCtrl: NavController, private http: Http, private userService: UserService, public toastCtrl: ToastController) {
  }

  ngOnInit(){
    this.newUserMethod="manually";
    //this.baseUrl = "https://test.alf.io";
    this.baseUrl = "http://localhost:8101";
    this.username = "yanke";
    this.password = "o5-XpGP2AI(^2(";
  }


  scan()
  {
    BarcodeScanner.scan().then((result) => {
      // Success!
      alert("We got a barcode\n" +
        "Result: " + result.text + "\n" +
        "Format: " + result.format + "\n" +
        "Cancelled: " + result.cancelled);
    }, (err) => {
      // An error occurred
    });
  }

  presentToast(username) {
    let toast = this.toastCtrl.create({
      message: 'User '+username+' was added successfully',
      duration: 3000
    });
    toast.present();
  }

  login(){
    let headers = new Headers();
    headers.append('Content-Type', 'text/plain');
    headers.append('Authorization', this.encode(this.username, this.password));

    this.http.get(this.baseUrl+"/admin/api/user-type", {headers: headers})
      .subscribe(res => {

        let newUser = this.userService.registerNewUser(this.baseUrl, this.username, this.password);
        this.userService.setCurrentUser(newUser.id);

        this.presentToast(newUser.id);

        //reset the values
        this.ngOnInit();
        //close the login window
        this.navCtrl.pop();
      }, (err) => {
        console.log(err);
        this.result=err.json();
      });
  }

  encode(username, password){
    let basicAuth = username + ":" + password;
    return "Basic "+ btoa(basicAuth);
  }
}
