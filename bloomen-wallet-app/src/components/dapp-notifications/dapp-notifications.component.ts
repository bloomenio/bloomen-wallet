// Basic
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Dapp } from '@core/models/dapp.model.js';

import { Logger } from '@services/logger/logger.service';
import { MatSnackBar } from '@angular/material';


const log = new Logger('dapp-notifications.component');

/**
 * Dapp-notifications component
 */
@Component({
  selector: 'blo-dapp-notifications',
  templateUrl: 'dapp-notifications.component.html',
  styleUrls: ['dapp-notifications.component.scss']
})
export class DappNotificationsComponent {

  @Input() public set dapp(value: any) {
    this._dapp = value;
  }

  private _dapp: any;

  /**
   * Constructor to declare all the necesary to initialize the component.
   */
  constructor(
    public snackBar: MatSnackBar,
    private router: Router,
  ) { }

  public goToNotificationDetail(index: number) {
    this.router.navigate([`dapp/${this.dapp.address}/notifications/${this.dapp.news[index].payment.asset}`]);
  }

  public get dapp() {
    return this._dapp;
  }

  public customTB(index, notification) {

    return `${this._dapp.lastUpdated}-${index}`;
  }
}
