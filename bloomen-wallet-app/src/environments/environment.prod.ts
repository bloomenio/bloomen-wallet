// `.env.ts` is generated by the `npm run env` command
import env from './.env';

export const environment = {
  production: true,
  test: false,
  version: env.npm_package_version,
  serverUrl: '/api',
  defaultLanguage: 'en',
  supportedLanguages: ['ca', 'de', 'el', 'en', 'es'],
  eth: {
    ethRpcUrl: 'https://0x.bloomen.io/rpc/telsius/wallet',
    ethBlockPollingTime: 4000,
    transactionStatusPollingTime: 1000,
    transactionCallDelayTime: 2000,
    hdMagicKey: 'xxXX_MAGIC_XXxx',
    generalSeed: 'kit mother damage noise monkey appear peanut come razor vacant story water',
    contractConfig: {
      default: {
        value: 0,
        gasPrice: 0,
        gas: 9999999
      },
      networkId: '83584648538'
    }
  }
};
