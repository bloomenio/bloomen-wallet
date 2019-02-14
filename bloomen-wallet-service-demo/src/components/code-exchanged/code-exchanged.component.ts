// Basic
import { Component, Input, OnInit } from '@angular/core';

import MediaMock from '../../assets/mock/media.json';
import { ASSETS_CONSTANTS } from '@core/constants/assets.constants.js';

@Component({
  selector: 'blo-code-exchanged',
  templateUrl: 'code-exchanged.component.html',
  styleUrls: ['code-exchanged.component.scss']
})
export class CodeExchangedComponent implements OnInit {

  @Input() public mobilityId: string;
  @Input() public smartOfficeId: string;

  public services: any;
  public id: string;

  constructor() {}

  public ngOnInit() {
    this.services = this.mobilityId ? MediaMock[ASSETS_CONSTANTS.MOBILITY] : MediaMock[ASSETS_CONSTANTS.SMART_OFFICE];
    this.id = this.mobilityId ? this.mobilityId : this.smartOfficeId;
  }


}
