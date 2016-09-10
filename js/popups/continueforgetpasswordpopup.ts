﻿/// <reference path="../_references.ts" />
/// <reference path="../poker.commanding.api.ts" />
/// <reference path="../app.ts" />
/// <reference path="../authmanager.ts" />

declare var apiHost: string;

import * as ko from "knockout";
import { SimplePopup } from "../popups/simplepopup";
import { PopupBase } from "../ui/popupbase";
import { App } from "../app";

declare var app: App;

export class ContinueForgetPasswordPopup extends PopupBase implements KnockoutValidationGroup {
    token: KnockoutObservable<string>;
    password: KnockoutObservable<string>;
    confirmPassword: KnockoutObservable<string>;
    errorMessage: KnockoutObservable<string>;
    errors: KnockoutValidationErrors;
    isValid: () => boolean;
    loading: KnockoutObservable<boolean>;

    constructor() {
        super();
        this.token = ko.observable<string>().extend({ required: true });
        this.password = ko.observable<string>().extend({ required: true });
        this.confirmPassword = ko.observable<string>().extend({ required: true });
        this.errors = ko.validation.group(this);
        this.errorMessage = ko.observable<string>();
        this.loading = ko.observable(false);
    }
    shown(args: any[]= []): void {
        this.token(null);
        this.password(null);
        this.confirmPassword(null);
        this.errors.showAllMessages(false);
        super.shown(args);
    }
    confirm() {
        var self = this;
        var isValid = this.isValid();
        if (!isValid) {
            this.errors.showAllMessages(true);
            return;
        }

        if (!this.loading()) {
            self.loading(true);
            self.errorMessage(null);
            var accountApi = new OnlinePoker.Commanding.API.Account(apiHost);
            accountApi.ResetPassword(this.token(), this.password(), function (data) {
                if (data.Status === "Ok") {
                    self.token(null);
                    self.password(null);
                    self.confirmPassword(null);
                    app.closePopup();
                    self.loading(false);
                    SimplePopup.display(_("auth.passwordRecovery"), _("auth.passwordRecoveredSuccess"));
                } else {
                    // Report authentication or authorization errors
                    self.errorMessage(_("errors." + data.Status));
                }
            });
        }
    }
}
