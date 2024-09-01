
interface ItemCategoriesType {
    [key: string]: string
}

type ConveyorTemplate = Workspace["Items"]["Conveyors"]["30000"]
type DropperTemplate = Workspace["Items"]["Droppers"]["10000"]
type FurnaceTemplate = Workspace["Items"]["Furnaces"]["20000"]
type UpgraderTemplate = Workspace["Items"]["Upgraders"]["40000"]

type PossibleItems =
    | ConveyorTemplate
    | DropperTemplate
    | FurnaceTemplate
    | UpgraderTemplate