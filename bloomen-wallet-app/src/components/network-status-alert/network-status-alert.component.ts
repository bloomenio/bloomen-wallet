// Basic
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { RpcDialogComponent } from '@components/rpc-dialog/rpc-dialog.component';
import * as fromMnemonicActions from '@stores/mnemonic/mnemonic.actions';
import { Store } from '@ngrx/store';
import { MnemonicModel } from '@core/models/mnemonic.model';
import { RpcSubprovider } from '@services/web3/rpc-subprovider';

@Component({
  selector: 'blo-network-status-alert',
  templateUrl: 'network-status-alert.component.html',
  styleUrls: ['network-status-alert.component.scss']
})
export class NetworkStatusAlertComponent {

  constructor( private dialog: MatDialog,
    private store: Store<MnemonicModel>,
    private rpcSubprovider: RpcSubprovider ) {}

    public changeRpcDialog() {
      const dialogRef = this.dialog.open(RpcDialogComponent, {
        width: '250px'
      });
      return dialogRef.afterClosed();
    }
  
    public resumeWallet() {
      this.rpcSubprovider.setErrorState(false);
      this.store.dispatch(new fromMnemonicActions.RefreshWallet());
    }
}
