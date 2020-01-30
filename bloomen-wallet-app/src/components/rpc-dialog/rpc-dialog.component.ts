import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Store } from '@ngrx/store';
import { ApplicationDataStateModel } from '@core/models/application-data-state.model';

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

  public host;
  public pathname;
  public httpsToggle;

  constructor( public dialogRef: MatDialogRef<RpcDialogComponent>,
    private store: Store<ApplicationDataStateModel>) {

  }

  public ngOnInit() {
    this.store.select(fromSelectors.getRpc).pipe(take(1)).subscribe((rpc) => {
      let url;
      if (rpc) {
          url = new URL(rpc);
      } else {
          url = new URL(environment.eth.ethRpcUrl);
      }
      this.httpsToggle = (url.protocol === 'https:') ;
      this.host = url.host;
      this.pathname = url.pathname;
    });
  }

  public onNoClick(): void {
    this.dialogRef.close(false);
  }

  public onYesClick(): void {
    const url = new URL(`${this.httpsToggle ? 'https:' : 'http:'}\\${this.host}${this.pathname}`);

    this.store.dispatch(new fromActions.ChangeRpc({rpc: url.toString()}));
    this.dialogRef.close(true);
  }

  public reset(): void {
    this.store.dispatch(new fromActions.ChangeRpc({rpc: environment.eth.ethRpcUrl}));
    this.dialogRef.close(true);
  }

}
