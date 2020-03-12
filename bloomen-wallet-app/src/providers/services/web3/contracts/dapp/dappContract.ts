import { default as JSON } from '../json/DappContainer.json';
import { Contract } from '../contract';

// Environment
import { environment } from '@env/environment';

// Services
import { Logger } from '@services/logger/logger.service';
import { Web3Service } from '@services/web3/web3.service';
import { TransactionService } from '@services/web3/transactions/transaction.service';

const log = new Logger('dapp.contract');

import * as jsonPathLibrary from 'json-path-value';

const jsonPath = new jsonPathLibrary.JsonPath();

export class DappContract extends Contract {
 
  constructor(
    public contractAddress: string,
    public web3Service: Web3Service,
    public transactionService: TransactionService
  ) {
    super(web3Service, transactionService, JSON.abi, contractAddress, undefined);
  }

  public getData(silent?: boolean) {

    const f = () => {
      return this.getContract().methods.getData().call(this.args).then((result) => {
        const storedJsonPathPairs = [];
        let i;
        for (i = 0; i < result.length; i++) {
          const jsonPathValue = result[i];
          const type = jsonPathValue[2];
          let value;
          if (jsonPath.TYPE_ARRAY === type) {
            value = JSON.parse(jsonPathValue[1]);
          } else {
            value = jsonPathValue[1];
          }
          storedJsonPathPairs.push(new jsonPathLibrary.JsonPathPair(jsonPathValue[0], value, type, -1));
        }

        return jsonPath.unMarshall(storedJsonPathPairs);
      });
    };

    return (silent) ? f() : this.transactionService.addTransaction(0, f);
  }

}
