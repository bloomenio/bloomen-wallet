// Basic
import { Component, OnInit } from '@angular/core';

import { Logger } from '@services/logger/logger.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { MatDialog } from '@angular/material';

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


  constructor(
    public dialog: MatDialog
  ) { }

  public ngOnInit() {
  }

}
