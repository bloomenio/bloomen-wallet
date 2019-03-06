import { createFeatureSelector } from '@ngrx/store';

// Reducer
import * as fromReducer from './collaborator.reducer';


export const CollaboratorState = createFeatureSelector<fromReducer.CollaboratorState>('collaborators');

export const { selectAll: selectAllMnemonics, selectIds } = fromReducer.collaboratorAdapter.getSelectors(CollaboratorState);
