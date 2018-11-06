import { Component, OnInit, TemplateRef } from '@angular/core';
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
  metrics: Metric[];
  categories: Category[];
  modalRef: BsModalRef;
  newMetric = new FormGroup({
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
  }

  openModal(template: TemplateRef<any>) {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
      this.modalRef = this.modalService.show(template);
    });
  }

  add(): void {
    this.newMetric.disable();
    const metric = {
      name: this.newMetric.value.name,
      weight: this.newMetric.value.weight,
      gender: this.newMetric.value.gender,
      unitLabel: this.newMetric.value.unitLabel,
      totalRangeMin: this.newMetric.value.totalRangeMin,
      totalRangeMax: this.newMetric.value.totalRangeMax,
      healthyRangeMin: this.newMetric.value.healthyRangeMin,
      healthyRangeMax: this.newMetric.value.healthyRangeMax,
      categoryId: this.newMetric.value.categoryId
    } as Metric;

    this.metricsService.addMetric(metric).subscribe(
      newMetric => {
        this.metrics.push(newMetric);
        this.newMetric.reset();
      },
      error => {},
      () => {
        this.newMetric.enable();
        this.modalRef.hide();
      }
    );
  }

  delete(metric: Metric): void {
    this.metrics = this.metrics.filter(h => h !== metric);
    this.metricsService.deleteMetric(metric).subscribe();
  }
}
