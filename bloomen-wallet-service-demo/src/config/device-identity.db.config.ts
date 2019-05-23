import { Driver, NgForageOptions } from 'ngforage';
// Constants
import { DB_NAME } from '@constants/storage.constants';

/**
 * Configuraton for the storage service
 */
export const deviceIdentityConfig = {
  databaseConfig: {
    name: `${DB_NAME.NAME}_v${DB_NAME.VERSION}.${DB_NAME.SUFFIX}`,
    storeName: '_deviceIdentity',
    driver: [Driver.INDEXED_DB, Driver.LOCAL_STORAGE]
  } as NgForageOptions,
  encryption: false
};
