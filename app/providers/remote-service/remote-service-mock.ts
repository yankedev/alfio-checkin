import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class RemoteService {

  user0 = {
    id: 1234567890,
    baseurl: "http://localhost:8100",
    username: "user0",
    password: "user0"
  };

  event0 = {
    begin:"2016-10-26T08:00:00Z",
    descriptions:[
      {
        description:"Descrizione italiana",
        locale:"it",
        shortDescription:"Descrizione italiana"
      }
    ],
    end:"2016-10-26T16:00:00Z",
    external:false,
    imageUrl:"/file/e75059462949bf8bab8a5b0094e2e78b7f2c4f86f37222796ed0d805d78759c3",
    key:"test-pdf",
    latitude:"46.005583",
    location:"Palazzo dei congressi, lugano",
    longitude:"8.955862",
    name:"test pdf",
    oneDay:true,
    timeZone:"Europe/Zurich",
    url:"/events/test-pdf"
  }


  constructor() {}

}

