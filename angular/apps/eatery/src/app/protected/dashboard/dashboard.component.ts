import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { single } from './data';
import { single2, multi2 } from './data2';

@Component({
  selector: 'fr-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  single: any[];
  multi: any[];

  view: any[] = [700, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Population';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };

  single2: any[];
  multi2: any[];

  view2: any[] = [700, 400];

  // options
  showLegend2 = true;

  colorScheme2 = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };

  // pie
  showLabels2 = true;
  explodeSlices2 = false;
  doughnut2 = false;

  gradient2 = false;

  constructor() {
    Object.assign(this, { single, single2, multi2 });
  }

  ngOnInit() {}

  onSelect(event) {
    console.log(event);
  }

  onSelect2(event) {
    console.log(event);
  }
}
