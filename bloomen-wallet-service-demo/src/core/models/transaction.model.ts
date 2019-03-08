export interface TransactionModel {
    address: string;
    transactions: TransactionModel.Transaction[];
}

export namespace TransactionModel {
    export interface Transaction {
        date: number;
        amount: number;
    }
}
