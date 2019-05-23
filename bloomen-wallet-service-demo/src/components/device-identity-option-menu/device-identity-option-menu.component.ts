// Basic
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromDeviceIdentityActions from '@stores/device-identity/device-identity.actions';

@Component({
  selector: 'blo-device-identity-option-menu',
  templateUrl: 'device-identity-option-menu.component.html',
  styleUrls: ['device-identity-option-menu.component.scss']
})
export class DeviceIdentityOptionMenuComponent {

  constructor(
    private store: Store<any>
  ) {}

  public doNewIdentity() {
    this.store.dispatch(new fromDeviceIdentityActions.ChangeIdentity());
  }

}
