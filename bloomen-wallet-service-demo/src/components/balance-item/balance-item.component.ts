// Basic
import { Component, OnInit, Input } from '@angular/core';
import { ERC223Contract } from '@core/core.module';
import { Logger } from '@services/logger/logger.service';
import { Web3Service } from '@services/web3/web3.service';
import { CollaboratorModel } from '@core/models/collaborator.model';
import { Observable } from 'rxjs';

const log = new Logger('balance-item');

/**
 * balance item component
 */
@Component({
  selector: 'blo-balance-item',
  templateUrl: 'balance-item.component.html',
  styleUrls: ['balance-item.component.scss']
})
export class BalanceItemComponent implements OnInit {

  @Input() public collaborator: CollaboratorModel;

  public balance$: Observable<string>;

  constructor(
    private erc223: ERC223Contract,
    private web3Service: Web3Service
  ) { }

  public ngOnInit() {
    this.web3Service.ready(() => {
      this.balance$ = this.erc223.getBalanceByAddress(this.collaborator.receptor);
    });
  }
}
