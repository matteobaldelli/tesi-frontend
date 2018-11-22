import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpParams } from '@angular/common/http';

import { ExamService } from '../exam.service';
import { MetricsService } from '../metrics.service';
import { HDataService } from '../h-data.service';

import { Exam} from '../exam';

declare var HGraph: any;

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  searchForm: FormGroup;
  graph: any;

  constructor(
    private formBuilder: FormBuilder,
    private metricsService: MetricsService,
    private examService: ExamService,
    private hDataService: HDataService
  ) { }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      gender: ['Uomo', Validators.required],
      age: [[0, 100]]
    });

    this.onChangeGender();
    this.onSubmit();
  }

  onChangeGender() {
    const gender = this.searchForm.value.gender;
    let paramsData = new HttpParams();
    paramsData = paramsData.append('gender', gender);
    this.metricsService.getDataMetrics(paramsData).subscribe(data => {
      this.hDataService.initialize(data as Object[]);
    });

    this.onSubmit();
  }

  onSubmit() {
    let params = new HttpParams();
    params = params.append('gender', this.searchForm.value.gender);
    params = params.append('age', this.searchForm.value.age);
    this.examService.statisticsExam(params).subscribe(exams => {
        this.draw(exams);
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
}
