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
        title: string;
        description: string;
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
        .NotNull(field => field.laf.theme, "Should not be null", "Dapp.laf.theme.Null")
        .NotNull(field => field.laf.backgroundImage, "Should not be null", "Dapp.laf.backgroundImage.Null")
        .NotNull(field => field.laf.prepaidCardImage, "Should not be null", "Dapp.laf.prepaidCardImage.Null")
        .NotNull(field => field.laf.landingImage, "Should not be null", "Dapp.laf.landingImage.Null")
        .NotNull(field => field.laf.homeImage, "Should not be null", "Dapp.laf.homeImage.Null")
        .NotNull(field => field.laf.logo, "Should not be null", "Dapp.laf.logo.Null")

        .NotNull(field => field.i18n.en.home.title, "Should not be null", "Dapp.i18n.en.home.title")
        .NotNull(field => field.i18n.en.home.subtitle, "Should not be null", "Dapp.i18n.en.home.subtitle")
        .NotNull(field => field.i18n.en.login.title, "Should not be null", "Dapp.i18n.en.login.title")

        .NotNull(field => field.i18n.el.home.title, "Should not be null", "Dapp.i18n.el.home.title")
        .NotNull(field => field.i18n.el.home.subtitle, "Should not be null", "Dapp.i18n.el.home.subtitle")
        .NotNull(field => field.i18n.el.login.title, "Should not be null", "Dapp.i18n.el.login.title")

        .NotNull(field => field.i18n.es.home.title, "Should not be null", "Dapp.i18n.es.home.title")
        .NotNull(field => field.i18n.es.home.subtitle, "Should not be null", "Dapp.i18n.es.home.subtitle")
        .NotNull(field => field.i18n.es.login.title, "Should not be null", "Dapp.i18n.es.login.title")

        .NotNull(field => field.i18n.de.home.title, "Should not be null", "Dapp.i18n.de.home.title")
        .NotNull(field => field.i18n.de.home.subtitle, "Should not be null", "Dapp.i18n.de.home.subtitle")
        .NotNull(field => field.i18n.de.login.title, "Should not be null", "Dapp.i18n.de.login.title")

        .NotNull(field => field.i18n.ca.home.title, "Should not be null", "Dapp.i18n.ca.home.title")
        .NotNull(field => field.i18n.ca.home.subtitle, "Should not be null", "Dapp.i18n.ca.home.subtitle")
        .NotNull(field => field.i18n.ca.login.title, "Should not be null", "Dapp.i18n.ca.login.title")

        

        .If(field => field.dappId != null && field.laf.theme != null, validator => validator
            
            .Matches(field => field.laf.theme, "(-light|-dark)", "Should be light or dark theme","Dapp.laf.theme.Match")
            .Matches(field => field.laf.backgroundImage, "([0-9a-zA-Z\._-]+.(png|PNG|gif|GIF|jp[e]?g|JP[E]?G))", "Should be an image", "Dapp.laf.backgroundImage.Match")
            .Matches(field => field.laf.prepaidCardImage, "([0-9a-zA-Z\._-]+.(png|PNG|gif|GIF|jp[e]?g|JP[E]?G))", "Should be an image", "Dapp.laf.prepaidCardImage.Match")
            .Matches(field => field.laf.landingImage, "([0-9a-zA-Z\._-]+.(png|PNG|gif|GIF|jp[e]?g|JP[E]?G))", "Should be an image", "Dapp.laf.landingImage.Match")
            .Matches(field => field.laf.homeImage, "([0-9a-zA-Z\._-]+.(png|PNG|gif|GIF|jp[e]?g|JP[E]?G))", "Should be an image", "Dapp.laf.homeImage.Match")
            .Matches(field => field.laf.logo, "logo: ([0-9a-zA-Z\._-]+.(png|PNG|gif|GIF|jp[e]?g|JP[E]?G|svg))", "Should be an image/logo", "Dapp.laf.logo.Match")
            .ToResult())
            .If(field => field.news != null && field.news.length > 0, 
                validator => validator
                              .ForEach(field => field.news, validateNewsFields)
                      .ToResult())
    .ToResult();
};

let validateNewsFields =  (validator: IValidator<Dapp.News>) : ValidationResult => {
    return validator 

        .NotNull(field => field.img, "Should not be null", "Dapp.News.img")
        .NotNull(field => field.title, "Should not be null", "Dapp.News.title")
        .NotNull(field => field.description, "Should not be null", "Dapp.News.description")

        .NotNull(field => field.i18n.en.title, "Should not be null", "Dapp.News.i18n.en.title")
        .NotNull(field => field.i18n.en.description, "Should not be null", "Dapp.News.i18n.en.description")
        .NotNull(field => field.i18n.el.title, "Should not be null", "Dapp.News.i18n.el.title")
        .NotNull(field => field.i18n.el.description, "Should not be null", "Dapp.News.i18n.el.description")
        .NotNull(field => field.i18n.es.title, "Should not be null", "Dapp.News.i18n.es.title")
        .NotNull(field => field.i18n.es.description, "Should not be null", "Dapp.News.i18n.es.description")
        .NotNull(field => field.i18n.de.title, "Should not be null", "Dapp.News.i18n.de.title")
        .NotNull(field => field.i18n.de.description, "Should not be null", "Dapp.News.i18n.de.description")
        .NotNull(field => field.i18n.ca.title, "Should not be null", "Dapp.News.i18n.ca.title")
        .NotNull(field => field.i18n.ca.description, "Should not be null", "Dapp.News.i18n.ca.description")

        .NotNull(field => field.payment.asset, "Should not be null", "Dapp.News.payment.asset")
        .NotNull(field => field.payment.schema, "Should not be null", "Dapp.News.payment.schema")
        .NotNull(field => field.payment.price, "Should not be null", "Dapp.News.payment.price")
        
        .If( field => 
            field.img != null && 
            field.title != null && 
            field.description != null && 

            field.i18n.en.title != null && 
            field.i18n.en.description != null && 
            field.i18n.el.title != null && 
            field.i18n.el.description != null && 
            field.i18n.es.title != null && 
            field.i18n.es.description != null &&
            field.i18n.de.title != null && 
            field.i18n.de.description != null && 
            field.i18n.ca.title != null && 
            field.i18n.ca.description != null &&
            
            field.payment.asset != null &&
            field.payment.schema != null &&
            field.payment.price != null,

            validator => validator
            .Matches(field => field.img, "([0-9a-zA-Z\._-]+.(png|PNG|gif|GIF|jp[e]?g|JP[E]?G))", "Should be an image", "Dapp.News.img")
            .Matches(field => field.payment.asset, "[0-9]", "Should be a number", "Dapp.News.payment.asset")
            .Matches(field => field.payment.schema , "[0-9]", "Should be a number", "Dapp.News.payment.schema")
            .Matches(field => field.payment.price, "[0-9]", "Should be a number", "Dapp.News.payment.price")
            .ToResult()
        ).ToResult();
}