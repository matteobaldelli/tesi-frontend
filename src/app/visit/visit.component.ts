import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import { VisitService } from '../visit.service';
import { MedicalService } from '../medical.service';
import { HDataService } from '../h-data.service';
import { MetricsService } from '../metrics.service';

import { Visit } from '../visit';
import { Medical } from '../medical';

declare var HGraph: any;

@Component({
  selector: 'app-visit',
  templateUrl: './visit.component.html',
  styleUrls: ['./visit.component.css']
})
export class VisitComponent implements OnInit {
  visit: Visit;
  medicals: Medical[];
  modalRef: BsModalRef;
  newMetric: string[];
  graph: any;

  newMedical = new FormGroup({
    metric: new FormControl(''),
    value: new FormControl('', Validators.required),
  });


  constructor(
    private route: ActivatedRoute,
    private visitService: VisitService,
    private medicalService: MedicalService,
    private hDataService: HDataService,
    private metricsService: MetricsService,
    private modalService: BsModalService
) {}

  ngOnInit() {
    this.medicals = [];
    this.newMetric = [];
    const id = +this.route.snapshot.paramMap.get('id');

    this.visitService.getVisit(id).subscribe(visit => this.visit = visit);

    let params = new HttpParams();
    params = params.append('visit_id', '' + id);
    this.medicalService.getMedicals(params).subscribe(medicals => {
      this.medicals = medicals;

      this.metricsService.getDataMetrics().subscribe(data => {
        this.hDataService.initialize(data as Object[]);
        this.calculateNewMetric();
        this.draw(medicals);
      });
    });
  }

  private draw(medicals: Medical[]): void {
    if (this.graph !== undefined) {
        this.graph.destroy();
      }

    if (medicals.length >= 3) {
      const container = document.getElementById('viz');
      const opts = {
        container: container,
        userdata: {
          hoverevents: true,
          factors: this.hDataService.process(medicals)
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
    this.newMedical.disable();
    const medical = {
      metric: this.newMedical.value.metric,
      value: this.newMedical.value.value,
      visit_id: this.visit.id
    } as Medical;
    this.medicalService.addMedical(medical).subscribe(
      newMedical => {
        this.medicals.push(newMedical);
        this.newMedical.reset();
        this.draw(this.medicals);
        this.calculateNewMetric();
      },
      error => {},
      () => {
        this.newMedical.enable();
        this.modalRef.hide();
      }
    );
  }

  delete(medical: Medical): void {
    this.medicalService.deleteMedical(medical).subscribe( success => {
        this.medicals = this.medicals.filter(h => h !== medical);
        this.draw(this.medicals);
        this.calculateNewMetric();
    });
  }

  calculateNewMetric(): void {
    this.newMetric = [];
    const allMetrics = this.metricsService.listMetrics;

    for (const metric of allMetrics) {
      if (!this.medicals.find((item) => item.metric === metric)) {
        this.newMetric.push(metric);
      }
    }
  }
}
