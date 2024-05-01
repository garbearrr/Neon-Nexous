import { ClientConveyor } from "../conveyor";
import { ClientDropper } from "../dropper";
import { ClientFurnace } from "../furnace";
import { ClientItem, ClientItemModule } from "../types";
import { ClientUpgrader } from "../upgrader";

type ItemModMapExport = (Item: ClientItem, placementId: string) => ClientItemModule;

const Map = [
    ClientDropper,
    ClientFurnace,
    ClientConveyor,
    ClientUpgrader
] as ItemModMapExport[];

export const itemModMap = (itemId: number): ItemModMapExport => {
    const firstDigit = math.floor(itemId / 10000);

    return Map[firstDigit - 1];
}