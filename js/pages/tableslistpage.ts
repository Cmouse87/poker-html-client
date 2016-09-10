/// <reference path="../_references.ts" />
/// <reference path="../app.ts" />
/// <reference path="../ui/pagebase.ts" />
/// <reference path="../poker.commanding.api.ts" />

import { App } from "../app";
import { PageBase } from "../ui/pagebase";
import * as tableManager from "../table/tablemanager";
import { debugSettings } from "../debugsettings";
import { reloadManager } from "../services";

declare var apiHost: string;
declare var app: App;

export class TablesListPage extends PageBase {
    tablesCaption: KnockoutComputed<string>;
    tables: KnockoutObservableArray<any>;
    loading: KnockoutObservable<boolean>;

    constructor() {
        super();
        var self = this;
        this.tables = ko.observableArray([]);
        this.tablesCaption = ko.computed(function () {
            return _("tablesList.headerCaption")
                .replace("#count", this.tables().length.toString());
        }, this);
        this.loading = ko.observable(false);

        tableManager.tables.subscribe(function () {
            self.updateOpenedTables();
        });
    }
    deactivate() {
        super.deactivate();
    }
    activate() {
        super.activate();
        var self = this;
        this.refreshTables(false);

        reloadManager.setReloadCallback(() => self.refreshTables(true));
    }
    refreshTables(force: boolean) {
        if (this.loading() && !force) {
            return;
        }

        this.loading(true);
        var self = this;
        var gameApi = new OnlinePoker.Commanding.API.Game(apiHost);
        var privateTables = false;
        var fullTables = null;

        var lobbyPage = app.lobbyPageBlock.lobbyPage;
		/* tslint:disable:no-bitwise */
        var maxPlayers = lobbyPage.cashOptions.maxPlayers() === 0 ? 0 : 1 << lobbyPage.cashOptions.maxPlayers();
        var betLevels = lobbyPage.cashOptions.bets() === 0 ? 0 : 1 << (lobbyPage.cashOptions.bets() - 1);
		/* tslint:enable:no-bitwise */
        var moneyType = lobbyPage.cashOptions.currency();
        var limitType = lobbyPage.cashOptions.limits();
        gameApi.GetTables(fullTables, privateTables, maxPlayers, betLevels, moneyType, limitType, function (data) {
            self.loading(false);
            if (!self.visible()) {
                return;
            }

            if (data.Status === "Ok") {
                self.log("Informaton about tables received: ", data.Data);
                var tables = <any[]>data.Data;
                tables.forEach(function (item) {
                    item.IsOpened = tableManager.isOpened(item.TableId);
                });
                self.tables(tables);
            }
        });
    }
	updateOpenedTables() {
        var tables = this.tables();
        tables.forEach(function (item) {
            item.IsOpened = tableManager.isOpened(item.TableId);
        });
        this.tables([]);
        this.tables(tables);
    }
    back() {
        app.lobbyPageBlock.showLobby();
    }
    selectTable(table: GameTableModel) {
        app.executeCommand("app.selectTable", [table]);
        app.executeCommand("page.tables");
    }
    private log(message: string, ...params: any[]) {
        if (debugSettings.lobby.trace) {
            console.log(message, params);
        }
    }
}
