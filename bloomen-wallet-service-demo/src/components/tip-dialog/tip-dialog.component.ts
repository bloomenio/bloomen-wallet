// Basic
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Logger } from '@services/logger/logger.service';
import { SchemasContract } from '@core/core.module';
import { Web3Service } from '@services/web3/web3.service';
import { SchemaModel } from '@core/models/schema.model';
import { TIPS_CONSTANTS } from '@core/constants/tip.constants';

const log = new Logger('tip-dialog.component');


@Component({
  selector: 'blo-tip-dialog',
  templateUrl: 'tip-dialog.component.html',
  styleUrls: ['tip-dialog.component.scss']
})
export class TipDialogComponent implements OnInit {

  public value: number;
  public tipQR: string;

  public schema: SchemaModel;

  constructor(
    public dialogRef: MatDialogRef<TipDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private schemasContract: SchemasContract,
    private web3Service: Web3Service
  ) { }

  public ngOnInit() {
    this.web3Service.ready(async () => {
      this.schema = await this.schemasContract.getSchema(TIPS_CONSTANTS.SCHEMA_ID);
    });

    this.onChange(1);
  }

  public onChange(newValue) {
    this.tipQR = `buy://${this.data.videoId}#${TIPS_CONSTANTS.SCHEMA_ID}#${newValue}#MWC-VIDEO#${encodeURI('Tip')}`;
  }

  public formatLabel(value: number | null) {
    if (!value) {
      return '1 $';
    } else {
      return `${value} $`;
    }
  }

  public closeDialog() {
    this.dialogRef.close();
  }
}
