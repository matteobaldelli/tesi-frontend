import { Component, OnInit, TemplateRef } from '@angular/core';
import { Metric } from '../metric';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MetricsService } from '../metrics.service';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.css']
})
export class MetricsComponent implements OnInit {
  metrics: Metric[];
  modalRef: BsModalRef;
  newMetric = new FormGroup({
    name: new FormControl('', Validators.required),
    weight: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required),
    unit_label: new FormControl('', Validators.required),
    total_range_min: new FormControl('', Validators.required),
    total_range_max: new FormControl('', Validators.required),
    healthy_range_min: new FormControl('', Validators.required),
    healthy_range_max: new FormControl('', Validators.required),
  });

  constructor(
    private metricsService: MetricsService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.metricsService.getMetrics().subscribe(metrics => this.metrics = metrics);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  add(): void {
    this.newMetric.disable();
    const metric = {
      name: this.newMetric.value.name,
      weight: this.newMetric.value.weight,
      gender: this.newMetric.value.gender,
      unit_label: this.newMetric.value.unit_label,
      total_range_min: this.newMetric.value.total_range_min,
      total_range_max: this.newMetric.value.total_range_max,
      healthy_range_min: this.newMetric.value.healthy_range_min,
      healthy_range_max: this.newMetric.value.healthy_range_max
    } as Metric;
    this.metricsService.addMetric(metric).subscribe(
      newMetric => this.metrics.push(newMetric),
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
