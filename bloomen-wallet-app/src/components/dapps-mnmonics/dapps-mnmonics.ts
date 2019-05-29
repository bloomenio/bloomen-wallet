import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';


@Component({
  selector: 'blo-dapps-menmonics',
  templateUrl: './dapps-mnmonics.html',
  styleUrls: ['./dapps-mnmonics.scss']
})
export class DappsMnmonicsComponent {

  private dappsWithMnemonics: any;

  constructor(public dialogRef: MatDialogRef<DappsMnmonicsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any ) {
              this.dappsWithMnemonics = this.data.dappsWithMnemonics;
  }

  public selectDapp(selectDapp: any) {
    this.dialogRef.close(selectDapp);
  }
}
