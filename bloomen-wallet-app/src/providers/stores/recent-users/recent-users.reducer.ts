import {UserAlias} from '@models/recent-user.model';
import {createEntityAdapter, EntityState} from "@ngrx/entity";
import {RecentUsersActions, RecentUsersActionTypes} from "@stores/recent-users/recent-users.actions";

export interface RecentUserState extends  EntityState<UserAlias>{
    currentAddressId: string
}

export const recentUserAdapter = createEntityAdapter<UserAlias>({
    selectId: (userAlias: UserAlias) => userAlias.address
});

const userRecentInitialState: RecentUserState = recentUserAdapter.getInitialState({
    currentAddressId: null
});

export function RecentUsersReducer(state: RecentUserState = userRecentInitialState, action: RecentUsersActions): RecentUserState {
    switch (action.type) {
        case RecentUsersActionTypes.ADD_ALIAS_SUCCESS:
            console.log('hi');
            return recentUserAdapter.upsertOne(action.payload.user, state);
        case RecentUsersActionTypes.CURRENT_ALIAS:
            return {
                ...state,
                currentAddressId: action.payload.address
            };
        case RecentUsersActionTypes.DELETE_ALIAS_SUCCESS:
            return recentUserAdapter.removeOne(action.payload.id, state);
        case RecentUsersActionTypes.CHANGE_ALIAS_SUCCESS:
            return recentUserAdapter.upsertOne(action.payload.user, state);
        case RecentUsersActionTypes.DELETE_CURRENT_ALIAS:
            return {
                ...state,
                currentAddressId: null
            };
        case RecentUsersActionTypes.INIT_RECENT_USER_SUCCESS:
            return recentUserAdapter.addAll(action.payload, state);
        default:
            return state;
    }
}

export const getSelectedUserId = (state: RecentUserState) => state.currentAddressId;
