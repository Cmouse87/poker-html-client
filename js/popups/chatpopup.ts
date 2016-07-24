﻿/// <reference path="../_references.ts" />
/// <reference path="../poker.commanding.api.ts" />
/// <reference path="../ui/chatcontrol.ts" />
/// <reference path="../table/tableview.ts" />

class ChatPopup {
    control: ChatControl;
    caption: KnockoutObservable<string>;
    currentMessage: KnockoutObservable<string>;
    loading: KnockoutObservable<boolean>;
    messages: KnockoutObservableArray<PlayerMessage>;
    private tableView: TableView;
    private subscription: KnockoutSubscription = null;

    constructor() {
        this.control = new ChatControl();
        this.currentMessage = ko.observable("");
        this.loading = ko.observable(false);
        this.caption = ko.observable(_("chat.tableCaption"));
        this.control.initialize();
        this.messages = ko.observableArray<PlayerMessage>([]);
    }
    attach(view: TableView) {
        var self = this;
        if (this.subscription !== null) {
            this.subscription.dispose();
            this.subscription = null;
        }

        this.tableView = view;
        self.messages(this.tableView.messages());
        this.subscription = this.tableView.messages.subscribe(function (value) {
            self.messages(value);
        });
    }
    send() {
        if (this.currentMessage() === "") {
            return;
        }

        this.tableView.chatMessage(this.currentMessage());
        this.tableView.sendMessage();
        this.currentMessage("");
    }
    close() {
        if (this.subscription !== null) {
            this.subscription.dispose();
            this.subscription = null;
        }

        app.closePopup();
        /* Workaround for iOS 7.1 issue which break layout. */
        timeService.setTimeout(function () {
            $(window).scrollLeft(0);
        }, 10);
    }
    shown(): void {
        this.control.attachToHub();
    }
}
