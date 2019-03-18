import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { UserAlias } from '@models/recent-user.model';
import { Store } from '@ngrx/store';
import * as fromRecentUsersAction from '@stores/recent-users/recent-users.actions';


@Component({
  selector: 'blo-recent-users',
  templateUrl: './recent-users.component.html',
  styleUrls: ['./recent-users.component.scss']
})
export class RecentUsersComponent {
  public newUser: UserAlias = {
    address: null,
    idDapp: null,
    alias: ''
  };

  constructor(public store: Store<UserAlias> ,
              public dialogRef: MatDialogRef<RecentUsersComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any ) {
                this.newUser.address = this.data.address;
                this.newUser.idDapp = this.data.idDapp;
               }

  public onNoClick(): void {
    this.dialogRef.close();
  }
  public onYesClick(): void {
    this.store.dispatch(new fromRecentUsersAction.AddAlias({ user: this.newUser }));
    this.dialogRef.close();
  }

}
