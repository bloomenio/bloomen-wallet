// Basic
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromCollaboratorActions from '@stores/collaborator/collaborator.actions';

@Component({
  selector: 'blo-dashboard-option-menu',
  templateUrl: 'dashboard-option-menu.component.html',
  styleUrls: ['dashboard-option-menu.component.scss']
})
export class DashboardOptionMenuComponent {

  constructor(
    private store: Store<any>
  ) {}

  public doRefresh() {
    this.store.dispatch(new fromCollaboratorActions.RefreshCollaborator());
  }

}
