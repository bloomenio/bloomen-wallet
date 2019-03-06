import { CollaboratorActionTypes, CollaboratorActions } from './collaborator.actions';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { CollaboratorModel } from '@core/models/collaborator.model';

export interface CollaboratorState extends EntityState<CollaboratorModel> { }

export const collaboratorAdapter = createEntityAdapter<CollaboratorModel>({
    selectId: (collaborator: CollaboratorModel) => collaborator.receptor
});

const mnemonicInitialState: CollaboratorState = collaboratorAdapter.getInitialState();

export function collaboratorReducer(state: CollaboratorState = mnemonicInitialState, action: CollaboratorActions): CollaboratorState {
    switch (action.type) {
        case CollaboratorActionTypes.INIT_COLLABORATOR_SUCCESS:
            return collaboratorAdapter.addAll(action.payload, state);

        case CollaboratorActionTypes.ADD_COLLABORATOR_SUCCESS:
            return collaboratorAdapter.upsertOne(action.payload, state);

        case CollaboratorActionTypes.REMOVE_COLLABORATOR_SUCCESS:
            return collaboratorAdapter.removeOne(action.payload.receptor, state);

        default:
            return state;
    }
}
