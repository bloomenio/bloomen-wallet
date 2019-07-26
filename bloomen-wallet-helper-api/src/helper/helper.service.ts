import { Injectable } from '@nestjs/common';
import { RequestPermissionsDto } from './dto/request-permissions.dto';
import * as JSON from '../contracts/Devices.json';
import * as Web3 from 'web3';
import { ResponsePermissionsDto } from './dto/response-permissions.dto';

@Injectable()
export class HelperService {

  private devicesContract: any;
  private web3: any;

  constructor() {
    this.web3 = new Web3(new Web3.providers.HttpProvider('https://0x.bloomen.io/rpc/telsius/blowallethelper'));
    this.devicesContract = new this.web3.eth.Contract(JSON.abi, JSON.networks['83584648538'].address);
  }

  async permissions(request: RequestPermissionsDto): Promise<ResponsePermissionsDto> {

    let response: ResponsePermissionsDto;

    const permissions = await this.devicesContract.methods.checkOwnershipMultipleAssetsForDevice(this.web3.utils.keccak256(request.deviceId)
      , request.assets
      , request.dappId).call();

    response = {...request, permissions};
    return response;
  }
}
