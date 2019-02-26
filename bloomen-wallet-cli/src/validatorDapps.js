"use strict";
exports.__esModule = true;
var dist_1 = require("ts.validator.fluent/dist");
var objectDapp1 = require('../data/dapp/demo.blue.json');
var objectDapp2 = require('../data/dapp/demo.brown.json');
var objectDapp3 = require('../data/dapp/demo.green.json');
var objectDapp4 = require('../data/dapp/demo.grey.json');
var objectDapp5 = require('../data/dapp/demo.json');
var objectDapp6 = require('../data/dapp/demo.lilac.json');
var objectDapp7 = require('../data/dapp/demo.orange.json');
var objectDapp8 = require('../data/dapp/gym.json');
var objectDapp9 = require('../data/dapp/mwc.facilities.json');
var objectDapp10 = require('../data/dapp/mwc.smart-office.json');
var objectDapp11 = require('../data/dapp/mwc.video.json');
var objectDapp12 = require('../data/dapp/ant1.json');
var x = [objectDapp1, objectDapp2, objectDapp3, objectDapp4, objectDapp5, objectDapp6, objectDapp7, objectDapp8, objectDapp9, objectDapp10, objectDapp11, objectDapp12];
var validateSuperRules = function (validator) {
    return validator
        .NotNull(function (field) { return field.dappId; }, "Should not be null", "Dapp.dappId.Null")
        .NotNull(function (field) { return field.laf.theme; }, "Should not be null", "Dapp.laf.theme.Null")
        .NotNull(function (field) { return field.laf.backgroundImage; }, "Should not be null", "Dapp.laf.backgroundImage.Null")
        .NotNull(function (field) { return field.laf.prepaidCardImage; }, "Should not be null", "Dapp.laf.prepaidCardImage.Null")
        .NotNull(function (field) { return field.laf.landingImage; }, "Should not be null", "Dapp.laf.landingImage.Null")
        .NotNull(function (field) { return field.laf.homeImage; }, "Should not be null", "Dapp.laf.homeImage.Null")
        .NotNull(function (field) { return field.laf.logo; }, "Should not be null", "Dapp.laf.logo.Null")
        .NotNull(function (field) { return field.i18n.en.home.title; }, "Should not be null", "Dapp.i18n.en.home.title")
        .NotNull(function (field) { return field.i18n.en.home.subtitle; }, "Should not be null", "Dapp.i18n.en.home.subtitle")
        .NotNull(function (field) { return field.i18n.en.login.title; }, "Should not be null", "Dapp.i18n.en.login.title")
        .NotNull(function (field) { return field.i18n.el.home.title; }, "Should not be null", "Dapp.i18n.el.home.title")
        .NotNull(function (field) { return field.i18n.el.home.subtitle; }, "Should not be null", "Dapp.i18n.el.home.subtitle")
        .NotNull(function (field) { return field.i18n.el.login.title; }, "Should not be null", "Dapp.i18n.el.login.title")
        .NotNull(function (field) { return field.i18n.es.home.title; }, "Should not be null", "Dapp.i18n.es.home.title")
        .NotNull(function (field) { return field.i18n.es.home.subtitle; }, "Should not be null", "Dapp.i18n.es.home.subtitle")
        .NotNull(function (field) { return field.i18n.es.login.title; }, "Should not be null", "Dapp.i18n.es.login.title")
        .NotNull(function (field) { return field.i18n.de.home.title; }, "Should not be null", "Dapp.i18n.de.home.title")
        .NotNull(function (field) { return field.i18n.de.home.subtitle; }, "Should not be null", "Dapp.i18n.de.home.subtitle")
        .NotNull(function (field) { return field.i18n.de.login.title; }, "Should not be null", "Dapp.i18n.de.login.title")
        .NotNull(function (field) { return field.i18n.ca.home.title; }, "Should not be null", "Dapp.i18n.ca.home.title")
        .NotNull(function (field) { return field.i18n.ca.home.subtitle; }, "Should not be null", "Dapp.i18n.ca.home.subtitle")
        .NotNull(function (field) { return field.i18n.ca.login.title; }, "Should not be null", "Dapp.i18n.ca.login.title")
        .If(function (field) { return field.dappId != null && field.laf.theme != null; }, function (validator) { return validator
        .Matches(function (field) { return field.laf.theme; }, "(-light|-dark)", "Should be light or dark theme", "Dapp.laf.theme.Match")
        .Matches(function (field) { return field.laf.backgroundImage; }, "([0-9a-zA-Z\._-]+.(png|PNG|gif|GIF|jp[e]?g|JP[E]?G))", "Should be an image", "Dapp.laf.backgroundImage.Match")
        .Matches(function (field) { return field.laf.prepaidCardImage; }, "([0-9a-zA-Z\._-]+.(png|PNG|gif|GIF|jp[e]?g|JP[E]?G))", "Should be an image", "Dapp.laf.prepaidCardImage.Match")
        .Matches(function (field) { return field.laf.landingImage; }, "([0-9a-zA-Z\._-]+.(png|PNG|gif|GIF|jp[e]?g|JP[E]?G))", "Should be an image", "Dapp.laf.landingImage.Match")
        .Matches(function (field) { return field.laf.homeImage; }, "([0-9a-zA-Z\._-]+.(png|PNG|gif|GIF|jp[e]?g|JP[E]?G))", "Should be an image", "Dapp.laf.homeImage.Match")
        .Matches(function (field) { return field.laf.logo; }, "([0-9a-zA-Z\._-])", "Should be an image/logo", "Dapp.laf.logo.Match")
        .ToResult(); })
        .If(function (field) { return field.news != null && field.news.length > 0; }, function (validator) { return validator
        .ForEach(function (field) { return field.news; }, validateNewsFields)
        .ToResult(); })
        .ToResult();
};
var validateNewsFields = function (validator) {
    return validator
        .NotNull(function (field) { return field.img; }, "Should not be null", "Dapp.News.img")
        .NotNull(function (field) { return field.i18n.en.title; }, "Should not be null", "Dapp.News.i18n.en.title")
        .NotNull(function (field) { return field.i18n.en.description; }, "Should not be null", "Dapp.News.i18n.en.description")
        .NotNull(function (field) { return field.i18n.el.title; }, "Should not be null", "Dapp.News.i18n.el.title")
        .NotNull(function (field) { return field.i18n.el.description; }, "Should not be null", "Dapp.News.i18n.el.description")
        .NotNull(function (field) { return field.i18n.es.title; }, "Should not be null", "Dapp.News.i18n.es.title")
        .NotNull(function (field) { return field.i18n.es.description; }, "Should not be null", "Dapp.News.i18n.es.description")
        .NotNull(function (field) { return field.i18n.de.title; }, "Should not be null", "Dapp.News.i18n.de.title")
        .NotNull(function (field) { return field.i18n.de.description; }, "Should not be null", "Dapp.News.i18n.de.description")
        .NotNull(function (field) { return field.i18n.ca.title; }, "Should not be null", "Dapp.News.i18n.ca.title")
        .NotNull(function (field) { return field.i18n.ca.description; }, "Should not be null", "Dapp.News.i18n.ca.description")
        .NotNull(function (field) { return field.payment.asset; }, "Should not be null", "Dapp.News.payment.asset")
        .NotNull(function (field) { return field.payment.schema; }, "Should not be null", "Dapp.News.payment.schema")
        .NotNull(function (field) { return field.payment.price; }, "Should not be null", "Dapp.News.payment.price")
        .If(function (field) {
        return field.img != null &&
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
            field.payment.price != null;
    }, function (validator) { return validator
        .Matches(function (field) { return field.img; }, "([0-9a-zA-Z\._-]+.(png|PNG|gif|GIF|jp[e]?g|JP[E]?G))", "Should be an image", "Dapp.News.img")
        .Matches(function (field) { return field.payment.asset; }, "([0-9])", "Should be a number", "Dapp.News.payment.asset")
        .Matches(function (field) { return field.payment.schema; }, "([0-9])", "Should be a number", "Dapp.News.payment.schema")
        .Matches(function (field) { return field.payment.price; }, "([0-9])", "Should be a number", "Dapp.News.payment.price")
        .ToResult(); }).ToResult();
};
x.forEach(function (value) { return console.log(new dist_1.Validator(value).Validate(validateSuperRules)); });
