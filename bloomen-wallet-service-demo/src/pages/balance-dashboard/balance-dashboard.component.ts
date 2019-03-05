// Basic
import { Component } from '@angular/core';

import { Logger } from '@services/logger/logger.service';

const log = new Logger('video.component');


/**
 * Home page
 */
@Component({
  selector: 'blo-balance-dashboard',
  templateUrl: './balance-dashboard.component.html',
  styleUrls: ['./balance-dashboard.component.scss']
})
export class BalanceDashboardComponent {

  constructor() { }


}
