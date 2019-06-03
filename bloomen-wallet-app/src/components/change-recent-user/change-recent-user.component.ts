import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserAlias } from '@models/recent-user.model';
import { Store } from '@ngrx/store';
import * as fromRecentUsersAction from '@stores/recent-users/recent-users.actions';

@Component({
  selector: 'blo-change-recent-user',
  templateUrl: './change-recent-user.component.html',
  styleUrls: ['./change-recent-user.component.scss']
})
export class ChangeRecentUserComponent implements OnInit {
  public newAlias = '';
  public newUser: UserAlias = {
    address: null,
    idDapp: null,
    alias: ''
  };

  constructor(public store: Store<UserAlias>,
    public dialogRef: MatDialogRef<ChangeRecentUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.newUser.address = this.data.user.address;
    this.newUser.idDapp = this.data.user.idDapp;
  }

  public ngOnInit() {
    this.newAlias = this.data.user.alias;
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }

  public onChangeAlias() {
    if (this.newUser.alias !== '') {
      this.store.dispatch(new fromRecentUsersAction.ChangeAlias({ user: this.newUser }));
    }
    this.dialogRef.close();
  }

}
