import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { MetricsService } from '../metrics.service';
import { HDataService } from '../h-data.service';

import { Exam } from '../exam';

declare var HGraph: any;

@Component({
  selector: 'app-graphic',
  templateUrl: './graphic.component.html',
  styleUrls: ['./graphic.component.css']
})
export class GraphicComponent implements OnInit, OnChanges {
  @Input() exams: Exam[];
  @Input() gender: string;
  graph: any;

  constructor(
    private metricsService: MetricsService,
    private hDataService: HDataService
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.gender) {
      let paramsData = new HttpParams();
      paramsData = paramsData.append('gender', changes.gender.currentValue);
      this.metricsService.getDataMetrics(paramsData).subscribe(data => {
        this.hDataService.initialize(data as Object[]);
        this.draw(this.exams);
      });
    }

    if (changes.exams) {
      this.draw(changes.exams.currentValue);
    }
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
