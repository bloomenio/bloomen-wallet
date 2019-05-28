import { Injectable } from "@angular/core";
import { DevicesContract } from "@core/core.module";

@Injectable({providedIn: 'root'})
export class AssetPurchased {

    private _purchased: any;

    constructor(
        private devicesContract: DevicesContract
    ) { }

    public checkOwnershipForDeviceMultipleAssets(device: string, assetsId: number[], dappId: string) {
        this.devicesContract.checkOwnershipForDeviceMultipleAssets(device, assetsId, dappId).then((purchases) => {
            console.log(purchases);
        });
    }

    public checkOwnershipForDeviceOneAsset(device: string, assetId: number, dappId: string) {
        this.devicesContract.checkOwnershipOneAssetForDevice(device, assetId, dappId).then((purchases) => {
            console.log(purchases);
        });
    }
}
