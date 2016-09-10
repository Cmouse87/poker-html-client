﻿/// <reference path="./_references.ts" />
/// <reference path="settings.ts" />
/// <reference path="poker.commanding.api.ts" />

declare var apiHost: string;

import ko = require("knockout");
import { App } from "./app";

declare var app: App;

class AuthManager {
    authenticated: KnockoutObservable<boolean>;
    login: KnockoutObservable<string>;
    loginId: KnockoutObservable<number>;

    constructor() {
        this.authenticated = ko.observable(false);
        this.login = ko.observable<string>();
        this.loginId = ko.observable<number>();
    }
    authenticate(login: string, password: string, rememberMe: boolean = false): JQueryPromise<string> {
        var self = this;
        var accountApi = new OnlinePoker.Commanding.API.Account(apiHost);
        var result = $.Deferred();
        if (rememberMe) {
            settings.login(login);
            settings.password(password);
            settings.saveSettings();
        }

        accountApi.Authenticate(login, password, false, function (data) {
            if (data.Status === "Ok") {
                self.authenticated(true);
                self.login(data.Login);
                self.loginId(data.Id);
				settings.isGuest(data.IsGuest);
				settings.saveSettings();
            } else {
                // Report authentication or authorization errors
                self.authenticated(false);
                self.login(null);
                self.loginId(null);
            }

            result.resolve(data.Status);
        }).fail(function () {
            result.resolve(false);
        });
        return result;
    }
    logout() {
        settings.login(null);
        settings.password(null);
        settings.saveSettings();

        authToken = null;
        this.authenticated(false);
        this.login(null);
    }
    loginAsGuest(): JQueryPromise<string> {
        var self = this;
        var result = $.Deferred();
        var accountApi = new OnlinePoker.Commanding.API.Account(apiHost);
        accountApi.RegisterGuest().then(function (value) {
            if (!value) {
                result.resolve(false);
            } else {
                settings.login(value.Login);
                settings.password(value.Password);
                settings.saveSettings();
                app.processing(false);
                if (value.Status === "Ok") {
                    self.authenticate(value.Login, value.Password, true).then(function (value) {
                        result.resolve(value);
                    });
                } else {
                    result.resolve(value.Status);
                }
            }
        }, function (error) {
            result.resolve(false);
        });
        return result;
    }
}

var authManager: AuthManager = new AuthManager();
export = authManager;
