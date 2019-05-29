// Basic
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Logger } from '@services/logger/logger.service';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

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
export class DeviceIdentityComponent implements OnInit, OnDestroy {

  public deviceIdentity$: Subscription;
  public qrDevice: string;


  constructor(
    private store: Store<DeviceIdentityStateModel>,
    public dialog: MatDialog
  ) { }

  public ngOnInit() {
    this.deviceIdentity$ = this.store.select(fromDeviceIdentitySelectors.getIdentity).subscribe((device: any) => {
      this.qrDevice = `allow://${encodeURI(device)}#0#201#MWC-VIDEO`;
    });

  }

  public ngOnDestroy() {
    this.deviceIdentity$.unsubscribe();
  }

}
