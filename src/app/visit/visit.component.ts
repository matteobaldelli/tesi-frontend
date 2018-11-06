import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import { VisitService } from '../visit.service';
import { ExamService } from '../exam.service';
import { HDataService } from '../h-data.service';
import { MetricsService } from '../metrics.service';

import { Visit } from '../visit';
import { Exam } from '../exam';
import { Metric } from '../metric';

declare var HGraph: any;

@Component({
  selector: 'app-visit',
  templateUrl: './visit.component.html',
  styleUrls: ['./visit.component.css']
})
export class VisitComponent implements OnInit {
  visit: Visit;
  exams: Exam[];
  modalRef: BsModalRef;
  newMetrics: Metric[];
  graph: any;
  metricLabel: string;
  metricMin: number;
  metricMax: number;

  newExam = new FormGroup({
    metric: new FormControl(''),
    value: new FormControl('', Validators.required),
  });


  constructor(
    private route: ActivatedRoute,
    private visitService: VisitService,
    private examService: ExamService,
    private hDataService: HDataService,
    private metricsService: MetricsService,
    private modalService: BsModalService
) {}

  ngOnInit() {
    this.exams = [];
    this.newMetrics = [];
    this.metricLabel = '';
    const id = +this.route.snapshot.paramMap.get('id');

    this.visitService.getVisit(id).subscribe(visit => this.visit = visit);

    let params = new HttpParams();
    params = params.append('visitId', '' + id);
    this.examService.getExams(params).subscribe(exams => {
      this.exams = exams;

      this.metricsService.getDataMetrics().subscribe(data => {
        this.hDataService.initialize(data as Object[]);
        this.calculateNewMetric();
        this.draw(this.exams);
      });
    });
  }

  private draw(exams: Exam[]): void {
    if (this.graph !== undefined) {
        this.graph.destroy();
      }

    if (exams.length >= 3) {
      const container = document.getElementById('viz');
      const opts = {
        container: container,
        userdata: {
          hoverevents: true,
          factors: this.hDataService.process(exams)
        },
        // custom ring size to support upper and lower user panels
        scaleFactors: {
          labels: {
            lower: 6,
            higher: 1.5
          },
          nolabels: {
            lower: 3,
            higher: 1
          }
        },
        // custom zoom in factor, higher compared to the usual 2.2
        zoomFactor: 3,
        zoomable: true,
        showLabels: true
      };

      this.graph = new HGraph(opts);
      this.graph.width = container.offsetWidth;
      this.graph.height = container.offsetHeight;
      this.graph.initialize();
    }
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
        this.exams.push(newExam);
        this.newExam.reset();
        this.draw(this.exams);
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
        this.draw(this.exams);
        this.calculateNewMetric();
    });
  }

  calculateNewMetric(): void {
    this.newMetrics = [];
    this.metricsService.getMetrics().subscribe(metrics => {
      for (const metric of metrics) {
        if (!this.exams.find((item) => item.metricId === metric.id)) {
          this.newMetrics.push(metric);
        }
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
