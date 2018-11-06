import {Component, OnInit, TemplateRef} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import {BsModalRef, BsModalService} from 'ngx-bootstrap';

import { VisitService } from '../visit.service';
import { UserService } from '../user.service';

import { Visit } from '../visit';


@Component({
  selector: 'app-visits',
  templateUrl: './visits.component.html',
  styleUrls: ['./visits.component.css']
})
export class VisitsComponent implements OnInit {
  visits: Visit[];
  modalRef: BsModalRef;
  newVisit = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  constructor(
    private visitService: VisitService,
    public userService: UserService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.visitService.getVisits().subscribe(visits => this.visits = visits);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  add(): void {
    this.newVisit.disable();
    const visit = {
      name: this.newVisit.value.name
    } as Visit;
    this.visitService.addVisit(visit).subscribe(
      newVisit => this.visits.push(newVisit),
      error => {},
      () => {
        this.newVisit.enable();
        this.modalRef.hide();
      }
    );
  }

  delete(visit: Visit): void {
    this.visits = this.visits.filter(h => h !== visit);
    this.visitService.deleteVisit(visit).subscribe();
  }
}
