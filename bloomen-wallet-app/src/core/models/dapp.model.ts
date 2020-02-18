export interface Dapp {
    theme: string;
    background: string;
    logo: string;
    address: string;
    laf: Dapp.LookAndFeel;
    i18n: Dapp.I18n;
    news: Array<Dapp.News>;
    dappId: string;
    secure: string;
    publicKey: string;
}

export interface DappOrigin {
    fromService: boolean;
    lastUpdated: Date;
}

export type DappCache = Dapp & DappOrigin;

export namespace Dapp {
    export interface LookAndFeel {
        theme: string;
        backgroundImage: string;
        backgroundOverlayColor: string;
        prepaidCardImage: string;
        landingImage: string;
        homeImage: string;
        logo: string;
    }

    export interface I18n {
        en: I18nDapp.Translation;
        el: I18nDapp.Translation;
        es: I18nDapp.Translation;
        de: I18nDapp.Translation;
        ca: I18nDapp.Translation;
    }
    export namespace I18nDapp {
        export interface Translation {
            home: Home;
            login: Login;
        }

        export interface Home {
            title: string;
            subtitle: string;
        }

        export interface Login {
            title: string;
        }
    }

    export interface News {
        img: string;
        payment: News.Payment;
        i18n: News.I18nNews;
    }

    export namespace News {
        export interface Payment {
            asset: string;
            schema: string;
            price: string;
            description: string;
        }

        export interface I18nNews {
            en: I18nNews.Translation;
            el: I18nNews.Translation;
            es: I18nNews.Translation;
            de: I18nNews.Translation;
            ca: I18nNews.Translation;
        }

        export namespace I18nNews {
            export interface Translation {
                title: string;
                description: string;
            }
        }
    }
}
