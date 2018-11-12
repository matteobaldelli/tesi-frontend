import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { MetricsService } from '../metrics.service';
import { CategoryService } from '../category.service';
import { Metric } from '../metric';
import { Category } from '../category';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.css']
})
export class MetricsComponent implements OnInit {
  @ViewChild('form')
  private templateForm: TemplateRef<any>;
  metrics: Metric[];
  categories: Category[];
  modalRef: BsModalRef;
  titleForm: string;
  metricForm = new FormGroup({
    id: new FormControl({ value: null, disabled: true}),
    name: new FormControl('', Validators.required),
    weight: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required),
    unitLabel: new FormControl('', Validators.required),
    totalRangeMin: new FormControl('', Validators.required),
    totalRangeMax: new FormControl('', Validators.required),
    healthyRangeMin: new FormControl('', Validators.required),
    healthyRangeMax: new FormControl('', Validators.required),
    categoryId: new FormControl(''),
  });

  constructor(
    private metricsService: MetricsService,
    private categoryService: CategoryService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.metricsService.getMetrics().subscribe(metrics => this.metrics = metrics);
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  add(): void {
    this.titleForm = 'Aggiungi';
    this.modalRef = this.modalService.show(this.templateForm, { keyboard: false });
  }

  edit(metric: Metric): void {
    this.titleForm = 'Modifica';
    this.metricForm.setValue({
      id: metric.id,
      name: metric.name,
      weight: metric.weight,
      gender: metric.gender,
      unitLabel: metric.unitLabel,
      totalRangeMin: metric.totalRangeMin,
      totalRangeMax: metric.totalRangeMax,
      healthyRangeMin: metric.healthyRangeMin,
      healthyRangeMax: metric.healthyRangeMax,
      categoryId: metric.categoryId
    });
    this.modalRef = this.modalService.show(this.templateForm, { keyboard: false });
  }

  onSubmit(): void {
    this.metricForm.disable();
    const metric = {
      id: this.metricForm.value.id,
      name: this.metricForm.value.name,
      weight: this.metricForm.value.weight,
      gender: this.metricForm.value.gender,
      unitLabel: this.metricForm.value.unitLabel,
      totalRangeMin: this.metricForm.value.totalRangeMin,
      totalRangeMax: this.metricForm.value.totalRangeMax,
      healthyRangeMin: this.metricForm.value.healthyRangeMin,
      healthyRangeMax: this.metricForm.value.healthyRangeMax,
      categoryId: this.metricForm.value.categoryId
    } as Metric;
    if (metric.id) {
      this.onSubmitUpdate(metric);
    } else {
      this.onSubmitAdd(metric);
    }
  }

  private onSubmitAdd(metric: Metric): void {
    this.metricsService.addMetric(metric).subscribe(
      newMetric => {
        this.metrics.push(newMetric);
      },
      error => {},
      () => {
        this.metricForm.enable();
        this.hideForm();
      }
    );
  }

   private onSubmitUpdate(metric: Metric): void {
    this.metricsService.updateMetric(metric).subscribe(
      updateMetric => {
        const index = this.metrics.findIndex(c => c.id === updateMetric.id);
        this.metrics[index] = updateMetric;
      },
      error => {},
      () => {
        this.metricForm.enable();
        this.hideForm();
      }
    );
  }

  delete(metric: Metric): void {
    this.metrics = this.metrics.filter(h => h !== metric);
    this.metricsService.deleteMetric(metric).subscribe();
  }

  hideForm(): void {
    this.metricForm.reset();
    this.modalRef.hide();
  }
}
