import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { HDataService } from '../h-data.service';

import { Exam } from '../exam';

declare var HGraph: any;

@Component({
  selector: 'app-graphic',
  templateUrl: './graphic.component.html',
  styleUrls: ['./graphic.component.css']
})
export class GraphicComponent implements OnInit, OnChanges {
  @Input() dataMetrics: Object[];
  @Input() exams: Exam[];
  graph: any;

  constructor(
    private hDataService: HDataService,
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.dataMetrics) {
      this.hDataService.initialize(this.dataMetrics);
      this.draw(this.exams);
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
