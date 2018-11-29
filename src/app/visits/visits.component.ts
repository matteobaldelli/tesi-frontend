import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';

import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import { VisitService } from '../visit.service';
import { UserService } from '../user.service';
import { ExamService } from '../exam.service';

import { Visit } from '../visit';
import { Category } from '../category';
import { Exam } from '../exam';

@Component({
  selector: 'app-visits',
  templateUrl: './visits.component.html',
  styleUrls: ['./visits.component.css']
})
export class VisitsComponent implements OnInit {
  @ViewChild('form')
  private templateForm: TemplateRef<any>;
  showGraphic = false;
  visits: Visit[];
  modalRef: BsModalRef;
  titleForm: string;
  exams: Exam[];
  visitForm = new FormGroup({
    id: new FormControl({ value: null, disabled: true}),
    name: new FormControl('', Validators.required)
  });
  userParam: string;

  constructor(
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private visitService: VisitService,
    private examService: ExamService,
    public userService: UserService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(queryParams => {
        this.userParam = queryParams['user'];
        let paramsData = new HttpParams();
        if (this.userParam) {
          paramsData = paramsData.append('user', this.userParam);
        }
        this.visitService.getVisits(paramsData).subscribe(visits => {
          this.visits = visits;
          this.getAverageData();
        });
    });
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
    this.visitService.deleteVisit(visit).subscribe( success => {
      this.visits = this.visits.filter(h => h !== visit);
      this.getAverageData();
    });
  }

  hideForm(): void {
    this.visitForm.reset();
    this.modalRef.hide();
  }

  private getAverageData(): void {
    if (this.visits.length) {
      if (!this.userService.isAdmin || (this.userService.isAdmin && this.userParam)) {
        let params = new HttpParams();
        this.visits.forEach(visit => {
          params = params.append('visits[]', String(visit.id));
        });
        this.examService.statisticsExam(params).subscribe(exams => {
          this.exams = exams;
          this.showGraphic = true;
        });
      }
    }
  }
}
