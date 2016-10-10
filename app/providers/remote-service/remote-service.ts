import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import {UserService, User} from "../user-service/user-service";

/*
  Generated class for the RemoteService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class RemoteService {

  constructor(private http: Http, private userService: UserService) {}


  //if getUserRoles does NOT returns an error it means
  loginUser(baseurl: string, username: string, password: string): User {

    //we reload the roles from the server to:
    // - check pwd is still valid
    // - get the current roles
    let userRoles: string[];

    this.getUserRoles(baseurl, username, password)
      .subscribe(
        (roles)=> {
          //if login is successful we set the current pwd and roles in the userService object
          userRoles = roles.json();
        },
        (error)=>{
          //if remote call fails it could be caused by different reasons:
          // - network problem or server unreacheable
          // - server error
          // - user unauthorized (wrong username/pwd)
          //the error has to be handled by the method calling loginUser
          throw error;
        }
      );

    //if we reach this point user/pwd are valid for this baseurl
    let user:User = this.userService.getUser(baseurl, username);

    if (user) {
      //the user is already registered
      //we update its roles and pwd with the fresh data
      user.roles = userRoles;
      user.password = password;
    } else {
      user = this.userService.registerNewUser(baseurl, username, password, userRoles)
    }

    return user;

  }

  getHeaders(username: string, password: string){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let basicAuth = username + ":" + password;
    headers.append('Authorization', "Basic "+ btoa(basicAuth));
    return headers;
  }

  parseQRCode(code: string) :string[] {
    return code.split("/");
  }

  getUserRoles(baseurl: string, username: string, password: string){
    return this.http.get(baseurl+'/admin/api/user-type', {headers: this.getHeaders(username, password)});
  }

  getEvents(baseurl: string, username: string, password: string){
    return this.http.get(baseurl+'/admin/api/events', {headers: this.getHeaders(username, password)});
  }

   getTicketDetail(baseurl: string, username: string, password: string, code: string, eventId: string) {
    let ticketId = this.parseQRCode(code)[0];
    return this.http.get(baseurl+'/admin/api/check-in/'+eventId+'/ticket/'+ticketId+'?qrCode='+code, {headers: this.getHeaders(username, password)});
  }

   checkInTicket(baseurl: string, username: string, password: string, code: string, eventId: string)  {
    let parsed = this.parseQRCode(code);

    return this.http.post(baseurl+'/admin/api/check-in/event/'+eventId+'/ticket/'+parsed[0], {code: code}, {headers: this.getHeaders(username, password)});
  }

   confirmDeskPayment(baseurl: string, username: string, password: string, code: string, eventId: string)   {
     let parsed = this.parseQRCode(code);
    return this.http.post(baseurl+'/admin/api/check-in/event/'+eventId+'/ticket/'+parsed[0]+'/confirm-on-site-payment', {headers: this.getHeaders(username, password)});
  }









}
