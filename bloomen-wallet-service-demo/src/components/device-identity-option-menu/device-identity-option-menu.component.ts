// Basic
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromCollaboratorActions from '@stores/collaborator/collaborator.actions';
import { windowWhen } from 'rxjs/operators';

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
    console.log('doNewIdentity');
  }

}
