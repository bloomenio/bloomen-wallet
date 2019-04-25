import { default as JSON } from '../json/Schemas.json';
import { Contract } from '../contract';

// Environment
import { environment } from '@env/environment';

// Services
import { Logger } from '@services/logger/logger.service';
import { Web3Service } from '@services/web3/web3.service';
import { TransactionService } from '@services/web3/transactions/transaction.service';
import { SchemaModel } from '@core/models/schema.model.js';

const log = new Logger('prepaid_card_manager.contract');


export class SchemasContract extends Contract {

  constructor(
    public contractAddress: string,
    public contract: any,
    public web3Service: Web3Service,
    public transactionService: TransactionService
  ) {
    super(contractAddress, contract, web3Service, transactionService);
  }

  public static get ABI() { return JSON.abi; }
  public static get ADDRESS() { return JSON.networks[environment.eth.contractConfig.networkId].address; }

  public getSchemas(): Promise<string[]> {
    return this.contract.methods.getSchemas().call(this.args);
  }

  public getSchema(schemaId: string): Promise<SchemaModel> {
    return this.contract.methods.getSchema(schemaId).call(this.args);
  }
}
