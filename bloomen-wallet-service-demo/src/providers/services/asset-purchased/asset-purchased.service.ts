import { Injectable } from "@angular/core";
import { DevicesContract } from "@core/core.module";

@Injectable({providedIn: 'root'})
export class AssetPurchased {

    private _purchased: any;

    constructor(
        private devicesContract: DevicesContract
    ) { }

    public checkOwnershipMultipleAssetsForDevice(device: string, assetsId: number[], dappId: string) {
        this.devicesContract.checkOwnershipMultipleAssetsForDevice(device, assetsId, dappId).then((purchases) => {
            console.log(purchases);
        });
    }

    public checkOwnershipOneAssetForDevice(device: string, assetId: number, dappId: string) {
        this.devicesContract.checkOwnershipOneAssetForDevice(device, assetId, dappId).then((purchases) => {
            console.log(purchases);
        });
    }
}
