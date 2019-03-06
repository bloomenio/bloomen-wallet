import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';

// Constants
import { map, switchMap } from 'rxjs/operators';

// Actions
import * as fromActions from './collaborator.actions';
import { Logger } from '@services/logger/logger.service';

import { CollaboratorDatabaseService } from '@db/collaborator-database.service';
import { from } from 'rxjs';
import { Web3Service } from '@services/web3/web3.service';
import { CollaboratorModel } from '@core/models/collaborator.model';

const log = new Logger('mnemonic.effects');

@Injectable()
export class MnemonicEffects {

    constructor(
        private actions$: Actions<fromActions.CollaboratorActions>,
        private collaboratorDatabaseService: CollaboratorDatabaseService,
        private web3Service: Web3Service
    ) { }

    @Effect() public initCollaborator = this.actions$.pipe(
        ofType(fromActions.CollaboratorActionTypes.INIT_COLLABORATOR),
        switchMap(() => {
            return from(this.collaboratorDatabaseService.getAll().pipe(
                map((value) => new fromActions.InitCollaboratorSuccess(value))
            ));
        })
    );

    @Effect() public addCollaborator = this.actions$.pipe(
        ofType(fromActions.CollaboratorActionTypes.ADD_COLLABORATOR),
        switchMap((action) => {
            const collaborator: CollaboratorModel = {
                receptor: action.payload.receptor,
                description: action.payload.receptor
            };
            return from(this.collaboratorDatabaseService.set(collaborator.receptor, collaborator).pipe(
                map(() => new fromActions.AddCollaboratorSuccess(collaborator))
            ));
        })
    );

    @Effect() public removeCollaborator = this.actions$.pipe(
        ofType(fromActions.CollaboratorActionTypes.REMOVE_COLLABORATOR),
        switchMap((action) => {
            return from(this.collaboratorDatabaseService.remove(action.payload.receptor).pipe(
                map(() => new fromActions.RemoveCollaboratorSuccess({ receptor: action.payload.receptor }))
            ));
        })
    );
}





