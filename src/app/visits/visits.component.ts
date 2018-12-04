import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { forkJoin } from 'rxjs';

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
  @ViewChild('create')
  private createTemplate: TemplateRef<any>;
  @ViewChild('update')
  private updateTemplate: TemplateRef<any>;
  showGraphic = false;
  visits: Visit[];
  modalRef: BsModalRef;
  graphicExams: Exam[];
  exams: Exam[];
  createForm = new FormGroup({
    name: new FormControl('', Validators.required)
  });
  updateForm = new FormGroup({
    id: new FormControl({ value: null, disabled: true}),
    name: new FormControl('', Validators.required)
  });
  examsForm: FormGroup;
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
    this.modalRef = this.modalService.show(this.createTemplate, { keyboard: false });
  }

  edit(category: Category): void {
    this.updateForm.setValue({
      id: category.id,
      name: category.name
    });
    this.examsForm = new FormGroup({});
    let params = new HttpParams();
    params = params.append('visitId', String(category.id));
    this.examService.getExams(params).subscribe(exams => {
      this.exams = exams;
      exams.forEach(item => {
        this.examsForm.addControl(String(item.id), new FormControl(item.value, [Validators.required]));
      });
      this.modalRef = this.modalService.show(this.updateTemplate, { keyboard: false });
    });
  }

  onSubmitAdd(): void {
    this.createForm.disable();
    const visit = {
      name: this.createForm.value.name
    } as Visit;

    this.visitService.addVisit(visit).subscribe(
      newVisit => {
        this.visits.push(newVisit);
      },
      error => {},
      () => {
        this.createForm.enable();
        this.hideForm();
      }
    );
  }

   onSubmitUpdate(): void {
    this.updateForm.disable();
    this.examsForm.disable();
    const visit = {
      id: this.updateForm.value.id,
      name: this.updateForm.value.name
    } as Visit;

    const observableExams = [];
    Object.keys(this.examsForm.value).forEach(key => {
      const exam = {
        id: Number(key),
        value: this.examsForm.value[key]
      } as Exam;
      observableExams.push(this.examService.updateExam(exam));
    });
    forkJoin([
      this.visitService.updateVisit(visit),
      ...observableExams
    ]).subscribe(results => {
        const updateVisit = results[0];
        const index = this.visits.findIndex(c => c.id === updateVisit.id);
        this.visits[index] = updateVisit;
    },
      error => {},
      () => {
        this.updateForm.enable();
        this.examsForm.enable();
        this.hideForm();
      });
  }

  delete(visit: Visit): void {
    this.visitService.deleteVisit(visit).subscribe( success => {
      this.visits = this.visits.filter(h => h !== visit);
      this.getAverageData();
    });
  }

  hideForm(): void {
    this.createForm.reset();
    this.updateForm.reset();
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
          this.graphicExams = exams;
          this.showGraphic = true;
        });
      }
    }
  }
}
