// Basic
import { Component, OnInit } from '@angular/core';

import { Logger } from '@services/logger/logger.service';
import { CollaboratorModel } from '@core/models/collaborator.model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromCollaboratorSelectors from '@stores/collaborator/collaborator.selectors';

const log = new Logger('video.component');


/**
 * Home page
 */
@Component({
  selector: 'blo-balance-dashboard',
  templateUrl: './balance-dashboard.component.html',
  styleUrls: ['./balance-dashboard.component.scss']
})
export class BalanceDashboardComponent implements OnInit {

  public collaborators$: Observable<CollaboratorModel[]>;

  constructor(
    private store: Store<CollaboratorModel>
  ) { }

  public ngOnInit() {
    this.collaborators$ = this.store.select(fromCollaboratorSelectors.selectAllCollaborators);
  }


}
