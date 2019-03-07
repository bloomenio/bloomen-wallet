import { createFeatureSelector } from '@ngrx/store';

// Reducer
import * as fromReducer from './collaborator.reducer';


export const CollaboratorState = createFeatureSelector<fromReducer.CollaboratorState>('collaborators');

export const { selectAll: selectAllCollaborators, selectIds } = fromReducer.collaboratorAdapter.getSelectors(CollaboratorState);
