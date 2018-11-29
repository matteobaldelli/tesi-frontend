import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import { VisitService } from '../visit.service';
import { ExamService } from '../exam.service';
import { MetricsService } from '../metrics.service';

import { Visit } from '../visit';
import { Exam } from '../exam';
import { Metric } from '../metric';

@Component({
  selector: 'app-visit',
  templateUrl: './visit.component.html',
  styleUrls: ['./visit.component.css']
})
export class VisitComponent implements OnInit {
  visit: Visit;
  exams: Exam[];
  modalRef: BsModalRef;
  newMetrics: Metric[] = [];
  metricLabel: string;
  metricMin: number;
  metricMax: number;

  newExam = new FormGroup({
    metric: new FormControl(undefined, Validators.required),
    value: new FormControl('', Validators.required),
  });


  constructor(
    private route: ActivatedRoute,
    private visitService: VisitService,
    private examService: ExamService,
    private metricsService: MetricsService,
    private modalService: BsModalService
) {}

  ngOnInit() {
    this.exams = [];
    this.newMetrics = [];
    this.metricLabel = '';
    const id = +this.route.snapshot.paramMap.get('id');

    this.visitService.getVisit(id).subscribe(visit => {
      this.visit = visit;

      let params = new HttpParams();
      params = params.append('visitId', '' + id);
      this.examService.getExams(params).subscribe(exams => {
        this.exams = exams;
        this.calculateNewMetric();
      });
    });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  add(): void {
    this.newExam.disable();
    const exam = {
      value: this.newExam.value.value,
      metricId: this.newExam.value.metric,
      visitId: this.visit.id
    } as Exam;
    this.examService.addExam(exam).subscribe(
      newExam => {
        this.exams = [...this.exams, newExam];
        this.newExam.reset();
        this.calculateNewMetric();
      },
      error => {},
      () => {
        this.newExam.enable();
        this.modalRef.hide();
      }
    );
  }

  delete(exam: Exam): void {
    this.examService.deleteExam(exam).subscribe( success => {
        this.exams = this.exams.filter(h => h !== exam);
        this.calculateNewMetric();
    });
  }

  calculateNewMetric(): void {
    this.newMetrics = [];
    let params = new HttpParams();
    params = params.append('gender', this.visit.userGender);
    this.metricsService.getMetrics(params).subscribe(metrics => {
      for (const metric of metrics) {
        if (!this.exams.find((item) => item.metricId === metric.id)) {
          this.newMetrics.push(metric);
        }
      }
      if (this.newMetrics.length) {
        this.newExam.setValue({
          metric: this.newMetrics[0].id,
          value: ''
        });
        this.onClickAddControll();
      }
    });
  }

  onClickAddControll(): void {
    const metric = this.newMetrics.find((item) => item.id === Number(this.newExam.value.metric));
    this.metricLabel = metric.unitLabel;
    this.metricMin = metric.totalRangeMin;
    this.metricMax = metric.totalRangeMax;
    this.newExam.controls['value'].setValidators([
      Validators.required, Validators.min(metric.totalRangeMin), Validators.max(metric.totalRangeMax)
    ]);
  }
}
