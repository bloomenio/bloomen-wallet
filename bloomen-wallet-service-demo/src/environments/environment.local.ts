// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

// `.env.ts` is generated by the `npm run env` command
import env from './.env';

export const environment = {
  production: false,
  test: false,
  version: env.npm_package_version + '-local',
  serverUrl: 'http://localhost:4200/video/',
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
      networkId: '82584648528'
    }
  }
};
