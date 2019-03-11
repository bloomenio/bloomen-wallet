// Basic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

// Modules
import { MaterialModule } from '@app/material.module';

// Components
import { RemoveBalanceItemDialogComponent } from './remove-balance-item-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    FlexLayoutModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [RemoveBalanceItemDialogComponent],
  exports: [RemoveBalanceItemDialogComponent],
  entryComponents: [RemoveBalanceItemDialogComponent]
})
export class RemoveBalanceItemDialogModule { }
