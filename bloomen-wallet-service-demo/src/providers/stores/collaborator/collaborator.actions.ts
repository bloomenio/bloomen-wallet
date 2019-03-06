import { Action } from '@ngrx/store';
import { CollaboratorModel } from '@core/models/collaborator.model';

export enum CollaboratorActionTypes {
    INIT_COLLABORATOR = '[Collaborator] Init collaborator',
    INIT_COLLABORATOR_SUCCESS = '[Collaborator] Init collaborator success',
    ADD_COLLABORATOR = '[Collaborator] add collaborator',
    ADD_COLLABORATOR_SUCCESS = '[Collaborator] add collaborator success',
    REMOVE_COLLABORATOR = '[Collaborator] remove collaborator',
    REMOVE_COLLABORATOR_SUCCESS = '[Collaborator] remove mnemonic success'

}

export class AddCollaborator implements Action {
    public readonly type = CollaboratorActionTypes.ADD_COLLABORATOR;
    constructor(public readonly payload: { receptor: string, description: string }) { }
}

export class AddCollaboratorSuccess implements Action {
    public readonly type = CollaboratorActionTypes.ADD_COLLABORATOR_SUCCESS;
    constructor(public readonly payload: CollaboratorModel) { }
}

export class InitCollaborator implements Action {
    public readonly type = CollaboratorActionTypes.INIT_COLLABORATOR;
}

export class InitCollaboratorSuccess implements Action {
    public readonly type = CollaboratorActionTypes.INIT_COLLABORATOR_SUCCESS;
    constructor(public readonly payload: CollaboratorModel[]) { }
}

export class RemoveCollaborator implements Action {
    public readonly type = CollaboratorActionTypes.REMOVE_COLLABORATOR;
    constructor(public readonly payload: { receptor: string }) { }
}

export class RemoveCollaboratorSuccess implements Action {
    public readonly type = CollaboratorActionTypes.REMOVE_COLLABORATOR_SUCCESS;
    constructor(public readonly payload: { receptor: string }) { }
}

export type CollaboratorActions = AddCollaborator | InitCollaborator | InitCollaboratorSuccess | AddCollaboratorSuccess |
    RemoveCollaborator | RemoveCollaboratorSuccess;
