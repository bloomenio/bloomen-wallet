import { IValidator, Validator, ValidationResult } from 'ts.validator.fluent/dist';


export interface Dapp {
    theme: string;
    background: string;
    logo: string;
    address: string;
    laf: Dapp.LookAndFeel;
    i18n: Dapp.I18n;
    news: Array<Dapp.News>;
    dappId: string;
}

export interface DappOrigin {
    fromService: boolean;
    lastUpdated: Date;
}

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


let validateSuperRules =  (validator: IValidator<Dapp>) : ValidationResult => {
    return validator
        .NotNull(field => field.dappId, "Should not be null", "Dapp.dappId.Null")        
        .NotNull(field => field.laf.theme, "Should be light or dark theme", "Dapp.laf.theme.Null")
        .NotNull(field => field.laf.backgroundImage, "Should be an image", "Dapp.laf.backgroundImage.Null")
        .NotNull(field => field.laf.prepaidCardImage, "Should be an image", "Dapp.laf.prepaidCardImage.Null")
        .NotNull(field => field.laf.landingImage, "Should be an image", "Dapp.laf.landingImage.Null")
        .NotNull(field => field.laf.homeImage, "Should be an image", "Dapp.laf.homeImage.Null")
        .If(field => field.dappId != null && field.laf.theme != null, validator => validator
            .Matches(field => field.laf.theme, "(-light|-dark)", "Should be light or dark theme","Dapp.laf.theme.Match")
            .Matches(field => field.laf.backgroundImage, "([0-9a-zA-Z\._-]+.(png|PNG|gif|GIF|jp[e]?g|JP[E]?G))", "Should be an image", "Dapp.laf.backgroundImage.Match")
            .Matches(field => field.laf.prepaidCardImage, "([0-9a-zA-Z\._-]+.(png|PNG|gif|GIF|jp[e]?g|JP[E]?G))", "Should be an image", "Dapp.laf.prepaidCardImage.Match")
            .Matches(field => field.laf.landingImage, "([0-9a-zA-Z\._-]+.(png|PNG|gif|GIF|jp[e]?g|JP[E]?G))", "Should be an image", "Dapp.laf.landingImage.Match")
            .Matches(field => field.laf.homeImage, "([0-9a-zA-Z\._-]+.(png|PNG|gif|GIF|jp[e]?g|JP[E]?G))", "Should be an image", "Dapp.laf.homeImage.Match")
            .ToResult())
    .ToResult();
};
