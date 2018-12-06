import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpParams } from '@angular/common/http';

import { ExamService } from '../exam.service';
import { MetricsService } from '../metrics.service';

import { Exam} from '../exam';
import { Metric } from '../metric';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class StatisticsComponent implements OnInit {
  searchForm: FormGroup;
  metricsForm: FormGroup;
  metrics: Metric[];
  exams: Exam[];
  fetching = false;

  constructor(
    private formBuilder: FormBuilder,
    private metricsService: MetricsService,
    private examService: ExamService
  ) { }

  ngOnInit() {
    this.exams = [];
    this.searchForm = this.formBuilder.group({
      gender: ['Uomo', Validators.required],
      age: [[0, 100]]
    });
    this.metricsForm = this.formBuilder.group({});

    this.onChangeGender();
    this.onSubmit();
  }

  onChangeGender() {
    this.loadFilter();
    this.onSubmit();
  }

  onSubmit() {
    this.fetching = true;
    let params = new HttpParams();
    params = params.append('gender', this.searchForm.value.gender);
    params = params.append('age', this.searchForm.value.age);
    Object.keys(this.metricsForm.value).forEach(key => {
      params = params.append(key, this.metricsForm.value[key]);
    });
    this.examService.statisticsExam(params).subscribe(exams => {
        this.exams = exams;
    },
      error => {},
      () => this.fetching = false);
  }

  private loadFilter(): void {
    const gender = this.searchForm.value.gender;
    let paramsData = new HttpParams();
    paramsData = paramsData.append('gender', gender);

    this.metricsService.getMetrics(paramsData).subscribe( metrics => {
      this.metricsForm = this.formBuilder.group({});
      metrics.forEach(metric => {
        this.metricsForm.addControl(metric.name, new FormControl([metric.totalRangeMin, metric.totalRangeMax]));
      });
      this.metrics = metrics;
    });
  }
}
