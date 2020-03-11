import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'blo-dapps-mnemonics',
  templateUrl: './dapps-mnemonics.component.html',
  styleUrls: ['./dapps-mnemonics.component.scss']
})
export class DappsMnemonicsComponent {

  public dappsWithMnemonics: any;

  constructor(public dialogRef: MatDialogRef<DappsMnemonicsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any ) {
              this.dappsWithMnemonics = this.data.dappsWithMnemonics;
  }

  public selectDapp(selectDapp: any) {
    this.dialogRef.close(selectDapp);
  }
}
