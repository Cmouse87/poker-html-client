﻿import * as ko from "knockout";
import { GameTypeSelectorComponent } from "poker/components/game-type-selector/gametypeselector";
import { FilterOptionsComponent } from "poker/components/lobby/filter/options";
import { Checkbox } from "poker/components/shared/checkbox/checkbox";
import { TimeBlockComponent } from "poker/components/timeblock/timeblock";
import * as table from "./table";

const trivialViewModelFactory = function (params: { data: any }, componentInfo: KnockoutComponentTypes.ComponentConfig) {
    return params.data;
};

const tableIconViewModelFactory = function (params: { data: LobbyTableItem }, componentInfo: KnockoutComponentTypes.ComponentConfig) {
    const tableData = params.data;
    return {
        displayTakenSeats: true,
        hasLoadingIndicator: false,
        MaxPlayers: tableData.MaxPlayers,
        SeatMask: tableData.SeatMask,
        loading: ko.observable(false),
    };
};

function getTemplateDefinition(name: string) {
    // tslint:disable-next-line:no-string-literal
    const useRequire = window["PokerComponents"] === undefined;
    if (useRequire) {
        throw new Error(`Component ${name} does not have template.`);
    }

    // tslint:disable-next-line:no-string-literal
    return window["PokerComponents"][name];
}

export function registerComponents() {
    /**
     * Tournament lobby sub-components
     */
    ko.components.register("tournament-information", {
        template: getTemplateDefinition("lobby/tournament/information.html"),
        viewModel: { createViewModel: trivialViewModelFactory },
    });
    ko.components.register("tournament-tables", {
        template: getTemplateDefinition("lobby/tournament/tables.html"),
        viewModel: { createViewModel: trivialViewModelFactory },
    });
    ko.components.register("tournament-players", {
        template: getTemplateDefinition("lobby/tournament/players.html"),
        viewModel: { createViewModel: trivialViewModelFactory },
    });
    ko.components.register("tournament-prizes", {
        template: getTemplateDefinition("lobby/tournament/prizes.html"),
    });
    ko.components.register("checkbox", {
        template: getTemplateDefinition("shared/checkbox/checkbox.html"),
        viewModel: Checkbox,
    });
    ko.components.register("tournament-blinds", {
        template: getTemplateDefinition("lobby/tournament/blinds.html"),
    });
    ko.components.register("rotate-phone-block", {
        template: getTemplateDefinition("rotate-phone-block/rotate-phone-block.html"),
    });

    /**
     * Lobby components
     */
    ko.components.register("tables-list", {
        template: getTemplateDefinition("lobby/tables/list.html"),
        viewModel: { createViewModel: trivialViewModelFactory },
    });
    ko.components.register("table-list-item", {
        template: getTemplateDefinition("lobby/tables/list-item.html"),
        viewModel: { createViewModel: trivialViewModelFactory },
    });
    ko.components.register("table-icon", {
        template: getTemplateDefinition("lobby/tables/table-icon.html"),
        viewModel: { createViewModel: tableIconViewModelFactory },
    });
    ko.components.register("tournaments-list", {
        template: getTemplateDefinition("lobby/tournaments/list.html"),
        viewModel: { createViewModel: trivialViewModelFactory },
    });
    ko.components.register("tournament-list-item", {
        template: getTemplateDefinition("lobby/tournaments/list-item.html"),
        viewModel: { createViewModel: trivialViewModelFactory },
    });
    ko.components.register("cash-options", {
        template: getTemplateDefinition("lobby/filter/cash-options.html"),
        viewModel: FilterOptionsComponent,
    });
    ko.components.register("tournament-options", {
        template: getTemplateDefinition("lobby/filter/tournament-options.html"),
        viewModel: FilterOptionsComponent,
    });
    ko.components.register("sng-options", {
        template: getTemplateDefinition("lobby/filter/sng-options.html"),
        viewModel: FilterOptionsComponent,
    });

    /**
     * Tabbar
     */
    ko.components.register("tabbar", {
        template: getTemplateDefinition("tabbar/tabbar.html"),
        viewModel: { createViewModel: tableIconViewModelFactory },
    });

    /**
     * Time block
     */
    ko.components.register("timeblock", {
        template: getTemplateDefinition("timeblock/timeblock.html"),
        viewModel: TimeBlockComponent,
    });

    /**
     * Game type selector
     */
    ko.components.register("game-type-selector", {
        template: getTemplateDefinition("game-type-selector/game-type-selector.html"),
        viewModel: GameTypeSelectorComponent,
    });

    /**
     * Game table action block
     */
    ko.components.register("table-action-block", {
        template: getTemplateDefinition("table/actionBlock/actionBlock.html"),
        viewModel: table.ActionBlockComponent,
    });
    ko.components.register("table-secondary-action-block", {
        template: getTemplateDefinition("table/actionBlock/secondaryActionBlock.html"),
        viewModel: table.ActionBlockComponent,
    });
    ko.components.register("table-raise-block", {
        template: getTemplateDefinition("table/raiseBlock/raiseBlock.html"),
        viewModel: table.RaiseBlockComponent,
    });

    ko.components.register("table-menu", {
        template: getTemplateDefinition("table/menu/menu.html"),
        viewModel: table.TableMenuComponent,
    });
    ko.components.register("tournament-status-indicator", {
        template: getTemplateDefinition("table/tournament-status-indicator/tournament-status-indicator.html"),
        viewModel: trivialViewModelFactory,
    });
    ko.components.register("table-place-marks", {
        template: getTemplateDefinition("table/table/place-marks.html"),
        viewModel: { createViewModel: trivialViewModelFactory },
    });
    ko.components.register("table-place-players", {
        template: getTemplateDefinition("table/table/place-players.html"),
        viewModel: { createViewModel: trivialViewModelFactory },
    });
}
