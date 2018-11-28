import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';

import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import { VisitService } from '../visit.service';
import { UserService } from '../user.service';
import { ExamService } from '../exam.service';
import { MetricsService } from '../metrics.service';
import { HDataService } from '../h-data.service';

import { Visit } from '../visit';
import { Category } from '../category';
import { Exam } from '../exam';

declare var HGraph: any;

@Component({
  selector: 'app-visits',
  templateUrl: './visits.component.html',
  styleUrls: ['./visits.component.css']
})
export class VisitsComponent implements OnInit {
  @ViewChild('form')
  private templateForm: TemplateRef<any>;
  graph: any;
  showGraphic = false;
  visits: Visit[];
  modalRef: BsModalRef;
  titleForm: string;
  visitForm = new FormGroup({
    id: new FormControl({ value: null, disabled: true}),
    name: new FormControl('', Validators.required)
  });

  constructor(
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private visitService: VisitService,
    private examService: ExamService,
    private metricsService: MetricsService,
    private hDataService: HDataService,
    public userService: UserService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(queryParams => {
        const user = queryParams['user'];
        let paramsData = new HttpParams();
        if (user) {
          paramsData = paramsData.append('user', user);
        }
        this.visitService.getVisits(paramsData).subscribe(visits => {
          this.visits = visits;

          // TODO: move
          if (this.visits.length) {
            let paramsGender = new HttpParams();
            paramsGender = paramsGender.append('gender', this.visits[0].userGender);
            this.metricsService.getDataMetrics(paramsGender).subscribe(data => {
              this.hDataService.initialize(data as Object[]);

              if (!this.userService.isAdmin || (this.userService.isAdmin && user)) {
                this.showGraphic = true;
                let params = new HttpParams();
                this.visits.forEach(visit => {
                  params = params.append('visits[]', String(visit.id));
                });
                this.examService.statisticsExam(params).subscribe(exams => {
                  this.draw(exams);
                });
              }
            });
          }
        });
    });
  }

  add(): void {
    this.titleForm = 'Aggiungi';
    this.modalRef = this.modalService.show(this.templateForm, { keyboard: false });
  }

  edit(category: Category): void {
    this.titleForm = 'Modifica';
    this.visitForm.setValue({
      id: category.id,
      name: category.name
    });
    this.modalRef = this.modalService.show(this.templateForm, { keyboard: false });
  }

  onSubmit(): void {
    this.visitForm.disable();
    const visit = {
      id: this.visitForm.value.id,
      name: this.visitForm.value.name
    } as Visit;
    if (visit.id) {
      this.onSubmitUpdate(visit);
    } else {
      this.onSubmitAdd(visit);
    }
  }

  private onSubmitAdd(visit: Visit): void {
    this.visitService.addVisit(visit).subscribe(
      newVisit => {
        this.visits.push(newVisit);
      },
      error => {},
      () => {
        this.visitForm.enable();
        this.hideForm();
      }
    );
  }

   private onSubmitUpdate(visit: Visit): void {
    this.visitService.updateVisit(visit).subscribe(
      updateVisit => {
        const index = this.visits.findIndex(c => c.id === updateVisit.id);
        this.visits[index] = updateVisit;
      },
      error => {},
      () => {
        this.visitForm.enable();
        this.hideForm();
      }
    );
  }

  delete(visit: Visit): void {
    this.visits = this.visits.filter(h => h !== visit);
    this.visitService.deleteVisit(visit).subscribe();
  }

  hideForm(): void {
    this.visitForm.reset();
    this.modalRef.hide();
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
