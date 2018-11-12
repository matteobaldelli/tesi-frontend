import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import {BsModalRef, BsModalService} from 'ngx-bootstrap';

import { VisitService } from '../visit.service';
import { UserService } from '../user.service';

import { Visit } from '../visit';
import {Category} from '../category';


@Component({
  selector: 'app-visits',
  templateUrl: './visits.component.html',
  styleUrls: ['./visits.component.css']
})
export class VisitsComponent implements OnInit {
  @ViewChild('form')
  private templateForm: TemplateRef<any>;
  visits: Visit[];
  modalRef: BsModalRef;
  titleForm: string;
  visitForm = new FormGroup({
    id: new FormControl({ value: null, disabled: true}),
    name: new FormControl('', Validators.required)
  });

  constructor(
    private visitService: VisitService,
    public userService: UserService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.visitService.getVisits().subscribe(visits => this.visits = visits);
  }

  add(): void {
    this.titleForm = 'Aggiungi';
    this.modalRef = this.modalService.show(this.templateForm, { keyboard: false });
  }

  edit(category: Category): void {
    this.titleForm = 'Modifica';
    this.visitForm.setValue({
      id: category.id,
      name: category.name
    });
    this.modalRef = this.modalService.show(this.templateForm, { keyboard: false });
  }

  onSubmit(): void {
    this.visitForm.disable();
    const visit = {
      id: this.visitForm.value.id,
      name: this.visitForm.value.name
    } as Visit;
    if (visit.id) {
      this.onSubmitUpdate(visit);
    } else {
      this.onSubmitAdd(visit);
    }
  }

  private onSubmitAdd(visit: Visit): void {
    this.visitService.addVisit(visit).subscribe(
      newVisit => {
        this.visits.push(newVisit);
      },
      error => {},
      () => {
        this.visitForm.enable();
        this.hideForm();
      }
    );
  }

   private onSubmitUpdate(visit: Visit): void {
    this.visitService.updateVisit(visit).subscribe(
      updateVisit => {
        const index = this.visits.findIndex(c => c.id === updateVisit.id);
        this.visits[index] = updateVisit;
      },
      error => {},
      () => {
        this.visitForm.enable();
        this.hideForm();
      }
    );
  }

  delete(visit: Visit): void {
    this.visits = this.visits.filter(h => h !== visit);
    this.visitService.deleteVisit(visit).subscribe();
  }

  hideForm(): void {
    this.visitForm.reset();
    this.modalRef.hide();
  }
}
