import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {SearchManager} from "../../models/search/search-manager";

@Component({
  selector: 'page-size',
  templateUrl: './page-size.component.html',
  styleUrls: ['./page-size.component.css']
})


export class PageSizeComponent implements OnInit {

  @Input() searchManager: SearchManager<any, any> | undefined;

  @Input() pageLengths: number[] = [10, 25, 50, 100];

  @Output() pageLengthChanged = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
    if (this.searchManager) {
      this.searchManager.itemsPerPage = this.pageLength;
    }
  }

  get pageLength() {
    // @ts-ignore
    return this.searchManager.itemsPerPage;
  }

  set pageLength(val) {
    if (this.searchManager) {
      this.searchManager.itemsPerPage = val;
      if (this.searchManager.list.length) {
        this.searchManager.reloadAndShowFirstPage();
      }
    }
    this.pageLengthChanged.emit(this.pageLength);
  }

}
