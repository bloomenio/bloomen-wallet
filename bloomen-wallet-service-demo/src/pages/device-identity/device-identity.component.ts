// Basic
import { Component, OnInit } from '@angular/core';

import { Logger } from '@services/logger/logger.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { MatDialog } from '@angular/material';

import * as fromDeviceIdentitySelectors from '@stores/device-identity/device-identity.selectors';
import { DeviceIdentityStateModel } from '@core/models/device-identity-state.model';

const log = new Logger('video.component');



/**
 * Home page
 */
@Component({
  selector: 'blo-device-identity',
  templateUrl: './device-identity.component.html',
  styleUrls: ['./device-identity.component.scss']
})
export class DeviceIdentityComponent implements OnInit {

  public deviceIdentity$: Observable<string>;

  constructor(
    private store: Store<DeviceIdentityStateModel>,
    public dialog: MatDialog
  ) { }

  public ngOnInit() {
    this.deviceIdentity$ = this.store.select(fromDeviceIdentitySelectors.getIdentity);
  }

}
