import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';


@Component({
  selector: 'app-page-length',
  templateUrl: './page-length.component.html',
  styleUrls: ['./page-length.component.css']
})
export class PageLengthComponent implements OnInit {

  pageLengths?: number [];
  @Input()pageLength?: number;
  @Output() pageLengthChanged = new EventEmitter<number>();
  constructor() { }

  ngOnInit() {
    if (!this.pageLength) {
      this.pageLength = 10;
    }
    this.pageLengths = [5, 10, 25, 50 , 100];
  }

  lengthChanged() {
    this.pageLengthChanged.emit(this.pageLength);
  }

}











