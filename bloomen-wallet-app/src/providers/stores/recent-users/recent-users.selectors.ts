import {createFeatureSelector, createSelector} from "@ngrx/store";

//Reducer
import * as fromReducer from './recent-users.reducer';



export const RecentUserState = createFeatureSelector<fromReducer.RecentUserState>('recentUsers');

export const  { selectAll: selectAllAddress, selectEntities } = fromReducer.recentUserAdapter.getSelectors(RecentUserState);

export const selectUserEntities = selectEntities;

export const selectRecentUserState = createFeatureSelector<fromReducer.RecentUserState>('recentUsers');

export const selectCurrentUserId = createSelector(
    selectRecentUserState,
    fromReducer.getSelectedUserId
);

export const selectCurrentUser = createSelector(
    selectUserEntities,
    selectCurrentUserId,
    (userEntities, userId) => userEntities[userId]
);
