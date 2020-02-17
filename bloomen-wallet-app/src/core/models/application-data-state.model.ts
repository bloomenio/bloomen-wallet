import { AppState } from '@core/core.state';

export interface ApplicationDataStateModel {
    isFirstRun: boolean;
    theme: string;
    currentDappAddress: string;
    language: string;
    rpc: string;
    secret: string;
}

export interface State extends AppState {
    applicationDataStateModel: ApplicationDataStateModel;
}
