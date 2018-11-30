import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { VisitService } from '../visit.service';

import { Visit } from '../visit';

@Component({
  selector: 'app-graphics',
  templateUrl: './graphics.component.html',
  styleUrls: ['./graphics.component.css']
})
export class GraphicsComponent implements OnInit {
  visits: Visit[];
  gender: string;
  username: string;

  constructor(
    private route: ActivatedRoute,
    private visitService: VisitService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(queryParams => {
      this.gender = queryParams['gender'];
      let params = new HttpParams();
      params = params.append('userId', queryParams['user']);
      this.visitService.getVisitAndExams(params).subscribe(visits => {
        this.visits = visits;
        this.username = visits[0].userUsername
      });
    });
  }
}
