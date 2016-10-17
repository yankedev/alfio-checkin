import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { NavController, ToastController } from 'ionic-angular';
import { BarcodeScanner } from 'ionic-native';

import {UserService} from '../../providers/user-service/user-service-secure-storage';

@Component({
  templateUrl: 'build/pages/login/login.html'
})
export class LoginPage implements OnInit {

  baseUrl: string
  username:string;
  password:string;
  result: string;
  newUserMethod: String;
  isLoading: boolean;

  constructor(public navCtrl: NavController, private http: Http, private userService: UserService, public toastCtrl: ToastController) {
  }

  ngOnInit(){
    this.newUserMethod="manually";
    this.baseUrl = "https://test.alf.io";
    //this.baseUrl = "http://localhost:8100";
    this.username = "yanke";
    this.password = ")&mWRf%slRmTs";
  }


  scan()
  {
    BarcodeScanner.scan({
      formats: "QR_CODE",   // Pass in of you want to restrict scanning to certain types
      cancelLabel: "Stop scanning", // iOS only, default 'Close'
      message: "Scan your configuration QR-Code", // Android only, default is 'Place a barcode inside the viewfinder rectangle to scan it.'
      preferFrontCamera: false,     // Android only, default false
      showFlipCameraButton: true,   // Android only, default false (on iOS it's always available)
      orientation: "portrait"      // Android only, optionally lock the orientation to either "portrait" or "landscape"
    }).then((result) => {
      this.isLoading = true;
      let scanResult = JSON.parse(result.text);
      let newUser = this.userService.registerNewUser(scanResult.baseUrl, scanResult.username, scanResult.password)
      this.userService.setCurrentUser(newUser.id);
      this.isLoading = false;
      this.presentToast(newUser.username);

      //reset the values
      this.ngOnInit();
      //close the login window
      this.navCtrl.pop();
    }, (error) => {
      console.log("No scan: " + error);
      this.isLoading = false;
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

        this.presentToast(newUser.username);

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
