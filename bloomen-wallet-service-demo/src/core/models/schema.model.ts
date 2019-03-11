import { CollaboratorModel } from './collaborator.model';

export interface SchemaModel {
    amount: string;
    assetLifeTime: string;
    clearingHouseRules: CollaboratorModel[];
    expirationDate: string;
    schemaId: string;
    valid: boolean;
}
