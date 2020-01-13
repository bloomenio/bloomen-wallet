import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Store } from '@ngrx/store';
import { ApplicationDataStateModel } from '@core/models/application-data-state.model';
import { Subscription } from 'rxjs';
import * as fromSelectors from '@stores/application-data/application-data.selectors';

// Environment
import { environment } from '@env/environment';
import * as fromActions from '@stores/application-data/application-data.actions';
import { take } from 'rxjs/operators';

@Component({
  selector: 'blo-rpc-dialog',
  templateUrl: './rpc-dialog.component.html',
  styleUrls: ['./rpc-dialog.component.scss']
})
export class RpcDialogComponent implements OnInit {

  public rpc ;

  constructor( public dialogRef: MatDialogRef<RpcDialogComponent>,
    private store: Store<ApplicationDataStateModel>) {

  }

  public ngOnInit() {
    this.store.select(fromSelectors.getRpc).pipe(take(1)).subscribe((rpc) => {
      if (rpc) {
          this.rpc = rpc;
      } else {
          this.rpc = environment.eth.ethRpcUrl;
      }
    });
  }

  public onNoClick(): void {
    this.dialogRef.close(false);
  }

  public onYesClick(): void {
    this.store.dispatch(new fromActions.ChangeRpc({rpc: this.rpc}));
    this.dialogRef.close(true);
  }

  public reset(): void {
    this.store.dispatch(new fromActions.ChangeRpc({rpc: environment.eth.ethRpcUrl}));
    this.dialogRef.close(true);
  }

}
