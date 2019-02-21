export const QR_VALIDATOR = {
    DAPP: 'dapp://',
    BUY: 'buy://',
    ALLOW_BUY: 'allow_buy://',
    ALLOW: 'allow://',
    CARD: 'card://',
    ID: 'id://'
};

export interface BuyObject {
    assetId: number;
    schemaId: number,
    amount: number,
    dappId: string,
    description: string
}

export interface AllowObject {
    deviceHash: string,
    assetId: number,
    schemaId: number,
    dappId: string
}

export interface AllowAndBuy {
    dappId: string,
    assetId: number,
    schemaId: number,
    amount: number,
    description: string,
    deviceHash: string
}
