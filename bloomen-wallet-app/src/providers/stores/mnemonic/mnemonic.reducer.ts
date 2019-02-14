import { MnemonicActionTypes, MnemonicActions } from './mnemonic.actions';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { MnemonicModel } from '@core/models/mnemonic.model';

export interface MnemonicState extends EntityState<MnemonicModel> { }

export const mnemonicAdapter = createEntityAdapter<MnemonicModel>({
    selectId: (mnemonic: MnemonicModel) => mnemonic.address
});

const mnemonicInitialState: MnemonicState = mnemonicAdapter.getInitialState();

export function mnemonicReducer(state: MnemonicState = mnemonicInitialState, action: MnemonicActions): MnemonicState {
    switch (action.type) {
        case MnemonicActionTypes.INIT_MNEMONIC_SUCCESS:
            return mnemonicAdapter.addAll(action.payload, state);

        case MnemonicActionTypes.ADD_MNEMONIC_SUCCESS:
            return mnemonicAdapter.upsertOne(action.payload, state);

        case MnemonicActionTypes.REMOVE_MNEMONIC_SUCCESS:
            return mnemonicAdapter.removeOne(action.payload.address, state);

        default:
            return state;
    }
}
