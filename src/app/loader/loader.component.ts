import { Component, Input, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements AfterViewInit, OnDestroy {
  @Input() fetching = false;
  @Input() maxTime = 0;
  @Input() showText = false;
  @Input() message = 'Caricamento in corso...';
  private timer = null;

  constructor() {
  }

  ngAfterViewInit() {
    if (this.maxTime && this.showText) {
      this.timer = setTimeout(() => {
        this.message = 'Ancora un po\' di pazienza per favore...';
      }, this.maxTime * 1000);
    }
  }

  ngOnDestroy() {
    clearTimeout(this.timer);
  }
}
