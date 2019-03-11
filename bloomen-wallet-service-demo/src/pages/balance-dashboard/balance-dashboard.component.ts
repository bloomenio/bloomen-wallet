// Basic
import { Component, OnInit } from '@angular/core';

import { Logger } from '@services/logger/logger.service';
import { CollaboratorModel } from '@core/models/collaborator.model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromCollaboratorSelectors from '@stores/collaborator/collaborator.selectors';
import * as fromCollaboratorActions from '@stores/collaborator/collaborator.actions';
import { MatDialog } from '@angular/material';

import { AddBalanceItemDialogComponent } from '@components/add-balance-item-dialog/add-balance-item-dialog.component';
import { RemoveBalanceItemDialogComponent } from '@components/remove-balance-item-dialog/remove-balance-item-dialog.component';

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
    private store: Store<CollaboratorModel>,
    public dialog: MatDialog
  ) { }

  public ngOnInit() {
    this.collaborators$ = this.store.select(fromCollaboratorSelectors.selectAllCollaborators);
  }


  public RemoveBalanceItem(address) {
    const dialogRef = this.dialog.open(RemoveBalanceItemDialogComponent, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(new fromCollaboratorActions.RemoveCollaborator({ receptor: address }));
      }
    });
  }

  public addBalanceItem() {
    const dialogRef = this.dialog.open(AddBalanceItemDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && Object.keys(result).length !== 0) {
        this.store.dispatch(new fromCollaboratorActions.AddCollaborator({ receptor: result.address, description: result.description }));
      }
    });
  }


}
