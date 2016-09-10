﻿/// <reference path="../_references.ts" />
/// <reference path="../poker.commanding.api.ts" />
/// <reference path="../app.ts" />
/// <reference path="../authmanager.ts" />
/// <reference path="../settings.ts" />
/// <reference path="../ui/popupbase.ts" />

declare var apiHost: string;

import * as ko from "knockout";
import { PopupBase } from "../ui/popupbase";
import * as authManager from "../authmanager";
import { keyboardActivationService } from "../services";
import { App } from "../app";

declare var apiHost: string;
declare var app: App;

export class AuthPopup extends PopupBase implements KnockoutValidationGroup {
    login: KnockoutObservable<string>;
    password: KnockoutObservable<string>;
    validationLogin = ko.observable<string>().extend({ required: true, maxLength: 12 });
    validationPassword = ko.observable<string>().extend({ required: true, maxLength: 16 });
    errorMessage: KnockoutObservable<string>;
    rememberMe: KnockoutObservable<boolean>;
    errors: KnockoutValidationErrors;
    isValid: () => boolean;
    loading: KnockoutObservable<boolean>;

    constructor() {
        super();
        this.login = ko.observable<string>();
        this.password = ko.observable<string>();
        this.rememberMe = ko.observable(false);
        this.errors = ko.validation.group(this);
        this.errorMessage = ko.observable<string>();
        this.loading = ko.observable(false);
    }
    shown(args: any[]= []): void {
        this.login(settings.login());
        this.password(settings.password());
        this.rememberMe(settings.login() != null);
        this.errors.showAllMessages(false);
        super.shown(args);
    }
    logon() {
        var self = this;
        if (authManager.authenticated()) {
            return;
        }

        this.validationLogin(this.login());
        this.validationPassword(this.password());
        var isValid = this.isValid();
        if (!isValid) {
            this.errors.showAllMessages(true);
            return;
        }

        if (!this.loading()) {
            this.loading(true);
            var login = this.login();
            var password = this.password();
            var rememberMe = this.rememberMe();
            self.errorMessage(null);
            authManager.authenticate(login, password, rememberMe).done(function (result: string) {
                if (result === "Ok") {
                    self.login(null);
                    self.password(null);
                    keyboardActivationService.forceHideKeyboard();
                    self.close();
                } else {
                    // Report authentication or authorization errors
                    if (result) {
                        self.errorMessage(_("errors." + result));
                    } else {
                        self.errorMessage(_("auth.unspecifiedError"));
                    }
                }
            }).always(function () {
                self.loading(false);
            });
        }
    }
    registration() {
		// Do nothing.
    }
    forgetPassword() {
        app.showPopup("forgetPassword");
    }
}
