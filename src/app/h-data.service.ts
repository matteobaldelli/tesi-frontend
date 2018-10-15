import { Injectable } from '@angular/core';

declare var HGraph: any;

@Injectable({
  providedIn: 'root'
})
export class HDataService {
  private metrics: Object[];

  constructor() { }

  public initialize(metrics: Object[]) {
    this.metrics = metrics;
  }

  public process(data: Object) {
    const userMetric = this.metrics;
    const userDatapoints = data;
    const dataPoints = [];

    // get scores for all metrics
    for (let i = 0; i < userMetric.length; i++) {
      if (userMetric[i]['details']) {
        const noAtomic = this.scoreNoAtomic(userMetric[i], userDatapoints);
        if (noAtomic !== null) {
          dataPoints.push(noAtomic);
        }
      } else {
        const atomic = this.scoreAtomic(userMetric[i], userDatapoints);
        if (atomic !== null) {
          dataPoints.push(atomic);
        }
      }
    }

    return dataPoints;
  }

  private findDatapoint(metric, userDatapoints) {
    for (let i = 0; i < userDatapoints.length; i++) {
      if (userDatapoints[i]['metric'] === metric ) {
        return userDatapoints[i];
      }
    }
    return null;
  }

  // Determines score for an atomic (no children) metric
  private scoreAtomic(metric, userDatapoints) {
    const currentDatapoint = this.findDatapoint(metric.name, userDatapoints);
    if (currentDatapoint !== null) {
      return {
        label: metric.name,
        score: HGraph.prototype.calculateScoreFromValue(metric.features, currentDatapoint.value),
        value: parseFloat(currentDatapoint.value).toFixed(2) + ' ' + metric.unit_label,
        weight: metric.weight
      };
    }

    return null;
  }

  private scoreNoAtomic(metric, userDatapoints) {
    const dataPoint = {
      label: metric.name,
      score: 0,
      value : 0,
      actual: 0,
      weight: 0,
      details : []
    };

    // add children (details)
    for (let i = 0; i < metric.details.length; i++) {
      const currentMetric = metric.details[i];
      const currentDatapoint = this.findDatapoint(currentMetric.name, userDatapoints);

      if (currentDatapoint !== null) {
        dataPoint.details.push({
          label: currentMetric.name,
          score: HGraph.prototype.calculateScoreFromValue(currentMetric.features, currentDatapoint.value),
          value: parseFloat(currentDatapoint.value).toFixed(2) + ' ' + currentMetric.unit_label,
          actual: currentDatapoint.value,
          weight: currentMetric.weight
        });
      }
    }

    if (!dataPoint.details.length) {
      return null;
    }
    // average everything
    // score metric based on subparts
    let directionSum = 0, weightSum = 0, sumSquare = 0;
    for (let i = 0; i < dataPoint.details.length; i++) {
      dataPoint.weight += dataPoint.details[i].weight;
      directionSum += dataPoint.details[i].score ;
      weightSum += dataPoint.details[i].weight;
      sumSquare = sumSquare + Math.pow(dataPoint.details[i].weight * dataPoint.details[i].score, 2.0);
    }

    let directionMultiplier = 1.0;
    if ( directionSum < 0) {
      directionMultiplier = -1.0;
    }
    dataPoint.score = directionMultiplier * Math.sqrt(sumSquare) / weightSum;
    dataPoint.weight /= dataPoint.details.length;

    return dataPoint;
  }
}
