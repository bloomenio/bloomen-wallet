import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { union } from 'lodash';

// Constants
import { map, switchMap } from 'rxjs/operators';

// Actions
import * as fromActions from './collaborator.actions';
import * as fromBalanceActions from '@stores/balance/balance.actions';
import * as fromTransactionActions from '@stores/transaction/transaction.actions';

import { Logger } from '@services/logger/logger.service';

import { CollaboratorDatabaseService } from '@db/collaborator-database.service';
import { from } from 'rxjs';
import { Web3Service } from '@services/web3/web3.service';
import { CollaboratorModel } from '@core/models/collaborator.model';
import { Store } from '@ngrx/store';
import { SchemasContract } from '@core/core.module';

const log = new Logger('collaborator.effects');

@Injectable()
export class CollaboratorEffects {

    constructor(
        private actions$: Actions<fromActions.CollaboratorActions>,
        private collaboratorDatabaseService: CollaboratorDatabaseService,
        private web3Service: Web3Service,
        private store: Store<any>,
        private schemasContract: SchemasContract
    ) { }

    @Effect({ dispatch: false }) public getCachedFirstCollaborators = this.actions$.pipe(
        ofType(fromActions.CollaboratorActionTypes.INIT_COLLABORATOR),
        map(() => {
            this.collaboratorDatabaseService.getAll().toPromise().then(collaborators => {
                if (!collaborators.length) {
                    this.store.dispatch(new fromActions.RefreshCollaborator());
                } else {
                    collaborators.forEach(collaborator => {
                        this.store.dispatch(new fromActions.AddCollaboratorSuccess(collaborator));
                    });
                }
            });
        })
    );

    @Effect({ dispatch: false }) public getCollaborators = this.actions$.pipe(
        ofType(
            fromActions.CollaboratorActionTypes.REFRESH_COLLABORATOR
        ),
        map(() => {
            this.web3Service.ready(() => {
                Promise.all([
                    this.collaboratorDatabaseService.getAll().toPromise(),
                    this.schemasContract.getSchemas()
                ]).then(async ([cachedAddresses, serverSchemas]) => {

                    const serverCollaborators = await this.extractCollaboratorsFromSchema(serverSchemas);

                    const collaborators = union(cachedAddresses, serverCollaborators);
                    collaborators.forEach(collaborator => {
                        const fromService = serverCollaborators.indexOf(collaborator) !== -1;
                        collaborator.fromServer = fromService;
                        this.collaboratorDatabaseService.set(collaborator.receptor, collaborator);
                        this.store.dispatch(new fromActions.AddCollaboratorSuccess(collaborator));
                    });
                });
            });
        })
    );

    @Effect() public addCollaborator = this.actions$.pipe(
        ofType(fromActions.CollaboratorActionTypes.ADD_COLLABORATOR),
        switchMap((action) => {
            const collaborator: CollaboratorModel = {
                receptor: action.payload.receptor,
                description: action.payload.description,
                fromServer: false
            };
            return from(this.collaboratorDatabaseService.set(collaborator.receptor, collaborator).pipe(
                map(() => new fromActions.AddCollaboratorSuccess(collaborator))
            ));
        })
    );

    @Effect({ dispatch: false }) public removeCollaborator = this.actions$.pipe(
        ofType(fromActions.CollaboratorActionTypes.REMOVE_COLLABORATOR),
        switchMap((action) => {
            return from(this.collaboratorDatabaseService.remove(action.payload.receptor).pipe(
                map(() => {
                    this.store.dispatch(new fromActions.RemoveCollaboratorSuccess({ receptor: action.payload.receptor }));
                    this.store.dispatch(new fromBalanceActions.RemoveBalanceSuccess({ address: action.payload.receptor }));
                    this.store.dispatch(new fromTransactionActions.RemoveTransaction({ address: action.payload.receptor }));
                })
            ));
        })
    );

    private async extractCollaboratorsFromSchema(schemas: string[]): Promise<CollaboratorModel[]> {
        const collaborators: CollaboratorModel[] = [];
        const start = async () => {
            await this.asyncForEach(schemas, async (schemaId) => {
                const schema = await this.schemasContract.getSchema(schemaId);

                schema.clearingHouseRules.forEach((clearingHouseRule) => {
                    const collaborator: CollaboratorModel = {
                        description: clearingHouseRule.description,
                        receptor: clearingHouseRule.receptor,
                        fromServer: true
                    };
                    collaborators.push(collaborator);
                });
            });
            return collaborators;
        };
        return start();
    }

    private async asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }
}





