import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {Router} from "@angular/router";

@Component({
  selector: 'app-modal-completion',
  templateUrl: './modal-completion.component.html',
  styleUrls: ['./modal-completion.component.css']
})
export class ModalCompletionComponent implements OnInit {

  @Output()
  onClick = new EventEmitter();
  @Output()
  onSuccessButtonClick = new EventEmitter();
  @Input() isSuccess = true;
  @Input() message;


  constructor(public modalRef: BsModalRef, private modalService: BsModalService, private router: Router) {
  }

  ngOnInit(): void {
  }

  buttonClicked() {
    this.onClick.emit();
  }
}
