import { Component, OnInit } from '@angular/core';
import {ContactService} from "../../../../sdk/bw-fullstack-reference-api-sdk";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  numberOfContacts = 0;

  constructor(private contactService: ContactService) { }

  ngOnInit(): void {
    this.numberOfContacts = this.getNumberOfContacts();
  }

  getNumberOfContacts(){

    this.contactService.getTotalContact().subscribe(res=>{
      this.numberOfContacts = res;
    })
    return this.numberOfContacts;

  }

}
